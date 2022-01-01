import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Script from "next/script";
import { createContext, useContext, Suspense } from "react";

import type {
  FightErrorResponse,
  FightResponse,
  FightSuccessResponse,
} from "../../../api/functions/fight";
import { fightHandlerError } from "../../../api/utils/errors";
import { isValidReportId } from "../../../wcl/utils";
import { Breadcrumbs } from "../../../web/components/Breadcrumbs";
import { Seo } from "../../../web/components/Seo";
import { AffixImpact } from "../../../web/components/report/AffixImpact";
import { Data } from "../../../web/components/report/Data";
import { Map } from "../../../web/components/report/Map";
import { Meta } from "../../../web/components/report/Meta";
import { useAbortableFetch } from "../../../web/hooks/useAbortableFetch";
import { affixes, dungeons } from "../../../web/staticData";
import { widthConstraint } from "../../../web/styles/tokens";
import { timeDurationToString } from "../../../web/utils";

const DeleteUtil = dynamic(
  () =>
    import(
      /* webpackChunkName: "dev-utils" */ "../../../web/components/report/dev"
    ),
  {
    suspense: true,
  }
);

const GenericError = dynamic(
  () =>
    import(
      /* webpackChunkName: "GenericError" */ "../../../web/components/GenericError"
    ),
  {
    suspense: true,
  }
);

const useFightURL = () => {
  const { query } = useRouter();
  const { reportID, fightID } = query;

  if (!isValidReportId(reportID)) {
    return {
      url: null,
      fightID: null,
      reportID: null,
    };
  }

  if (!fightID || Array.isArray(fightID)) {
    return {
      url: null,
      fightID: null,
      reportID: null,
    };
  }

  const maybeFightID = Number.parseInt(fightID);

  if (!maybeFightID || Number.isNaN(maybeFightID) || maybeFightID < 1) {
    return {
      url: null,
      fightID: null,
      reportID: null,
    };
  }

  const params = new URLSearchParams({
    reportID,
    fightID: `${fightID}`,
  }).toString();

  return {
    url: `/api/fight?${params}`,
    fightID,
    reportID,
  };
};

const imageMap: Record<FightErrorResponse["error"], string> = {
  MISSING_DUNGEON: "/static/bear/hands-256.png",
  BROKEN_LOG_OR_WCL_UNAVAILABLE: "/static/bear/hands-256.png",
  FATAL_ERROR: "/static/bear/concern-256.png",
  UNKNOWN_REPORT: "/static/bear/concern-256.png",
};

type FightContextDefinition = {
  reportID: string;
  fightID: string;
  fight: FightSuccessResponse;
};

const FightContext = createContext<FightContextDefinition | null>(null);

export const useFight = (): FightContextDefinition => {
  const ctx = useContext(FightContext);

  if (!ctx) {
    throw new Error("useFight must be used within FightContext.Provider");
  }

  return ctx;
};

export default function FightID(): JSX.Element | null {
  const { url, fightID, reportID } = useFightURL();

  const [fight, loading] = useAbortableFetch<FightResponse>({
    url,
    initialState: null,
  });

  if (!fightID || !reportID || !fight || loading) {
    // TODO: extract as component since its identical to /[reportID]/index
    return (
      <div className="flex flex-col items-center justify-center w-full px-16 py-8 m-auto xl:px-64 xl:py-32 lg:flex-row max-w-screen-2xl">
        <p className="pt-8 lg:pl-24 lg:pt-0">
          Bear busy retrieving run. Please stand by.
        </p>

        <img
          src="/static/bear/dance.gif"
          height="256"
          width="256"
          alt="Loading"
          loading="lazy"
        />
      </div>
    );
  }

  const breadcrumbs = (
    <Breadcrumbs
      className="mt-6"
      paths={[
        {
          href: `/report/${reportID}`,
          children: `Report ${reportID}`,
        },
        {
          children: `Fight ${fightID}`,
        },
      ]}
    />
  );

  if ("error" in fight) {
    const image = imageMap[fight.error];

    return (
      <>
        {breadcrumbs}
        {/** TODO: extract as component as its basically identical to /[reportID]/index */}
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
            <h1 className="font-semibold ">{fight.error}</h1>
            <p className="pt-8">{fightHandlerError[fight.error]}</p>
          </div>
        </div>
      </>
    );
  }

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    fight,
    reportID,
    fightID,
  };

  return (
    <FightContext.Provider value={value}>
      <Script
        src="https://wow.zamimg.com/widgets/power.js"
        strategy="lazyOnload"
      />

      <FightIDHead fight={fight} />

      {process.env.NODE_ENV === "development" && (
        <Suspense fallback={null}>
          <DeleteUtil reportID={reportID} fightID={fightID} />
        </Suspense>
      )}

      {breadcrumbs}

      {fight.meta.percent < 100 && (
        <Suspense fallback={null}>
          <GenericError type="missing-percent" percent={fight.meta.percent} />
        </Suspense>
      )}

      <div
        className={`space-x-0 lg:space-x-4 lg:flex lg:flex-row ${widthConstraint}`}
      >
        <Meta />
        <Map />
      </div>

      <AffixImpact />

      <Data />
    </FightContext.Provider>
  );
}

type FightIDHeadProps = {
  fight: FightSuccessResponse;
};

function FightIDHead({ fight }: FightIDHeadProps) {
  const dungeon = dungeons[fight.dungeon];

  const extendedTitle = [
    fight.affixes.map((affix) => affixes[affix].name).join(", "),
    fight.player
      .map((player) => {
        return player.name;
      })
      .join(", "),
  ].join(" | ");

  return (
    <Seo
      title={`+${fight.meta.level} ${dungeon.name} (${timeDurationToString(
        fight.meta.time,
        { omitMs: true }
      )})`}
      description={extendedTitle}
      image={`/static/dungeons/${dungeon.slug.toLowerCase()}.jpg`}
    />
  );
}
