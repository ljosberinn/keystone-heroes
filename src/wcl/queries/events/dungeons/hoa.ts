import type { AllTrackedEventTypes, CastEvent } from "../types";
import { createIsSpecificEvent } from "../utils";

export const HOA_GARGOYLE = 342_171 as const;

/**
 * @see https://www.warcraftlogs.com/reports/hFj3wLzrapC4KvZk#fight=4&type=summary&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22cast%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D%20342171&view=events
 * @example
 * ```gql
 * {
 *   reportData {
 *     report(code: "hFj3wLzrapC4KvZk") {
 *       fights(fightIDs: [4]) {
 *         startTime
 *         endTime
 *       }
 *        events(startTime: 5987472, endTime: 7736379, filterExpression: "type = \"cast\" and source.type = \"player\" and ability.id = 342171") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `type = "cast" and source.type = "player" and ability.id = ${HOA_GARGOYLE}`,
];

const isHoaGargoyleEvent = createIsSpecificEvent<CastEvent>({
  type: "cast",
  abilityGameID: HOA_GARGOYLE,
});

export const getHOAEvents = (
  allEvents: AllTrackedEventTypes[]
): CastEvent[] => {
  return allEvents.filter(isHoaGargoyleEvent);
};
