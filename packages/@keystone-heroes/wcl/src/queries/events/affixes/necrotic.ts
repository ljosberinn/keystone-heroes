import { Affixes } from "@keystone-heroes/db/types";

import type {
  AllTrackedEventTypes,
  ApplyDebuffStackEvent,
  DamageEvent,
} from "../types";
import { createIsSpecificEvent, reduceEventsByPlayer } from "../utils";

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
const expressions = {
  base: `target.type = "player" and ability.id = ${NECROTIC}`,
  stack: 'type = "applydebuffstack" and stack > 10',
  damage: 'type = "damage" and rawDamage > 0',
};

export const filterExpression = [
  `(${expressions.base}) AND ((${expressions.stack}) OR (${expressions.damage}))`,
];

const isNecroticDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NECROTIC,
});

const isNecroticStackEvent = createIsSpecificEvent<ApplyDebuffStackEvent>({
  type: "applydebuffstack",
  abilityGameID: NECROTIC,
});

const getHighestNecroticStack = (
  allEvents: ApplyDebuffStackEvent[]
): ApplyDebuffStackEvent[] => {
  const highestStack = allEvents.reduce(
    (acc, event) => (acc >= event.stack ? acc : event.stack),
    0
  );

  // dont care whether this specific stack size was reached multiple times
  // just need to track one
  const first = allEvents.find((event) => event.stack === highestStack);

  return first ? [first] : [];
};

export const getNecroticEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): (DamageEvent | ApplyDebuffStackEvent)[] => {
  if (!affixSet.has(Affixes.Necrotic)) {
    return [];
  }

  const stacks = getHighestNecroticStack(
    allEvents.filter(isNecroticStackEvent)
  );
  const damage = reduceEventsByPlayer(
    allEvents.filter(isNecroticDamageEvent),
    "targetID"
  );

  return [...stacks, ...damage];
};
