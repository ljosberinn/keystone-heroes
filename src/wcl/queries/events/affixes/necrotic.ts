import { Affixes } from "@prisma/client";

import type {
  AllTrackedEventTypes,
  ApplyDebuffEvent,
  ApplyDebuffStackEvent,
  DamageEvent,
} from "../types";
import { createIsSpecificEvent } from "../utils";

export const NECROTIC = 209_858;

/**
 * @see https://www.warcraftlogs.com/reports/DmVgxdj3WTYBApQt/#fight=1&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24ability.id%20%3D%20209858%20and%20type%20%3D%20%22applydebuffstack%22%20and%20stack%20%3E%2010%5E2%24Off%24%23909049%24expression%24type%20%3D%20%22damage%22%20and%20target.type%20%3D%20%22player%22%20and%20ability.id%20%3D%20209858%20and%20rawDamage%20%3E%200
 * @example
 * ```gql
 * {
 *   reportData {
 *     report(code: "DmVgxdj3WTYBApQt") {
 *       fights(fightIDs: [1]) {
 *         startTime
 *         endTime
 *       }
 *        events(startTime: 0, endTime: 1414930, filterExpression: "(target.type = \"player\" and ability.id = 209858) and ((type = \"applydebuffstack\" and stack > 10) or (type = \"damage\" and rawDamage > 0))") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */

export const filterExpression = [
  `type in ("applydebuff", "damage", "applydebuffstack") and ability.id = ${NECROTIC}`,
];

const isNecroticDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NECROTIC,
});

const isNecroticDebuffStackEvent = createIsSpecificEvent<ApplyDebuffStackEvent>(
  {
    type: "applydebuffstack",
    abilityGameID: NECROTIC,
  }
);

const isNecroticDebuffEvent = createIsSpecificEvent<ApplyDebuffEvent>({
  type: "applydebuff",
  abilityGameID: NECROTIC,
});

export const getNecroticEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): (DamageEvent | ApplyDebuffStackEvent | ApplyDebuffEvent)[] => {
  if (!affixSet.has(Affixes.Necrotic)) {
    return [];
  }

  return [
    ...allEvents.filter(isNecroticDebuffStackEvent),
    ...allEvents.filter(isNecroticDamageEvent),
    ...allEvents.filter(isNecroticDebuffEvent),
  ];
};
