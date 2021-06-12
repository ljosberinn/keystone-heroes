import { TORMENTED } from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import type { DamageEvent, HealEvent } from "../types";
import type { GetEventBaseParams } from "../utils";
import { getEvents, reduceEventsByPlayer, createEventFetcher } from "../utils";

export const getStygianKingsBarbsDamageEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const events = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: TORMENTED.damageDone.STYGIAN_KINGS_BARBS,
  });

  return reduceEventsByPlayer(events, "sourceID");
};

export const getFifthSkullDamageEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const events = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: TORMENTED.damageDone.THE_FIFTH_SKULL,
  });

  return reduceEventsByPlayer(events, "sourceID");
};

export const getBottleOfSanguineIchorDamageEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const events = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: TORMENTED.damageDone.BOTTLE_OF_SANGUINE_ICHOR,
  });

  return reduceEventsByPlayer(events, "sourceID");
};

export const getBottleOfSanguineIchorHealEvents = createEventFetcher<HealEvent>(
  {
    dataType: EventDataType.Healing,
    hostilityType: HostilityType.Friendlies,
    abilityID: TORMENTED.healingDone.BOTTLE_OF_SANGUINE_ICHOR,
  }
);

export const getStoneWardHealEvents = createEventFetcher<HealEvent>({
  dataType: EventDataType.Healing,
  hostilityType: HostilityType.Friendlies,
  abilityID: TORMENTED.healingDone.STONE_WARD,
});

export const getMassiveSmashDamageTakenEvents = createEventFetcher<DamageEvent>(
  {
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: TORMENTED.damageTaken.MASSIVE_SMASH,
  }
);

export const getRazeDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: TORMENTED.damageTaken.RAZE,
});

export const getDecapitateDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: TORMENTED.damageTaken.DECAPITATE,
});

export const getSoulforgeFlamesDamageTakenEvents = createEventFetcher<DamageEvent>(
  {
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: TORMENTED.damageTaken.SOULFORGE_FLAMES,
  }
);

export const getBitingColdDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: TORMENTED.damageTaken.BITING_COLD,
});

export const getFrostLanceDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: TORMENTED.damageTaken.FROST_LANCE,
});

export const getVolcanicPlumeDamageDoneEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const events = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: TORMENTED.damageDone.VOLCANIC_PLUME,
  });

  return reduceEventsByPlayer(events, "sourceID");
};
