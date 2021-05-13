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
  EXPLOSIVES,
  EXPLOSION,
} from "../../utils/spellIds";
import { getGqlClient } from "../gqlClient";
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

type ApplyBuffEvent = Event<{
  type: "applybuff";
  sourceID: number;
  sourceInstance: number;
  targetID: number;
  targetInstance: number;
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
  | DeathEvent;

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

export const getTotalDamageTakenBySanguine = async (
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

  return allEvents.reduce(
    (acc, event) => acc + event.amount - (event.absorbed ?? 0),
    0
  );
};

export const getTotalDamageTakenByGrievousWound = async (
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

  return allEvents.reduce((acc, event) => acc + event.amount, 0);
};

export const getExplosiveId = async (
  reportId: string,
  fightId: number
): Promise<number | null> => {
  const response = await getEnemyNpcIds(reportId, [fightId]);

  return (
    response.reportData.report.fights[0].enemyNPCs.find(
      (npc) => npc.gameID === EXPLOSIVES
    )?.id ?? null
  );
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

  return allEvents.reduce((acc, event) => acc + event.amount, 0);
};
