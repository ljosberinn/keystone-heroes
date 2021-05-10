import { gql } from "graphql-request";

import { DOS_URN, SOA_SPEAR } from "../../utils/spellIds";
import { getGqlClient } from "../gqlClient";

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

type RawEventResponse = {
  reportData: {
    report: {
      events: {
        data: (
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
        )[];
        nextPageTimestamp: number | null;
      };
    };
  };
};

type RawEvents = RawEventResponse["reportData"]["report"]["events"];

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
};

const getEventData = async (reportId: string, params: EventQueryParams) => {
  const client = await getGqlClient();

  return client.request<RawEventResponse>(
    gql`
      query EventData(
        $reportId: String!
        $startTime: Float!
        $endTime: Float!
        $hostilityType: HostilityType!
        $sourceId: Int
        $dataType: EventDataType
        $abilityId: Float
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
  previousEvents: RawEvents["data"] = []
): Promise<RawEvents["data"]> => {
  const soaSpear = await spiresSpear(reportId, startTime, endTime);
  const urn = await dosUrn(reportId, startTime, endTime);
  console.log({ soaSpear, urn });

  try {
    const json = await getEventData(reportId, {
      startTime,
      endTime,
      sourceId,
      dataType: "Casts",
      hostilityType: "Friendlies",
    });

    const { data, nextPageTimestamp } = json.reportData.report.events;
    const nextEvents = [...previousEvents, ...data];

    console.log(nextEvents.length);

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
  } catch (error) {
    console.trace(error);
    return previousEvents;
  }
};

const spiresSpear = async (
  reportId: string,
  startTime: number,
  endTime: number
): Promise<ApplyDebuffEvent[]> => {
  try {
    const json = await getEventData(reportId, {
      startTime,
      endTime,
      dataType: "Debuffs",
      hostilityType: "Enemies",
      abilityId: SOA_SPEAR,
    });

    return json.reportData.report.events.data.filter(
      (event): event is ApplyDebuffEvent => event.type === "applydebuff"
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

const dosUrn = async (
  reportId: string,
  startTime: number,
  endTime: number
): Promise<ApplyDebuffEvent[]> => {
  try {
    const json = await getEventData(reportId, {
      startTime,
      endTime,
      dataType: "Debuffs",
      hostilityType: "Enemies",
      abilityId: DOS_URN,
    });

    return json.reportData.report.events.data.filter(
      (event): event is ApplyDebuffEvent => event.type === "applydebuff"
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};
