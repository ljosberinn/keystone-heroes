import type { ReactNode } from "react";
import { useContext, createContext } from "react";

type PullMetaDefinition = {
  fightStartTime: number;
  pullEndTime: number;
};

const PullDetailsSettingsContext = createContext<PullMetaDefinition | null>(
  null
);

export const usePullMeta = (): PullMetaDefinition => {
  const ctx = useContext(PullDetailsSettingsContext);

  if (!ctx) {
    throw new Error("used outside of provider");
  }

  return ctx;
};

type PullRowMetaProviderProps = {
  children: ReactNode[] | null;
  fightStartTime: number;
  pullEndTime: number;
};

export function PullMetaProvider({
  children,
  fightStartTime,
  pullEndTime,
}: PullRowMetaProviderProps): JSX.Element {
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    fightStartTime,
    pullEndTime,
  };

  return (
    <PullDetailsSettingsContext.Provider value={value}>
      {children}
    </PullDetailsSettingsContext.Provider>
  );
}
