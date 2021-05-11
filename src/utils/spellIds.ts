import { classes } from "../../prisma/classes";

export const NW_KYRIAN_ORB_HEAL = 344_422;
export const NW_KYRIAN_ORB_DAMAGE = 344_421;
export const NW_SPEAR = 328_351;
export const NW_HAMMER = 328_128;
export const NW_ORB = 328_406;

export const SOA_SPEAR = 339_917;

export const DOS_URN = 228_626;

export const CARDBOARD_ASSASSIN = 51_229;

// const DIMENSIONAL_SHIFTER = 1;

// profession specific
//  CARDBOARD_ASSASSIN
//  DRUMS
//  DISPOSABLE_SPECTROPHASIC_REANIMATOR

//  // dungeon specific

//  HOA_GARGOYLE

//  SD_LANTERN

//  // affix specific
//  HEALING_BY_SANGUINE
//  EXPLOSIVE_KILLS // with meta: amount per role

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
