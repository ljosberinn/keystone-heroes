import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  BeginCastEvent,
} from "../types";
import { createIsSpecificEvent } from "../utils";

export const TOP_BANNER_AURA = 340_378 as const;
export const TOP_OPENING = 340_014 as const;

/**
 * @see https://www.warcraftlogs.com/reports/MKdfLJm8byVhXA32#fight=17&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22applybuff%22%20and%20ability.id%20%3D%20340378
 * @example
 * ```gql
 * {
 *   reportData {
 *     report(code: "MKdfLJm8byVhXA32") {
 *       fights(fightIDs: [17]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 4646430, endTime: 6817998, filterExpression: "type = \"applybuff\" and ability.id = 340378") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `type = "applybuff" and ability.id = ${TOP_BANNER_AURA}`,
  `ability.id = ${TOP_OPENING}`,
];

const isTopBannerAuraEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: TOP_BANNER_AURA,
});

const isTopBannerOpeningBeginCastEvent = createIsSpecificEvent<BeginCastEvent>({
  type: "begincast",
  abilityGameID: TOP_OPENING,
});

export const getTOPEvents = (
  allEvents: AllTrackedEventTypes[]
): (ApplyBuffEvent | BeginCastEvent)[] => {
  return [
    ...allEvents.filter(isTopBannerAuraEvent),
    ...allEvents.filter(isTopBannerOpeningBeginCastEvent),
  ];
};
