import { DungeonIDs, remarkableSpellIDs } from "@keystone-heroes/db/data";
import { Affixes } from "@keystone-heroes/db/types";

import { filterProfessionEvents } from "../events/other";
import type {
  AnyEvent,
  ApplyDebuffEvent,
  DamageEvent,
  DeathEvent,
} from "../events/types";
import {
  sanguineFilterExpression,
  explosiveFilterExpression,
  grievousFilterExpression,
  necroticFilterExpression,
  volcanicFilterExpression,
  burstingFilterExpression,
  spitefulFilterExpression,
  quakingFilterExpression,
  stormingFilterExpression,
  bolsteringFilterExpression,
  tormentedFilterExpression,
  isStygianKingsBarbsEvent,
  isTheFifthSkullDamageEvent,
  isBottleOfSanguineIchorDamageEvent,
  isBottleOfSanguineIchorHealEvent,
  isVolcanicPlumeDamageEvent,
  isStoneWardEvent,
  isInfernoDamageEvent,
  isScorchingBlastDamageEvent,
  isSoulforgeFlamesDamageEvent,
  isColdSnapDamageEvent,
  isFrostLanceDamageEvent,
  isBitingColdDamageEvent,
  isSeismicWaveDamageEvent,
  isCrushDamageEvent,
  isSeverDamageEvent,
  isRazeDamageEvent,
  isStormingEvent,
  isSpitefulDamageEvent,
  isSanguineDamageEvent,
  reduceHealingDoneBySanguine,
  isSanguineHealEvent,
  isVolcanicEvent,
  isQuakingDamageEvent,
  isQuakingInterruptEvent,
  getHighestBolsteringStack,
  isBolsteringEvent,
  isBurstingEvent,
  isExplosiveDamageEvent,
  isExplosiveDeathEvent,
  isGrievousDamageEvent,
  getHighestNecroticStack,
  isNecroticStackEvent,
  isNecroticDamageEvent,
} from "./affixes";
import {
  dosFilterExpression,
  hoaFilterExpression,
  isDosUrnEvent,
  isHoaGargoyleEvent,
  isNwHammerEvent,
  isNwKyrianOrbDamageEvent,
  isNwKyrianOrbHealEvent,
  isNwOrbEvent,
  isNwSpearEvent,
  isPfSlimeBuffEvent,
  isPfSlimeDeathEvent,
  isSdLanternBuffEvent,
  isSdLanternOpeningEvent,
  isSoaSpearEvent,
  isTopBannerAuraEvent,
  nwFilterExpression,
  nwOrbReducer,
  nwSpearReducer,
  pfFilterExpression,
  sdFilterExpression,
  soaFilterExpression,
  soaSpearReducer,
  topFilterExpression,
} from "./dungeons/shadowlands";
import { recursiveGetEvents, reduceEventsByPlayer } from "./utils";

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

const affixExpressionMap: Record<AffixWithEvents, string[]> = {
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
    .flatMap((affix) => affixExpressionMap[affix]);

  return [...baseExpressions, ...dungeonExpressions, ...affixExpressions]
    .flat()
    .map((part) => `(${part})`)
    .join(" or ");
};

const filterDungeonEvents = (allEvents: AnyEvent[], dungeonID: DungeonIDs) => {
  switch (dungeonID) {
    case DungeonIDs.DE_OTHER_SIDE:
      return allEvents.filter(isDosUrnEvent);
    case DungeonIDs.HALLS_OF_ATONEMENT:
      return allEvents.filter(isHoaGargoyleEvent);
    case DungeonIDs.THE_NECROTIC_WAKE:
      return [
        ...allEvents
          .filter(isNwSpearEvent)
          .reduce<DamageEvent[][]>(nwSpearReducer, [])
          .flatMap((chunk) => reduceEventsByPlayer(chunk, "sourceID")),
        ...allEvents
          .filter(isNwOrbEvent)
          .reduce<DamageEvent[][]>(nwOrbReducer, [])
          .flatMap((chunk) => reduceEventsByPlayer(chunk, "sourceID")),
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
      return (
        allEvents
          .filter(isSoaSpearEvent)
          .reduce<ApplyDebuffEvent[][]>(soaSpearReducer, [])
          // pick only the first event of each chunk,
          // indicating when the spear was used
          .flatMap((chunk) => chunk[0])
      );
    default:
      return [];
  }
};

const filterTormentedEvents = (allEvents: AnyEvent[]) => {
  // powers
  const stygianKingsBarbs = reduceEventsByPlayer(
    allEvents.filter(isStygianKingsBarbsEvent),
    "sourceID"
  );
  const theFifthSkulL = reduceEventsByPlayer(
    allEvents.filter(isTheFifthSkullDamageEvent),
    "sourceID"
  );
  const bottleOfSanguineIchorDamage = reduceEventsByPlayer(
    allEvents.filter(isBottleOfSanguineIchorDamageEvent),
    "sourceID"
  );
  const bottleOfSanguineIchorHeal = reduceEventsByPlayer(
    allEvents.filter(isBottleOfSanguineIchorHealEvent),
    "sourceID"
  );
  const volcanicPlume = reduceEventsByPlayer(
    allEvents.filter(isVolcanicPlumeDamageEvent),
    "sourceID"
  );
  const stoneWard = reduceEventsByPlayer(
    allEvents.filter(isStoneWardEvent),
    "sourceID"
  );

  // lieutenant abilities
  const infernoDamageEvent = reduceEventsByPlayer(
    allEvents.filter(isInfernoDamageEvent),
    "targetID"
  );
  const scorchingBlast = reduceEventsByPlayer(
    allEvents.filter(isScorchingBlastDamageEvent),
    "targetID"
  );
  const soulforgeFlame = reduceEventsByPlayer(
    allEvents.filter(isSoulforgeFlamesDamageEvent),
    "targetID"
  );
  const coldSnap = reduceEventsByPlayer(
    allEvents.filter(isColdSnapDamageEvent),
    "targetID"
  );
  const frostLance = reduceEventsByPlayer(
    allEvents.filter(isFrostLanceDamageEvent),
    "targetID"
  );
  const bitingCold = reduceEventsByPlayer(
    allEvents.filter(isBitingColdDamageEvent),
    "targetID"
  );
  const seismicWave = reduceEventsByPlayer(
    allEvents.filter(isSeismicWaveDamageEvent),
    "targetID"
  );
  const crush = reduceEventsByPlayer(
    allEvents.filter(isCrushDamageEvent),
    "targetID"
  );
  const sever = reduceEventsByPlayer(
    allEvents.filter(isSeverDamageEvent),
    "targetID"
  );
  const raze = reduceEventsByPlayer(
    allEvents.filter(isRazeDamageEvent),
    "targetID"
  );

  return [
    ...stygianKingsBarbs,
    ...bottleOfSanguineIchorDamage,
    ...bottleOfSanguineIchorHeal,
    ...infernoDamageEvent,
    ...volcanicPlume,
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
  const sanguineHeal = hasSanguine
    ? reduceHealingDoneBySanguine(allEvents.filter(isSanguineHealEvent))
    : [];
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
    ? getHighestBolsteringStack(allEvents.filter(isBolsteringEvent))
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
    ? getHighestNecroticStack(allEvents.filter(isNecroticStackEvent))
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
