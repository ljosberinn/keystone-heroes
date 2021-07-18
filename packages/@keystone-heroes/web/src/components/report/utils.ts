import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import { tormentedLieutenants } from "@keystone-heroes/wcl/queries/events/affixes/tormented";

export const findTormentedLieutenantPull = (
  pull: FightSuccessResponse["pulls"][number]
): typeof tormentedLieutenants[number] | null => {
  const match = tormentedLieutenants.find((lieutenant) =>
    pull.npcs.some((npc) => npc.id === lieutenant.id)
  );

  return match ?? null;
};
