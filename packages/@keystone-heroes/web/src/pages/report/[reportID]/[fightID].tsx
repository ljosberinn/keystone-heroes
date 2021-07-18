import type { FightResponse } from "@keystone-heroes/api/functions/fight";
import { isValidReportId } from "@keystone-heroes/wcl/utils";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useContext,
} from "react";
import { Map } from "src/components/report/Map";
import { Meta } from "src/components/report/Meta";
import { useAbortableFetch } from "src/hooks/useAbortableFetch";
import { fightTimeToString } from "src/utils";

type FightIDProps = {
  cache?: {
    fight: FightResponse | null;
    reportID: string | null;
    fightID: number | null;
  };
};

const useFightURL = (cache: FightIDProps["cache"]) => {
  const { query, isFallback } = useRouter();

  if (isFallback) {
    return {
      url: null,
      reportID: null,
      fightID: null,
    };
  }

  if (cache?.fight) {
    return {
      url: null,
      reportID: cache.reportID,
      fightID: cache.fightID,
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

export default function FightID({ cache }: FightIDProps): JSX.Element | null {
  const { url, fightID, reportID } = useFightURL(cache);

  const [fight] = useAbortableFetch<FightResponse>({
    url,
    initialState: cache?.fight ?? null,
  });

  if (!fightID || !reportID || !fight) {
    return null;
  }

  if ("error" in fight) {
    return <h1>{fight.error}</h1>;
  }

  return (
    <>
      <Head>
        <title>
          KSH | {fight.dungeon.slug} +{fight.meta.level} in{" "}
          {fightTimeToString(fight.meta.time)}
        </title>
      </Head>

      <FightIDContextProvider>
        <div className="flex flex-col lg:flex-row">
          <Meta {...fight} />
          <Map zones={fight.dungeon.zones} pulls={fight.pulls} />
        </div>
        <div className="flex flex-col lg:flex-row">
          <section>
            <h1 className="text-2xl font-bold">Pulls</h1>
          </section>
          <section>
            <h1 className="text-2xl font-bold">Notable Events</h1>
          </section>
        </div>
      </FightIDContextProvider>
    </>
  );
}

type StaticPathParams = {
  reportID: string;
  fightID: string;
};

export const getStaticPaths: GetStaticPaths<StaticPathParams> = () => {
  return {
    fallback: true,
    paths: [],
  };
};

export const getStaticProps: GetStaticProps<FightIDProps, StaticPathParams> =
  () => {
    return {
      props: {
        cache: {
          fight: null,
          fightID: null,
          reportID: null,
        },
      },
    };
  };

type FightIDContextDefinition = {
  selectedPull: number;
  handlePullSelectionChange: (id: number) => void;
};

const FightIDContext = createContext<null | FightIDContextDefinition>(null);

export const useFightIDContext = (): FightIDContextDefinition => {
  const ctx = useContext(FightIDContext);

  if (!ctx) {
    throw new Error("useFightIDContext called outside of its provider");
  }

  return ctx;
};

type FightIDContextProviderProps = {
  children: ReactNode;
};

function FightIDContextProvider({ children }: FightIDContextProviderProps) {
  const [selectedPull, setSelectedPull] = useState(1);

  const handlePullSelectionChange = useCallback((id: number) => {
    setSelectedPull(id);
  }, []);

  const value: FightIDContextDefinition = useMemo(
    () => ({
      selectedPull,
      handlePullSelectionChange,
    }),
    [selectedPull, handlePullSelectionChange]
  );

  return (
    <FightIDContext.Provider value={value}>{children}</FightIDContext.Provider>
  );
}
