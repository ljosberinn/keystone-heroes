import type { ApplyDebuffStackEvent, DamageEvent } from "..";
import { createIsSpecificEvent } from "../utils";

export const NECROTIC = 209_858;

// const getHighestNecroticStackAmount = (
//   allEvents: ApplyDebuffStackEvent[]
// ): ApplyDebuffStackEvent | null => {
//   const relevantEvents = allEvents.filter(
//     (event): event is ApplyDebuffStackEvent => event.type === "applydebuffstack"
//   );

//   const highestStack = relevantEvents.reduce(
//     (acc, event) => (acc >= event.stack ? acc : event.stack),
//     0
//   );

//   // dont care whether this specific stack size was reached multiple times
//   // just need to track one
//   return relevantEvents.find((event) => event.stack === highestStack) ?? null;
// };

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
 *       events(startTime: 0, endTime: 1414930, filterExpression: "(target.type = \"player\" and ability.id = 209858 AND ((type = \"applydebuffstack\" and stack > 10) OR (type = \"damage\" and rawDamage > 0))") {
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

export const filterExpression = `(${expressions.base}) AND ((${expressions.stack}) OR (${expressions.damage}))`;

export const isNecroticDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NECROTIC,
});

export const isNecroticStackEvent =
  createIsSpecificEvent<ApplyDebuffStackEvent>({
    type: "applydebuffstack",
    abilityGameID: NECROTIC,
  });

// type NecroticEvents = {
//   damageTakenByNecroticEvents: ReturnType<typeof reduceEventsByPlayer>;
//   highestNecroticStackEvent: ApplyDebuffStackEvent | null;
// };

// export const getNecroticEvents = async (
//   params: GetEventBaseParams
// ): Promise<NecroticEvents> => {
//   const allEvents = await getEvents<DamageEvent | ApplyDebuffStackEvent>({
//     ...params,
//     filterExpression,
//   });

//   const damageTakenByNecroticEvents = reduceEventsByPlayer(
//     allEvents.filter((event): event is DamageEvent => event.type === "damage"),
//     "targetID"
//   );

//   const highestNecroticStackEvent = getHighestNecroticStackAmount(
//     allEvents.filter(
//       (event): event is ApplyDebuffStackEvent =>
//         event.type === "applydebuffstack"
//     )
//   );

//   return {
//     damageTakenByNecroticEvents,
//     highestNecroticStackEvent,
//   };
// };
