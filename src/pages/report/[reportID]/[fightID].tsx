import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useContext, Suspense } from "react";

import type {
  FightResponse,
  FightSuccessResponse,
} from "../../../api/functions/fight";
import { isValidReportId } from "../../../wcl/utils";
import { Breadcrumbs } from "../../../web/components/Breadcrumbs";
import { Spinner } from "../../../web/components/Spinner";
import { AffixImpact } from "../../../web/components/report/AffixImpact";
import { Data } from "../../../web/components/report/Data";
import { Map } from "../../../web/components/report/Map";
import { Meta } from "../../../web/components/report/Meta";
import { useAbortableFetch } from "../../../web/hooks/useAbortableFetch";
import { dungeons } from "../../../web/staticData";
import { widthConstraint } from "../../../web/styles/tokens";
import { timeDurationToString } from "../../../web/utils";

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
    return (
      <div className="self-center w-1/4 h-1/4">
        <Spinner />
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
    return (
      <>
        {breadcrumbs}
        <Suspense fallback={null}>
          <GenericError type="loading-failed" error={fight.error} />
        </Suspense>
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
      <FightIDHead fight={fight} />

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

  return (
    <Head>
      <title>
        {dungeon.slug} +{fight.meta.level} in{" "}
        {timeDurationToString(fight.meta.time)}
      </title>
    </Head>
  );
}
