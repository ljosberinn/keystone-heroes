import { getCachedSdk } from "../client";
import type { EnemyNpcIdsQueryVariables, ReportFightNpc } from "../types";

type EnsuredNPC = Omit<ReportFightNpc, "gameID" | "id"> & {
  gameID: number;
  id: number;
};

export const getEnemyNPCIDs = async (
  params: EnemyNpcIdsQueryVariables,
  gameIdOrIds: number | number[]
): Promise<Record<number, number>> => {
  const client = await getCachedSdk();
  const response = await client.EnemyNPCIds(params);

  const ids = new Set(Array.isArray(gameIdOrIds) ? gameIdOrIds : [gameIdOrIds]);

  return Object.fromEntries(
    response?.reportData?.report?.fights?.[0]?.enemyNPCs
      ?.filter(
        (npc): npc is EnsuredNPC =>
          npc?.gameID !== undefined &&
          npc?.gameID !== null &&
          ids.has(npc.gameID) &&
          typeof npc.id === "number"
      )
      .map((npc) => [npc.gameID, npc.id]) ?? []
  );
};
