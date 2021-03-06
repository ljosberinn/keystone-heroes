import type {
  ApplyDebuffEvent,
  AllTrackedEventTypes,
  BeginCastEvent,
} from "../types";
import { createChunkByThresholdReducer, createIsSpecificEvent } from "../utils";

export const ENVELOPMENT_OF_MISTS = 323_881 as const;
/**
 * both opening skip/shroom area and the respawn points are indicated by this id
 */
export const MOTS_OPENING = 340_004 as const;

/**
 * @see https://www.warcraftlogs.com/reports/aT8ZhP1HRfJANKCj#fight=18&type=summary&view=events&pins=2%24Off%24%23909049%24expression%24type%20%3D%20%22applydebuff%22%20and%20target.type%20%3D%20%22player%22%20and%20ability.id%20%3D%20323881%5E2%24Off%24%23909049%24expression%24ability.id%20%3D%20340004
 * @example
 * ```gql
 * {
 *   reportData {
 *     report(code: "aT8ZhP1HRfJANKCj") {
 *       fights(fightIDs: [18]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 34782210, endTime: 36664869, filterExpression: "(type = \"applydebuff\" and target.type = \"player\" and ability.id = 323881) or (ability.id = 340004)") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `type = "applydebuff" and target.type = "player" and ability.id = ${ENVELOPMENT_OF_MISTS}`,
  `ability.id = ${MOTS_OPENING}`,
];

const isMistsMazeDebuffEvent = createIsSpecificEvent<ApplyDebuffEvent>({
  type: "applydebuff",
  abilityGameID: ENVELOPMENT_OF_MISTS,
});

const isMazeOpeningBeginCastEvent = createIsSpecificEvent<BeginCastEvent>({
  type: "begincast",
  abilityGameID: MOTS_OPENING,
});

// failing the mists maze applies a debuff for 4 seconds
// hence its impossible to trigger it 2x within that timeframe
const debuffReducer = createChunkByThresholdReducer(4 * 1000);

export const getMOTSEvents = (
  allEvents: AllTrackedEventTypes[]
): (ApplyDebuffEvent | BeginCastEvent)[] => {
  return [
    ...allEvents
      .filter(isMistsMazeDebuffEvent)
      .reduce<ApplyDebuffEvent[][]>(debuffReducer, [])
      // pick only the first event of each chunk,
      // indicating when the maze was failed
      .flatMap((chunk) => chunk[0]),
    ...allEvents.filter(isMazeOpeningBeginCastEvent),
  ];
};
