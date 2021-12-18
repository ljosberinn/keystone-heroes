import type { CastEvent, AllTrackedEventTypes } from "./types";
import { createIsSpecificEvent } from "./utils";

export const SHARED_COVENANT_ABILITIES = {
  FLESHCRAFT: 324_631,
  SOULSHAPE: 310_143,
  SUMMON_STEWARD: 324_739,
  DOOR_OF_SHADOWS: 300_728,
} as const;

export const generalCovenantExpression = `type in ("cast", "applydebuff") and ability.id in (${Object.values(
  SHARED_COVENANT_ABILITIES
).join(", ")})`;

const isSharedCovenantAbility = createIsSpecificEvent<CastEvent>({
  abilityGameID: Object.values(SHARED_COVENANT_ABILITIES),
  type: "cast",
});

export const filterCovenantCastEvents = (
  allEvents: AllTrackedEventTypes[]
): CastEvent[] => {
  return allEvents.filter(isSharedCovenantAbility);
};
