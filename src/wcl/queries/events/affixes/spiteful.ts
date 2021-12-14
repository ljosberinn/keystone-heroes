import { Affixes } from "@prisma/client";

import type { AllTrackedEventTypes, DamageEvent } from "../types";
import { createIsSpecificEvent } from "../utils";

export const SPITEFUL = {
  unit: 174_773,
  ability: 350_163,
} as const;

/**
 * @see https://www.warcraftlogs.com/reports/LafTw4CxyAjkVHv6#fight=8&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24source.name%20%3D%20%22Spiteful%20Shade%22%20and%20type%20%3D%20%22damage%22%20AND%20target.type%20%3D%20%22player%22
 * ```gql
 * {
 *   reportData {
 *     report(code: "LafTw4CxyAjkVHv6") {
 *       fights(fightIDs: [8]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 6376923, endTime: 8202012, limit: 2000, filterExpression: "source.id = 174773 and type = \"damage\" AND target.type = \"player\"") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `source.id = ${SPITEFUL.unit} and type = "damage" and target.type = "player"`,
];

const isSpitefulDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: SPITEFUL.ability,
});

export const getSpitefulEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): DamageEvent[] => {
  if (!affixSet.has(Affixes.Spiteful)) {
    return [];
  }

  return allEvents.filter(isSpitefulDamageEvent);
};
