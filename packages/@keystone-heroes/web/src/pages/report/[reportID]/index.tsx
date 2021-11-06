import type {
  ReportResponse,
  ReportSuccessResponse,
} from "@keystone-heroes/api/functions/report";
import {
  createResponseFromDB,
  loadExistingReport,
} from "@keystone-heroes/api/functions/report";
import { prisma } from "@keystone-heroes/db/prisma";
import { isValidReportId } from "@keystone-heroes/wcl/utils";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { LinkBox, LinkOverlay } from "../../../components/LinkBox";
import { SpecIcon } from "../../../components/SpecIcon";
import { useAbortableFetch } from "../../../hooks/useAbortableFetch";
import { bgPrimary } from "../../../styles/tokens";
import { timeDurationToString } from "../../../utils";
import { classnames } from "../../../utils/classnames";

type ReportProps = {
  cache?: {
    report: ReportResponse | null;
    reportID: string | null;
    fightID: string | null;
  };
};

const useReportURL = (cache: ReportProps["cache"]) => {
  const { query, isFallback } = useRouter();

  if (cache?.report) {
    return {
      url: null,
      reportID: cache.reportID,
      fightID:
        query.fightID && !Array.isArray(query.fightID) ? query.fightID : null,
    };
  }

  if (isFallback) {
    return {
      url: null,
      reportID: null,
      fightID:
        query.fightID && !Array.isArray(query.fightID) ? query.fightID : null,
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

  const fights: ReportSuccessResponse["fights"] = report
    ? report.fights
    : Array.from({ length: 6 }, (_, index) => ({
        id: index,
        averageItemLevel: 0,
        dungeon: null,
        keystoneBonus: 1,
        keystoneLevel: 15,
        keystoneTime: 0,
        player: [],
        rating: 0,
      }));

  return (
    <>
      <Head>
        <title>Keystone Heroes - {report?.title ?? "unknown report"}</title>
      </Head>
      <h1>{loading ? "loading" : report?.title ?? "unknown report"}</h1>

      {/* <div>
        {report?.affixes?.map((affix) => (
          <AbilityIcon alt={affix.name} key={affix.name} icon={affix.icon} />
        ))}
      </div> */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-3 2xl:gap-8">
        {reportID &&
          fights.map((fight) => {
            return (
              <FightCard
                reportID={reportID}
                fight={fight}
                key={fight.id}
                loading={loading}
              />
            );
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
  loading: boolean;
};

function FightCard({ fight, reportID, loading }: FightCardProps) {
  if (!fight) {
    return (
      <div className="flex items-center justify-center h-12 text-2xl font-extrabold text-red-900 rounded-md">
        fallback
      </div>
    );
  }

  return (
    <div className={`p-2 rounded-lg shadow-sm ${bgPrimary}`}>
      <LinkBox
        className={classnames(
          "relative flex items-center justify-center h-12 h-64 text-2xl rounded-md bg-cover bg-white hover:bg-blend-luminosity transition-colors duration-500",
          fight.dungeon
            ? `bg-${fight.dungeon.slug.toLowerCase()}`
            : "bg-fallback",
          loading && "animate-pulse"
        )}
        as="section"
        aria-labelledby={`fight-${fight.id}`}
      >
        {loading ? null : (
          <LinkOverlay
            href={`/report/${reportID}/${fight.id}`}
            className="p-4 bg-white rounded-lg dark:bg-coolgray-900"
          >
            <h2 id={`fight-${fight.id}`} className="font-extrabold">
              {fight.dungeon ? fight.dungeon.name : "Unknown Dungeon"} +
              {fight.keystoneLevel}
            </h2>

            <p className="flex justify-center w-full space-x-2">
              <span>{timeDurationToString(fight.keystoneTime)}</span>
              {fight.dungeon && (
                <span
                  className="italic text-green-600 dark:text-green-500"
                  title={`${fight.keystoneBonus} chest${
                    fight.keystoneBonus > 1 ? "s" : ""
                  }`}
                >
                  +
                  {timeDurationToString(
                    fight.dungeon.time - fight.keystoneTime
                  )}
                </span>
              )}
            </p>

            <p className="flex justify-center w-full space-x-2 font-xl">
              Ø {fight.averageItemLevel} | +{fight.rating}
            </p>

            {/* specs */}

            <div className="flex justify-center w-full pt-4 space-x-2">
              {fight.player.map((player, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <div className="w-8 h-8" key={index}>
                    <SpecIcon class={player.class} spec={player.spec} />
                  </div>
                );
              })}
            </div>

            {/* soulbinds */}

            {/* <div className="flex justify-center w-full pt-2 space-x-2">
            {fight.player.map((player, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div className="w-8 h-8" key={index}>
                  <img
                    src={
                      player.soulbindID
                        ? `https://assets.rpglogs.com/img/warcraft/soulbinds/soulbind-${player.soulbindID}.jpg`
                        : undefined
                    }
                    alt={
                      player.soulbindID
                        ? soulbinds[player.soulbindID].name
                        : "No Soulbind"
                    }
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
              );
            })}
          </div> */}

            {/* legendaries */}

            {/* <div className="flex justify-center w-full pt-2 space-x-2">
            {fight.player.map((player, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div className="w-8 h-8" key={index}>
                  <AbilityIcon
                    icon={player.legendary?.effectIcon}
                    className="object-cover w-full h-full rounded-full"
                    alt={player.legendary?.effectName ?? "Unknown Legendary"}
                  />
                </div>
              );
            })}
          </div> */}
          </LinkOverlay>
        )}
      </LinkBox>
    </div>
  );
}

type StaticPathParams = {
  reportID: string;
};

export const getStaticPaths: GetStaticPaths<StaticPathParams> = async () => {
  const paths = await prisma.report.findMany({
    select: {
      report: true,
    },
  });

  return {
    fallback: true,
    paths: paths.map((path) => ({
      params: {
        reportID: path.report,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<ReportProps, StaticPathParams> =
  async (ctx) => {
    if (!ctx.params?.reportID) {
      return {
        props: {
          cache: {
            report: null,
            reportID: null,
            fightID: null,
          },
        },
      };
    }

    const reportSuccessResponse = await loadExistingReport(ctx.params.reportID);

    if (!reportSuccessResponse) {
      return {
        props: {
          cache: {
            report: null,
            reportID: null,
            fightID: null,
          },
        },
        revalidate: 24 * 60 * 60,
      };
    }

    const cache: ReportProps["cache"] = {
      reportID: ctx.params.reportID,
      fightID: null,
      report: createResponseFromDB(reportSuccessResponse),
    };

    return {
      props: {
        cache,
      },
      revalidate: 24 * 60 * 60,
    };
  };
