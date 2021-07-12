import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import { tormentedLieutenantIDSet } from "@keystone-heroes/wcl/queries/events/affixes/tormented";

export const findTormentedLieutenantPull = (
  pull: FightSuccessResponse["pulls"][number]
): FightSuccessResponse["pulls"][number]["npcs"][number] | null => {
  const match = pull.npcs.find((npc) => tormentedLieutenantIDSet.has(npc.id));

  return match ?? null;
};
