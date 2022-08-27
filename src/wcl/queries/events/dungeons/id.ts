import type { AllTrackedEventTypes, DamageEvent } from "../types";
import { createIsSpecificEvent } from "../utils";

export const IRON_DOCKS_CRUSHED = 167_862 as const;

export const filterExpression = [
  `type = "damage" and ability.id = ${IRON_DOCKS_CRUSHED}`,
];

const isIronStarCrushedEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: IRON_DOCKS_CRUSHED,
});

export const getIDEvents = (
  allEvents: AllTrackedEventTypes[]
): DamageEvent[] => {
  return allEvents.filter(isIronStarCrushedEvent);
};
