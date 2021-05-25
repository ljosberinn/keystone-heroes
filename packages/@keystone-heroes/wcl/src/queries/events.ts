import {
  DIMENSIONAL_SHIFTER,
  HOA_GARGOYLE,
  POTION_OF_THE_HIDDEN_SPIRIT,
  SD_LANTERN_OPENING,
  SANGUINE_ICHOR_DAMAGE,
  SANGUINE_ICHOR_HEALING,
  CARDBOARD_ASSASSIN,
  DOS_URN,
  SOA_SPEAR,
  GRIEVOUS_WOUND,
  NECROTIC,
  STORMING,
  VOLCANIC,
  BOLSTERING,
  PF_GREEN_BUFF,
  PF_PURPLE_BUFF,
  PF_RED_BUFF,
  BURSTING,
  QUAKING,
  PRIDE,
  remarkableSpellIds,
  NW_KYRIAN_ORB_HEAL,
  NW_KYRIAN_ORB_DAMAGE,
  NW_HAMMER,
  NW_SPEAR,
  NW_ORB,
  TOP_BANNER_AURA,
  EXPLOSIVE,
  SPITEFUL,
  SD_LANTERN_BUFF,
} from "@keystone-heroes/db/data";

import { getCachedSdk } from "../client";
import { EventDataType, HostilityType } from "../types";
import { loadEnemyNPCIDs } from "./report";

import type { Sdk } from "../types";

type Event<T extends Record<string, unknown>> = T & {
  timestamp: number;
};

// type EncounterStartEvent = Event<{
//   type: "encounterstart";
//   encounterID: number;
//   name: string;
//   difficulty: number;
//   size: number;
//   level: number;
//   affixes: number[];
// }>;

// type CombatantInfoEvent = Event<{
//   type: "combatantinfo";
//   sourceID: number;
//   gear: [];
//   auras: {
//     source: number;
//     ability: number;
//     stacks: number;
//     icon: string;
//     name?: string;
//   }[];
//   expansion: string;
//   faction: number;
//   specID: number;
//   covenantID: number;
//   soulbindID: number;
//   strength: number;
//   agility: number;
//   stamina: number;
//   intellect: number;
//   dodge: number;
//   parry: number;
//   block: number;
//   armor: number;
//   critMelee: number;
//   critRanged: number;
//   critSpell: number;
//   speed: number;
//   leech: number;
//   hasteMelee: number;
//   hasteRanged: number;
//   hasteSpell: number;
//   avoidance: number;
//   mastery: number;
//   versatilityDamageDone: number;
//   versatilityHealingDone: number;
//   versatilityDamageReduction: number;
//   talents: { id: number; icon: string }[];
//   pvpTalents: { id: number; icon: string }[];
//   artifact: { traitID: number; rank: number; spellID: number; icon: string }[];
//   heartOfAzeroth: {
//     traitID: number;
//     rank: number;
//     spellID: number;
//     icon: string;
//   }[];
// }>;

export type ApplyDebuffEvent = Event<{
  type: "applydebuff";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  targetInstance?: number;
  targetMarker?: number;
}>;

type ApplyDebuffStackEvent = Event<{
  type: "applydebuffstack";
  stack: number;
}>;

export type ApplyBuffEvent = Event<{
  type: "applybuff";
  sourceID: number;
  sourceInstance?: number;
  targetID: number;
  targetInstance?: number;
  abilityGameID: number;
}>;

export type RemoveBuffEvent = Event<{
  type: "removebuff";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  sourceMarker: number;
  targetMarker: number;
}>;

export type CastEvent = Event<{
  type: "cast";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  sourceMarker?: number;
}>;

export type DamageEvent = Event<{
  type: "damage";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  hitType: number;
  amount: number;
  mitigated?: number;
  unmitigatedAmount?: number;
  tick?: boolean;
  sourceMarker?: number;
  absorbed?: number;
  overkill?: number;
}>;

export type DamageTakenEvent = DamageEvent & {
  buffs?: string;
};

export type BeginCastEvent = Event<{
  type: "begincast";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
}>;

type RemoveDebuffEvent = Event<{
  type: "removedebuff";
  sourceID: number;
  targetID: number;
  targetInstance: number;
  abilityGameID: number;
}>;

// type SummonEvent = Event<{
//   type: "summon";
//   sourceID: number;
//   targetID: number;
//   targetInstance: number;
//   abilityGameID: number;
// }>;

// type PhaseStartEvent = Event<{
//   type: "phasestart";
//   encounterID: number;
//   name: string;
//   difficulty: number;
//   size: number;
// }>;

export type HealEvent = Event<{
  type: "heal";
  sourceID: number;
  targetID: number;
  targetInstance?: number;
  abilityGameID: number;
  hitType: number;
  amount: number;
  sourceMarker?: number;
  targetMarker?: number;
  tick?: boolean;
  overheal?: number;
  absorbed?: number;
}>;

// type EnergizeEvent = Event<{
//   type: "energize";
//   sourceID: number;
//   targetID: number;
//   abilityGameID: number;
//   resourceChange: number;
//   resourceChangeType: number;
//   otherResourceChange: number;
//   waste: number;
//   sourceMarker?: number;
//   targetMarker?: number;
// }>;

export type ApplyBuffStackEvent = Event<{
  type: "applybuffstack";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  stack: number;
  sourceMarker?: number;
  targetMarker?: number;
}>;

export type InterruptEvent = Event<{
  type: "interrupt";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  extraAbilityGameID: number;
  sourceMarker?: number;
}>;

// type AbsorbEvent = Event<{
//   type: "absorbed";
//   sourceID: number;
//   targetID: number;
//   abilityGameID: number;
//   attackerID: number;
//   amount: number;
//   extraAbilityGameID: number;
//   sourceMarker: number;
//   targetMarker: number;
// }>;

type RefreshDebuffEvent = Event<{
  type: "refreshdebuff";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
}>;

// type DispelEvent = Event<{
//   type: "dispel";
//   sourceID: number;
//   targetID: number;
//   abilityGameID: number;
//   extraAbilityGameID: number;
//   isBuff: boolean;
//   sourceMarker: number;
//   targetMarker: number;
// }>;

export type DeathEvent = Event<{
  type: "death";
  sourceID: number;
  targetID: number;
  targetInstance?: number;
  abilityGameID: number;
  // only present if NPC kills player
  killerID?: number;
  killerInstance?: number;
  killingAbilityGameID?: number;
  targetMarker?: number;
}>;

export const loadRecursiveEventsFromSource = async (
  reportID: string,
  startTime: number,
  endTime: number,
  sourceID: number,
  previousEvents: CastEvent[] = []
): Promise<CastEvent[]> => {
  try {
    const sdk = await getCachedSdk();

    const json = await sdk.EventData({
      reportID,
      startTime,
      endTime,
      sourceID,
      dataType: EventDataType.Casts,
      hostilityType: HostilityType.Friendlies,
    });

    const data: (CastEvent | BeginCastEvent)[] =
      json?.reportData?.report?.events?.data ?? [];
    const nextPageTimestamp =
      json?.reportData?.report?.events?.nextPageTimestamp ?? null;

    const nextEvents = [
      ...previousEvents,
      ...data.filter((event): event is CastEvent => event.type === "cast"),
    ];

    if (nextPageTimestamp) {
      return await loadRecursiveEventsFromSource(
        reportID,
        startTime,
        nextPageTimestamp,
        endTime,
        nextEvents
      );
    }

    return nextEvents.filter((event) =>
      remarkableSpellIds.has(event.abilityGameID)
    );
  } catch {
    return previousEvents;
  }
};

type SpiresSpearUsageParams = Pick<
  Parameters<Sdk["EventData"]>[0],
  "reportID" | "startTime" | "endTime"
>;

export const getSpiresSpearUsage = async (
  params: SpiresSpearUsageParams
): Promise<ApplyDebuffEvent[]> => {
  const sdk = await getCachedSdk();

  const json = await sdk.EventData({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: SOA_SPEAR,
  });

  const data: (ApplyDebuffEvent | RemoveDebuffEvent | RefreshDebuffEvent)[] =
    json?.reportData?.report?.events?.data ?? [];

  return data.filter(
    (event): event is ApplyDebuffEvent => event.type === "applydebuff"
  );
};

type NWKyrianOrbHealParams = SpiresSpearUsageParams;

export const getNecroticWakeKyrianOrbHealEvents = async (
  params: NWKyrianOrbHealParams,
  previousEvents: HealEvent[] = []
): Promise<HealEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.Healing,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_KYRIAN_ORB_HEAL,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: HealEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getNecroticWakeKyrianOrbHealEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type NWKyrianOrbDamageParams = SpiresSpearUsageParams;

export const getNecroticWakeKyrianOrbDamageEvents = async (
  params: NWKyrianOrbDamageParams,
  previousEvents: DamageEvent[] = []
): Promise<DamageEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_KYRIAN_ORB_DAMAGE,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DamageEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getNecroticWakeKyrianOrbDamageEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type NWHammerUsageParams = SpiresSpearUsageParams;

export const getNwHammerUsage = async (
  params: NWHammerUsageParams
): Promise<DamageEvent[]> => {
  const sdk = await getCachedSdk();

  const json = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_HAMMER,
  });

  return json?.reportData?.report?.events?.data ?? [];
};

type NWSpearUsageParams = SpiresSpearUsageParams;

export const getNwSpearUsage = async (
  params: NWSpearUsageParams
): Promise<DamageEvent[]> => {
  const sdk = await getCachedSdk();

  const json = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_SPEAR,
  });

  return json?.reportData?.report?.events?.data ?? [];
};

type NWSOrbUsageParams = SpiresSpearUsageParams;

export const getNwOrbUsage = async (
  params: NWSOrbUsageParams
): Promise<DamageEvent[]> => {
  const sdk = await getCachedSdk();

  const json = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_ORB,
  });

  return json?.reportData?.report?.events?.data ?? [];
};

type TOPBannerUsageParams = SpiresSpearUsageParams;

export const getTopBannerUsage = async (
  params: TOPBannerUsageParams
): Promise<ApplyBuffEvent[]> => {
  const sdk = await getCachedSdk();

  const json = await sdk.EventData({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: TOP_BANNER_AURA,
  });

  const data: (ApplyBuffEvent | RemoveBuffEvent)[] =
    json?.reportData?.report?.events?.data ?? [];

  return data.filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );
};

type DOSUrnUsageParams = SpiresSpearUsageParams;

export const getDosUrnUsage = async (
  params: DOSUrnUsageParams
): Promise<ApplyDebuffEvent[]> => {
  const sdk = await getCachedSdk();

  const json = await sdk.EventData({
    ...params,
    dataType: EventDataType.Debuffs,
    hostilityType: HostilityType.Enemies,
    abilityID: DOS_URN,
  });

  const data: (ApplyDebuffEvent | RemoveDebuffEvent | RefreshDebuffEvent)[] =
    json?.reportData?.report?.events?.data ?? [];

  return data.filter(
    (event): event is ApplyDebuffEvent => event.type === "applydebuff"
  );
};

type CardboardAssassinUsageParams = SpiresSpearUsageParams;
type CardboardAssassinUsages = { events: CastEvent[]; actorId: number | null };

export const getCardboardAssassinUsage = async (
  params: CardboardAssassinUsageParams
): Promise<CardboardAssassinUsages[]> => {
  const sdk = await getCachedSdk();

  const data = await sdk.PetActors({
    reportID: params.reportID,
  });

  const cardboardAssassinInstances =
    data?.reportData?.report?.masterData?.actors?.filter(
      (pet) => pet?.gameID === CARDBOARD_ASSASSIN
    ) ?? [];

  if (cardboardAssassinInstances.length === 0) {
    return [];
  }

  const eventGroup = await Promise.all(
    cardboardAssassinInstances.map(async (instance) => {
      if (!instance?.id) {
        return null;
      }

      const response = await sdk.EventData({
        ...params,
        sourceID: instance.id,
        dataType: EventDataType.Threat,
        hostilityType: HostilityType.Friendlies,
      });

      const events = response?.reportData?.report?.events?.data ?? [];

      if (events.length === 0) {
        return null;
      }

      return {
        actorId: instance.petOwner,
        events,
      };
    })
  );

  return eventGroup.filter(
    (dataset): dataset is CardboardAssassinUsages => dataset !== null
  );
};

type InvisibilityUsageParams = SpiresSpearUsageParams;

export const getInvisibilityUsage = async (
  params: InvisibilityUsageParams
): Promise<ApplyBuffEvent[]> => {
  const sdk = await getCachedSdk();

  const dimensionalShifterUsage = await sdk.EventData({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: DIMENSIONAL_SHIFTER,
  });

  const potionUsage = await sdk.EventData({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: POTION_OF_THE_HIDDEN_SPIRIT,
  });

  const allEvents: (ApplyBuffEvent | RemoveBuffEvent)[] = [
    ...(dimensionalShifterUsage?.reportData?.report?.events?.data ?? []),
    ...(potionUsage?.reportData?.report?.events?.data ?? []),
  ];

  return allEvents.filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );
};

type HOAGargoyleCharmsParams = SpiresSpearUsageParams;

export const getHoaGargoyleCharms = async (
  params: HOAGargoyleCharmsParams
): Promise<CastEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: HOA_GARGOYLE,
  });

  const data: (CastEvent | BeginCastEvent)[] =
    response?.reportData?.report?.events?.data ?? [];

  return data.filter((event): event is CastEvent => event.type === "cast");
};

type SDLanternUsageParams = SpiresSpearUsageParams;

export const getSdLanternUsages = async (
  params: SDLanternUsageParams
): Promise<BeginCastEvent[]> => {
  const sdk = await getCachedSdk();

  const data = await sdk.EventData({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: SD_LANTERN_OPENING,
  });

  return data?.reportData?.report?.events?.data ?? [];
};

export const getSdBuffEvents = async (
  params: SDLanternUsageParams
): Promise<(ApplyBuffEvent | ApplyBuffStackEvent | RemoveBuffEvent)[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: SD_LANTERN_BUFF,
  });

  return response?.reportData?.report?.events?.data ?? [];
};

type TotalHealingDoneBySanguineParams = SpiresSpearUsageParams;

export const getSanguineHealingDoneEvents = async (
  params: TotalHealingDoneBySanguineParams,
  previousEvents: HealEvent[] = []
): Promise<HealEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.Healing,
    hostilityType: HostilityType.Enemies,
    abilityID: SANGUINE_ICHOR_HEALING,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: HealEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getSanguineHealingDoneEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type TotalDamageTakenBySanguineParams = SpiresSpearUsageParams;

export const getSanguineDamageTakenEvents = async (
  params: TotalDamageTakenBySanguineParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<DamageTakenEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: SANGUINE_ICHOR_DAMAGE,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DamageTakenEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getSanguineDamageTakenEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type TotalDamageTakenByGrievousWoundParams = SpiresSpearUsageParams;

export const getGrievousDamageTakenEvents = async (
  params: TotalDamageTakenByGrievousWoundParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<DamageTakenEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: GRIEVOUS_WOUND,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DamageTakenEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getGrievousDamageTakenEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type ExplosiveKillsParams = SpiresSpearUsageParams & {
  fightID: number;
};

export const getExplosiveKillEvents = async (
  params: ExplosiveKillsParams,
  explosiveID = -1,
  previousEvents: DamageEvent[] = []
): Promise<DamageEvent[]> => {
  const sourceID =
    explosiveID === -1
      ? await getExplosiveSourceID({
          fightID: params.fightID,
          reportID: params.reportID,
        })
      : explosiveID;

  if (!sourceID) {
    return [];
  }

  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    targetID: sourceID,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DamageEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getExplosiveKillEvents(
      { ...params, startTime: nextPageTimestamp },
      sourceID,
      allEvents
    );
  }

  return allEvents.filter((event) => event.overkill);
};

type TotalDamageTakenBySpitefulParams = SpiresSpearUsageParams & {
  fightID: number;
};

export const getSpitefulDamageTakenEvents = async (
  params: TotalDamageTakenBySpitefulParams,
  spitefulID = -1,
  previousEvents: DamageTakenEvent[] = []
): Promise<DamageTakenEvent[]> => {
  const sourceID =
    spitefulID === -1
      ? await getSpitefulSourceID({
          fightID: params.fightID,
          reportID: params.reportID,
        })
      : spitefulID;

  if (!sourceID) {
    return [];
  }

  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    targetID: sourceID,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DamageTakenEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getSpitefulDamageTakenEvents(
      { ...params, startTime: nextPageTimestamp },
      sourceID,
      allEvents
    );
  }

  return allEvents;
};

type TotalDamageTakenByExplosionParams = SpiresSpearUsageParams;

export const getExplosiveDamageTakenEvents = async (
  params: TotalDamageTakenByExplosionParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<DamageTakenEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: EXPLOSIVE.ability,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DamageTakenEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getExplosiveDamageTakenEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type HighestNecroticStackAmountParams = SpiresSpearUsageParams;

export const getHighestNecroticStackAmount = async (
  params: HighestNecroticStackAmountParams,
  previousEvents: ApplyDebuffStackEvent[] = []
): Promise<ApplyDebuffStackEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.Debuffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: NECROTIC,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [
    ...previousEvents,
    ...data.filter(
      (
        event: ApplyDebuffStackEvent | ApplyDebuffEvent
      ): event is ApplyDebuffStackEvent => event.type === "applydebuffstack"
    ),
  ];

  if (nextPageTimestamp) {
    return getHighestNecroticStackAmount(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  const highestStack = allEvents.reduce(
    (acc, event) => (acc >= event.stack ? acc : event.stack),
    0
  );

  return allEvents.filter((event) => event.stack === highestStack);
};

type TotalDamageTakenByNecroticParams = SpiresSpearUsageParams;

export const getNecroticDamageTakenEvents = async (
  params: TotalDamageTakenByNecroticParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<DamageTakenEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: NECROTIC,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DamageTakenEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getNecroticDamageTakenEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents.reduce<DamageTakenEvent[]>((arr, event) => {
    const existingIndex = arr.findIndex(
      (dataset) => dataset.targetID === event.targetID
    );

    if (existingIndex > -1) {
      return arr.map((dataset, index) =>
        index === existingIndex
          ? {
              ...dataset,
              amount: dataset.amount + event.amount + (event.absorbed ?? 0),
            }
          : dataset
      );
    }

    return [...arr, event];
  }, []);
};

type TotalDamageTakenByStormingParams = SpiresSpearUsageParams;

export const getStormingDamageTakenEvents = async (
  params: TotalDamageTakenByStormingParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<DamageTakenEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: STORMING,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getStormingDamageTakenEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type TotalDamageTakenByVolcanicParams = SpiresSpearUsageParams;

export const getVolcanicDamageTakenEvents = async (
  params: TotalDamageTakenByVolcanicParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<DamageTakenEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: VOLCANIC,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getVolcanicDamageTakenEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type PlayerDeathEventParams = SpiresSpearUsageParams;

export const getPlayerDeathEvents = async (
  params: PlayerDeathEventParams,
  previousEvents: DeathEvent[] = []
): Promise<DeathEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.Deaths,
    hostilityType: HostilityType.Friendlies,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DeathEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getPlayerDeathEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type HighestBolsteringStackParams = SpiresSpearUsageParams;

export const getBolsteringEvents = async (
  params: HighestBolsteringStackParams,
  previousEvents: ApplyBuffEvent[] = []
): Promise<ApplyBuffEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Enemies,
    abilityID: BOLSTERING,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: ApplyBuffEvent[] = [
    ...previousEvents,
    ...data.filter(
      (event: ApplyBuffEvent | RemoveBuffEvent): event is ApplyBuffEvent =>
        event.type === "applybuff"
    ),
  ];

  if (nextPageTimestamp) {
    return getBolsteringEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  type StackDataset = {
    targetID: number;
    targetInstance: number | null;
    stacks: number;
  };

  const stacksPerNPC = allEvents.reduce<StackDataset[]>(
    (acc, { targetID, targetInstance = null }) => {
      const existingIndex = acc.findIndex(
        (dataset) =>
          dataset.targetInstance === targetInstance &&
          targetID === dataset.targetID
      );

      if (existingIndex > -1) {
        return acc.map((dataset, index) =>
          index === existingIndex
            ? { ...dataset, stacks: dataset.stacks + 1 }
            : dataset
        );
      }

      return [
        ...acc,
        {
          targetID,
          targetInstance,
          stacks: 1,
        },
      ];
    },
    []
  );

  const highestStack = stacksPerNPC.reduce((acc, dataset) =>
    acc?.stacks >= dataset.stacks ? acc : dataset
  );

  const NPCsWithSameFinalStackAmount = stacksPerNPC.filter(
    (dataset) => dataset.stacks === highestStack.stacks
  );

  return allEvents.reduce<(ApplyBuffEvent & { stacks: number })[]>(
    (acc, event) => {
      const dataset = NPCsWithSameFinalStackAmount.find(
        (npc) =>
          npc.targetID === event.targetID &&
          npc.targetInstance === event.targetInstance
      );

      if (!dataset) {
        return acc;
      }

      const previousMatch = acc.find(
        (oldEvent) =>
          oldEvent.targetID === event.targetID &&
          oldEvent.targetInstance === event.targetInstance
      );

      const enhancedEvent = { ...event, stacks: dataset.stacks };

      if (!previousMatch) {
        return [...acc, enhancedEvent];
      }

      // implicitly means it must be a higher stack amount as targetID and
      // targetInstance match
      const isNewer = event.timestamp > previousMatch.timestamp;

      if (isNewer) {
        return [
          ...acc.filter((oldEvent) => oldEvent !== previousMatch),
          enhancedEvent,
        ];
      }

      return acc;
    },
    []
  );
};

type PFSlimeKillsParams = SpiresSpearUsageParams & {
  fightID: number;
};

export const getPFSlimeKills = async (
  params: PFSlimeKillsParams
): Promise<(DeathEvent | ApplyBuffEvent)[]> => {
  const {
    [PF_RED_BUFF.unit]: red,
    [PF_GREEN_BUFF.unit]: green,
    [PF_PURPLE_BUFF.unit]: purple,
  } = await loadEnemyNPCIDs(
    {
      fightIDs: [params.fightID],
      reportID: params.reportID,
    },
    [PF_RED_BUFF.unit, PF_GREEN_BUFF.unit, PF_PURPLE_BUFF.unit]
  );

  const sdk = await getCachedSdk();

  const [
    redDeathEvents,
    greenDeathEvents,
    purpleDeathEvents,
  ] = await Promise.all<DeathEvent[]>(
    [red, green, purple].map(async (sourceID) => {
      if (!sourceID) {
        return [];
      }

      const response = await sdk.EventData({
        ...params,
        dataType: EventDataType.Deaths,
        hostilityType: HostilityType.Enemies,
        sourceID,
      });

      return response?.reportData?.report?.events?.data ?? [];
    })
  );

  const earliestUnitDeathTimestamp = [
    ...redDeathEvents,
    ...greenDeathEvents,
    ...purpleDeathEvents,
  ].reduce(
    (acc, event) => (acc <= event.timestamp ? acc : event.timestamp),
    Infinity
  );

  const [
    redAuraApplication,
    greenAuraApplication,
    purpleAuraApplication,
  ] = await Promise.all(
    [PF_RED_BUFF.aura, PF_GREEN_BUFF.aura, PF_PURPLE_BUFF.aura].map(
      async (abilityID) => {
        if (earliestUnitDeathTimestamp === Infinity) {
          return [];
        }

        const response = await sdk.EventData({
          ...params,
          startTime: earliestUnitDeathTimestamp,
          dataType: EventDataType.Buffs,
          hostilityType: HostilityType.Friendlies,
          abilityID,
        });

        const events: (ApplyBuffEvent | RemoveBuffEvent)[] =
          response?.reportData?.report?.events?.data ?? [];

        return events.filter(
          (event): event is ApplyBuffEvent => event.type === "applybuff"
        );
      }
    )
  );

  return [
    ...redDeathEvents,
    ...greenDeathEvents,
    ...purpleDeathEvents,
    ...redAuraApplication,
    ...greenAuraApplication,
    ...purpleAuraApplication,
  ];

  // return {
  //   red: {
  //     kills: redDeathEvents.length,
  //     consumed: redAuraApplication.length,
  //   },
  //   green: {
  //     kills: greenDeathEvents.length,
  //     consumed: greenAuraApplication.length,
  //   },
  //   purple: {
  //     kills: purpleDeathEvents.length,
  //     consumed: purpleAuraApplication.length,
  //   },
  // };
};

type TotalDamageTakenByBurstingParams = SpiresSpearUsageParams;

export const getBurstingDamageTakenEvents = async (
  params: TotalDamageTakenByBurstingParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<DamageTakenEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    hostilityType: HostilityType.Friendlies,
    dataType: EventDataType.DamageTaken,
    abilityID: BURSTING,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DamageTakenEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getBurstingDamageTakenEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type TotalDamageTakenByQuakingParams = SpiresSpearUsageParams;

export const getQuakingDamageTakenEvents = async (
  params: TotalDamageTakenByQuakingParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<DamageTakenEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    hostilityType: HostilityType.Friendlies,
    dataType: EventDataType.DamageTaken,
    abilityID: QUAKING,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DamageTakenEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getQuakingDamageTakenEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

type InterrutpsByQuakingParams = SpiresSpearUsageParams;

export const getQuakingInterruptEvents = async (
  params: InterrutpsByQuakingParams,
  previousEvents: InterruptEvent[] = []
): Promise<InterruptEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    hostilityType: HostilityType.Friendlies,
    dataType: EventDataType.Interrupts,
    abilityID: QUAKING,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: InterruptEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getQuakingInterruptEvents(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return (
    allEvents
      // see https://canary.discord.com/channels/180033360939319296/681904912090529801/842578775840391188
      .filter((event) => event.abilityGameID === QUAKING)
  );
};

type ManifestationOfPrideSourceIDParams = Pick<
  SpiresSpearUsageParams,
  "reportID"
> & {
  fightID: number;
};

export const getManifestationOfPrideSourceID = async (
  params: ManifestationOfPrideSourceIDParams
): Promise<number | null> => {
  const response = await loadEnemyNPCIDs(
    {
      fightIDs: [params.fightID],
      reportID: params.reportID,
    },
    [PRIDE.unit]
  );

  return response[PRIDE.unit] ?? null;
};

type SpitefulSourceIDParams = ManifestationOfPrideSourceIDParams;

const getSpitefulSourceID = async (params: SpitefulSourceIDParams) => {
  const response = await loadEnemyNPCIDs(
    {
      fightIDs: [params.fightID],
      reportID: params.reportID,
    },
    [SPITEFUL]
  );

  return response[SPITEFUL] ?? null;
};

type ExplosiveSourceIDParams = ManifestationOfPrideSourceIDParams;

const getExplosiveSourceID = async (params: ExplosiveSourceIDParams) => {
  const response = await loadEnemyNPCIDs(
    {
      fightIDs: [params.fightID],
      reportID: params.reportID,
    },
    [EXPLOSIVE.unit]
  );

  return response[EXPLOSIVE.unit] ?? null;
};

type ManifestationOfPrideDeathEvents = SpiresSpearUsageParams & {
  fightID: number;
  sourceID: number;
};

export const getManifestationOfPrideDeathEvents = async (
  params: ManifestationOfPrideDeathEvents
): Promise<DeathEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.Deaths,
    hostilityType: HostilityType.Enemies,
  });

  return response?.reportData?.report?.events?.data ?? [];
};

type ManifestationOfPrideDamageEventsParams<
  Type extends EventDataType
> = SpiresSpearUsageParams & {
  targetID: number;
  targetInstance?: number;
  dataType: Type;
};

const getManifestationOfPrideDamageEvents = async <
  Type extends EventDataType,
  ReturnedEvent = Type extends EventDataType.DamageDone
    ? DamageEvent
    : DamageTakenEvent
>(
  params: ManifestationOfPrideDamageEventsParams<Type>,
  firstEventOnly = false,
  previousEvents: ReturnedEvent[] = []
): Promise<ReturnedEvent[]> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    hostilityType: HostilityType.Friendlies,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};

  if (firstEventOnly) {
    return [data[0]];
  }

  const allEvents: ReturnedEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getManifestationOfPrideDamageEvents(
      { ...params, startTime: nextPageTimestamp },
      false,
      allEvents
    );
  }

  return allEvents;
};

type ManifestationOfPrideDamageDoneEventParams = Omit<
  ManifestationOfPrideDamageEventsParams<EventDataType.DamageDone>,
  "dataType"
>;

export const getDamageDoneToManifestationOfPrideEvents = async (
  params: ManifestationOfPrideDamageDoneEventParams,
  firstEventOnly = false
): Promise<DamageEvent[]> => {
  const events = await getManifestationOfPrideDamageEvents(
    {
      ...params,
      dataType: EventDataType.DamageDone,
    },
    firstEventOnly
  );

  return events.reduce<DamageEvent[]>((arr, event) => {
    const existingIndex = arr.findIndex(
      (dataset) => dataset.sourceID === event.sourceID
    );

    if (existingIndex > -1) {
      // eslint-disable-next-line sonarjs/no-identical-functions
      return arr.map((dataset, index) =>
        index === existingIndex
          ? {
              ...dataset,
              amount: dataset.amount + event.amount + (event.absorbed ?? 0),
            }
          : dataset
      );
    }

    return [...arr, event];
  }, []);
};

type ManifestationOfPrideDamageTakenEventParams = Omit<
  ManifestationOfPrideDamageEventsParams<EventDataType.DamageTaken>,
  "dataType"
>;

export const getDamageTakenByManifestatioNOfPrideEvents = async (
  params: ManifestationOfPrideDamageTakenEventParams,
  firstEventOnly = false
): Promise<DamageTakenEvent[]> => {
  const events = await getManifestationOfPrideDamageEvents(
    {
      ...params,
      dataType: EventDataType.DamageTaken,
    },
    firstEventOnly
  );

  // eslint-disable-next-line sonarjs/no-identical-functions
  return events.reduce<DamageTakenEvent[]>((arr, event) => {
    const existingIndex = arr.findIndex(
      (dataset) => dataset.targetID === event.targetID
    );

    if (existingIndex > -1) {
      // eslint-disable-next-line sonarjs/no-identical-functions
      return arr.map((dataset, index) =>
        index === existingIndex
          ? {
              ...dataset,
              amount: dataset.amount + event.amount + (event.absorbed ?? 0),
            }
          : dataset
      );
    }

    return [...arr, event];
  }, []);
};
