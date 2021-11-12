import type {
  FightResponse,
  FightSuccessResponse,
} from "@keystone-heroes/api/functions/fight";
import {
  createResponseFromStoredFight,
  loadExistingFight,
  fightHasDungeon,
} from "@keystone-heroes/api/functions/fight";
import { prisma } from "@keystone-heroes/db/prisma";
import { isValidReportId } from "@keystone-heroes/wcl/utils";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useContext } from "react";

import { Spinner } from "../../../components/Spinner";
import { AffixImpact } from "../../../components/report/AffixImpact";
import { Data } from "../../../components/report/Data";
import { Map } from "../../../components/report/Map";
import { Meta } from "../../../components/report/Meta";
import { useAbortableFetch } from "../../../hooks/useAbortableFetch";
import { dungeons } from "../../../staticData";
import { widthConstraint } from "../../../styles/tokens";
import { timeDurationToString } from "../../../utils";

type FightIDProps = {
  cache?: {
    fight: FightResponse | null;
    reportID: string | null;
    fightID: number | null;
  };
};

const useFightURL = (cache: FightIDProps["cache"]) => {
  const { query, isFallback } = useRouter();

  if (cache?.fight) {
    return {
      url: null,
      reportID: cache.reportID,
      fightID: cache.fightID ? `${cache.fightID}` : null,
    };
  }

  if (isFallback) {
    return {
      url: null,
      reportID: null,
      fightID: null,
    };
  }

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
  loading: boolean;
  fight: FightSuccessResponse | null;
};

const FightContext = createContext<FightContextDefinition | null>(null);

export const useFight = (): FightContextDefinition => {
  const ctx = useContext(FightContext);

  if (!ctx) {
    throw new Error("useFight must be used within FightContext.Provider");
  }

  return ctx;
};

export default function FightID({ cache }: FightIDProps): JSX.Element | null {
  const { url, fightID, reportID } = useFightURL(cache);

  const [fight, loading] = useAbortableFetch<FightResponse>({
    url,
    initialState: cache?.fight ?? null,
  });

  if (!fightID || !reportID || !fight || loading) {
    return (
      <div className="self-center w-1/4 h-1/4">
        <Spinner />
      </div>
    );
  }

  if ("error" in fight) {
    return <h1>{fight.error}</h1>;
  }

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    fight,
    loading,
    reportID,
    fightID,
  };

  return (
    <FightContext.Provider value={value}>
      <FightIDHead />

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

type StaticPathParams = {
  reportID: string;
  fightID: string;
};

export const getStaticPaths: GetStaticPaths<StaticPathParams> = async () => {
  const paths = await prisma.fight.findMany({
    select: {
      fightID: true,
      Report: {
        select: {
          report: true,
        },
      },
    },
  });

  return {
    fallback: true,
    paths: paths.map((path) => ({
      params: {
        reportID: path.Report.report,
        fightID: `${path.fightID}`,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<FightIDProps, StaticPathParams> =
  async (ctx) => {
    if (!ctx.params?.fightID || !ctx.params.reportID) {
      return {
        props: {
          cache: {
            fight: null,
            fightID: null,
            reportID: null,
          },
        },
      };
    }

    const fightID = Number.parseInt(ctx.params.fightID);

    const fightSuccessResponse = await loadExistingFight(
      ctx.params.reportID,
      fightID
    );

    if (!fightSuccessResponse || !fightHasDungeon(fightSuccessResponse)) {
      return {
        props: {
          cache: {
            fight: null,
            reportID: null,
            fightID: null,
          },
        },
      };
    }

    const fight = createResponseFromStoredFight(fightSuccessResponse);

    // fight is known through report import, but has not finished importing
    if (fight.pulls.length === 0) {
      return {
        props: {
          cache: {
            fight: null,
            reportID: null,
            fightID: null,
          },
        },
        revalidate: 24 * 60 * 60,
      };
    }

    const cache: FightIDProps["cache"] = {
      reportID: ctx.params.reportID,
      fightID,
      fight,
    };

    return {
      props: {
        cache,
      },
      revalidate: 24 * 60 * 60,
    };
  };

function FightIDHead() {
  const { fight } = useFight();

  if (!fight) {
    return (
      <Head>
        <title>Keystone Heroes | loading...</title>
      </Head>
    );
  }

  const dungeon = dungeons[fight.dungeon];

  return (
    <Head>
      <title>
        KSH | {dungeon.slug} +{fight.meta.level} in{" "}
        {timeDurationToString(fight.meta.time)}
      </title>
    </Head>
  );
}
