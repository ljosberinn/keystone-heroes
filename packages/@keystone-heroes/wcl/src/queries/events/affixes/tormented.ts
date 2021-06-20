import type { AbsorbEvent, DamageEvent, HealEvent } from "../types";
import { createIsSpecificEvent } from "../utils";

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

export const filterExpression = [
  `ability.id = ${TORMENTED.BOTTLE_OF_SANGUINE_ICHOR} and type in ("damage", "heal")`,
  `type = "damage" and ability.id in (${[
    ...Object.values(TORMENTED).filter(
      (id) => id !== TORMENTED.BOTTLE_OF_SANGUINE_ICHOR
    ),
  ].join(", ")})`,
];

export const isStygianKingsBarbsEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.STYGIAN_KINGS_BARBS,
});

export const isStoneWardEvent = createIsSpecificEvent<AbsorbEvent>({
  type: "absorbed",
  abilityGameID: TORMENTED.STONE_WARD,
});

export const isBottleOfSanguineIchorHealEvent =
  createIsSpecificEvent<HealEvent>({
    type: "heal",
    abilityGameID: TORMENTED.BOTTLE_OF_SANGUINE_ICHOR,
  });

export const isBottleOfSanguineIchorDamageEvent =
  createIsSpecificEvent<DamageEvent>({
    type: "damage",
    abilityGameID: TORMENTED.BOTTLE_OF_SANGUINE_ICHOR,
  });

export const isInfernoDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.INFERNO,
});

export const isScorchingBlastDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.SCORCHING_BLAST,
});

export const isSoulforgeFlamesDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.SOULFORGE_FLAMES,
});

export const isColdSnapDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.COLD_SNAP,
});

export const isFrostLanceDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.FROST_LANCE,
});

export const isBitingColdDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.BITING_COLD,
});

export const isSeismicWaveDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.SEISMIC_WAVE,
});

export const isCrushDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.CRUSH,
});

export const isSeverDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.SEVER,
});

export const isRazeDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.RAZE,
});

export const isVolcanicPlumeDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.VOLCANIC_PLUME,
});

export const isTheFifthSkullDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: TORMENTED.THE_FIFTH_SKULL,
});
