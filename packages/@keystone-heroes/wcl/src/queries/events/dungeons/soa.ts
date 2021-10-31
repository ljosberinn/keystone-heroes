import type { AllTrackedEventTypes, ApplyDebuffEvent } from "../types";
import { createIsSpecificEvent } from "../utils";

export const SOA_SPEAR = 339_917 as const;

/**
 * @see https://www.warcraftlogs.com/reports/JVnw7NF6hyz8QqX4#fight=20&type=summary&view=events&pins=2%24Off%24%23a04D8A%24expression%24type%20%3D%20%22applydebuff%22%20and%20target.type%20%3D%20%22NPC%22%20and%20ability.id%20%3D%20339917&hostility=1
 * @example
 * ```gql
 * {
 *   reportData {
 *     report(code: "JVnw7NF6hyz8QqX4") {
 *       fights(fightIDs: [20]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 11052027, endTime: 13152414, filterExpression: "type = \"applydebuff\" and ability.id = 339917") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `type = "applydebuff" and ability.id = ${SOA_SPEAR}`,
];

const isSoaSpearEvent = createIsSpecificEvent<ApplyDebuffEvent>({
  type: "applydebuff",
  abilityGameID: SOA_SPEAR,
});

export const getSOAEvents = (
  allEvents: AllTrackedEventTypes[]
): ApplyDebuffEvent[] => {
  return allEvents.filter(isSoaSpearEvent);
};
