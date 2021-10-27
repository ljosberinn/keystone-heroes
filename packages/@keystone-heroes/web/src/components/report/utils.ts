import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";

const bloodlustTypes = new Set([
  2825, 32_182, 309_658,
  // Timewarp
  80_353,
  // Bloodlust
  2825,
]);
const invisibilityTypes = new Set([307_195, 321_422]);

export const findBloodlust = <
  T extends { events: FightSuccessResponse["pulls"][number]["events"] }
>(
  pull: T
): number | null => {
  const match = pull.events.find(
    (event) =>
      event.type !== "AbilityReady" &&
      event.ability &&
      bloodlustTypes.has(event.ability.id)
  );

  return match?.ability?.id ?? null;
};

export const detectInvisibilityUsage = (
  pull: FightSuccessResponse["pulls"][number]
): null | "invisibility" | "shroud" => {
  const invisEvent = pull.events.find(
    (event) =>
      event.type === "ApplyBuff" &&
      event.ability &&
      invisibilityTypes.has(event.ability.id) &&
      event.category === "AFTER"
  );

  if (invisEvent) {
    return "invisibility";
  }

  const shroudEvent = pull.events.find(
    (event) =>
      event.type === "Cast" &&
      event.ability?.id === 114_018 &&
      event.category === "AFTER"
  );

  return shroudEvent ? "shroud" : null;
};

export const calcChallengersBurden = (keyLevel: number): number => {
  return Math.round((1.08 ** (keyLevel - 2) - 1) * 100);
};
