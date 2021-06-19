import type { DamageEvent, InterruptEvent } from "../types";
import { createIsSpecificEvent } from "../utils";

export const QUAKING = 240_448;

/**
 * @see https://www.warcraftlogs.com/reports/nqrLhBXH6AfC4NdM#fight=27&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22interrupt%22%20and%20target.type%20%3D%20%22player%22%20and%20ability.name%20%3D%20%22Quake%22%5E2%24Off%24%23909049%24expression%24type%20%3D%20%22damage%22%20and%20target.type%20%3D%20%22player%22%20and%20ability.name%20%3D%20%22Quake%22
 * ```gql
 * {
 *   reportData {
 *     report(code: "nqrLhBXH6AfC4NdM") {
 *       fights(fightIDs: [27]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 11446505, endTime: 13247987, filterExpression: "target.type = \"player\" and ability.id = 240448 AND type IN (\"interrupt\", \"damage\")") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
const expressions = {
  base: `target.type = "player" and ability.id = ${QUAKING}`,
  interrupt: '"interrupt"',
  damage: '"damage"',
};

export const filterExpression = `${expressions.base} AND type IN (${expressions.interrupt}, ${expressions.damage})`;

export const isQuakingInterruptEvent = createIsSpecificEvent<InterruptEvent>({
  type: "interrupt",
  abilityGameID: QUAKING,
});

export const isQuakingDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: QUAKING,
});

// type QuakingEvents = {
//   damageTakenByQuakingEvents: ReturnType<typeof reduceEventsByPlayer>;
//   interruptsByQuakingEvents: InterruptEvent[];
// };

// export const getQuakingEvents = async (
//   params: GetEventBaseParams
// ): Promise<QuakingEvents> => {
//   const allEvents = await getEvents<InterruptEvent | DamageEvent>({
//     ...params,
//     filterExpression,
//   });

//   const damageTakenByQuakingEvents = reduceEventsByPlayer(
//     allEvents.filter((event): event is DamageEvent => event.type === "damage"),
//     "targetID"
//   );
//   const interruptsByQuakingEvents = allEvents.filter(
//     (event): event is InterruptEvent => event.type === "interrupt"
//   );

//   return {
//     interruptsByQuakingEvents,
//     damageTakenByQuakingEvents,
//   };
// };
