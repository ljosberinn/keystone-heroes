import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import type {
  ReportResponse,
  ReportSuccessResponse,
} from "../../../api/functions/report";
import { isValidReportId } from "../../../wcl/utils";
import { LinkBox, LinkOverlay } from "../../../web/components/LinkBox";
import { SpecIcon } from "../../../web/components/SpecIcon";
import { useAbortableFetch } from "../../../web/hooks/useAbortableFetch";
import {
  bgPrimary,
  widthConstraint,
  greenText,
  redText,
} from "../../../web/styles/tokens";
import { timeDurationToString } from "../../../web/utils";
import { classnames } from "../../../web/utils/classnames";

const useReportURL = () => {
  const { query } = useRouter();

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

const findFightIDToRedirecTo = (
  report: ReportResponse | null,
  reportID: string | null,
  fightID: string | null
) => {
  if (!report || "error" in report || !reportID || !fightID) {
    return { reportID: null, fightID: null };
  }

  return {
    reportID,
    // if "last" is selected, ensure its a valid fight to select
    fightID:
      fightID === "last" && report.fights.length > 0
        ? report.fights[report.fights.length - 1].id
        : // ensure this fightID actually exists
        report.fights.some((fight) => `${fight.id}` === fightID)
        ? fightID
        : null,
  };
};

function useSeamlessFightRedirect(
  report: ReportResponse | null,
  maybeReportID: string | null,
  maybeFightID: string | null
) {
  const { push } = useRouter();
  const { fightID, reportID } = findFightIDToRedirecTo(
    report,
    maybeReportID,
    maybeFightID
  );

  useEffect(() => {
    if (reportID && fightID) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      push(`/report/${reportID}/${fightID}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportID, fightID]);

  return !!fightID;
}

export default function Report(): JSX.Element | null {
  const { url, reportID, fightID } = useReportURL();

  const [report, loading] = useAbortableFetch<ReportResponse>({
    initialState: null,
    url,
  });

  const willRedirect = useSeamlessFightRedirect(report, reportID, fightID);

  if (report && "error" in report) {
    return <h1>error: {report.error}</h1>;
  }

  if (willRedirect) {
    //  TODO: show spinner
    return null;
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

      <div className={`${widthConstraint} py-6`}>
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

  const isTimed = fight.dungeon
    ? fight.dungeon.time - fight.keystoneTime >= 750
    : true;

  return (
    <div className={`p-2 rounded-lg shadow-sm ${bgPrimary}`}>
      <LinkBox
        className={classnames(
          "relative flex items-center justify-center h-12 h-64 text-2xl rounded-md bg-cover bg-white transition-colors duration-500",
          fight.dungeon
            ? `bg-${fight.dungeon.slug.toLowerCase()}`
            : "bg-fallback hover:bg-blend-luminosity",
          loading && "animate-pulse",
          isTimed
            ? "hover:bg-blend-luminosity"
            : "bg-blend-luminosity hover:bg-blend-normal"
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

            <TimeInformation
              keystoneBonus={fight.keystoneBonus}
              keystoneTime={fight.keystoneTime}
              dungeonTimer={fight.dungeon?.time}
              isTimed={isTimed}
            />

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

type TimeInformationProps = {
  keystoneTime: number;
  keystoneBonus: number;
  dungeonTimer?: number;
  isTimed: boolean;
};

function TimeInformation({
  keystoneBonus,
  keystoneTime,
  dungeonTimer,
  isTimed,
}: TimeInformationProps) {
  return (
    <p className="flex justify-center w-full space-x-2">
      <span>{timeDurationToString(keystoneTime)}</span>
      {dungeonTimer && (
        <span
          className={`italic ${isTimed ? greenText : redText}`}
          title={`${keystoneBonus} chest${keystoneBonus > 1 ? "s" : ""}`}
        >
          {isTimed ? "+" : "-"}
          {timeDurationToString(
            isTimed ? dungeonTimer - keystoneTime : keystoneTime - dungeonTimer
          )}
        </span>
      )}
    </p>
  );
}
