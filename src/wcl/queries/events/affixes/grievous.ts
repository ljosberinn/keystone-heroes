import { Affixes } from "@prisma/client";

import type { AllTrackedEventTypes, DamageEvent } from "../types";
import { createIsSpecificEvent } from "../utils";

export const GRIEVOUS_WOUND = 240_559;

/**
 * @see https://www.warcraftlogs.com/reports/Jq7KrbYV1hmTWMyw#fight=15&type=summary&pins=2%24Off%24%23909049%24expression%24type%20%3D%20%22damage%22%20and%20target.type%20%3D%20%22player%22%20and%20ability.id%20%3D240559%20and%20rawDamage%20%3E%200&view=events
 * @example
 * ```gql
 * {
 *   reportData {
 *     report(code: "Jq7KrbYV1hmTWMyw") {
 *       fights(fightIDs: [15]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 14217119, endTime: 16443155, filterExpression: "type = \"damage\" and target.type = \"player\" and ability.id = 240559 and rawDamage > 0") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `type = "damage" and target.type = "player" and ability.id = ${GRIEVOUS_WOUND} and rawDamage > 0`,
];

const isGrievousDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: GRIEVOUS_WOUND,
});

export const getGrievousEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): DamageEvent[] => {
  if (!affixSet.has(Affixes.Grievous)) {
    return [];
  }

  return allEvents.filter(isGrievousDamageEvent);
};
