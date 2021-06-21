import { Affixes } from "@keystone-heroes/db/types";

import type {
  AbsorbEvent,
  AllTrackedEventTypes,
  DamageEvent,
  HealEvent,
} from "../types";
import { createIsSpecificEvent, reduceEventsByPlayer } from "../utils";

const BOTTLE_OF_SANGUINE_ICHOR = 357_901;

export const TORMENTED = {
  // dps powers
  STYGIAN_KINGS_BARBS: 357_865,
  THE_FIFTH_SKULL: 357_841,
  VOLCANIC_PLUME: 357_708,
  BOTTLE_OF_SANGUINE_ICHOR, // also heal
  // absorb
  STONE_WARD: 357_525,
  // heal lieutenant
  RAZE: 356_925,
  SEVER: 356_923,
  // melee lieutenant
  MASSIVE_SMASH: 355_806,
  CRUSH: 358_784,
  SEISMIC_WAVE: 358_970,
  // frost lieutenant
  BITING_COLD: 356_667,
  FROST_LANCE: 356_414,
  COLD_SNAP: 358_894,
  // fire lieutenant
  SOULFORGE_FLAMES: 355_709,
  SCORCHING_BLAST: 355_737,
  INFERNO: 358_967,
};

/**
 * @see https://www.warcraftlogs.com/reports/J3WKacdjpntmLT7C/#fight=3&type=damage-done&view=events&pins=2%24Off%24%23244F4B%24expression%24(type%20%3D%20%22damage%22%20and%20ability.id%20in%20(357865,%20357841,%20357708,%20357901,%20357525,%20356925,%20356923,%20355806,%20358784,%20358970,%20356667,%20356414,%20358894,%20355709,%20355737,%20358967))%20or%20(type%20%3D%20%22heal%22%20and%20ability.id%20%3D%20357901)
 * @example
 * ```gql
 * {
 *   reportData {
 *     report(code: "J3WKacdjpntmLT7C") {
 *       fights(fightIDs: [3]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 2948263, endTime: 4818150, filterExpression: "(type = \"damage\" and ability.id in (357865, 357841, 357708, 357901, 357525, 356925, 356923, 355806, 358784, 358970, 356667, 356414, 358894, 355709, 355737, 358967)) or (type = \"heal\" and ability.id = 357901)") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `ability.id = ${TORMENTED.BOTTLE_OF_SANGUINE_ICHOR} and type = "heal"`,
  `type = "damage" and ability.id in (${[Object.values(TORMENTED)].join(
    ", "
  )})`,
];

const isStygianKingsBarbsEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.STYGIAN_KINGS_BARBS,
});

const isStoneWardEvent = createIsSpecificEvent<AbsorbEvent>({
  type: "absorbed",
  abilityGameID: TORMENTED.STONE_WARD,
});

const isBottleOfSanguineIchorHealEvent = createIsSpecificEvent<HealEvent>({
  type: "heal",
  abilityGameID: TORMENTED.BOTTLE_OF_SANGUINE_ICHOR,
});

const isBottleOfSanguineIchorDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.BOTTLE_OF_SANGUINE_ICHOR,
});

const isInfernoDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.INFERNO,
});

const isScorchingBlastDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.SCORCHING_BLAST,
});

const isSoulforgeFlamesDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.SOULFORGE_FLAMES,
});

const isColdSnapDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.COLD_SNAP,
});

const isFrostLanceDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.FROST_LANCE,
});

const isBitingColdDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.BITING_COLD,
});

const isSeismicWaveDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.SEISMIC_WAVE,
});

const isCrushDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.CRUSH,
});

const isSeverDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.SEVER,
});

const isRazeDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.RAZE,
});

const isVolcanicPlumeDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.VOLCANIC_PLUME,
});

const isTheFifthSkullDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.THE_FIFTH_SKULL,
});

export const getTormentedEvents = (
  allEvents: AllTrackedEventTypes,
  affixSet: Set<Affixes>
): (DamageEvent | HealEvent | AbsorbEvent)[] => {
  if (!affixSet.has(Affixes.Tormented)) {
    return [];
  }

  // powers;
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
