import type { AbsorbEvent, DamageEvent, HealEvent } from "../types";
import { chainFilterExpression, createIsSpecificEvent } from "../utils";

const BOTTLE_OF_SANGUINE_ICHOR = 357_901;
const STYGIAN_KINGS_BARBS = 357_865;
const THE_FIFTH_SKULL = 357_841;
const VOLCANIC_PLUME = 357_708;
const RAZE = 356_925;
const SEVER = 356_923;
const MASSIVE_SMASH = 355_806;
const CRUSH = 358_784;
const SEISMIC_WAVE = 358_970;
const BITING_COLD = 356_667;
const FROST_LANCE = 356_414;
const COLD_SNAP = 358_894;
const SOULFORGE_FLAMES = 355_709;
const SCORCHING_BLAST = 355_737;
const INFERNO = 358_967;
const STONE_WARD = 357_525;

export const TORMENTED = {
  damageDone: {
    STYGIAN_KINGS_BARBS,
    THE_FIFTH_SKULL,
    VOLCANIC_PLUME,
    BOTTLE_OF_SANGUINE_ICHOR,
  },
  damageTaken: {
    // heal
    RAZE,
    SEVER,
    // melee
    MASSIVE_SMASH,
    CRUSH,
    SEISMIC_WAVE,
    // frost
    BITING_COLD,
    FROST_LANCE,
    COLD_SNAP,
    // fire
    SOULFORGE_FLAMES,
    SCORCHING_BLAST,
    INFERNO,
  },
  healingDone: {
    STONE_WARD,
    BOTTLE_OF_SANGUINE_ICHOR,
  },
};

const expressions = {
  // DAMAGE DONE
  stygianKingsBarbs: `type ="damage" and ability.id = ${TORMENTED.damageDone.STYGIAN_KINGS_BARBS}`,
  volcanicPlume: `type = "damage" ability.id ${TORMENTED.damageDone.VOLCANIC_PLUME}`,
  bottleOfSanguineIchor: `ability.id = ${TORMENTED.damageDone.BOTTLE_OF_SANGUINE_ICHOR} and type IN ("damage", "heal")`,
  theFifthSkull: `type = "damage" and ability.id = ${TORMENTED.damageDone.THE_FIFTH_SKULL}`,
  // HEALING DONE
  theStoneWard: `type = "absorbed" and ability.id = ${TORMENTED.healingDone.STONE_WARD}`,
  // Bottle of Sanguine Ichor is already covered above
  // DAMAGE TAKEN
  raze: `type = "damage" and ability.id = ${TORMENTED.damageTaken.RAZE}`,
  sever: `type = "damage" and ability.id = ${TORMENTED.damageTaken.SEVER}`,
  // melee
  massiveSmash: `type = "damage" and ability.id = ${TORMENTED.damageTaken.MASSIVE_SMASH}`,
  crush: `type = "damage" and ability.id = ${TORMENTED.damageTaken.CRUSH}`,
  seismicWave: `type = "damage" and ability.id = ${TORMENTED.damageTaken.SEISMIC_WAVE}`,
  // frost
  bitingCold: `type = "damage" and ability.id = ${TORMENTED.damageTaken.BITING_COLD}`,
  frostLance: `type = "damage" and ability.id = ${TORMENTED.damageTaken.FROST_LANCE}`,
  coldSnap: `type = "damage" and ability.id = ${TORMENTED.damageTaken.COLD_SNAP}`,
  // fire
  soulforgeFlames: `type = "damage" and ability.id = ${TORMENTED.damageTaken.SOULFORGE_FLAMES}`,
  scorchingBlast: `type = "damage" and ability.id = ${TORMENTED.damageTaken.SCORCHING_BLAST}`,
  interno: `type = "damage" and ability.id = ${TORMENTED.damageTaken.INFERNO}`,
};

export const filterExpression = chainFilterExpression(
  Object.values(expressions)
);

export const isStygianKingsBarbsEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: STYGIAN_KINGS_BARBS,
});

export const isStoneWardEvent = createIsSpecificEvent<AbsorbEvent>({
  type: "absorbed",
  abilityGameID: STONE_WARD,
});

export const isBottleOfSanguineIchorHealEvent =
  createIsSpecificEvent<HealEvent>({
    type: "heal",
    abilityGameID: BOTTLE_OF_SANGUINE_ICHOR,
  });

export const isBottleOfSanguineIchorDamageEvent =
  createIsSpecificEvent<DamageEvent>({
    type: "damage",
    abilityGameID: BOTTLE_OF_SANGUINE_ICHOR,
  });

export const isInfernoDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: INFERNO,
});

export const isScorchingBlastDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: SCORCHING_BLAST,
});

export const isSoulforgeFlamesDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: SOULFORGE_FLAMES,
});

export const isColdSnapDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: COLD_SNAP,
});

export const isFrostLanceDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: FROST_LANCE,
});

export const isBitingColdDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: BITING_COLD,
});

export const isSeismicWaveDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: SEISMIC_WAVE,
});

export const isCrushDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: CRUSH,
});

export const isSeverDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: SEVER,
});

export const isRazeDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: RAZE,
});

export const isVolcanicPlumeDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: VOLCANIC_PLUME,
});

export const isTheFifthSkullDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: THE_FIFTH_SKULL,
});
