import type { ReportResponse } from "@keystone-heroes/api/functions/report";
import { isValidReportId } from "@keystone-heroes/wcl/utils";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { WCL_ASSET_URL } from "src/components/AbilityIcon";
import { classnames } from "src/utils/classnames";

import { LinkBox, LinkOverlay } from "../../../components/LinkBox";
import { useAbortableFetch } from "../../../hooks/useAbortableFetch";

type ReportProps = {
  cache?: {
    report: ReportResponse | null;
    reportID: string | null;
    fightID: string | null;
  };
};

const useReportURL = (cache: ReportProps["cache"]) => {
  const { query, isFallback } = useRouter();

  if (isFallback) {
    return {
      url: null,
      reportID: null,
      fightID:
        query.fightID && !Array.isArray(query.fightID) ? query.fightID : null,
    };
  }

  if (cache?.report) {
    return {
      url: null,
      reportID: cache.reportID,
      fightID: null,
    };
  }

  const { reportID, fightID = null } = query;

  if (!isValidReportId(reportID) || Array.isArray(fightID)) {
    return {
      url: null,
      reportID: null,
      fightID: null,
    };
  }

  const params = new URLSearchParams({
    reportID,
  }).toString();

  return {
    url: `/api/report?${params}`,
    reportID,
    fightID,
  };
};

function useSeamlessFightRedirect(
  report: ReportResponse | null,
  reportID: string | null,
  fightID: string | null
) {
  const { push } = useRouter();

  useEffect(() => {
    if (!report || "error" in report || !reportID || !fightID) {
      return;
    }

    const safeFightID =
      // if "last" is selected, ensure its a valid fight to select
      fightID === "last" && report.fights.length > 0
        ? report.fights[report.fights.length - 1].id
        : // ensure this fightID actually exists
        report.fights.some((fight) => `${fight.id}` === fightID)
        ? fightID
        : null;

    if (safeFightID) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      push(`/report/${reportID}/${safeFightID}`);
    }
  }, [report, fightID, push, reportID]);
}

export default function Report({ cache }: ReportProps): JSX.Element | null {
  const { url, reportID, fightID } = useReportURL(cache);

  const [report, loading] = useAbortableFetch<ReportResponse>({
    initialState: cache?.report ?? null,
    url,
  });

  useSeamlessFightRedirect(report, reportID, fightID);

  if (report && "error" in report) {
    return <h1>error: {report.error}</h1>;
  }

  const fights = report?.fights ?? Array.from({ length: 4 });

  return (
    <>
      <Head>
        <title>Keystone Heroes - {report?.title ?? "unknown report"}</title>
      </Head>
      <h1>{loading ? "loading" : report?.title ?? "unknown report"}</h1>
      <div>
        {report?.affixes?.map((affix) => (
          <img
            loading="lazy"
            alt={affix.name}
            key={affix.name}
            src={`${WCL_ASSET_URL}${affix.icon}.jpg`}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-3 2xl:gap-8">
        {reportID &&
          fights.map((fight, index) => {
            return <FightCard reportID={reportID} fight={fight} key={index} />;
          })}
      </div>
    </>
  );
}

type PickFromUnion<T, K extends string> = T extends { [P in K]: unknown }
  ? T[K]
  : never;

type FightCardProps = {
  fight?: PickFromUnion<ReportResponse, "fights">[number];
  reportID: string;
};

function FightCard({ fight, reportID }: FightCardProps) {
  if (!fight) {
    return (
      <div className="flex items-center justify-center h-12 text-2xl font-extrabold text-red-900 rounded-md">
        fallback
      </div>
    );
  }

  return (
    <>
      {fight.dungeon && (
        <style jsx>
          {`
            .bg-${fight.dungeon.slug.toLowerCase()} {
              background-image: url(/static/dungeons/${fight.dungeon.slug.toLowerCase()}.jpg);
            }
          `}
        </style>
      )}
      <LinkBox
        className={classnames(
          "relative flex items-center justify-center h-12 h-64 text-2xl font-extrabold text-red-900 rounded-md bg-cover bg-white bg-blend-luminosity",
          fight.dungeon && `bg-${fight.dungeon.slug.toLowerCase()}`
        )}
      >
        <LinkOverlay href={`/report/${reportID}/${fight.id}`}>
          {fight.id}
        </LinkOverlay>

        {/* <table>
        <tbody>
          <tr>
            {fight.player.map((player, index) => (
              <td key={index}>
                {player.class}-{player.spec}
              </td>
            ))}
          </tr>
          <tr>
            {fight.player.map((player, index) => (
              <td key={index}>
                {player.legendary ? (
                  <img
                    src={`https://assets.rpglogs.com/img/warcraft/abilities/${player.legendary.effectIcon}`}
                    alt={player.legendary.effectName}
                    loading="lazy"
                    className="w-6 h-6"
                  />
                ) : null}
              </td>
            ))}
          </tr>
          <tr>
            {fight.player.map((player, index) => (
              <td key={index}>
                {player.soulbindID ? (
                  <img
                    src={`https://assets.rpglogs.com/img/warcraft/soulbinds/soulbind-${player.soulbindID}.jpg`}
                    alt={player.soulbindID}
                    loading="lazy"
                    className="w-6 h-6"
                  />
                ) : null}
              </td>
            ))}
          </tr>
        </tbody>
      </table> */}
      </LinkBox>
    </>
  );
}

type StaticPathParams = {
  reportID: string;
};

export const getStaticPaths: GetStaticPaths<StaticPathParams> = () => {
  return {
    fallback: true,
    paths: [],
  };
};

export const getStaticProps: GetStaticProps<ReportProps, StaticPathParams> =
  () => {
    return {
      props: {
        cache: {
          report: null,
          reportID: null,
          fightID: null,
        },
      },
    };
  };
