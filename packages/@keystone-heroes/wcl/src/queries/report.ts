import { getCachedSdk } from "../client";
import type {
  EnemyNpcIdsQueryVariables,
  GameZone,
  Region,
  Report,
  ReportFight,
  ReportFightNpc,
} from "../types";

type EnsuredNPC = Omit<ReportFightNpc, "gameID" | "id"> & {
  gameID: number;
  id: number;
};

export const loadEnemyNPCIDs = async (
  params: EnemyNpcIdsQueryVariables,
  gameIdOrIds: number | number[]
): Promise<Record<number, number>> => {
  const client = await getCachedSdk();
  const response = await client.EnemyNPCIds(params);

  const ids = new Set(Array.isArray(gameIdOrIds) ? gameIdOrIds : [gameIdOrIds]);

  return (
    response?.reportData?.report?.fights?.[0]?.enemyNPCs
      ?.filter(
        (npc): npc is EnsuredNPC =>
          npc?.gameID !== undefined &&
          npc?.gameID !== null &&
          ids.has(npc.gameID) &&
          typeof npc.id === "number"
      )
      .reduce<Record<number, number>>(
        (acc, npc) => ({
          ...acc,
          [npc.gameID]: npc.id,
        }),
        {}
      ) ?? {}
  );
};

export type InitialReportData = Pick<
  Report,
  "startTime" | "endTime" | "title"
> & {
  region: Pick<Region, "slug">;
  fights: ReportFight["id"][];
};

export type ExtendedReportData = {
  averageItemLevel: number;
  keystoneTime: number;
  keystoneBonus: number;
  keystoneLevel: number;
  startTime: number;
  endTime: number;
  keystoneAffixes: number[];
  id: number;
  gameZone: Pick<GameZone, "id"> | null;
};

export type ExtendedReportDataWithGameZone = Omit<
  ExtendedReportData,
  "gameZone"
> & {
  gameZone: Pick<GameZone, "id">;
};
