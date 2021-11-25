import { useState, useEffect, useContext, createContext } from "react";

import type { DungeonIDs } from "../../../../db/data/dungeons";
import { dungeons } from "../../../staticData";

export type POIContextDefinition = {
  doors: Record<
    number,
    {
      type: "left" | "right" | "up" | "down";
      x: number;
      y: number;
      to: number;
    }[]
  >;
  poi: Record<
    number,
    {
      icon: string;
      x: number;
      y: number;
      label: string;
    }[]
  >;
};

const PointsOfInterestContext = createContext<POIContextDefinition | null>(
  null
);

export const usePointsOfInterest = (): POIContextDefinition => {
  const ctx = useContext(PointsOfInterestContext);

  if (!ctx) {
    throw new Error("used outside of ctx");
  }

  return ctx;
};

export type PointsOfInterestProviderProps = {
  children: JSX.Element[];
  dungeonID?: DungeonIDs;
};

export function PointsOfInterestProvider({
  children,
  dungeonID,
}: PointsOfInterestProviderProps): JSX.Element {
  const [data, setData] = useState({
    doors: {},
    poi: [],
  });

  useEffect(() => {
    if (!dungeonID) {
      return;
    }

    const dungeonName = dungeons[dungeonID]?.slug.toLowerCase();

    if (!dungeonName) {
      return;
    }

    import(/* webpackChunkName: "points-of-interest-" */ `./${dungeonName}`)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(setData)
      // eslint-disable-next-line promise/prefer-await-to-then, no-console
      .catch(console.error);
  }, [dungeonID]);

  return (
    <PointsOfInterestContext.Provider value={data}>
      {children}
    </PointsOfInterestContext.Provider>
  );
}
