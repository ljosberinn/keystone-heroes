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
  EXPLOSION,
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

type ApplyDebuffEvent = Event<{
  type: "applydebuff";
  sourceID: number;
  targetID: number;
  targetInstance: number;
  abilityGameID: number;
}>;

type ApplyDebuffStackEvent = Event<{
  type: "applydebuffstack";
  stack: number;
}>;

type ApplyBuffEvent = Event<{
  type: "applybuff";
  sourceID: number;
  sourceInstance: number;
  targetID: number;
  targetInstance?: number;
  abilityGameID: number;
}>;

type RemoveBuffEvent = Event<{
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

type DamageEvent = Event<{
  type: "damage";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  hitType: number;
  amount: number;
  mitigated: number;
  unmitigatedAmount: number;
  tick?: true;
  sourceMarker?: number;
  absorbed?: number;
}>;

type DamageTakenEvent = DamageEvent & {
  buffs?: string;
};

type BeginCastEvent = Event<{
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

type HealEvent = Event<{
  type: "heal";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  hitType: number;
  amount: number;
  sourceMarker: number;
  targetMarker: number;
  tick?: true;
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

// type ApplyBuffStackEvent = Event<{
//   type: "applybuffstack";
//   sourceID: number;
//   targetID: number;
//   abilityGameID: number;
//   stack: number;
//   sourceMarker: number;
//   targetMarker: number;
// }>;

type InterruptEvent = Event<{
  type: "interrupt";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  extraAbilityGameID: number;
  sourceMarker: number;
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

type DeathEvent = Event<{
  type: "death";
  sourceID: number;
  targetID: number;
  targetInstance?: number;
  abilityGameID: number;
  killerID: number;
  killerInstance: number;
  killingAbilityGameID: number;
}>;

export const loadRecursiveEventsFromSource = async (
  reportID: string,
  startTime: number,
  endTime: number,
  sourceID: number,
  previousEvents: CastEvent[] = []
): Promise<Omit<CastEvent, "sourceMarker">[]> => {
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

    return nextEvents
      .map(({ sourceMarker, ...rest }) => rest)
      .filter((event) => remarkableSpellIds.has(event.abilityGameID));
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

  const casts = await sdk.EventData({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: HOA_GARGOYLE,
  });

  const data: (CastEvent | BeginCastEvent)[] =
    casts?.reportData?.report?.events?.data ?? [];

  return data.filter((event): event is CastEvent => event.type === "cast");
};

type SDLanternUsageParams = SpiresSpearUsageParams;

export const getSdLanternUsages = async (
  params: SDLanternUsageParams
): Promise<BeginCastEvent[]> => {
  const sdk = await getCachedSdk();

  const casts = await sdk.EventData({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: SD_LANTERN_OPENING,
  });

  return casts?.reportData?.report?.events?.data ?? [];
};

type TotalHealingDoneBySanguineParams = SpiresSpearUsageParams;

export const getTotalHealingDoneBySanguine = async (
  params: TotalHealingDoneBySanguineParams,
  previousEvents: HealEvent[] = []
): Promise<number> => {
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
    return getTotalHealingDoneBySanguine(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents.reduce((acc, event) => acc + event.amount, 0);
};

const reduceDamageTakenToMap = <Data extends DamageTakenEvent[]>(
  allEvents: Data,
  type: HostilityType = HostilityType.Friendlies
) => {
  // when querying for dataType: DamageTaken and hostilityType: Enemies
  // targetID is the target of the enemy which is doing the damage
  // sourceID is the enemy
  const isFriendlies = type === HostilityType.Friendlies;

  return allEvents.reduce<Record<number, number>>(
    (acc, { amount, sourceID, targetID, absorbed = 0 }) => {
      const sum = amount + absorbed;
      const key = isFriendlies ? sourceID : targetID;

      return {
        ...acc,
        [key]: acc[key] ? acc[key] + sum : sum,
      };
    },
    {}
  );
};

type TotalDamageTakenBySanguineParams = SpiresSpearUsageParams;

export const getTotalDamageTakenBySanguine = async (
  params: TotalDamageTakenBySanguineParams,
  previousEvents: DamageEvent[] = []
): Promise<Record<number, number>> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: SANGUINE_ICHOR_DAMAGE,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenBySanguine(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type TotalDamageTakenByGrievousWoundParams = SpiresSpearUsageParams;
type GrievousDamageTakenMap = Record<number, number>;

export const getTotalDamageTakenByGrievousWound = async (
  params: TotalDamageTakenByGrievousWoundParams,
  previousEvents: DamageEvent[] = []
): Promise<GrievousDamageTakenMap> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: GRIEVOUS_WOUND,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByGrievousWound(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type ExplosiveKillsParams = SpiresSpearUsageParams;

export const getAllExplosiveKills = async (
  params: ExplosiveKillsParams,
  explosiveId: number,
  previousEvents: DamageEvent[] = []
): Promise<Record<number, DamageEvent[]>> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    targetID: explosiveId,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getAllExplosiveKills(
      { ...params, startTime: nextPageTimestamp },
      explosiveId,
      allEvents
    );
  }

  return allEvents.reduce<Record<number, DamageEvent[]>>((acc, event) => {
    return {
      ...acc,
      [event.sourceID]: acc[event.sourceID]
        ? [...acc[event.sourceID], event]
        : [event],
    };
  }, {});
};

type TotalDamageTakenBySpitefulParams = SpiresSpearUsageParams;

export const getTotalDamageTakenBySpiteful = async (
  params: TotalDamageTakenBySpitefulParams,
  spitefulId: number,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    targetID: spitefulId,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenBySpiteful(
      { ...params, startTime: nextPageTimestamp },
      spitefulId,
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type TotalDamageTakenByExplosionParams = SpiresSpearUsageParams;

export const getTotalDamageTakenByExplosion = async (
  params: TotalDamageTakenByExplosionParams,
  previousEvents: DamageEvent[] = []
): Promise<number> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: EXPLOSION,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: DamageTakenEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByExplosion(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents.reduce(
    (acc, event) => acc + event.amount + (event.absorbed ?? 0),
    0
  );
};

type HighestNecroticStackAmountParams = SpiresSpearUsageParams;

export const getHighestNecroticStackAmount = async (
  params: HighestNecroticStackAmountParams,
  previousEvents: ApplyDebuffStackEvent[] = []
): Promise<number> => {
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

  return allEvents.reduce(
    (acc, event) => (acc >= event.stack ? acc : event.stack),
    0
  );
};

type TotalDamageTakenByNecroticParams = SpiresSpearUsageParams;

export const getTotalDamageTakenByNecrotic = async (
  params: TotalDamageTakenByNecroticParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: NECROTIC,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByNecrotic(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type TotalDamageTakenByStormingParams = SpiresSpearUsageParams;

export const getTotalDamageTakenByStorming = async (
  params: TotalDamageTakenByStormingParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
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
    return getTotalDamageTakenByStorming(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type TotalDamageTakenByVolcanicParams = SpiresSpearUsageParams;

export const getTotalDamageTakenByVolcanic = async (
  params: TotalDamageTakenByVolcanicParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
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
    return getTotalDamageTakenByVolcanic(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type HighestBolsteringStackParams = SpiresSpearUsageParams;

type HighestBolsteringDataset = {
  stack: number;
  targetID: number;
  targetInstance: number | null;
};

export const getHighestBolsteringStack = async (
  params: HighestBolsteringStackParams,
  previousEvents: ApplyBuffEvent[] = []
): Promise<HighestBolsteringDataset> => {
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
    return getHighestBolsteringStack(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents
    .reduce<HighestBolsteringDataset[]>(
      (acc, { targetID, targetInstance = null }) => {
        const existingIndex = acc.findIndex(
          (dataset) =>
            dataset.targetInstance === targetInstance &&
            targetID === dataset.targetID
        );

        if (existingIndex > -1) {
          return acc.map((dataset, index) =>
            index === existingIndex
              ? { ...dataset, stack: dataset.stack + 1 }
              : dataset
          );
        }

        return [
          ...acc,
          {
            targetID,
            targetInstance,
            stack: 1,
          },
        ];
      },
      []
    )
    .reduce((acc, dataset) => (acc?.stack >= dataset.stack ? acc : dataset));
};

type PFSlimeKillsParams = SpiresSpearUsageParams & {
  fightID: number;
};

type PFSlimeKills = {
  red: { kills: number; consumed: number };
  green: { kills: number; consumed: number };
  purple: { kills: number; consumed: number };
};

export const getPFSlimeKills = async (
  params: PFSlimeKillsParams
): Promise<PFSlimeKills> => {
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

  const [redDeathEvents, greenDeathEvents, purpleDeathEvents] =
    await Promise.all<DeathEvent[]>(
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

  const [redAuraApplication, greenAuraApplication, purpleAuraApplication] =
    await Promise.all(
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

  return {
    red: {
      kills: redDeathEvents.length,
      consumed: redAuraApplication.length,
    },
    green: {
      kills: greenDeathEvents.length,
      consumed: greenAuraApplication.length,
    },
    purple: {
      kills: purpleDeathEvents.length,
      consumed: purpleAuraApplication.length,
    },
  };
};

// export const getHighestBurstingCount = async (
//   reportId: string,
//   startTime: number,
//   endTime: number,
//   previousEvents: ApplyDebuffStackEvent[] = []
// ): Promise<number> => {
//   const response = await getEventData<
//     (ApplyDebuffEvent | ApplyDebuffStackEvent)[]
//   >(reportId, {
//     startTime,
//     endTime,
//     hostilityType: "Friendlies",
//     dataType: EventDataType."Debuffs",
//     abilityID: BURSTING,
//   });

//   const { data, nextPageTimestamp } = response.reportData.report.events;
//   const allEvents = [
//     ...previousEvents,
//     ...data.filter(
//       (event): event is ApplyDebuffStackEvent =>
//         event.type === "applydebuffstack"
//     ),
//   ];

//   if (nextPageTimestamp) {
//     return getHighestBurstingCount(
//       reportId,
//       nextPageTimestamp,
//       endTime,
//       allEvents
//     );
//   }

//   return allEvents.reduce((acc, event) => {
//     return acc > event.stack ? acc : event.stack;
//   }, 0);
// };

type TotalDamageTakenByBurstingParams = SpiresSpearUsageParams;

export const getTotalDamageTakenByBursting = async (
  params: TotalDamageTakenByBurstingParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    hostilityType: HostilityType.Friendlies,
    dataType: EventDataType.DamageTaken,
    abilityID: BURSTING,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByBursting(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type TotalDamageTakenByQuakingParams = SpiresSpearUsageParams;

export const getTotalDamageTakenByQuaking = async (
  params: TotalDamageTakenByQuakingParams,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    hostilityType: HostilityType.Friendlies,
    dataType: EventDataType.DamageTaken,
    abilityID: QUAKING,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByQuaking(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type InterrutpsByQuakingParams = SpiresSpearUsageParams;

type QuakingInterruptMap = Record<
  number,
  { timestamp: number; abilityID: number }[]
>;

export const getInterruptsByQuaking = async (
  params: InterrutpsByQuakingParams,
  previousEvents: InterruptEvent[] = []
): Promise<QuakingInterruptMap> => {
  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    hostilityType: HostilityType.Friendlies,
    dataType: EventDataType.Interrupts,
    abilityID: QUAKING,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getInterruptsByQuaking(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return (
    allEvents
      // see https://canary.discord.com/channels/180033360939319296/681904912090529801/842578775840391188
      .filter((event) => event.abilityGameID === QUAKING)
      .reduce<QuakingInterruptMap>(
        (acc, { sourceID, timestamp, extraAbilityGameID }) => {
          const next = {
            timestamp,
            abilityID: extraAbilityGameID,
          };

          return {
            ...acc,
            [sourceID]: acc[sourceID] ? [...acc[sourceID], next] : [next],
          };
        },
        {}
      )
  );
};

type ManifestationOfPrideSourceIdParams = Pick<
  SpiresSpearUsageParams,
  "reportID"
> & {
  fightID: number;
};

const getManifestationOfPrideSourceId = async (
  params: ManifestationOfPrideSourceIdParams
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

type ManifestationOfPrideDeathEvents = SpiresSpearUsageParams & {
  fightID: number;
};

export const getManifestationOfPrideDeathEvents = async (
  params: ManifestationOfPrideDeathEvents
): Promise<DeathEvent[]> => {
  const sourceID = await getManifestationOfPrideSourceId(params);

  if (!sourceID) {
    return [];
  }

  const sdk = await getCachedSdk();

  const response = await sdk.EventData({
    ...params,
    dataType: EventDataType.Deaths,
    hostilityType: HostilityType.Enemies,
    sourceID,
  });

  return response?.reportData?.report?.events?.data ?? [];
};

type ManifestationOfPrideDamageEventsParams = SpiresSpearUsageParams & {
  targetID: number;
  targetInstance?: number;
  dataType: EventDataType;
};

const getManifestationOfPrideDamageEvents = async (
  params: ManifestationOfPrideDamageEventsParams,
  firstEventOnly = false,
  previousEvents: DamageEvent[] = []
): Promise<DamageEvent[]> => {
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

  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getManifestationOfPrideDamageEvents(
      { ...params, startTime: nextPageTimestamp },
      false,
      allEvents
    );
  }

  return allEvents;
};

type ManifestationOfPrideDamageTakenEventsParams = SpiresSpearUsageParams & {
  targetID: number;
  targetInstance?: number;
};

type ManifestationOfPrideMeta = {
  startTime: number;
  endTime: number;
  combatTime: number;
  damageTaken: Record<number, number>;
};

export const getManifestationOfPrideDamageTaken = async (
  params: ManifestationOfPrideDamageTakenEventsParams
): Promise<ManifestationOfPrideMeta | null> => {
  const deathEvents = await getManifestationOfPrideDamageEvents(
    {
      ...params,
      dataType: EventDataType.DamageDone,
    },
    true
  );

  // all prides skipped :tada:
  if (!deathEvents) {
    return null;
  }

  const [{ timestamp: firstDamageDoneTimestamp }] = deathEvents;

  const damageTakenEvents = await getManifestationOfPrideDamageEvents(
    {
      ...params,
      dataType: EventDataType.DamageTaken,
    },
    false
  );

  return {
    startTime: firstDamageDoneTimestamp,
    endTime: params.endTime,
    combatTime: params.endTime - firstDamageDoneTimestamp,
    damageTaken: reduceDamageTakenToMap(
      damageTakenEvents,
      HostilityType.Enemies
    ),
  };
};
