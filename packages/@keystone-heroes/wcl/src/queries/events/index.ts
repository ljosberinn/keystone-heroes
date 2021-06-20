import { DungeonIDs, remarkableSpellIDs } from "@keystone-heroes/db/data";
import { PlayableClass, Affixes } from "@keystone-heroes/db/types";

import { filterProfessionEvents } from "../events/other";
import type {
  AnyEvent,
  ApplyDebuffEvent,
  CastEvent,
  DamageEvent,
  DeathEvent,
} from "../events/types";
import {
  filterExpression as bolsteringFilterExpression,
  getHighestBolsteringStack,
  isBolsteringEvent,
} from "./affixes/bolstering";
import {
  filterExpression as burstingFilterExpression,
  isBurstingEvent,
} from "./affixes/bursting";
import {
  createIsExplosiveDeathEvent,
  filterExpression as explosiveFilterExpression,
  findExplosiveTargetID,
  isExplosiveDamageEvent,
} from "./affixes/explosive";
import {
  filterExpression as grievousFilterExpression,
  isGrievousDamageEvent,
} from "./affixes/grievous";
import {
  filterExpression as necroticFilterExpression,
  getHighestNecroticStack,
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
  reduceHealingDoneBySanguine,
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
  isVolcanicPlumeDamageEvent,
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
  nwOrbReducer,
  nwSpearReducer,
} from "./dungeons/shadowlands/nw";
import {
  filterExpression as pfFilterExpression,
  isPfPlagueBombDamageEvent,
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
  soaSpearReducer,
} from "./dungeons/shadowlands/soa";
import {
  filterExpression as topFilterExpression,
  isTopBannerAuraEvent,
} from "./dungeons/shadowlands/top";
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
const deathFilterExpression =
  'target.type = "player" and type = "death" and feign = false';
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

const filterDungeonEvents = (
  allEvents: AnyEvent[],
  dungeonID: DungeonIDs,
  playerMetaInformation: Parameters<typeof getEvents>[1]
) => {
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
    case DungeonIDs.PLAGUEFALL: {
      const actorIDSet = new Set(
        playerMetaInformation.map((player) => player.actorID)
      );

      const plagueBombDamageEvents = allEvents.filter(
        isPfPlagueBombDamageEvent
      );

      const plagueBombDamageTakenEvents = reduceEventsByPlayer(
        plagueBombDamageEvents.filter((event) =>
          actorIDSet.has(event.targetID)
        ),
        "targetID"
      );
      const plagueBombDamageDoneEvents = plagueBombDamageEvents.filter(
        (event) => !actorIDSet.has(event.targetID)
      );

      const aggregatedPlagueBombDamageEvent =
        plagueBombDamageDoneEvents.length > 0
          ? plagueBombDamageDoneEvents.reduce((acc, event) => {
              if (acc === event) {
                return acc;
              }

              return {
                ...acc,
                amount: acc.amount + event.amount - (event.overkill ?? 0),
              };
            }, plagueBombDamageDoneEvents[0])
          : null;

      return [
        ...allEvents.filter((event) => isPfSlimeDeathEvent(event, actorIDSet)),
        ...allEvents.filter(isPfSlimeBuffEvent),
        ...plagueBombDamageTakenEvents,
        ...(aggregatedPlagueBombDamageEvent
          ? [aggregatedPlagueBombDamageEvent]
          : []),
      ];
    }
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

  const explosiveTargetID = hasExplosive
    ? findExplosiveTargetID(allEvents)
    : null;

  console.log({ explosiveTargetID });

  if (hasExplosive && !explosiveTargetID) {
    console.error("could not determine targetID for explosives");
  }

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
  const explosiveKills =
    hasExplosive && explosiveTargetID
      ? allEvents.filter(createIsExplosiveDeathEvent(explosiveTargetID))
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

const filterRemarkableSpellEvents = (allEvents: AnyEvent[]): CastEvent[] => {
  return allEvents.filter(
    (event): event is CastEvent =>
      event.type === "cast" && remarkableSpellIDs.has(event.abilityGameID)
  );
};

const filterPlayerDeathEvents = (
  allEvents: AnyEvent[],
  playerMetaInformation: Parameters<typeof getEvents>[1],
  remarkableSpellEvents: CastEvent[]
): DeathEvent[] => {
  const actorIDSet = new Set(
    playerMetaInformation.map((dataset) => dataset.actorID)
  );

  const hunter = playerMetaInformation.find(
    (player) => player.class === PlayableClass.Hunter
  );

  const deathEvents = allEvents.filter((event): event is DeathEvent => {
    return (
      event.type === "death" &&
      actorIDSet.has(event.targetID) &&
      event.sourceID === -1
    );
  });

  if (!hunter) {
    return deathEvents;
  }

  const hunterDeaths = deathEvents.filter(
    (event) => event.targetID === hunter.actorID
  );

  if (hunterDeaths.length === 0) {
    return deathEvents;
  }

  return deathEvents.filter((event) => {
    const isHunterDeath = hunterDeaths.includes(event);

    if (!isHunterDeath) {
      return true;
    }

    const nextHunterCD = remarkableSpellEvents.find((e) => {
      return e.sourceID === event.targetID && e.timestamp > event.timestamp;
    });

    if (!nextHunterCD) {
      return true;
    }

    // assume a hunter feigned if he used a cd within the next 2 seconds
    // could alternatively be solved by querying
    // hostilityType: Friendlies, dataType: Deaths
    // once separately...
    return nextHunterCD.timestamp - event.timestamp >= 2000;
  });
};

export const getEvents = async (
  params: EventParams,
  playerMetaInformation: { actorID: number; class: PlayableClass }[]
): Promise<{ allEvents: AnyEvent[]; playerDeathEvents: DeathEvent[] }> => {
  const filterExpression = generateFilterExpression({
    dungeonID: params.dungeonID,
    affixes: params.affixes,
  });

  console.log(filterExpression);

  console.time(`getEvents.recursiveGetEvents-${params.reportID}`);
  const allEvents = await recursiveGetEvents({
    startTime: params.startTime,
    endTime: params.endTime,
    reportID: params.reportID,
    filterExpression,
  });
  console.timeEnd(`getEvents.recursiveGetEvents-${params.reportID}`);

  console.time(`filterDungeonEvents-${params.reportID}`);
  const dungeonEvents = filterDungeonEvents(
    allEvents,
    params.dungeonID,
    playerMetaInformation
  );
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
  const playerDeathEvents = filterPlayerDeathEvents(
    allEvents,
    playerMetaInformation,
    remarkableSpellEvents
  );
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
