import { FightRepo, ReportRepo } from "@keystone-heroes/db/repos";
import { IS_DEV } from "@keystone-heroes/env";
import { isValidReportId } from "@keystone-heroes/wcl/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import type { FightResponse } from "@keystone-heroes/api/handler/fight";
import type { ReportResponse } from "@keystone-heroes/api/handler/report";
import type { GetStaticPaths, GetStaticProps } from "next";

type ReportProps = {
  cache?: {
    report: ReportResponse | null;
    fights: FightResponse[] | [];
  };
};

function useFights(
  report: ReportResponse | null,
  initialFights: FightResponse[] = []
) {
  const { isFallback } = useRouter();
  const [fights, setFights] = useState<FightResponse[]>(initialFights);

  useEffect(() => {
    if (
      isFallback ||
      !report ||
      !report.reportID ||
      report.fights.length === 0 ||
      initialFights.length > 0
    ) {
      return;
    }

    const fightsToFetch = report.fights.filter(
      (id) => !fights.some((fight) => fight.fightID === id)
    );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      for (const id of fightsToFetch) {
        // @ts-expect-error doesnt have to be a string
        const query = new URLSearchParams({
          reportID: report.reportID,
          fightIDs: id,
        }).toString();

        try {
          // eslint-disable-next-line no-await-in-loop
          const response = await fetch(`/api/fight?${query}`);
          // eslint-disable-next-line no-await-in-loop
          const fight: FightResponse[] = await response.json();
          setFights((current) => [...current, fight[0]]);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    })();
  }, [report, isFallback, initialFights, fights]);

  return fights;
}

function useReport(cachedReport: ReportResponse | null = null) {
  const { query, isFallback } = useRouter();
  const [report, setReport] = useState<ReportResponse | null>(cachedReport);

  useEffect(() => {
    if (
      isFallback ||
      report ||
      !query.reportID ||
      Array.isArray(query.reportID) ||
      !isValidReportId(query.reportID)
    ) {
      return;
    }

    fetch(`/api/report?reportID=${query.reportID}`)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then((response) => response.json())
      // eslint-disable-next-line promise/prefer-await-to-then
      .then((data: ReportResponse) => {
        if (data) {
          setReport(data);
        }
      })
      // eslint-disable-next-line no-console, promise/prefer-await-to-then
      .catch(console.error);
  }, [query.reportID, report, isFallback]);

  return report;
}

export default function Report({ cache }: ReportProps): JSX.Element | null {
  const { query } = useRouter();

  const report = useReport(cache?.report);
  const fights = useFights(report, cache?.fights);

  if (!report) {
    return (
      <>
        <Head>
          <title>{query.id ?? "unknown report"}</title>
        </Head>
        <h1>retrieving data</h1>
      </>
    );
  }

  return (
    <>
      {report.fights.map((id) => {
        const fight = fights.find((fight) => fight.fightID === id);

        if (!fight) {
          return <h1 key={id}>still loading fight {id}</h1>;
        }

        return <code key={id}>fight {id} loaded</code>;
      })}
    </>
  );
}

export const getStaticPaths: GetStaticPaths<{
  reportID: string;
}> = async () => {
  if (IS_DEV) {
    return {
      fallback: true,
      paths: [],
    };
  }

  const reports = await ReportRepo.loadFinishedReports();

  // eslint-disable-next-line no-console
  console.info(`[Report/getStaticPaths] found ${reports.length} reports`);

  return {
    fallback: true,
    paths: reports.map((report) => {
      return {
        params: {
          reportID: report,
        },
      };
    }),
  };
};

export const getStaticProps: GetStaticProps<
  ReportProps,
  { reportID: string }
> = async ({ params }) => {
  if (IS_DEV) {
    return {
      props: {
        cache: {
          fights: [],
          report: null,
        },
      },
    };
  }

  if (
    !params?.reportID ||
    Array.isArray(params.reportID) ||
    params.reportID.includes(".")
  ) {
    throw new Error("invalid or missing params.id");
  }

  const { reportID } = params;

  try {
    // eslint-disable-next-line no-console
    console.info(`[Report/getStaticProps] loading report "${reportID}"`);

    const report = await ReportRepo.load(reportID);

    if (!report) {
      return {
        props: {
          cache: {
            fights: [],
            report: null,
          },
        },
      };
    }

    const { id: dbId, fights: reportFights, ...rest } = report;

    // eslint-disable-next-line no-console
    console.info(
      `[Report/getStaticProps] loading fights "${reportFights.join(",")}"`
    );
    const fights = await FightRepo.loadFull(reportID, reportFights);

    return {
      props: {
        cache: {
          fights,
          report: {
            ...rest,
            reportID,
            fights: reportFights,
            endTime: rest.endTime,
            region: report.region.slug,
            startTime: report.startTime,
          },
        },
      },
    };
  } catch {
    return {
      props: {
        cache: {
          fights: [],
          report: null,
        },
      },
    };
  }
};
