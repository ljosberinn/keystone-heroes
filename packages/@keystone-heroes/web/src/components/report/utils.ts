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

const bloodlustTypes = new Set(["Heroism", "Bloodlust", "Drums of Ferocity"]);

export const hasBloodLust = (
  pull: FightSuccessResponse["pulls"][number]
): boolean => {
  return pull.events.some(
    (event) => event.ability?.name && bloodlustTypes.has(event.ability.name)
  );
};

export const detectInvisibilityUsage = (
  pull: FightSuccessResponse["pulls"][number]
): null | "invisibility" | "shroud" => {
  const eventWasBeforeThisPull = (
    event: FightSuccessResponse["pulls"][number]["events"][number]
  ) => event.timestamp < pull.startTime;

  const invisEvent = pull.events.find(
    (event) =>
      event.eventType === "ApplyBuff" &&
      (event.ability?.id === 307_195 || event.ability?.id === 321_422)
  );

  if (invisEvent && eventWasBeforeThisPull(invisEvent)) {
    return "invisibility";
  }

  const shroudEvent = pull.events.find(
    (event) => event.eventType === "Cast" && event.ability?.id === 114_018
  );

  if (shroudEvent && eventWasBeforeThisPull(shroudEvent)) {
    return "shroud";
  }

  return null;
};
