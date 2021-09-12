import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";

const bloodlustTypes = new Set([2825, 32_182, 309_658]);

export const hasBloodLust = (
  pull: FightSuccessResponse["pulls"][number]
): boolean => {
  return pull.events.some(
    (event) => event.ability && bloodlustTypes.has(event.ability.id)
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
      event.type === "ApplyBuff" &&
      (event.ability?.id === 307_195 || event.ability?.id === 321_422)
  );

  if (invisEvent && eventWasBeforeThisPull(invisEvent)) {
    return "invisibility";
  }

  const shroudEvent = pull.events.find(
    (event) => event.type === "Cast" && event.ability?.id === 114_018
  );

  if (shroudEvent && eventWasBeforeThisPull(shroudEvent)) {
    return "shroud";
  }

  return null;
};
