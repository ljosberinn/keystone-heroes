import { remarkableSpellIDs } from "@keystone-heroes/db/data";

import { EventDataType, HostilityType } from "../../types";
import type { GetEventBaseParams } from "./utils";
import { getEvents } from "./utils";

import type {
  CastEvent,
  BeginCastEvent,
  ApplyBuffEvent,
  RemoveBuffEvent,
} from ".";

// TODO: drums

export const getRemarkableSpellCastEvents = async (
  params: GetEventBaseParams,
  playerActorIDs: Set<number>
): Promise<CastEvent[]> => {
  const allEvents = await getEvents<CastEvent | BeginCastEvent>({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
  });

  return allEvents.filter((event): event is CastEvent => {
    return (
      event.type === "cast" &&
      playerActorIDs.has(event.sourceID) &&
      remarkableSpellIDs.has(event.abilityGameID)
    );
  });
};

// type CardboardAssassinUsages = { events: CastEvent[]; actorId: number | null };
// export const CARDBOARD_ASSASSIN = 51_229;

// const getCardboardAssassinUsage = async (
//   params: GetEventBaseParams
// ): Promise<CardboardAssassinUsages[]> => {
//   const sdk = await getCachedSdk();

//   const data = await sdk.PetActors({
//     reportID: params.reportID,
//   });

//   const cardboardAssassinInstances =
//     data?.reportData?.report?.masterData?.actors?.filter(
//       (pet) => pet?.gameID === CARDBOARD_ASSASSIN
//     ) ?? [];

//   if (cardboardAssassinInstances.length === 0) {
//     return [];
//   }

//   const eventGroup = await Promise.all(
//     cardboardAssassinInstances.map(async (instance) => {
//       if (!instance?.id) {
//         return null;
//       }

//       const events = await getEvents<CastEvent>({
//         ...params,
//         sourceID: instance.id,
//         dataType: EventDataType.Threat,
//         hostilityType: HostilityType.Friendlies,
//       });

//       if (events.length === 0) {
//         return null;
//       }

//       return {
//         actorId: instance.petOwner,
//         events,
//       };
//     })
//   );

//   return eventGroup.filter(
//     (dataset): dataset is CardboardAssassinUsages => dataset !== null
//   );
// };

export const INVISIBILITY = {
  DIMENSIONAL_SHIFTER: 321_422,
  POTION_OF_THE_HIDDEN_SPIRIT: 307_195,
} as const;

export const getInvisibilityUsage = async (
  params: GetEventBaseParams
): Promise<ApplyBuffEvent[]> => {
  const dimensionalShifterUsage = await getEvents<
    ApplyBuffEvent | RemoveBuffEvent
  >({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: INVISIBILITY.DIMENSIONAL_SHIFTER,
  });

  const potionUsage = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: INVISIBILITY.POTION_OF_THE_HIDDEN_SPIRIT,
  });

  return [...dimensionalShifterUsage, ...potionUsage].filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );
};

export const ENGINEERING_BATTLE_REZ = {
  // Disposable Spectrophasic Reanimator
  SHADOWLANDS: 345_130,
};

export const getEngineeringBattleRezCastEvents = async (
  params: GetEventBaseParams
): Promise<CastEvent[]> => {
  const allEvents = await getEvents<BeginCastEvent | CastEvent>({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: ENGINEERING_BATTLE_REZ.SHADOWLANDS,
  });

  return allEvents.filter((event): event is CastEvent => event.type === "cast");
};
