import type { DamageEvent } from "..";
import { createIsSpecificEvent } from "../utils";

export const SPITEFUL = 174_773;

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
export const filterExpression = `source.id = ${SPITEFUL} and type = "damage" AND target.type = "player"`;

export const isSpitefulDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: SPITEFUL,
});
