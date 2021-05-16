import { gql } from "graphql-request";

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
} from "@keystone-heroes/db/data";
import { getGqlClient } from "../client";
import { getEnemyNpcIds } from "./report";

type Event<T extends Record<string, unknown>> = T & {
  timestamp: number;
};

type EncounterStartEvent = Event<{
  type: "encounterstart";
  encounterID: number;
  name: string;
  difficulty: number;
  size: number;
  level: number;
  affixes: number[];
}>;

type CombatantInfoEvent = Event<{
  type: "combatantinfo";
  sourceID: number;
  gear: [];
  auras: {
    source: number;
    ability: number;
    stacks: number;
    icon: string;
    name?: string;
  }[];
  expansion: string;
  faction: number;
  specID: number;
  covenantID: number;
  soulbindID: number;
  strength: number;
  agility: number;
  stamina: number;
  intellect: number;
  dodge: number;
  parry: number;
  block: number;
  armor: number;
  critMelee: number;
  critRanged: number;
  critSpell: number;
  speed: number;
  leech: number;
  hasteMelee: number;
  hasteRanged: number;
  hasteSpell: number;
  avoidance: number;
  // eslint-disable-next-line inclusive-language/use-inclusive-words
  mastery: number;
  versatilityDamageDone: number;
  versatilityHealingDone: number;
  versatilityDamageReduction: number;
  talents: { id: number; icon: string }[];
  pvpTalents: { id: number; icon: string }[];
  artifact: { traitID: number; rank: number; spellID: number; icon: string }[];
  heartOfAzeroth: {
    traitID: number;
    rank: number;
    spellID: number;
    icon: string;
  }[];
}>;

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

type CastEvent = Event<{
  type: "cast";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
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

type SummonEvent = Event<{
  type: "summon";
  sourceID: number;
  targetID: number;
  targetInstance: number;
  abilityGameID: number;
}>;

type PhaseStartEvent = Event<{
  type: "phasestart";
  encounterID: number;
  name: string;
  difficulty: number;
  size: number;
}>;

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

type EnergizeEvent = Event<{
  type: "energize";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  resourceChange: number;
  resourceChangeType: number;
  otherResourceChange: number;
  waste: number;
  sourceMarker?: number;
  targetMarker?: number;
}>;

type ApplyBuffStackEvent = Event<{
  type: "applybuffstack";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  stack: number;
  sourceMarker: number;
  targetMarker: number;
}>;

type InterruptEvent = Event<{
  type: "interrupt";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  extraAbilityGameID: number;
  sourceMarker: number;
}>;

type AbsorbEvent = Event<{
  type: "absorbed";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  attackerID: number;
  amount: number;
  extraAbilityGameID: number;
  sourceMarker: number;
  targetMarker: number;
}>;

type RefreshDebuffEvent = Event<{
  type: "refreshdebuff";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
}>;

type DispelEvent = Event<{
  type: "dispel";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  extraAbilityGameID: number;
  isBuff: boolean;
  sourceMarker: number;
  targetMarker: number;
}>;

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

type LogEvent =
  | EncounterStartEvent
  | CombatantInfoEvent
  | ApplyDebuffEvent
  | ApplyBuffEvent
  | RemoveBuffEvent
  | CastEvent
  | DamageEvent
  | DamageTakenEvent
  | BeginCastEvent
  | RemoveDebuffEvent
  | SummonEvent
  | PhaseStartEvent
  | HealEvent
  | EnergizeEvent
  | ApplyBuffEvent
  | ApplyBuffStackEvent
  | InterruptEvent
  | AbsorbEvent
  | RefreshDebuffEvent
  | DispelEvent
  | DeathEvent
  | ApplyDebuffStackEvent;

type RawEventResponse<Event extends LogEvent | LogEvent[]> = {
  reportData: {
    report: {
      events: {
        data: Event extends LogEvent[] ? Event : Event[];
        nextPageTimestamp: number | null;
      };
    };
  };
};

type DataType =
  | "All"
  | "Buffs"
  | "Casts"
  | "CombatantInfo"
  | "DamageDone"
  | "DamageTaken"
  | "Deaths"
  | "Debuffs"
  | "Dispels"
  | "Healing"
  | "Interrupts"
  | "Resources"
  | "Summons"
  | "Threat";
type Hostility = "Friendlies" | "Enemies";

type EventQueryParams = {
  dataType?: DataType;
  hostilityType?: Hostility;
  startTime: number;
  endTime: number;
  sourceId?: number;
  abilityId?: number;
  targetId?: number;
  targetInstance?: number;
};

const getEventData = async <Event extends LogEvent | LogEvent[]>(
  reportId: string,
  params: EventQueryParams
) => {
  const client = await getGqlClient();

  return client.request<RawEventResponse<Event>>(
    gql`
      query EventData(
        $reportId: String!
        $startTime: Float!
        $endTime: Float!
        $hostilityType: HostilityType!
        $sourceId: Int
        $dataType: EventDataType
        $abilityId: Float
        $targetId: Int
        $targetInstance: Int
      ) {
        reportData {
          report(code: $reportId) {
            events(
              startTime: $startTime
              endTime: $endTime
              hostilityType: $hostilityType
              sourceID: $sourceId
              dataType: $dataType
              abilityID: $abilityId
              targetID: $targetId
              targetInstanceID: $targetInstance
            ) {
              data
              nextPageTimestamp
            }
          }
        }
      }
    `,
    {
      reportId,
      ...params,
    }
  );
};

export const loadRecursiveEventsFromSource = async (
  reportId: string,
  startTime: number,
  endTime: number,
  sourceId: number,
  previousEvents: CastEvent[] = []
): Promise<CastEvent[]> => {
  try {
    const json = await getEventData<CastEvent>(reportId, {
      startTime,
      endTime,
      sourceId,
      dataType: "Casts",
      hostilityType: "Friendlies",
    });

    const { data, nextPageTimestamp } = json.reportData.report.events;
    const nextEvents = [...previousEvents, ...data];

    if (nextPageTimestamp) {
      return await loadRecursiveEventsFromSource(
        reportId,
        startTime,
        nextPageTimestamp,
        endTime,
        nextEvents
      );
    }

    return nextEvents;
  } catch {
    return previousEvents;
  }
};

export const getSpiresSpearUsage = async (
  reportId: string,
  startTime: number,
  endTime: number
): Promise<ApplyDebuffEvent[]> => {
  const json = await getEventData<
    (ApplyDebuffEvent | RemoveDebuffEvent | RefreshDebuffEvent)[]
  >(reportId, {
    startTime,
    endTime,
    dataType: "Debuffs",
    hostilityType: "Enemies",
    abilityId: SOA_SPEAR,
  });

  return json.reportData.report.events.data.filter(
    (event): event is ApplyDebuffEvent => event.type === "applydebuff"
  );
};

export const getDosUrnUsage = async (
  reportId: string,
  startTime: number,
  endTime: number
): Promise<ApplyDebuffEvent[]> => {
  const json = await getEventData<
    (ApplyDebuffEvent | RemoveDebuffEvent | RefreshDebuffEvent)[]
  >(reportId, {
    startTime,
    endTime,
    dataType: "Debuffs",
    hostilityType: "Enemies",
    abilityId: DOS_URN,
  });

  return json.reportData.report.events.data.filter(
    (event): event is ApplyDebuffEvent => event.type === "applydebuff"
  );
};

// eslint-disable-next-line inclusive-language/use-inclusive-words
type MasterDataActors = {
  gameID: number;
  id: number;
  petOwner: null | number;
};

// eslint-disable-next-line inclusive-language/use-inclusive-words
type RawMasterDataResponse = {
  reportData: {
    report: {
      // eslint-disable-next-line inclusive-language/use-inclusive-words
      masterData: {
        // eslint-disable-next-line inclusive-language/use-inclusive-words
        actors: MasterDataActors[];
      };
    };
  };
};

type CardboardAssassinUsages = { events: CastEvent[]; actorId: number | null };

export const getCardboardAssassinUsage = async (
  reportId: string,
  startTime: number,
  endTime: number
): Promise<CardboardAssassinUsages[]> => {
  const client = await getGqlClient();

  // eslint-disable-next-line inclusive-language/use-inclusive-words
  const data = await client.request<RawMasterDataResponse>(
    // eslint-disable-next-line inclusive-language/use-inclusive-words
    gql`
      query EventData($reportId: String!) {
        reportData {
          report(code: $reportId) {
            masterData {
              actors(type: "Pet") {
                gameID
                petOwner
                id
              }
            }
          }
        }
      }
    `,
    {
      reportId,
    }
  );

  const cardboardAssassinInstances =
    // eslint-disable-next-line inclusive-language/use-inclusive-words
    data.reportData.report.masterData.actors.filter(
      (pet) => pet.gameID === CARDBOARD_ASSASSIN
    );

  if (cardboardAssassinInstances.length === 0) {
    return [];
  }

  const eventGroup = await Promise.all(
    cardboardAssassinInstances.map(async (instance) => {
      const response = await getEventData<CastEvent[]>(reportId, {
        startTime,
        endTime,
        sourceId: instance.id,
        dataType: "Threat",
        hostilityType: "Friendlies",
      });

      if (response.reportData.report.events.data.length === 0) {
        return null;
      }

      return {
        actorId: instance.petOwner,
        events: response.reportData.report.events.data,
      };
    })
  );

  return eventGroup.filter(
    (dataset): dataset is CardboardAssassinUsages => dataset !== null
  );
};

export const getInvisibilityUsage = async (
  reportId: string,
  startTime: number,
  endTime: number
): Promise<ApplyBuffEvent[]> => {
  const dimensionalShifterUsage = await getEventData<
    (ApplyBuffEvent | RemoveBuffEvent)[]
  >(reportId, {
    startTime,
    endTime,
    dataType: "Buffs",
    hostilityType: "Friendlies",
    abilityId: DIMENSIONAL_SHIFTER,
  });

  const potionUsage = await getEventData<(ApplyBuffEvent | RemoveBuffEvent)[]>(
    reportId,
    {
      endTime,
      startTime,
      abilityId: POTION_OF_THE_HIDDEN_SPIRIT,
      dataType: "Buffs",
      hostilityType: "Friendlies",
    }
  );

  const allEvents = [
    ...dimensionalShifterUsage.reportData.report.events.data,
    ...potionUsage.reportData.report.events.data,
  ];

  return allEvents.filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );
};

export const getHoaGargoyleCharms = async (
  reportId: string,
  startTime: number,
  endTime: number
): Promise<CastEvent[]> => {
  const casts = await getEventData<(CastEvent | BeginCastEvent)[]>(reportId, {
    endTime,
    startTime,
    dataType: "Casts",
    hostilityType: "Friendlies",
    abilityId: HOA_GARGOYLE,
  });

  return casts.reportData.report.events.data.filter(
    (event): event is CastEvent => event.type === "cast"
  );
};

export const getSdLanternUsages = async (
  reportId: string,
  startTime: number,
  endTime: number
): Promise<BeginCastEvent[]> => {
  const casts = await getEventData<BeginCastEvent[]>(reportId, {
    endTime,
    startTime,
    dataType: "Casts",
    hostilityType: "Friendlies",
    abilityId: SD_LANTERN_OPENING,
  });

  return casts.reportData.report.events.data;
};

export const getTotalSanguineHealing = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: HealEvent[] = []
): Promise<number> => {
  const response = await getEventData<HealEvent[]>(reportId, {
    endTime,
    startTime,
    dataType: "Healing",
    hostilityType: "Enemies",
    abilityId: SANGUINE_ICHOR_HEALING,
  });

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalSanguineHealing(
      reportId,
      nextPageTimestamp,
      endTime,
      allEvents
    );
  }

  return allEvents.reduce((acc, event) => acc + event.amount, 0);
};

const reduceDamageTakenToMap = <Data extends DamageTakenEvent[]>(
  allEvents: Data,
  type: Hostility = "Friendlies"
) => {
  // when querying for dataType: DamageTaken and hostilityType: Enemies
  // targetID is the target of the enemy which is doing the damage
  // sourceID is the enemy
  const isFriendlies = type === "Friendlies";

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

export const getTotalDamageTakenBySanguine = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: DamageEvent[] = []
): Promise<Record<number, number>> => {
  const response = await getEventData<DamageTakenEvent[]>(reportId, {
    startTime,
    endTime,
    dataType: "DamageTaken",
    hostilityType: "Friendlies",
    abilityId: SANGUINE_ICHOR_DAMAGE,
  });

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenBySanguine(
      reportId,
      nextPageTimestamp,
      endTime,
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type GrievousDamageTakenMap = Record<number, number>;

export const getTotalDamageTakenByGrievousWound = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: DamageEvent[] = []
): Promise<GrievousDamageTakenMap> => {
  const response = await getEventData<DamageTakenEvent[]>(reportId, {
    startTime,
    endTime,
    dataType: "DamageTaken",
    hostilityType: "Friendlies",
    abilityId: GRIEVOUS_WOUND,
  });

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByGrievousWound(
      reportId,
      nextPageTimestamp,
      endTime,
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

export const getAllExplosiveKills = async (
  reportId: string,
  startTime: number,
  endTime: number,
  explosiveId: number,
  previousEvents: DamageEvent[] = []
): Promise<Record<number, DamageEvent[]>> => {
  const response = await getEventData<DamageEvent>(reportId, {
    startTime,
    endTime,
    dataType: "DamageDone",
    hostilityType: "Friendlies",
    targetId: explosiveId,
  });

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getAllExplosiveKills(
      reportId,
      nextPageTimestamp,
      endTime,
      explosiveId,
      allEvents
    );
  }

  // TODO: maybe dont return a map
  // return allEvents;

  return allEvents.reduce<Record<number, DamageEvent[]>>((acc, event) => {
    return {
      ...acc,
      [event.sourceID]: acc[event.sourceID]
        ? [...acc[event.sourceID], event]
        : [event],
    };
  }, {});
};

export const getTotalDamageTakenBySpiteful = async (
  reportId: string,
  startTime: number,
  endTime: number,
  spitefulId: number,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
  const response = await getEventData<DamageTakenEvent[]>(reportId, {
    startTime,
    endTime,
    dataType: "DamageTaken",
    hostilityType: "Friendlies",
    targetId: spitefulId,
  });

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenBySpiteful(
      reportId,
      nextPageTimestamp,
      endTime,
      spitefulId,
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

export const getTotalDamageTakenByExplosion = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: DamageEvent[] = []
): Promise<number> => {
  const response = await getEventData<DamageTakenEvent[]>(reportId, {
    startTime,
    endTime,
    dataType: "DamageTaken",
    hostilityType: "Friendlies",
    abilityId: EXPLOSION,
  });

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByExplosion(
      reportId,
      nextPageTimestamp,
      endTime,
      allEvents
    );
  }

  return allEvents.reduce(
    (acc, event) => acc + event.amount + (event.absorbed ?? 0),
    0
  );
};

export const getHighestNecroticStackAmount = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: ApplyDebuffStackEvent[] = []
): Promise<number> => {
  const response = await getEventData<
    (ApplyDebuffStackEvent | ApplyDebuffEvent)[]
  >(reportId, {
    startTime,
    endTime,
    dataType: "Debuffs",
    hostilityType: "Friendlies",
    abilityId: NECROTIC,
  });

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [
    ...previousEvents,
    ...data.filter(
      (event): event is ApplyDebuffStackEvent =>
        event.type === "applydebuffstack"
    ),
  ];

  if (nextPageTimestamp) {
    return getHighestNecroticStackAmount(
      reportId,
      nextPageTimestamp,
      endTime,
      allEvents
    );
  }

  return allEvents.reduce(
    (acc, event) => (acc >= event.stack ? acc : event.stack),
    0
  );
};

export const getTotalDamageTakenByNecrotic = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
  const response = await getEventData<DamageTakenEvent[]>(reportId, {
    startTime,
    endTime,
    dataType: "DamageTaken",
    hostilityType: "Friendlies",
    abilityId: NECROTIC,
  });

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByNecrotic(
      reportId,
      nextPageTimestamp,
      endTime,
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

export const getTotalDamageTakenByStorming = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
  const response = await getEventData<DamageTakenEvent[]>(reportId, {
    startTime,
    endTime,
    dataType: "DamageTaken",
    hostilityType: "Friendlies",
    abilityId: STORMING,
  });

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByStorming(
      reportId,
      nextPageTimestamp,
      endTime,
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

export const getTotalDamageTakenByVolcanic = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
  const response = await getEventData<DamageTakenEvent[]>(reportId, {
    startTime,
    endTime,
    dataType: "DamageTaken",
    hostilityType: "Friendlies",
    abilityId: VOLCANIC,
  });

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByVolcanic(
      reportId,
      nextPageTimestamp,
      endTime,
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type HighestBolsteringDataset = {
  stack: number;
  targetID: number;
  targetInstance: number | null;
};

export const getHighestBolsteringStack = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: ApplyBuffEvent[] = []
): Promise<HighestBolsteringDataset> => {
  const response = await getEventData<(ApplyBuffEvent | RemoveBuffEvent)[]>(
    reportId,
    {
      startTime,
      endTime,
      dataType: "Buffs",
      hostilityType: "Enemies",
      abilityId: BOLSTERING,
    }
  );

  const { nextPageTimestamp, data } = response.reportData.report.events;
  const allEvents = [
    ...previousEvents,
    ...data.filter(
      (event): event is ApplyBuffEvent => event.type === "applybuff"
    ),
  ];

  if (nextPageTimestamp) {
    return getHighestBolsteringStack(
      reportId,
      nextPageTimestamp,
      endTime,
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

type PFSlimeKills = {
  red: { kills: number; consumed: number };
  green: { kills: number; consumed: number };
  purple: { kills: number; consumed: number };
};

export const getPFSlimeKills = async (
  reportId: string,
  fightId: number,
  startTime: number,
  endTime: number
): Promise<PFSlimeKills> => {
  const {
    [PF_RED_BUFF.unit]: red,
    [PF_GREEN_BUFF.unit]: green,
    [PF_PURPLE_BUFF.unit]: purple,
  } = await getEnemyNpcIds(reportId, fightId, [
    PF_RED_BUFF.unit,
    PF_GREEN_BUFF.unit,
    PF_PURPLE_BUFF.unit,
  ]);

  const [redDeathEvents, greenDeathEvents, purpleDeathEvents] =
    await Promise.all(
      [red, green, purple].map(async (sourceId) => {
        const response = await getEventData<DeathEvent[]>(reportId, {
          startTime,
          endTime,
          dataType: "Deaths",
          hostilityType: "Enemies",
          sourceId,
        });

        return response.reportData.report.events.data;
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
        async (abilityId) => {
          const response = await getEventData<
            (ApplyBuffEvent | RemoveBuffEvent)[]
          >(reportId, {
            startTime: earliestUnitDeathTimestamp,
            endTime,
            dataType: "Buffs",
            hostilityType: "Friendlies",
            abilityId,
          });

          return response.reportData.report.events.data.filter(
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
//     dataType: "Debuffs",
//     abilityId: BURSTING,
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

export const getTotalDamageTakenByBursting = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
  const response = await getEventData<DamageTakenEvent[]>(reportId, {
    startTime,
    endTime,
    hostilityType: "Friendlies",
    dataType: "DamageTaken",
    abilityId: BURSTING,
  });

  const { data, nextPageTimestamp } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByBursting(
      reportId,
      nextPageTimestamp,
      endTime,
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

export const getTotalDamageTakenByQuaking = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: DamageTakenEvent[] = []
): Promise<Record<number, number>> => {
  const response = await getEventData<DamageTakenEvent[]>(reportId, {
    startTime,
    endTime,
    hostilityType: "Friendlies",
    dataType: "DamageTaken",
    abilityId: QUAKING,
  });

  const { data, nextPageTimestamp } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getTotalDamageTakenByQuaking(
      reportId,
      nextPageTimestamp,
      endTime,
      allEvents
    );
  }

  return reduceDamageTakenToMap(allEvents);
};

type QuakingInterruptMap = Record<
  number,
  { timestamp: number; abilityID: number }[]
>;

export const getInterruptsByQuaking = async (
  reportId: string,
  startTime: number,
  endTime: number,
  previousEvents: InterruptEvent[] = []
): Promise<QuakingInterruptMap> => {
  const response = await getEventData<InterruptEvent[]>(reportId, {
    startTime,
    endTime,
    hostilityType: "Friendlies",
    dataType: "Interrupts",
    abilityId: QUAKING,
  });

  const { data, nextPageTimestamp } = response.reportData.report.events;
  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getInterruptsByQuaking(
      reportId,
      nextPageTimestamp,
      endTime,
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

const getManifestationOfPrideSourceId = async (
  reportId: string,
  fightId: number
): Promise<number | null> => {
  const response = await getEnemyNpcIds(reportId, fightId, [PRIDE.unit]);

  return response[PRIDE.unit] ?? null;
};

export const getManifestationOfPrideDeathEvents = async (
  reportId: string,
  fightId: number,
  startTime: number,
  endTime: number
): Promise<DeathEvent[]> => {
  const sourceId = await getManifestationOfPrideSourceId(reportId, fightId);

  if (!sourceId) {
    return [];
  }

  const response = await getEventData<DeathEvent[]>(reportId, {
    startTime,
    endTime,
    dataType: "Deaths",
    hostilityType: "Enemies",
    sourceId,
  });

  return response.reportData.report.events.data;
};

type ManifestationOfPrideQueryParams = {
  startTime: number;
  endTime: number;
  targetId: number;
  targetInstance?: number;
  dataType: DataType;
};

const getManifestationOfPrideDamageEvents = async (
  reportId: string,
  queryParams: ManifestationOfPrideQueryParams,
  firstEventOnly = false,
  previousEvents: DamageEvent[] = []
): Promise<DamageEvent[]> => {
  const response = await getEventData<DamageEvent[]>(reportId, {
    ...queryParams,
    hostilityType: "Friendlies",
  });

  const { data, nextPageTimestamp } = response.reportData.report.events;

  if (firstEventOnly) {
    return [data[0]];
  }

  const allEvents = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getManifestationOfPrideDamageEvents(
      reportId,
      {
        ...queryParams,
        startTime: nextPageTimestamp,
      },
      false,
      allEvents
    );
  }

  return allEvents;
};

type ManifestationOfPrideMeta = {
  startTime: number;
  endTime: number;
  combatTime: number;
  damageTaken: Record<number, number>;
};

export const getManifestationOfPrideDamageTaken = async (
  reportId: string,
  startTime: number,
  endTime: number,
  targetId: number,
  targetInstance?: number
): Promise<ManifestationOfPrideMeta> => {
  const [{ timestamp: firstDamageDoneTimestamp }] =
    await getManifestationOfPrideDamageEvents(
      reportId,
      {
        dataType: "DamageDone",
        endTime,
        startTime,
        targetId,
        targetInstance,
      },
      true
    );

  const damageTakenEvents = await getManifestationOfPrideDamageEvents(
    reportId,
    {
      dataType: "DamageTaken",
      endTime,
      startTime,
      targetId,
      targetInstance,
    },
    false
  );

  return {
    startTime: firstDamageDoneTimestamp,
    endTime,
    combatTime: endTime - firstDamageDoneTimestamp,
    damageTaken: reduceDamageTakenToMap(damageTakenEvents, "Enemies"),
  };
};
