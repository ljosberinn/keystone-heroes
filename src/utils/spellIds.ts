import { classes } from "../../prisma/classes";

export const NW_KYRIAN_ORB_HEAL = 344_422;
export const NW_KYRIAN_ORB_DAMAGE = 344_421;
export const NW_SPEAR = 328_351;
export const NW_HAMMER = 328_128;
export const NW_ORB = 328_406;

export const SOA_SPEAR = 339_917;

export const DOS_URN = 228_626;
export const HOA_GARGOYLE = 342_171;

export const CARDBOARD_ASSASSIN = 51_229;

export const DIMENSIONAL_SHIFTER = 321_422;
export const POTION_OF_THE_HIDDEN_SPIRIT = 307_195;

export const SD_LANTERN_OPENING = 340_013;
export const SD_LANTERN_BUFF = 340_433;

export const SANGUINE_ICHOR_HEALING = 226_510;
export const SANGUINE_ICHOR_DAMAGE = 226_512;

export const GRIEVOUS_WOUND = 240_559;

export const EXPLOSIVES = 120_651;
export const EXPLOSION = 240_446;

// highest stack, total dmg taken, total healing reduced(?)
export const NECROTIC = 209_858;
// total dmg taken
export const STORMING = 343_520;
// total dmg taken
export const VOLCANIC = 209_862;
// highest stack
export const BOLSTERING = 209_859;
// total dmg taken; must filter for enemyNpcId first
export const SPITEFUL = 174_773;
// highest stacks, total dmg taken
export const BURSTING = 243_237;
// highest dmg taken within a fight; total dmg taken, fastest, slowest
export const PRIDEFUL = 342_332;
// total dmg taken, interrupt count
export const QUAKING = 240_448;

// profession specific
//  DRUMS
//  DISPOSABLE_SPECTROPHASIC_REANIMATOR

export const remarkableSpellIds = new Set(
  classes.reduce<number[]>((acc, data) => {
    const allSharedCooldownIds = data.cooldowns.map((cooldown) => cooldown.id);
    const allSpecCooldownIds = data.specs.flatMap((spec) =>
      spec.cooldowns.map((cooldown) => cooldown.id)
    );
    const allCovenantIds = data.covenantAbilities.map((ability) => ability.id);

    return [
      ...acc,
      ...allSharedCooldownIds,
      ...allSpecCooldownIds,
      ...allCovenantIds,
    ];
  }, [])
);
