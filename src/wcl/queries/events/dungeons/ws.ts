import type { AllTrackedEventTypes, DamageEvent } from "../types";
import { createIsSpecificEvent } from "../utils";

export const WS = {
  ROCKET_BARRAGE: 294_128,
  ANTI_PERSONNEL_SQUIRREL: 293_861,
} as const;

export const filterExpression = [
  `type = "damage" and ability.id in (${Object.values(WS).join(", ")})`,
];

const isWorkshopDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: Object.values(WS),
});

export const getWSEvents = (
  allEvents: AllTrackedEventTypes[]
): DamageEvent[] => {
  return allEvents.filter(isWorkshopDamageEvent);
};
