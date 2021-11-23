import { useContext, createContext, useState } from "react";

import { useFight } from "../../../pages/report/[reportID]/[fightID]";

type PullDetailsSettingsDefinition = {
  useAbsoluteTimestamps: boolean;
  fightStartTime: number;
  groupDPS: number;
  toggleAbsoluteTimestamps: () => void;
};

const PullDetailsSettingsContext =
  createContext<PullDetailsSettingsDefinition | null>(null);

export const usePullDetailsSettings = (): PullDetailsSettingsDefinition => {
  const ctx = useContext(PullDetailsSettingsContext);

  if (!ctx) {
    throw new Error("used outside of provider");
  }

  return ctx;
};

type PullDetailsSettingsProviderProps = {
  children: JSX.Element | null;
};

export function PullDetailsSettingsProvider({
  children,
}: PullDetailsSettingsProviderProps): JSX.Element {
  const [useAbsoluteTimestamps, setUseAbsoluteTimestamps] = useState(false);
  const { fight } = useFight();

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    useAbsoluteTimestamps,
    fightStartTime: fight.meta.startTime,
    groupDPS: fight.meta.dps,
    toggleAbsoluteTimestamps: () => {
      setUseAbsoluteTimestamps((prev) => !prev);
    },
  };

  return (
    <PullDetailsSettingsContext.Provider value={value}>
      {children}
    </PullDetailsSettingsContext.Provider>
  );
}
