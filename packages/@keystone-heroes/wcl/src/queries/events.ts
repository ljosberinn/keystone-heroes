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
  remarkableSpellIDs,
  NW_KYRIAN_ORB_HEAL,
  NW_KYRIAN_ORB_DAMAGE,
  NW_HAMMER,
  NW_SPEAR,
  NW_ORB,
  TOP_BANNER_AURA,
  EXPLOSIVE,
  SPITEFUL,
  SD_LANTERN_BUFF,
  TORMENTED,
} from "@keystone-heroes/db/data";

import { getCachedSdk } from "../client";
import { EventDataType, HostilityType } from "../types";
import type { Sdk } from "../types";
import { loadEnemyNPCIDs } from "./report";

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

export type ApplyDebuffStackEvent = Event<{
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
  buffs?: string;
}>;

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

type GetEventBaseParams<
  T extends Record<string, unknown> = Record<string, unknown>
> = Pick<
  Parameters<Sdk["EventData"]>[0],
  "reportID" | "startTime" | "endTime"
> &
  T;

const getEvents = async <T extends Event<Record<string, unknown>>>(
  params: GetEventBaseParams<{
    abilityID?: number;
    dataType: EventDataType;
    hostilityType: HostilityType;
    sourceID?: number;
    targetID?: number;
  }>,
  previousEvents: T[] = []
): Promise<T[]> => {
  const sdk = await getCachedSdk();
  const response = await sdk.EventData(params);

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: T[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getEvents<T>({ ...params, startTime: nextPageTimestamp }, allEvents);
  }

  return allEvents;
};

type EventFetcherParams = {
  abilityID?: number;
  dataType: EventDataType;
  hostilityType: HostilityType;
};

const createEventFetcher =
  <T extends Event<Record<string, unknown>>>(
    initialParams: EventFetcherParams
  ) =>
  (params: GetEventBaseParams) =>
    getEvents<T>({
      ...params,
      ...initialParams,
    });

const reduceEventsByPlayer = <T extends DamageEvent | HealEvent>(
  events: T[],
  key: "targetID" | "sourceID"
) => {
  return events.reduce<T[]>((arr, event) => {
    const existingIndex = arr.findIndex(
      (dataset) => dataset[key] === event[key]
    );

    if (existingIndex > -1) {
      return arr.map((dataset, index) => {
        return index === existingIndex
          ? {
              ...dataset,
              amount: dataset.amount + event.amount + (event.absorbed ?? 0),
              overheal:
                event.type === "heal" && dataset.type === "heal"
                  ? (dataset?.overheal ?? 0) + (event?.overheal ?? 0)
                  : undefined,
            }
          : dataset;
      });
    }

    return [...arr, event];
  }, []);
};

export const getRemarkableSpellCastEvents = async (
  params: GetEventBaseParams<{ sourceID: number }>
): Promise<CastEvent[]> => {
  const allEvents = await getEvents<CastEvent | BeginCastEvent>({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
  });

  return allEvents.filter(
    (event): event is CastEvent =>
      event.type === "cast" && remarkableSpellIDs.has(event.abilityGameID)
  );
};

export const getSpiresOfAscensionSpearUsage = async (
  params: GetEventBaseParams
): Promise<ApplyDebuffEvent[]> => {
  const allEvents = await getEvents<
    ApplyDebuffEvent | RemoveDebuffEvent | RefreshDebuffEvent
  >({
    ...params,
    dataType: EventDataType.Debuffs,
    hostilityType: HostilityType.Enemies,
    abilityID: SOA_SPEAR,
  });

  // SoA Spear stun lasts 10 seconds
  // each usage should be thus at least 10s apart of each other
  const threshold = 10 * 1000;

  // picks the first event of each chunk
  return allEvents
    .filter((event): event is ApplyDebuffEvent => event.type === "applydebuff")
    .reduce<ApplyDebuffEvent[][]>(
      (acc, event) => reduceToChunkByThreshold(acc, event, threshold),
      []
    )
    .flatMap((chunk) => chunk[0]);
};

export const getNecroticWakeHammerUsage = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageDone,
  hostilityType: HostilityType.Friendlies,
  abilityID: NW_HAMMER,
});

const reduceToChunkByThreshold = <E extends Event<Record<string, unknown>>>(
  acc: E[][],
  event: E,
  threshold: number
) => {
  if (acc.length === 0) {
    return [[event]];
  }

  const lastChunksIndex = acc.length - 1;
  const lastChunks = acc[lastChunksIndex];

  const lastIndex = lastChunks.length - 1;
  const lastEvent = lastChunks[lastIndex];

  const timePassed = event.timestamp - lastEvent.timestamp;
  return timePassed > threshold
    ? [...acc, [event]]
    : acc.map((events, index) =>
        index === lastChunksIndex ? [...events, event] : events
      );
};

export const getNecroticWakeSpearUsage = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_SPEAR,
  });

  // NW Spear applies a bleed for 16 seconds
  // each usage is hopefully thus at least 16s apart of each other
  // may have to adjust later for multi-spearing...
  const threshold = 16 * 1000;

  const chunks = allEvents.reduce<DamageEvent[][]>(
    (acc, event) => reduceToChunkByThreshold(acc, event, threshold),
    []
  );

  // creates one event per orb usage
  return chunks.flatMap((chunk) => reduceEventsByPlayer(chunk, "sourceID"));
};
export const getNecroticWakeOrbUsage = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_ORB,
  });
  // NW Orb pulses every 1s for 8s
  // each usage is hopefully thus at least 8s apart of each other
  // may have to adjust later for multi-orbing...
  const threshold = 8 * 1000;

  const chunks = allEvents.reduce<DamageEvent[][]>(
    (acc, event) => reduceToChunkByThreshold(acc, event, threshold),
    []
  );

  // creates one event per orb usage
  return chunks.flatMap((chunk) => reduceEventsByPlayer(chunk, "sourceID"));
};

export const getTheaterOfPainBannerUsage = async (
  params: GetEventBaseParams
): Promise<ApplyBuffEvent[]> => {
  const data = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: TOP_BANNER_AURA,
  });

  return data.filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );
};

export const getDeOtherSideUrnUsage = async (
  params: GetEventBaseParams
): Promise<ApplyDebuffEvent[]> => {
  const allEvents = await getEvents<
    ApplyDebuffEvent | RemoveDebuffEvent | RefreshDebuffEvent
  >({
    ...params,
    dataType: EventDataType.Debuffs,
    hostilityType: HostilityType.Enemies,
    abilityID: DOS_URN,
  });

  return allEvents.filter(
    (event): event is ApplyDebuffEvent => event.type === "applydebuff"
  );
};

type CardboardAssassinUsages = { events: CastEvent[]; actorId: number | null };

export const getCardboardAssassinUsage = async (
  params: GetEventBaseParams
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

      const events = await getEvents<CastEvent>({
        ...params,
        sourceID: instance.id,
        dataType: EventDataType.Threat,
        hostilityType: HostilityType.Friendlies,
      });

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

export const getInvisibilityUsage = async (
  params: GetEventBaseParams
): Promise<ApplyBuffEvent[]> => {
  const dimensionalShifterUsage = await getEvents<
    ApplyBuffEvent | RemoveBuffEvent
  >({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: DIMENSIONAL_SHIFTER,
  });

  const potionUsage = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: POTION_OF_THE_HIDDEN_SPIRIT,
  });

  return [...dimensionalShifterUsage, ...potionUsage].filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );
};

export const getHallsOfAtonementGargoyleCharms = async (
  params: GetEventBaseParams
): Promise<CastEvent[]> => {
  const data = await getEvents<CastEvent | BeginCastEvent>({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: HOA_GARGOYLE,
  });

  return data.filter((event): event is CastEvent => event.type === "cast");
};

export const getSanguineDepthsLanternUsages =
  createEventFetcher<BeginCastEvent>({
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: SD_LANTERN_OPENING,
  });

export const getSanguineDepthsBuffEvents = createEventFetcher<
  ApplyBuffEvent | ApplyBuffStackEvent | RemoveBuffEvent
>({
  dataType: EventDataType.Buffs,
  hostilityType: HostilityType.Friendlies,
  abilityID: SD_LANTERN_BUFF,
});

export const getSanguineHealingDoneEvents = async (
  params: GetEventBaseParams
): Promise<[HealEvent]> => {
  const allEvents = await getEvents<HealEvent>({
    ...params,
    dataType: EventDataType.Healing,
    hostilityType: HostilityType.Enemies,
    abilityID: SANGUINE_ICHOR_HEALING,
  });

  return [
    allEvents.reduce<HealEvent>((acc, event) => {
      return {
        ...acc,
        amount: acc.amount + event.amount,
        overheal: (acc.overheal ?? 0) + (event.overheal ?? 0),
      };
    }, allEvents[0]),
  ];
};

export const getExplosiveKillEvents = async (
  params: GetEventBaseParams<{ fightID: number }>,
  explosiveID = -1
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

  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    targetID: sourceID,
  });

  return allEvents.filter((event) => event.overkill);
};

export const getSpitefulDamageTakenEvents = async (
  params: GetEventBaseParams<{ fightID: number }>,
  spitefulID = -1
): Promise<DamageEvent[]> => {
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

  return getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    targetID: sourceID,
  });
};

export const getHighestNecroticStackAmount = async (
  params: GetEventBaseParams
): Promise<ApplyDebuffStackEvent[]> => {
  const allEvents = await getEvents<ApplyDebuffStackEvent | ApplyDebuffEvent>({
    ...params,
    dataType: EventDataType.Debuffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: NECROTIC,
  });

  const relevantEvents = allEvents.filter(
    (event): event is ApplyDebuffStackEvent => event.type === "applydebuffstack"
  );

  const highestStack = relevantEvents.reduce(
    (acc, event) => (acc >= event.stack ? acc : event.stack),
    0
  );

  return relevantEvents.filter((event) => event.stack === highestStack);
};

export const getNecroticDamageTakenEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: NECROTIC,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};

export const getPlayerDeathEvents = createEventFetcher<DeathEvent>({
  dataType: EventDataType.Deaths,
  hostilityType: HostilityType.Friendlies,
});

type StackDataset = {
  targetID: number;
  targetInstance: number | null;
  stacks: number;
};

export const getBolsteringEvents = async (
  params: GetEventBaseParams
): Promise<ApplyBuffEvent[]> => {
  const allEvents = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Enemies,
    abilityID: BOLSTERING,
  });

  const relevantEvents = allEvents.filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );

  const stacksPerNPC = relevantEvents.reduce<StackDataset[]>(
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

  return relevantEvents.reduce<(ApplyBuffEvent & { stacks: number })[]>(
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

type PFSlimeKillsParams = GetEventBaseParams & {
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

  const [redDeathEvents, greenDeathEvents, purpleDeathEvents] =
    await Promise.all<DeathEvent[]>(
      [red, green, purple].map(async (sourceID) => {
        if (!sourceID) {
          return [];
        }

        return getEvents<DeathEvent>({
          ...params,
          dataType: EventDataType.Deaths,
          hostilityType: HostilityType.Enemies,
          sourceID,
        });
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

          const events = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
            ...params,
            startTime: earliestUnitDeathTimestamp,
            dataType: EventDataType.Buffs,
            hostilityType: HostilityType.Friendlies,
            abilityID,
          });

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

export const getBurstingDamageTakenEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: BURSTING,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};

export const getNecroticWakeKyrianOrbHealEvents = async (
  params: GetEventBaseParams
): Promise<HealEvent[]> => {
  const allEvents = await getEvents<HealEvent>({
    ...params,
    dataType: EventDataType.Healing,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_KYRIAN_ORB_HEAL,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};

export const getNecroticWakeKyrianOrbDamageEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_KYRIAN_ORB_DAMAGE,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};

export const getSanguineDamageTakenEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: SANGUINE_ICHOR_DAMAGE,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};

export const getGrievousDamageTakenEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: GRIEVOUS_WOUND,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};

export const getExplosiveDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: EXPLOSIVE.ability,
});

export const getStormingDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: STORMING,
});

export const getVolcanicDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: VOLCANIC,
});

export const getQuakingDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: QUAKING,
});

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

export const getSoulforgeFlamesDamageTakenEvents =
  createEventFetcher<DamageEvent>({
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: TORMENTED.damageTaken.SOULFORGE_FLAMES,
  });

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

export const getQuakingInterruptEvents = async (
  params: GetEventBaseParams
): Promise<InterruptEvent[]> => {
  const allEvents = await getEvents<InterruptEvent>({
    ...params,
    dataType: EventDataType.Interrupts,
    hostilityType: HostilityType.Friendlies,
    abilityID: QUAKING,
  });

  // see https://canary.discord.com/channels/180033360939319296/681904912090529801/842578775840391188
  return allEvents.filter((event) => event.abilityGameID === QUAKING);
};

type ManifestationOfPrideSourceIDParams = Pick<
  GetEventBaseParams,
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

export const getManifestationOfPrideDeathEvents = (
  params: GetEventBaseParams<{
    fightID: number;
    sourceID: number;
  }>
): Promise<DeathEvent[]> =>
  getEvents<DeathEvent>({
    ...params,
    dataType: EventDataType.Deaths,
    hostilityType: HostilityType.Enemies,
  });

type ManifestationOfPrideDamageEventsParams<Type extends EventDataType> =
  GetEventBaseParams<{
    targetID: number;
    targetInstance?: number;
    dataType: Type;
  }>;

const getManifestationOfPrideDamageEvents = async <Type extends EventDataType>(
  params: ManifestationOfPrideDamageEventsParams<Type>,
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

  const allEvents: DamageEvent[] = [...previousEvents, ...data];

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

  return reduceEventsByPlayer(events, "sourceID");
};

type ManifestationOfPrideDamageTakenEventParams = Omit<
  ManifestationOfPrideDamageEventsParams<EventDataType.DamageTaken>,
  "dataType"
>;

export const getDamageTakenByManifestatioNOfPrideEvents = async (
  params: ManifestationOfPrideDamageTakenEventParams,
  firstEventOnly = false
): Promise<DamageEvent[]> => {
  const events = await getManifestationOfPrideDamageEvents(
    {
      ...params,
      dataType: EventDataType.DamageTaken,
    },
    firstEventOnly
  );

  return reduceEventsByPlayer(events, "targetID");
};
