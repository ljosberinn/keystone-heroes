import { Affixes } from "@keystone-heroes/db/types";

import type { AllTrackedEventTypes, DamageEvent } from "../types";
import { createIsSpecificEvent, reduceEventsByPlayer } from "../utils";

export const BURSTING = 243_237;

/**
 * @see https://www.warcraftlogs.com/reports/hFj3wLzrapC4KvZk#fight=4&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22damage%22%20and%20target.type%20%3D%20%22player%22%20and%20ability.id%20%3D%20243237%20and%20rawDamage%20%3E%200
 * ```gql
 * {
 *   reportData {
 *     report(code: "1rnWqNzBwgA4McFL") {
 *       fights(fightIDs: [2]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 5987472, endTime: 7736379, limit: 2000, filterExpression: "type = \"damage\" and target.type = \"player\" and ability.id = 240237 and rawDamage > 0") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `type = "damage" and target.type = "player" and ability.id = ${BURSTING} and rawDamage > 0`,
];

const isBurstingEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: BURSTING,
});

export const getBurstingEvents = (
  allEvents: AllTrackedEventTypes,
  affixSet: Set<Affixes>
): DamageEvent[] => {
  if (!affixSet.has(Affixes.Bursting)) {
    return [];
  }

  return reduceEventsByPlayer(allEvents.filter(isBurstingEvent), "targetID");
};
