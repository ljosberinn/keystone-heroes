import type { ReactNode } from "react";
import { useContext, createContext } from "react";

import { staticData } from "../staticData";

type StaticData = typeof staticData;

const StaticDataContext = createContext<null | StaticData>(null);

export function useStaticData(): StaticData {
  const ctx = useContext(StaticDataContext);

  if (!ctx) {
    throw new Error("useStaticData was used outsideof StaticDataProvider");
  }

  return ctx;
}

type StaticDataProviderProps = {
  children: ReactNode;
};

export function StaticDataProvider({
  children,
}: StaticDataProviderProps): JSX.Element {
  return (
    <StaticDataContext.Provider value={staticData}>
      {children}
    </StaticDataContext.Provider>
  );
}
