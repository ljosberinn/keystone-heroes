import Head from "next/head";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";

import type {
  ReportErrorResponse,
  ReportResponse,
  ReportSuccessResponse,
} from "../../../api/functions/report";
import { reportHandlerError } from "../../../api/utils/errors";
import { isValidReportId } from "../../../wcl/utils";
import { ExternalLink } from "../../../web/components/ExternalLink";
import { LinkBox, LinkOverlay } from "../../../web/components/LinkBox";
import { SpecIcon } from "../../../web/components/SpecIcon";
import { useAbortableFetch } from "../../../web/hooks/useAbortableFetch";
import { useIsMounted } from "../../../web/hooks/useIsMounted";
import { classes, dungeons } from "../../../web/staticData";
import {
  bgPrimary,
  widthConstraint,
  greenText,
  redText,
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
  EMPTY_LOG: "/static/bear/concern-256.png",
  BROKEN_LOG_OR_WCL_UNAVAILABLE: "/static/bear/hands-256.png",
  NO_ELIGIBLE_KEYS: "/static/bear/concern-256.png",
  SECONDARY_REQUEST_FAILED: "/static/bear/cry-256.png",
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
        <Head>
          <title>Unknown Report</title>
        </Head>

        <div className="flex flex-col items-center justify-center w-full px-16 py-8 m-auto xl:px-64 xl:py-32 lg:flex-row max-w-screen-2xl">
          <img
            src="/static/bear/concern-256.png"
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

        <p className="pt-8 lg:pl-24 lg:pt-0">Bear busy. Please stand by.</p>
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

  return (
    <>
      <Head>
        <title>{report.title}</title>
      </Head>

      <div className={`${widthConstraint} py-6`}>
        {timed.length > 0 ? (
          <>
            <h1>{timed.length} timed keys</h1>
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
            <h1>{untimed.length} untimed keys</h1>
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
            <h1>
              {indeterminate.length} keys without initially detectable dungeon
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
    </>
  );
}

type PickFromUnion<T, K extends string> = T extends { [P in K]: unknown }
  ? T[K]
  : never;

type FightCardProps = {
  fight: PickFromUnion<ReportResponse, "fights">[number];
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
    <div className={`p-2 rounded-lg shadow-sm ${bgPrimary}`}>
      <LinkBox
        className={classnames(
          "relative flex items-center justify-center h-64 text-2xl rounded-md bg-cover bg-white transition-colors duration-500",
          dungeon
            ? `bg-${dungeon.slug.toLowerCase()}`
            : "bg-fallback hover:bg-blend-luminosity",
          isTimed
            ? "hover:bg-blend-luminosity"
            : "bg-blend-luminosity hover:bg-blend-normal"
        )}
        as="section"
        aria-labelledby={`fight-${fight.id}`}
      >
        {
          <LinkOverlay
            href={`/report/${reportID}/${fight.id}`}
            className="p-4 bg-white rounded-lg dark:bg-coolgray-900"
          >
            <h2 id={`fight-${fight.id}`} className="font-extrabold text-center">
              {dungeon ? dungeon.name : "Unknown Dungeon"} +
              {fight.keystoneLevel}
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
          className={`italic ${isTimed ? greenText : redText}`}
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
    <div className={`p-2 rounded-lg shadow-sm ${bgPrimary}`}>
      <div className="h-64 text-2xl bg-white bg-cover rounded-md bg-fallback bg-blend-luminosity">
        <div
          className={`bg-no-repeat bg-contain h-64 bg-cover rounded-md w-full h-full ${type}`}
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
  }
> = {};

type GenerateCardArgs = {
  fights: ReportSuccessResponse["fights"];
  category: "timed" | "untimed" | "indeterminate";
  reportID: string;
};

function generateCards({
  fights,
  category,
  reportID,
}: GenerateCardArgs): JSX.Element[] {
  return fights.reduce<JSX.Element[]>((acc, fight, index) => {
    // retrieve cache of this report
    const cache = reportID in cardCache ? cardCache[reportID][category] : null;
    // retrieve cache of this array index
    const cachedType = cache && index in cache ? cache[index] : null;

    // first loop, mutate cache
    if (index === 0 && !cache) {
      cardCache[reportID] = {
        timed: {},
        untimed: {},
        indeterminate: {},
      };
    }

    // only consider even calculating spawning a card if nothing
    // is already cached
    const maySpawn =
      cache && Object.values(cache).some((cache) => cache.length > 0)
        ? false
        : index > 0 && index + 1 < fights.length && Math.random() >= 0.66;

    const jsx = <FightCard reportID={reportID} fight={fight} key={fight.id} />;

    // may not add now or absed on previous iteration
    if (!maySpawn && !cachedType) {
      return [...acc, jsx];
    }

    // use cache. straightforward
    if (cachedType) {
      return [
        ...acc,
        jsx,
        // eslint-disable-next-line react/no-array-index-key
        <BearCard type={cachedType} key={`${cachedType}-${index}`} />,
      ];
    }

    // retrieve all previously used options
    const usedOptions = cache ? Object.values(cache) : [];

    // compare whether new options are possible
    const hasExhaustedAllOptions =
      usedOptions.length === categories.timed.length;

    // may spawn, but nothing to spawn :(
    if (hasExhaustedAllOptions) {
      return [...acc, jsx];
    }

    // reroll until we hit something we haven't seen yet
    let nextType = pickType("timed");

    while (usedOptions.includes(nextType)) {
      nextType = pickType("timed");
    }

    // cache it
    cardCache[reportID].timed[index] = nextType;

    // use it
    return [
      ...acc,
      jsx,
      // eslint-disable-next-line react/no-array-index-key
      <BearCard type={nextType} key={`${nextType}-${index}`} />,
    ];
  }, []);
}
