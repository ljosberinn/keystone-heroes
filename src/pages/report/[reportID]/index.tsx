import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { Suspense, useEffect } from "react";

import type {
  ReportErrorResponse,
  ReportResponse,
  ReportSuccessResponse,
} from "../../../api/functions/report";
import { reportHandlerError } from "../../../api/utils/errors";
import { isValidReportId } from "../../../wcl/utils";
import { Affixes } from "../../../web/components/Affixes";
import { ExternalLink } from "../../../web/components/ExternalLink";
import { LinkBox, LinkOverlay } from "../../../web/components/LinkBox";
import { Seo } from "../../../web/components/Seo";
import { SpecIcon } from "../../../web/components/SpecIcon";
import type { SupportCardProps } from "../../../web/components/report/SupportCard";
import { useAbortableFetch } from "../../../web/hooks/useAbortableFetch";
import { useIsMounted } from "../../../web/hooks/useIsMounted";
import { classes, dungeons } from "../../../web/staticData";
import { concern, hands, cry } from "../../../web/styles/bears";
import {
  bgPrimary,
  widthConstraint,
  greenText,
  redText,
  yellowText,
  bgSecondary,
  hoverShadow,
} from "../../../web/styles/tokens";
import {
  classBorderColorMap,
  createWCLUrl,
  timeDurationToString,
} from "../../../web/utils";
import { classnames } from "../../../web/utils/classnames";

enum ReportUrlError {
  INVALID_REPORT_ID = "The report ID seems to be malformed.",
}

const imageMap: Record<ReportErrorResponse["error"], string> = {
  EMPTY_LOG: concern,
  BROKEN_LOG_OR_WCL_UNAVAILABLE: hands,
  NO_ELIGIBLE_KEYS: concern,
  SECONDARY_REQUEST_FAILED: cry,
  PRIVATE_REPORT: concern,
};

const useReportURL = (): {
  url: string | null;
  reportID: string | null;
  fightID: string | null;
  error: ReportUrlError | null;
  query: ParsedUrlQuery;
} => {
  const { query } = useRouter();
  const isMounted = useIsMounted();

  const { reportID, fightID = null } = query;

  if (!isValidReportId(reportID) || Array.isArray(fightID)) {
    return {
      url: null,
      reportID: null,
      fightID: null,
      error: isMounted.current ? ReportUrlError.INVALID_REPORT_ID : null,
      query,
    };
  }

  const params = new URLSearchParams({
    reportID,
  }).toString();

  return {
    url: `/api/report?${params}`,
    reportID,
    fightID,
    error: null,
    query,
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
  const { url, reportID, fightID, error, query } = useReportURL();

  const [report, loading] = useAbortableFetch<ReportResponse>({
    initialState: null,
    url,
  });

  const willRedirect = useSeamlessFightRedirect(report, reportID, fightID);

  if (error) {
    const linkableReportID = query.reportID
      ? Array.isArray(query.reportID)
        ? query.reportID[0]
        : query.reportID
      : "";

    return (
      <>
        <Seo title="Unknown Report" />

        <div className="flex flex-col items-center justify-center w-full px-16 py-8 m-auto xl:px-64 xl:py-32 lg:flex-row max-w-screen-2xl">
          <img
            src={concern}
            height="256"
            width="256"
            alt="Our bear is concerned."
            loading="lazy"
          />
          <div className="pt-8 lg:pl-24 lg:pt-0">
            <h1 className="font-semibold ">{error}</h1>
            <p className="pt-8">
              Are you sure{" "}
              <ExternalLink
                href={createWCLUrl({
                  reportID: linkableReportID,
                })}
                className="underline"
              >
                this
              </ExternalLink>{" "}
              leads to a valid report?
            </p>
          </div>
        </div>
      </>
    );
  }

  if (report && "error" in report) {
    const image = imageMap[report.error];

    return (
      <div className="flex flex-col items-center justify-center w-full px-16 py-8 m-auto xl:px-64 xl:py-32 lg:flex-row max-w-screen-2xl">
        <img
          src={image}
          height="256"
          width="256"
          alt="An error occured!"
          loading="lazy"
          className={image.includes("cry") ? "-scale-x-100" : undefined}
        />
        <div className="pt-8 lg:pl-24 lg:pt-0">
          <h1 className="font-semibold ">{report.error}</h1>
          <p className="pt-8">{reportHandlerError[report.error]}</p>
        </div>
      </div>
    );
  }

  if (loading || willRedirect) {
    return (
      <div className="flex flex-col items-center justify-center w-full px-16 py-8 m-auto xl:px-64 xl:py-32 lg:flex-row max-w-screen-2xl">
        <img
          src="/static/bear/dance.gif"
          height="256"
          width="256"
          alt="Loading"
          loading="lazy"
        />

        <p className="pt-8 lg:pl-24 lg:pt-0">
          Bear busy retrieving report. Please stand by.
        </p>
      </div>
    );
  }

  if (!report || !reportID || !url) {
    return null;
  }

  const { timed, untimed, indeterminate } = report.fights.reduce<{
    timed: ReportSuccessResponse["fights"];
    untimed: ReportSuccessResponse["fights"];
    indeterminate: ReportSuccessResponse["fights"];
  }>(
    (acc, fight) => {
      if (fight.dungeon && fight.dungeon in dungeons) {
        const dungeon = dungeons[fight.dungeon];
        const timed = dungeon.time - fight.keystoneTime >= -750;

        if (timed) {
          acc.timed.push(fight);
        } else {
          acc.untimed.push(fight);
        }

        return acc;
      }

      acc.indeterminate.push(fight);

      return acc;
    },
    {
      timed: [],
      untimed: [],
      indeterminate: [],
    }
  );

  const startDate = new Date(report.startTime);
  const endDate = new Date(report.endTime);

  const minmaxKeyLevel = report.fights.reduce(
    (acc, fight) => {
      return {
        ...acc,
        min: fight.keystoneLevel < acc.min ? fight.keystoneLevel : acc.min,
        max: fight.keystoneLevel > acc.max ? fight.keystoneLevel : acc.max,
      };
    },
    { min: Infinity, max: 0 }
  );

  return (
    <>
      <Seo title={report.title} />

      <div className={`${widthConstraint} py-6`}>
        <div className={`${bgSecondary} p-4 rounded-lg`}>
          <div className="sm:flex sm:justify-between">
            <h1 className="pb-4 space-x-2 text-4xl font-bold sm:inline-block">
              <span>Report</span>
              <ExternalLink
                href={createWCLUrl({ reportID })}
                className="italic underline"
              >
                {report.title}
              </ExternalLink>
            </h1>

            <Affixes ids={report.affixes} className="pb-4 sm:pb-0" />
          </div>

          <span className="space-x-1">
            <time dateTime={startDate.toISOString()}>
              {startDate.toLocaleDateString("en-US")}{" "}
              {startDate.toLocaleTimeString("en-US")}
            </time>
            <span>-</span>
            <time dateTime={endDate.toISOString()}>
              {endDate.toLocaleDateString("en-US")}{" "}
              {endDate.toLocaleTimeString("en-US")}
            </time>
            <span className="hidden md:inline">
              (Session of{" "}
              {timeDurationToString(report.endTime - report.startTime, {
                omitMs: true,
                toHours: true,
              })}
              )
            </span>
          </span>

          {report.fights.length > 1 && (
            <p>
              {report.fights.length} Keys (+{minmaxKeyLevel.min} to +
              {minmaxKeyLevel.max})
            </p>
          )}
        </div>

        <div className={`${bgPrimary} p-4 rounded-lg mt-4`}>
          {timed.length > 0 ? (
            <>
              <h1 className="py-4 text-3xl font-bold">
                Timed Keys ({timed.length})
              </h1>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-3 2xl:gap-8">
                {generateCards({
                  fights: timed,
                  category: "timed",
                  reportID,
                })}
              </div>
            </>
          ) : null}

          {untimed.length > 0 ? (
            <>
              <h1
                className={classnames(
                  "text-3xl font-bold",
                  timed.length > 0 ? "py-4" : "pb-4"
                )}
              >
                Keys Over Time ({untimed.length})
              </h1>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-3 2xl:gap-8">
                {generateCards({
                  fights: untimed,
                  category: "untimed",
                  reportID,
                })}
              </div>
            </>
          ) : null}

          {indeterminate.length > 0 ? (
            <>
              <h1
                className={classnames(
                  "text-3xl font-bold",
                  untimed.length > 0 || timed.length > 0 ? "py-4" : "pb-4"
                )}
              >
                Indeterminate Keys ({indeterminate.length})
              </h1>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-3 2xl:gap-8">
                {generateCards({
                  fights: indeterminate,
                  category: "indeterminate",
                  reportID,
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export const commonCardClassNames = `${hoverShadow} rounded-lg hover:-translate-y-1 transition-transform`;

type FightCardProps = {
  fight: ReportSuccessResponse["fights"][number];
  reportID: string;
};

function FightCard({ fight, reportID }: FightCardProps) {
  const dungeon =
    fight.dungeon && fight.dungeon in dungeons ? dungeons[fight.dungeon] : null;

  const isTimed =
    dungeon && fight.dungeon
      ? dungeons[fight.dungeon].time - fight.keystoneTime >= -750
      : true;

  return (
    <div className={commonCardClassNames}>
      <LinkBox
        className={classnames(
          "relative flex items-center justify-center h-64 text-2xl rounded-md bg-cover bg-maincolor",
          dungeon
            ? `bg-${dungeon.slug.toLowerCase()}`
            : "bg-fallback hover:bg-blend-multiply",
          isTimed
            ? "hover:bg-blend-multiply"
            : "bg-blend-multiply hover:bg-blend-normal"
        )}
        as="section"
        aria-labelledby={`fight-${fight.id}`}
      >
        {
          <LinkOverlay
            href={`/report/${reportID}/${fight.id}`}
            className="p-4 bg-white rounded-lg dark:bg-gray-900"
          >
            <h2 id={`fight-${fight.id}`} className="font-extrabold text-center">
              <span className="inline md:hidden">
                {dungeon ? dungeon.slug : "Unknown"}
              </span>
              <span className="hidden md:inline">
                {dungeon ? dungeon.name : "Unknown Dungeon"}
              </span>
              <span> +{fight.keystoneLevel}</span>
            </h2>

            <TimeInformation
              keystoneBonus={fight.keystoneBonus}
              keystoneTime={fight.keystoneTime}
              dungeonTimer={dungeon?.time}
              isTimed={isTimed}
            />

            <p className="flex justify-center w-full space-x-2 font-xl">
              <span>Ø {fight.averageItemLevel}</span>
              {fight.rating ? <span>| +{fight.rating}</span> : null}
            </p>

            {/* specs */}

            <div className="flex justify-center w-full pt-4 space-x-2">
              {fight.player.map((player, index) => {
                const { name, specs } = classes[player.class];
                const spec = specs.find((spec) => spec.id === player.spec);

                if (!spec) {
                  return null;
                }

                const classColor = classBorderColorMap[name.toLowerCase()];

                return (
                  <div
                    className="w-8 h-8"
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${player.class}-${player.spec}-${index}`}
                  >
                    <SpecIcon
                      class={name}
                      spec={spec.name}
                      className={`${classColor} border-2`}
                    />
                  </div>
                );
              })}
            </div>
          </LinkOverlay>
        }
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
      <span className="space-x-2">
        <span>{timeDurationToString(keystoneTime)}</span>
        <span
          className={`italic ${
            dungeonTimer ? (isTimed ? greenText : redText) : yellowText
          }`}
          title={`${keystoneBonus} chest${keystoneBonus > 1 ? "s" : ""}`}
        >
          {dungeonTimer
            ? timeDurationToString(
                isTimed
                  ? dungeonTimer - keystoneTime
                  : keystoneTime - dungeonTimer
              )
            : "Unknown"}
        </span>
      </span>
    </p>
  );
}

const bearCardTypes = [
  "bg-heart",
  "bg-pog",
  "bg-mplus",
  "bg-cry",
  "bg-hands",
  "bg-ahegao",
  "bg-laugh",
  "bg-uwu",
  "bg-pray",
  "bg-concern",
  "bg-taunt",
] as const;

const categories: Record<
  "timed" | "untimed" | "indeterminate",
  typeof bearCardTypes[number][]
> = {
  timed: ["bg-heart", "bg-pog", "bg-mplus", "bg-ahegao", "bg-laugh", "bg-uwu"],
  untimed: ["bg-cry", "bg-hands", "bg-mplus", "bg-heart"],
  indeterminate: ["bg-concern", "bg-taunt", "bg-pray", "bg-mplus", "bg-heart"],
};

const pickType = (category: keyof typeof categories) => {
  const possible = categories[category];

  const pick = Math.floor(Math.random() * possible.length);

  return possible[pick];
};

type BearCardProps = {
  type: typeof bearCardTypes[number];
};

function BearCard({ type }: BearCardProps) {
  return (
    <div className={commonCardClassNames}>
      <div className="h-64 text-2xl bg-white bg-cover rounded-md bg-fallback bg-blend-luminosity">
        <div
          className={`bg-no-repeat h-64 bg-cover sm:bg-contain rounded-md w-full h-full ${type}`}
        />
      </div>
    </div>
  );
}

const cardCache: Record<
  string,
  {
    timed: Record<number, BearCardProps["type"]>;
    untimed: Record<number, BearCardProps["type"]>;
    indeterminate: Record<number, BearCardProps["type"]>;
    supportCard: "buyMeACoffee" | "patreon" | null;
  }
> = {};

type GenerateCardArgs = {
  fights: ReportSuccessResponse["fights"];
  category: "timed" | "untimed" | "indeterminate";
  reportID: string;
};

const mutateOrRetrieveCache = ({
  category,
  reportID,
}: Omit<GenerateCardArgs, "fights">) => {
  if (reportID in cardCache) {
    return cardCache[reportID][category];
  }

  cardCache[reportID] = {
    timed: {},
    untimed: {},
    indeterminate: {},
    supportCard: null,
  };

  return cardCache[reportID][category];
};

const SupportCard = dynamic(
  () =>
    import(
      /* webpackChunkName: "SupportCard" */ "../../../web/components/report/SupportCard"
    ),
  {
    suspense: true,
  }
);

const maybeSpawnSupportCard = ({
  reportID,
  index,
  spawnedPreviously,
}: Pick<GenerateCardArgs, "reportID"> & {
  index: number;
  spawnedPreviously: boolean;
}) => {
  if (spawnedPreviously || index % 2 !== 1) {
    return null;
  }

  const cache = cardCache[reportID];

  if (cache.supportCard) {
    return (
      <Suspense
        fallback={<div />}
        key={`support-${cache.supportCard}-${reportID}`}
      >
        <SupportCard type={cache.supportCard} />
      </Suspense>
    );
  }

  const shouldSpawn = Math.random() >= 0.5;

  if (!shouldSpawn) {
    return null;
  }

  const type: SupportCardProps["type"] =
    Math.random() >= 0.5 ? "buyMeACoffee" : "patreon";
  cache.supportCard = type;

  return (
    <Suspense fallback={<div />} key={`support-${type}-${reportID}`}>
      <SupportCard type={type} />
    </Suspense>
  );
};

function generateCards({
  fights,
  category,
  reportID,
}: GenerateCardArgs): (JSX.Element | null)[] {
  // retrieve cache of this report
  const cache = mutateOrRetrieveCache({ category, reportID });
  let spawnedSupportCard = false;

  return fights.reduce<(JSX.Element | null)[]>((acc, fight, index) => {
    // retrieve cache of this array index
    const cachedType = index in cache ? cache[index] : null;

    // add a 50% chance to spawn a support on odd indices
    const supportJsx = maybeSpawnSupportCard({
      reportID,
      index,
      spawnedPreviously: spawnedSupportCard,
    });

    if (supportJsx) {
      spawnedSupportCard = true;
    }

    const defaultJsx = (
      <FightCard reportID={reportID} fight={fight} key={fight.id} />
    );

    const maySpawn =
      index > 0 && index + 1 < fights.length && Math.random() >= 0.66;

    // may not add now or based on previous iteration
    if (!maySpawn && !cachedType) {
      acc.push(defaultJsx, supportJsx);
      return acc;
    }

    // use cache. straightforward
    if (cachedType) {
      acc.push(
        defaultJsx,
        <BearCard type={cachedType} key={`${cachedType}-${reportID}`} />,
        supportJsx
      );
      return acc;
    }

    // retrieve all previously used options
    const usedOptions = Object.values(cache);

    // compare whether new options are possible
    const hasExhaustedAllOptions =
      usedOptions.length === categories[category].length;

    // may spawn, but nothing to spawn :(
    if (hasExhaustedAllOptions) {
      acc.push(defaultJsx, supportJsx);
      return acc;
    }

    // reroll until we hit something we haven't seen yet
    let nextType = pickType(category);

    while (usedOptions.includes(nextType)) {
      nextType = pickType(category);
    }

    // cache it
    cardCache[reportID][category][index] = nextType;

    // use it
    acc.push(
      defaultJsx,
      <BearCard type={nextType} key={`${nextType}-${reportID}`} />,
      supportJsx
    );
    return acc;
  }, []);
}
