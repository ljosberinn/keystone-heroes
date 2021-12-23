import type { ReactNode } from "react";
import { useContext, createContext } from "react";

type PullMetaContextDefinition = {
  fightStartTime: number;
  pullEndTime: number;
};

const PullMetaContext = createContext<PullMetaContextDefinition | null>(null);

export const usePullMeta = (): PullMetaContextDefinition => {
  const ctx = useContext(PullMetaContext);

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
    <PullMetaContext.Provider value={value}>
      {children}
    </PullMetaContext.Provider>
  );
}
