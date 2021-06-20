import type { ApplyBuffEvent, BeginCastEvent } from "../../types";
import { createIsSpecificEvent } from "../../utils";

export const SD_LANTERN_OPENING = 340_013;
export const SD_LANTERN_BUFF = 340_433;

/**
 * see https://www.warcraftlogs.com/reports/mQn47kFCbpThBtrG#fight=15&type=summary&view=events&pins=2%24Off%24%23909049%24expression%24type%20%3D%20%22applybuff%22%20and%20ability.id%20%3D%20340433%5E2%24Off%24%23909049%24expression%24ability.id%20%3D%20340013%20and%20type%20%3D%22begincast%22
 */
const lanternOpeningExpression = `type ="begincast" and ability.id = ${SD_LANTERN_OPENING}`;
const lanternBuffExpression = `type="applybuff" and ability.id = ${SD_LANTERN_BUFF}`;

export const filterExpression = [
  lanternOpeningExpression,
  lanternBuffExpression,
];

export const isSdLanternOpeningEvent = createIsSpecificEvent<BeginCastEvent>({
  type: "begincast",
  abilityGameID: SD_LANTERN_OPENING,
});

export const isSdLanternBuffEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: SD_LANTERN_BUFF,
});
