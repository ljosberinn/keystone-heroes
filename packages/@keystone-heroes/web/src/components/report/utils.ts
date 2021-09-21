import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";

const bloodlustTypes = new Set([2825, 32_182, 309_658]);
const invisibilityTypes = new Set([307_195, 321_422]);

export const hasBloodLust = (
  pull: FightSuccessResponse["pulls"][number]
): boolean => {
  return pull.events.some(
    (event) =>
      event.type !== "AbilityReady" &&
      event.ability &&
      bloodlustTypes.has(event.ability.id)
  );
};

const eventWasBeforeThisPull = (
  event: FightSuccessResponse["pulls"][number]["events"][number],
  pullStart: number
) => event.timestamp < pullStart;

export const detectInvisibilityUsage = (
  pull: FightSuccessResponse["pulls"][number]
): null | "invisibility" | "shroud" => {
  const invisEvent = pull.events.find(
    (event) =>
      event.type === "ApplyBuff" &&
      event.ability &&
      invisibilityTypes.has(event.ability.id)
  );

  if (invisEvent && eventWasBeforeThisPull(invisEvent, pull.startTime)) {
    return "invisibility";
  }

  const shroudEvent = pull.events.find(
    (event) => event.type === "Cast" && event.ability?.id === 114_018
  );

  if (shroudEvent && eventWasBeforeThisPull(shroudEvent, pull.startTime)) {
    return "shroud";
  }

  return null;
};
