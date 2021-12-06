import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  BeginCastEvent,
  CastEvent,
  RemoveBuffEvent,
} from "../types";
import { createIsSpecificEvent } from "../utils";

export const SD_LANTERN_OPENING = 340_013 as const;
export const SD_LANTERN_BUFF = 340_433 as const;
export const SD_ZRALI_SHIELD = 324_089 as const;
export const SD_ZRALI_SHIELD_BUFF = 324_092 as const;
export const SD_ZRALI_SHIELD_CAST = 324_086 as const;

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

export const filterExpression = [
  `type = "begincast" and ability.id = ${SD_LANTERN_OPENING}`,
  `ability.id = ${SD_LANTERN_BUFF} and type in ("applybuff", "applybuffstack", "removebuff")`,
  `type in ("applybuff", "removebuff") and ability.id = ${SD_ZRALI_SHIELD}`,
  `type in ("applybuff", "removebuff") and ability.id = ${SD_ZRALI_SHIELD_BUFF}`,
  `type = "cast" and ability.id = ${SD_ZRALI_SHIELD_CAST}`,
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

const isSdZraliApplyBuffEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: SD_ZRALI_SHIELD,
});

const isSdZraliBubbleRemoveBuffEvent = createIsSpecificEvent<RemoveBuffEvent>({
  type: "removebuff",
  abilityGameID: SD_ZRALI_SHIELD_BUFF,
});

const isSdZraliBubbleActiveApplyBuff = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: SD_ZRALI_SHIELD_BUFF,
});

const isSdZraliShieldCastEvent = createIsSpecificEvent<CastEvent>({
  type: "cast",
  abilityGameID: SD_ZRALI_SHIELD_CAST,
});

export const getSDEvents = (
  allEvents: AllTrackedEventTypes[]
): (
  | BeginCastEvent
  | ApplyBuffEvent
  | RemoveBuffEvent
  | ApplyBuffStackEvent
  | CastEvent
)[] => {
  return [
    ...allEvents.filter(isSdLanternRemoveBuffEvent),
    ...allEvents.filter(isSdLanternOpeningEvent),
    ...allEvents.filter(isSdLanternBuffEvent),
    ...allEvents.filter(isSdLanternApplyBuffStackEvent),
    ...allEvents.filter(isSdZraliApplyBuffEvent),
    ...allEvents.filter(isSdZraliBubbleActiveApplyBuff),
    ...allEvents.filter(isSdZraliShieldCastEvent),
    ...allEvents.filter(isSdZraliBubbleRemoveBuffEvent),
  ];
};
