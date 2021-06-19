// export const getRemarkableSpellCastEvents = async (
//   params: GetEventBaseParams,
//   playerActorIDs: string[]
// ): Promise<CastEvent[]> => {
//   const abilityIDFilterExpression = `ability.id IN (${remarkableSpellIDs})`;
//   // const sourceNamesFilterExpression = `source.name IN (${playerActorIDs.join(
//   //   ", "
//   // )})`;

import type { ApplyBuffEvent, CastEvent } from "./types";
import { createIsSpecificEvent } from "./utils";

//   // const filterExpression = [
//   //   abilityIDFilterExpression,
//   //   sourceNamesFilterExpression,
//   // ].join(" AND ");

//   const allEvents = await getEvents<CastEvent | BeginCastEvent>({
//     ...params,
//     dataType: EventDataType.Casts,
//     hostilityType: HostilityType.Friendlies,
//     filterExpression: abilityIDFilterExpression,
//   });

//   return allEvents.filter((event): event is CastEvent => {
//     return event.type === "cast";
//   });
// };

export const INVISIBILITY = {
  DIMENSIONAL_SHIFTER: 321_422,
  POTION_OF_THE_HIDDEN_SPIRIT: 307_195,
} as const;

export const ENGINEERING_BATTLE_REZ = {
  // Disposable Spectrophasic Reanimator
  SHADOWLANDS: 345_130,
} as const;

export const LEATHERWORKING_DRUMS = {
  // Drums of Deathly Ferocity
  SHADOWLANDS: 309_658,
} as const;

export const isLeatherworkingDrumsEvent = createIsSpecificEvent<ApplyBuffEvent>(
  {
    abilityGameID: LEATHERWORKING_DRUMS.SHADOWLANDS,
    type: "applybuff",
  }
);

export const isInvisibilityEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: [
    INVISIBILITY.DIMENSIONAL_SHIFTER,
    INVISIBILITY.POTION_OF_THE_HIDDEN_SPIRIT,
  ],
});

export const isEngineeringBattleRezEvent = createIsSpecificEvent<CastEvent>({
  type: "cast",
  abilityGameID: ENGINEERING_BATTLE_REZ.SHADOWLANDS,
});

export const invisibilityFilterExpression = `type = "applybuff" and actor.type = "player" and ability.id in (${INVISIBILITY.DIMENSIONAL_SHIFTER}, ${INVISIBILITY.POTION_OF_THE_HIDDEN_SPIRIT})`;
export const engineeringBattleRezExpression = `type = "cast" and ability.id = ${ENGINEERING_BATTLE_REZ.SHADOWLANDS}`;

/**
 * @see https://www.warcraftlogs.com/reports/Rt7FqrJkhdmvV4j3#fight=3&type=casts&view=events&pins=2%24Off%24%23244F4B%24expression%24ability.id%20%3D%20309658
 */
export const leatherworkingDrumsExpression = `type = "cast" and ability.id = ${LEATHERWORKING_DRUMS.SHADOWLANDS}`;

// export const getInvisibilityUsage = async (
//   params: GetEventBaseParams
// ): Promise<ApplyBuffEvent[]> => {
//   const allEvents = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
//     ...params,
//     dataType: EventDataType.Buffs,
//     hostilityType: HostilityType.Friendlies,
//     filterExpression: `ability.id IN (${INVISIBILITY.DIMENSIONAL_SHIFTER}, ${INVISIBILITY.POTION_OF_THE_HIDDEN_SPIRIT})`,
//   });

//   return allEvents.filter(
//     (event): event is ApplyBuffEvent => event.type === "applybuff"
//   );
// };

// export const getEngineeringBattleRezCastEvents = async (
//   params: GetEventBaseParams
// ): Promise<CastEvent[]> => {
//   const allEvents = await getEvents<BeginCastEvent | CastEvent>({
//     ...params,
//     dataType: EventDataType.Casts,
//     hostilityType: HostilityType.Friendlies,
//     abilityID: ENGINEERING_BATTLE_REZ.SHADOWLANDS,
//   });

//   return allEvents.filter((event): event is CastEvent => event.type === "cast");
// };
