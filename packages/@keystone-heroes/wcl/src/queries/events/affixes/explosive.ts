import type { AnyEvent, DamageEvent, DeathEvent } from "..";
import { createIsSpecificEvent } from "../utils";

export const EXPLOSIVE = {
  unit: 120_651,
  ability: 240_446,
};

/**
 * @see https://www.warcraftlogs.com/reports/YrA4zyZgQJvHbn32#fight=1&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24target.id%20%3D120651%20AND%20type%20%3D%20%22damage%22%20AND%20overkill%20%3E%200%5E2%24Off%24%23909049%24expression%24target.type%20%3D%20%22player%22%20and%20rawDamage%20%3E%200%20and%20ability.id%20%3D%20240446
 * ```gql
 * {
 *   reportData {
 *     report(code: "YrA4zyZgQJvHbn32") {
 *       fights(fightIDs: [1]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 87034, endTime: 1527765, limit: 2000, filterExpression: "(target.type = \"player\" and rawDamage > 0 and ability.name = \"Explosion\") OR (target.name = \"Explosives\" AND type = \"damage\" AND overkill > 0)") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
const abilityExpression = `target.type = "player" and rawDamage > 0 and ability.id = ${EXPLOSIVE.ability}`;
const killExpression = `target.name = ${EXPLOSIVE.unit} AND type = "damage" AND overkill > 0`;

export const filterExpression = `(${abilityExpression}) OR (${killExpression})`;

export const isExplosiveDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: EXPLOSIVE.ability,
});

// TODO: separate from e.g. PF Slimes and Player Deaths
export const isExplosiveDeathEvent = (event: AnyEvent): event is DeathEvent => {
  return event.type === "death" && !("killerID" in event);
};

// export const getExplosiveKillEvents = createEventFetcher<DamageEvent>({
//   filterExpression: killExpression,
// });

// export const getExplosiveDamageTakenEvents = createEventFetcher<DamageEvent>({
//   dataType: EventDataType.DamageTaken,
//   hostilityType: HostilityType.Friendlies,
//   abilityID: EXPLOSIVE.ability,
// });

// type ExplosiveEvents = {
//   damageTakenByExplosivesEvents: ReturnType<typeof reduceEventsByPlayer>;
//   explosivesOverkillEvents: DamageEvent[];
// };

// export const getExplosiveEvents = async (
//   params: GetEventBaseParams
// ): Promise<ExplosiveEvents> => {
//   const allEvents = await getEvents<DamageEvent>({
//     ...params,
//     filterExpression,
//   });

//   const damageTakenByExplosivesEvents = reduceEventsByPlayer(
//     allEvents.filter((event) => event.sourceID === -1),
//     "targetID"
//   );
//   const explosivesOverkillEvents = allEvents.filter(
//     (event) => event.sourceID !== -1
//   );

//   return {
//     damageTakenByExplosivesEvents,
//     explosivesOverkillEvents,
//   };
// };
