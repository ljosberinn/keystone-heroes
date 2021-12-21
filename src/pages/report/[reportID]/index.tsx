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
import { Seo } from "../../../web/components/Seo";
import { SpecIcon } from "../../../web/components/SpecIcon";
import { useAbortableFetch } from "../../../web/hooks/useAbortableFetch";
import { useIsMounted } from "../../../web/hooks/useIsMounted";
import { classes, dungeons } from "../../../web/staticData";
import {
  bgPrimary,
  widthConstraint,
  greenText,
  redText,
  yellowText,
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
        <Seo title="Unknown Report" />

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
      <Seo title={report.title} />

      <div className={`${widthConstraint} py-6`}>
        {timed.length > 0 ? (
          <>
            <h1 className="pb-4 text-3xl font-bold">Timed Keys</h1>
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
            <h1 className="pb-4 text-3xl font-bold">Keys Over Time</h1>
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
            <h1 className="pb-4 text-3xl font-bold">Indeterminate Keys</h1>
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
            className="p-4 bg-white rounded-lg dark:bg-gray-900"
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
}: GenerateCardArgs): (JSX.Element | null)[] {
  let hasBuyMeACoffeeCard = false;

  return fights.reduce<(JSX.Element | null)[]>((acc, fight, index) => {
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

    // add a 50% chance to spawn a BuyMeACoffeeCard on odd indices
    const shouldSpawnBuyMeACoffeeCard =
      !hasBuyMeACoffeeCard && index % 2 === 1 && Math.random() >= 0.5;
    if (shouldSpawnBuyMeACoffeeCard) {
      hasBuyMeACoffeeCard = true;
    }

    const buyMeACoffeeJsx = shouldSpawnBuyMeACoffeeCard ? (
      <BuyMeACoffeeCard />
    ) : null;

    // only consider even calculating spawning a card if nothing
    // is already cached
    const maySpawn =
      cache && Object.values(cache).some((cache) => cache.length > 0)
        ? false
        : index > 0 && index + 1 < fights.length && Math.random() >= 0.66;

    const jsx = <FightCard reportID={reportID} fight={fight} key={fight.id} />;

    // may not add now or absed on previous iteration
    if (!maySpawn && !cachedType) {
      return [...acc, jsx, buyMeACoffeeJsx];
    }

    // use cache. straightforward
    if (cachedType) {
      return [
        ...acc,
        jsx,
        // eslint-disable-next-line react/no-array-index-key
        <BearCard type={cachedType} key={`${cachedType}-${index}`} />,
        buyMeACoffeeJsx,
      ];
    }

    // retrieve all previously used options
    const usedOptions = cache ? Object.values(cache) : [];

    // compare whether new options are possible
    const hasExhaustedAllOptions =
      usedOptions.length === categories.timed.length;

    // may spawn, but nothing to spawn :(
    if (hasExhaustedAllOptions) {
      return [...acc, jsx, buyMeACoffeeJsx];
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
      buyMeACoffeeJsx,
    ];
  }, []);
}

function BuyMeACoffeeCard() {
  return (
    <div className={`p-2 rounded-lg shadow-sm ${bgPrimary}`}>
      <LinkBox
        className={classnames(
          "relative flex items-center justify-center h-64 text-2xl rounded-md"
        )}
        as="section"
        aria-labelledby="buy-me-a-coffee"
      >
        <LinkOverlay
          href="https://www.buymeacoffee.com/rOSn8DF"
          className="flex flex-col justify-center w-full h-full p-4 bg-white rounded-lg dark:bg-gray-900 "
        >
          <h2 id="buy-me-a-coffee" className="font-extrabold text-center">
            Consider supporting the site to keep the lights on {"<3"}
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 300 300"
          >
            <path d="M0 0h300v300H0z" />
            <path
              fill="#0D0C22"
              d="m215.457 85.7847-.164-.0968-.381-.1161c.153.1293.345.2042.545.2129ZM217.856 102.917l-.184.052.184-.052ZM215.529 85.7583c-.024-.003-.047-.0085-.069-.0164-.001.0152-.001.0305 0 .0457.025-.0032.049-.0134.069-.0293Z"
            />
            <path
              fill="#0D0C22"
              d="M215.459 85.7869h.025v-.0154l-.025.0154ZM217.709 102.886l.277-.158.104-.058.093-.1c-.176.076-.336.183-.474.316ZM215.939 86.1589l-.271-.2581-.184-.1c.099.1744.263.303.455.3581ZM147.753 252.409c-.217.094-.406.24-.552.426l.171-.11c.116-.106.281-.232.381-.316ZM187.347 244.619c0-.245-.12-.2-.09.671 0-.071.029-.142.041-.21.017-.155.029-.306.049-.461ZM183.241 252.409c-.216.094-.406.24-.552.426l.171-.11c.117-.106.281-.232.381-.316ZM119.87 254.261c-.165-.143-.366-.237-.581-.271.174.084.349.168.465.232l.116.039ZM113.594 248.252c-.025-.254-.103-.5-.229-.722.089.231.163.468.223.709l.006.013Z"
            />
            <path
              fill="#FD0"
              d="M155.742 140.782c-8.614 3.687-18.389 7.869-31.059 7.869-5.3-.011-10.574-.738-15.679-2.162l8.762 89.963c.31 3.76 2.023 7.266 4.799 9.822 2.776 2.555 6.411 3.974 10.184 3.973 0 0 12.424.645 16.57.645 4.461 0 17.841-.645 17.841-.645 3.772 0 7.406-1.419 10.181-3.974 2.775-2.556 4.488-6.062 4.798-9.821l9.385-99.413c-4.194-1.432-8.427-2.384-13.199-2.384-8.252-.003-14.901 2.839-22.583 6.127Z"
            />
            <path
              fill="#0D0C22"
              d="m81.8789 102.4.1484.139.0968.058c-.0745-.074-.1567-.14-.2452-.197Z"
            />
            <path
              fill="#0D0C22"
              d="m232.044 94.0967-1.32-6.6557c-1.184-5.9717-3.871-11.6144-10.001-13.7727-1.965-.6904-4.194-.9872-5.701-2.4164-1.506-1.4292-1.952-3.6489-2.3-5.7072-.645-3.7779-1.252-7.559-1.913-11.3304-.571-3.2424-1.023-6.8847-2.51-9.8593-1.936-3.9941-5.952-6.3298-9.947-7.8752-2.046-.764-4.135-1.4103-6.255-1.9357-9.979-2.6326-20.47-3.6005-30.736-4.1521-12.322-.68-24.677-.4751-36.969.6129-9.15.8324-18.787 1.839-27.4811 5.0039-3.1778 1.1582-6.4524 2.5487-8.8689 5.0038-2.9649 3.0165-3.9327 7.6816-1.7679 11.4434 1.5389 2.6713 4.1456 4.5586 6.9105 5.8072 3.6013 1.6087 7.3624 2.8328 11.2204 3.652 10.744 2.3745 21.871 3.3069 32.846 3.7037 12.165.491 24.35.0931 36.457-1.1904 2.993-.3291 5.982-.7238 8.965-1.1841 3.513-.5387 5.769-5.1329 4.733-8.3333-1.239-3.8262-4.568-5.3103-8.333-4.7328-.555.0871-1.107.1678-1.662.2484l-.4.0581c-1.275.1613-2.551.3119-3.826.4517-2.635.2839-5.276.5161-7.924.6968-5.929.413-11.875.6033-17.818.613-5.839 0-11.682-.1645-17.509-.5485-2.658-.1742-5.31-.3957-7.955-.6646-1.204-.1258-2.404-.2581-3.604-.4065l-1.142-.1451-.249-.0355-1.184-.171c-2.419-.3646-4.839-.784-7.233-1.2905-.241-.0536-.457-.188-.612-.381-.155-.193-.24-.433-.24-.6804 0-.2475.085-.4875.24-.6805.155-.193.371-.3274.612-.3809h.045c2.075-.442 4.165-.8195 6.262-1.1486.699-.1097 1.401-.2172 2.104-.3226h.019c1.313-.0871 2.633-.3226 3.939-.4775 11.369-1.1824 22.804-1.5856 34.227-1.2066 5.546.1613 11.089.4872 16.609 1.0485 1.187.1226 2.368.2517 3.549.3969.451.0548.906.1193 1.361.1742l.916.1322c2.672.3979 5.329.8808 7.972 1.4486 3.917.8517 8.947 1.1292 10.689 5.42.555 1.3615.806 2.8746 1.113 4.3038l.39 1.8228c.01.0327.018.0661.023.1.922 4.3016 1.846 8.6032 2.771 12.9049.068.3177.069.6461.005.9645-.065.3184-.195.6201-.381.8861-.187.2661-.426.4909-.703.6604-.277.1695-.586.2801-.908.3248h-.026l-.565.0774-.558.0742c-1.768.2302-3.538.4452-5.31.6453-3.491.3979-6.987.742-10.489 1.0324-6.957.5785-13.929.9581-20.915 1.1388-3.56.0946-7.118.1387-10.676.1323-14.159-.0112-28.307-.8341-42.373-2.4648-1.522-.1807-3.045-.3743-4.568-.5711 1.181.1517-.858-.1161-1.271-.1742-.968-.1355-1.9358-.2764-2.9036-.4226-3.2488-.4872-6.4783-1.0873-9.7206-1.6131-3.9199-.6453-7.6687-.3226-11.2143 1.6131-2.9104 1.5926-5.266 4.0348-6.7525 7.0009-1.5292 3.1616-1.9841 6.604-2.668 10.0012-.684 3.3972-1.7486 7.0525-1.3454 10.54.8679 7.527 6.1298 13.644 13.6985 15.012 7.1203 1.29 14.2792 2.335 21.4579 3.226 28.198 3.453 56.685 3.866 84.971 1.232 2.304-.215 4.604-.449 6.901-.703.718-.079 1.444.004 2.125.242.682.238 1.301.625 1.813 1.134.513.508.905 1.125 1.148 1.805.243.679.331 1.405.257 2.123l-.716 6.962c-1.443 14.068-2.887 28.136-4.33 42.202-1.505 14.772-3.021 29.542-4.546 44.312-.43 4.16-.86 8.318-1.29 12.476-.413 4.094-.471 8.317-1.249 12.362-1.226 6.363-5.533 10.269-11.817 11.699-5.758 1.31-11.64 1.998-17.544 2.052-6.546.035-13.089-.255-19.635-.22-6.988.039-15.547-.606-20.941-5.807-4.74-4.568-5.395-11.721-6.04-17.905-.86-8.189-1.713-16.376-2.558-24.562l-4.743-45.518-3.068-29.452c-.051-.487-.103-.968-.151-1.458-.368-3.514-2.8556-6.953-6.7755-6.775-3.3552.148-7.1686 3-6.775 6.775l2.2745 21.835 4.7038 45.166c1.3399 12.83 2.6766 25.662 4.0101 38.496.2581 2.458.5001 4.923.7711 7.381 1.474 13.434 11.734 20.674 24.439 22.713 7.42 1.193 15.021 1.439 22.551 1.561 9.653.155 19.402.526 28.897-1.223 14.069-2.581 24.625-11.975 26.132-26.548.43-4.207.86-8.415 1.291-12.624 1.43-13.92 2.858-27.841 4.284-41.763l4.665-45.49 2.139-20.848c.107-1.034.543-2.005 1.245-2.772.702-.766 1.632-1.286 2.652-1.483 4.023-.784 7.869-2.123 10.731-5.185 4.555-4.874 5.462-11.23 3.852-17.6373ZM80.7056 98.594c.0613-.029-.0516.4968-.1.742-.0096-.371.0097-.7001.1-.742Zm.3904 3.02c.0323-.023.1291.106.2291.261-.1517-.142-.2484-.248-.2323-.261h.0032Zm.3839.506c.1388.236.213.384 0 0Zm.7711.626h.0193c0 .023.0355.045.0484.068-.0214-.025-.0451-.048-.0709-.068h.0032Zm135.023-.935c-1.445 1.374-3.623 2.013-5.775 2.332-24.132 3.581-48.615 5.394-73.012 4.594-17.46-.597-34.737-2.536-52.0226-4.978-1.6937-.239-3.5295-.548-4.6941-1.797-2.1938-2.355-1.1163-7.0975-.5452-9.943.5226-2.6068 1.5227-6.0814 4.6231-6.4524 4.8393-.5678 10.4594 1.4744 15.2468 2.2002 5.764.8797 11.55 1.5841 17.357 2.1132 24.784 2.2584 49.984 1.9067 74.658-1.3969 4.497-.6044 8.978-1.3066 13.444-2.1067 3.977-.713 8.388-2.0519 10.791 2.068 1.649 2.8068 1.868 6.5621 1.613 9.7334-.078 1.3818-.682 2.6812-1.687 3.6332h.003Z"
            />
          </svg>
        </LinkOverlay>
      </LinkBox>
    </div>
  );
}
