import { DungeonIDs, remarkableSpellIDs } from "@keystone-heroes/db/data";
import { Affixes } from "@keystone-heroes/db/types";

import type { DeathEvent } from "..";
import {
  isEngineeringBattleRezEvent,
  isInvisibilityEvent,
  isLeatherworkingDrumsEvent,
} from "..";
import type { AnyEvent } from "../events/types";
import {
  filterExpression as bolsteringFilterExpression,
  isBolsteringEvent,
} from "./affixes/bolstering";
import {
  filterExpression as burstingFilterExpression,
  isBurstingEvent,
} from "./affixes/bursting";
import {
  filterExpression as explosiveFilterExpression,
  isExplosiveDamageEvent,
  isExplosiveDeathEvent,
} from "./affixes/explosive";
import {
  filterExpression as grievousFilterExpression,
  isGrievousDamageEvent,
} from "./affixes/grievous";
import {
  filterExpression as necroticFilterExpression,
  isNecroticDamageEvent,
  isNecroticStackEvent,
} from "./affixes/necrotic";
import {
  filterExpression as quakingFilterExpression,
  isQuakingDamageEvent,
  isQuakingInterruptEvent,
} from "./affixes/quaking";
import {
  filterExpression as sanguineFilterExpression,
  isSanguineDamageEvent,
  isSanguineHealEvent,
} from "./affixes/sanguine";
import {
  filterExpression as spitefulFilterExpression,
  isSpitefulDamageEvent,
} from "./affixes/spiteful";
import {
  filterExpression as stormingFilterExpression,
  isStormingEvent,
} from "./affixes/storming";
import {
  filterExpression as tormentedFilterExpression,
  isBitingColdDamageEvent,
  isBottleOfSanguineIchorDamageEvent,
  isBottleOfSanguineIchorHealEvent,
  isColdSnapDamageEvent,
  isCrushDamageEvent,
  isFrostLanceDamageEvent,
  isInfernoDamageEvent,
  isRazeDamageEvent,
  isScorchingBlastDamageEvent,
  isSeismicWaveDamageEvent,
  isSeverDamageEvent,
  isSoulforgeFlamesDamageEvent,
  isStoneWardEvent,
  isStygianKingsBarbsEvent,
  isTheFifthSkullDamageEvent,
} from "./affixes/tormented";
import {
  filterExpression as volcanicFilterExpression,
  isVolcanicEvent,
} from "./affixes/volcanic";
import {
  filterExpression as dosFilterExpression,
  isDosUrnEvent,
} from "./dungeons/shadowlands/dos";
import {
  filterExpression as hoaFilterExpression,
  isHoaGargoyleEvent,
} from "./dungeons/shadowlands/hoa";
import {
  filterExpression as nwFilterExpression,
  isNwHammerEvent,
  isNwKyrianOrbDamageEvent,
  isNwKyrianOrbHealEvent,
  isNwOrbEvent,
  isNwSpearEvent,
} from "./dungeons/shadowlands/nw";
import {
  filterExpression as pfFilterExpression,
  isPfSlimeBuffEvent,
  isPfSlimeDeathEvent,
} from "./dungeons/shadowlands/pf";
import {
  filterExpression as sdFilterExpression,
  isSdLanternBuffEvent,
  isSdLanternOpeningEvent,
} from "./dungeons/shadowlands/sd";
import {
  filterExpression as soaFilterExpression,
  isSoaSpearEvent,
} from "./dungeons/shadowlands/soa";
import {
  filterExpression as topFilterExpression,
  isTopBannerAuraEvent,
} from "./dungeons/shadowlands/top";
import {
  chainFilterExpression,
  recursiveGetEvents,
  reduceEventsByPlayer,
} from "./utils";

export * from "./other";
export * from "./types";

export type EventParams = {
  reportID: string;
  startTime: number;
  endTime: number;
  dungeonID: DungeonIDs;
  fightID: number;
  affixes: Affixes[];
};

type DungeonWithEvents = Exclude<DungeonIDs, DungeonIDs.MISTS_OF_TIRNA_SCITHE>;

const isDungeonWithEvent = (id: DungeonIDs): id is DungeonWithEvents =>
  id in dungeonExpressionMap;

// TODO: feign false doesnt work?
// TODO: killerID missing
const deathFilterExpression =
  'target.type = "player" and type = "death" and source.type = "npc" and feign = false';
const remarkableSpellFilterExpression = `source.type = "player" and type = "cast" and ability.id IN (${[
  ...remarkableSpellIDs,
].join(", ")})`;

const baseExpressions = [
  deathFilterExpression,
  remarkableSpellFilterExpression,
];

const dungeonExpressionMap: Record<DungeonWithEvents, string[]> = {
  [DungeonIDs.DE_OTHER_SIDE]: dosFilterExpression,
  [DungeonIDs.HALLS_OF_ATONEMENT]: hoaFilterExpression,
  [DungeonIDs.PLAGUEFALL]: pfFilterExpression,
  [DungeonIDs.SANGUINE_DEPTHS]: sdFilterExpression,
  [DungeonIDs.SPIRES_OF_ASCENSION]: soaFilterExpression,
  [DungeonIDs.THEATRE_OF_PAIN]: topFilterExpression,
  [DungeonIDs.THE_NECROTIC_WAKE]: nwFilterExpression,
};

type AffixWithEvents = Exclude<
  Affixes,
  | "Awakened"
  | "Beguiling"
  | "Tyrannical"
  | "Fortified"
  | "Prideful"
  | "Raging"
  | "Infested"
  | "Inspiring"
  | "Reaping"
  | "Skittish"
>;

const affixExpressionMap: Record<AffixWithEvents, string> = {
  [Affixes.Sanguine]: sanguineFilterExpression,
  [Affixes.Explosive]: explosiveFilterExpression,
  [Affixes.Grievous]: grievousFilterExpression,
  [Affixes.Necrotic]: necroticFilterExpression,
  [Affixes.Volcanic]: volcanicFilterExpression,
  [Affixes.Bursting]: burstingFilterExpression,
  [Affixes.Spiteful]: spitefulFilterExpression,
  [Affixes.Quaking]: quakingFilterExpression,
  [Affixes.Storming]: stormingFilterExpression,
  [Affixes.Bolstering]: bolsteringFilterExpression,
  [Affixes.Tormented]: tormentedFilterExpression,
};

const generateFilterExpression = ({
  dungeonID,
  affixes,
}: Pick<EventParams, "dungeonID" | "affixes">) => {
  const dungeonExpressions = isDungeonWithEvent(dungeonID)
    ? dungeonExpressionMap[dungeonID]
    : [];

  const affixExpressions = affixes
    .filter((affix): affix is AffixWithEvents => affix in affixExpressionMap)
    .map((affix) => affixExpressionMap[affix]);

  return chainFilterExpression(
    [...baseExpressions, ...dungeonExpressions, ...affixExpressions].flat()
  );
};

const filterDungeonEvents = (allEvents: AnyEvent[], dungeonID: DungeonIDs) => {
  switch (dungeonID) {
    case DungeonIDs.DE_OTHER_SIDE:
      return allEvents.filter(isDosUrnEvent);
    case DungeonIDs.HALLS_OF_ATONEMENT:
      return allEvents.filter(isHoaGargoyleEvent);
    case DungeonIDs.THE_NECROTIC_WAKE:
      return [
        ...allEvents.filter(isNwSpearEvent),
        ...allEvents.filter(isNwOrbEvent),
        ...allEvents.filter(isNwHammerEvent),
        ...allEvents.filter(isNwKyrianOrbDamageEvent),
        ...allEvents.filter(isNwKyrianOrbHealEvent),
      ];
    case DungeonIDs.PLAGUEFALL:
      return [
        ...allEvents.filter(isPfSlimeDeathEvent),
        ...allEvents.filter(isPfSlimeBuffEvent),
      ];
    case DungeonIDs.SANGUINE_DEPTHS:
      return [
        ...allEvents.filter(isSdLanternBuffEvent),
        ...allEvents.filter(isSdLanternOpeningEvent),
      ];
    case DungeonIDs.THEATRE_OF_PAIN:
      return allEvents.filter(isTopBannerAuraEvent);
    case DungeonIDs.SPIRES_OF_ASCENSION:
      return allEvents.filter(isSoaSpearEvent);
    default:
      return [];
  }
};

const filterTormentedEvents = (allEvents: AnyEvent[]) => {
  const stygianKingsBarbs = allEvents.filter(isStygianKingsBarbsEvent);
  const bottleOfSanguineIchorDamage = allEvents.filter(
    isBottleOfSanguineIchorDamageEvent
  );
  const bottleOfSanguineIchorHeal = allEvents.filter(
    isBottleOfSanguineIchorHealEvent
  );
  const infernoDamageEvent = allEvents.filter(isInfernoDamageEvent);
  const scorchingBlast = allEvents.filter(isScorchingBlastDamageEvent);
  const soulforgeFlame = allEvents.filter(isSoulforgeFlamesDamageEvent);
  const coldSnap = allEvents.filter(isColdSnapDamageEvent);
  const frostLance = allEvents.filter(isFrostLanceDamageEvent);
  const bitingCold = allEvents.filter(isBitingColdDamageEvent);
  const seismicWave = allEvents.filter(isSeismicWaveDamageEvent);
  const crush = allEvents.filter(isCrushDamageEvent);
  const sever = allEvents.filter(isSeverDamageEvent);
  const raze = allEvents.filter(isRazeDamageEvent);
  const theFifthSkulL = allEvents.filter(isTheFifthSkullDamageEvent);
  const stoneWard = allEvents.filter(isStoneWardEvent);

  return [
    ...stygianKingsBarbs,
    ...bottleOfSanguineIchorDamage,
    ...bottleOfSanguineIchorHeal,
    ...infernoDamageEvent,
    ...scorchingBlast,
    ...soulforgeFlame,
    ...coldSnap,
    ...frostLance,
    ...bitingCold,
    ...crush,
    ...sever,
    ...raze,
    ...theFifthSkulL,
    ...stoneWard,
    ...seismicWave,
  ];
};

const filterAffixEvents = (
  allEvents: AnyEvent[],
  affixes: EventParams["affixes"]
) => {
  const affixSet = new Set(affixes);

  // seasonal
  console.time("filterTormentedEvents");
  const tormentedEvents = affixSet.has(Affixes.Tormented)
    ? filterTormentedEvents(allEvents)
    : [];
  console.timeEnd("filterTormentedEvents");

  // common affixes
  console.time("filter common affixes");
  const hasSanguine = affixSet.has(Affixes.Sanguine);
  const hasQuaking = affixSet.has(Affixes.Quaking);
  const hasNecrotic = affixSet.has(Affixes.Necrotic);
  const hasExplosive = affixSet.has(Affixes.Explosive);

  const storming = affixSet.has(Affixes.Storming)
    ? reduceEventsByPlayer(allEvents.filter(isStormingEvent), "targetID")
    : [];
  const spiteful = affixSet.has(Affixes.Spiteful)
    ? reduceEventsByPlayer(allEvents.filter(isSpitefulDamageEvent), "targetID")
    : [];
  const sanguineDamage = hasSanguine
    ? reduceEventsByPlayer(allEvents.filter(isSanguineDamageEvent), "targetID")
    : [];
  const sanguineHeal = hasSanguine ? allEvents.filter(isSanguineHealEvent) : [];
  const volcanic = affixSet.has(Affixes.Volcanic)
    ? reduceEventsByPlayer(allEvents.filter(isVolcanicEvent), "targetID")
    : [];

  const quakingDamage = hasQuaking
    ? reduceEventsByPlayer(allEvents.filter(isQuakingDamageEvent), "targetID")
    : [];
  const quakingInterrupts = hasQuaking
    ? allEvents.filter(isQuakingInterruptEvent)
    : [];
  const bolstering = affixSet.has(Affixes.Bolstering)
    ? allEvents.filter(isBolsteringEvent)
    : [];
  const bursting = affixSet.has(Affixes.Bursting)
    ? reduceEventsByPlayer(allEvents.filter(isBurstingEvent), "targetID")
    : [];
  const explosiveDamage = hasExplosive
    ? reduceEventsByPlayer(allEvents.filter(isExplosiveDamageEvent), "targetID")
    : [];
  const explosiveKills = hasExplosive
    ? allEvents.filter(isExplosiveDeathEvent)
    : [];

  const grievous = affixSet.has(Affixes.Grievous)
    ? reduceEventsByPlayer(allEvents.filter(isGrievousDamageEvent), "targetID")
    : [];
  const necroticStacks = hasNecrotic
    ? allEvents.filter(isNecroticStackEvent)
    : [];
  const necroticDamage = hasNecrotic
    ? reduceEventsByPlayer(allEvents.filter(isNecroticDamageEvent), "targetID")
    : [];
  console.timeEnd("filter common affixes");

  return [
    ...tormentedEvents,
    ...storming,
    ...spiteful,
    ...sanguineDamage,
    ...sanguineHeal,
    ...volcanic,
    ...quakingDamage,
    ...quakingInterrupts,
    ...bolstering,
    ...bursting,
    ...explosiveDamage,
    ...explosiveKills,
    ...grievous,
    ...necroticStacks,
    ...necroticDamage,
  ];
};

const filterProfessionEvents = (allEvents: AnyEvent[]) => {
  const leatherworkingDrums = allEvents.filter(isLeatherworkingDrumsEvent);
  const invisibility = allEvents.filter(isInvisibilityEvent);
  const engineeringBattleRez = allEvents.filter(isEngineeringBattleRezEvent);

  return [...leatherworkingDrums, ...invisibility, ...engineeringBattleRez];
};

const filterRemarkableSpellEvents = (allEvents: AnyEvent[]) => {
  return allEvents.filter(
    (event) =>
      event.type === "cast" && remarkableSpellIDs.has(event.abilityGameID)
  );
};

const filterPlayerDeathEvents = (
  allEvents: AnyEvent[],
  actorIDSet: Set<number>
) => {
  return allEvents.filter(
    (event): event is DeathEvent =>
      event.type === "death" && actorIDSet.has(event.targetID)
  );
};

export const getEvents = async (
  params: EventParams,
  actorIDSet: Set<number>
): Promise<{ allEvents: AnyEvent[]; playerDeathEvents: DeathEvent[] }> => {
  const filterExpression = generateFilterExpression({
    dungeonID: params.dungeonID,
    affixes: params.affixes,
  });

  console.time(`getEvents.recursiveGetEvents-${params.reportID}`);
  const allEvents = await recursiveGetEvents({
    startTime: params.startTime,
    endTime: params.endTime,
    reportID: params.reportID,
    filterExpression,
  });
  console.timeEnd(`getEvents.recursiveGetEvents-${params.reportID}`);

  console.time(`filterDungeonEvents-${params.reportID}`);
  const dungeonEvents = filterDungeonEvents(allEvents, params.dungeonID);
  console.timeEnd(`filterDungeonEvents-${params.reportID}`);
  console.time(`filterAffixEvents-${params.reportID}`);
  const affixEvents = filterAffixEvents(allEvents, params.affixes);
  console.timeEnd(`filterAffixEvents-${params.reportID}`);
  console.time(`filterProfessionEvents-${params.reportID}`);
  const professionEvents = filterProfessionEvents(allEvents);
  console.timeEnd(`filterProfessionEvents-${params.reportID}`);

  console.time(`remarkableSpellEvents-${params.reportID}`);
  const remarkableSpellEvents = filterRemarkableSpellEvents(allEvents);
  console.timeEnd(`remarkableSpellEvents-${params.reportID}`);

  console.time(`filterPlayerDeathEvents-${params.reportID}`);
  const playerDeathEvents = filterPlayerDeathEvents(allEvents, actorIDSet);
  console.timeEnd(`filterPlayerDeathEvents-${params.reportID}`);

  return {
    allEvents: [
      ...professionEvents,
      ...dungeonEvents,
      ...affixEvents,
      ...remarkableSpellEvents,
      ...playerDeathEvents,
    ].sort((a, b) => a.timestamp - b.timestamp),
    playerDeathEvents,
  };
};
