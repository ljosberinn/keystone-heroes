import { Affixes } from "@keystone-heroes/db/types";

import type { AllTrackedEventTypes, DamageEvent } from "../types";
import { createIsSpecificEvent, reduceEventsByPlayer } from "../utils";

export const STORMING = 343_520;

/**
 * @see https://www.warcraftlogs.com/reports/1rnWqNzBwgA4McFL#fight=2&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%22damage%22%20and%20target.type%20%3D%20%22player%22%20and%20ability.id%20%3D%20343520
 * {
 *   reportData {
 *     report(code: "1rnWqNzBwgA4McFL") {
 *       fights(fightIDs: [2]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 34007, endTime: 1759795, filterExpression: "type =\"damage\" and target.type = \"player\" and ability.id = 343520") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `type = "damage" and target.type = "player" and ability.id = ${STORMING}`,
];

const isStormingEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: STORMING,
});

export const getStormingEvents = (
  allEvents: AllTrackedEventTypes,
  affixSet: Set<Affixes>
): DamageEvent[] => {
  if (!affixSet.has(Affixes.Storming)) {
    return [];
  }

  return reduceEventsByPlayer(allEvents.filter(isStormingEvent), "targetID");
};
