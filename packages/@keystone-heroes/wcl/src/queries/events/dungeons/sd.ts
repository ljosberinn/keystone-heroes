import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  BeginCastEvent,
  RemoveBuffEvent,
} from "../types";
import { createIsSpecificEvent } from "../utils";

export const SD_LANTERN_OPENING = 340_013;
export const SD_LANTERN_BUFF = 340_433;

/**
 * @see https://www.warcraftlogs.com/reports/mQn47kFCbpThBtrG#fight=15&type=summary&view=events&pins=2%24Off%24%23909049%24expression%24ability.id%20%3D%20340433%20and%20type%20in%20(%22applybuff%22,%20%22applybuffstack%22,%20%22removebuff%22)%5E2%24Off%24%23909049%24expression%24ability.id%20%3D%20340013%20and%20type%20%3D%22begincast%22
 * @example
 * ```gql
 * {
 *   reportData {
 *     report(code: "mQn47kFCbpThBtrG") {
 *       fights(fightIDs: [15]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 11536849, endTime: 13848195, filterExpression: "(type = \"begincast\" and ability.id = 340013) or (ability.id = 340433 and type in (\"applybuff\", \"applybuffstack\", \"removebuff\"))") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
const lanternOpeningExpression = `type = "begincast" and ability.id = ${SD_LANTERN_OPENING}`;
const lanternBuffExpression = `ability.id = ${SD_LANTERN_BUFF} and type in ("applybuff", "applybuffstack", "removebuff")`;

export const filterExpression = [
  lanternOpeningExpression,
  lanternBuffExpression,
];

const isSdLanternOpeningEvent = createIsSpecificEvent<BeginCastEvent>({
  type: "begincast",
  abilityGameID: SD_LANTERN_OPENING,
});

const isSdLanternBuffEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: SD_LANTERN_BUFF,
});

const isSdLanternRemoveBuffEvent = createIsSpecificEvent<RemoveBuffEvent>({
  type: "removebuff",
  abilityGameID: SD_LANTERN_BUFF,
});

const isSdLanternApplyBuffStackEvent =
  createIsSpecificEvent<ApplyBuffStackEvent>({
    type: "applybuffstack",
    abilityGameID: SD_LANTERN_BUFF,
  });

export const getSDEvents = (
  allEvents: AllTrackedEventTypes[]
): (
  | BeginCastEvent
  | ApplyBuffEvent
  | RemoveBuffEvent
  | ApplyBuffStackEvent
)[] => {
  return allEvents.reduce<
    (BeginCastEvent | ApplyBuffEvent | RemoveBuffEvent | ApplyBuffStackEvent)[]
  >((acc, event) => {
    if (
      isSdLanternBuffEvent(event) ||
      isSdLanternOpeningEvent(event) ||
      isSdLanternRemoveBuffEvent(event) ||
      isSdLanternApplyBuffStackEvent(event)
    ) {
      return [...acc, event];
    }

    return acc;
  }, []);
};
