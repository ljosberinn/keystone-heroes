import type { UIFight } from "../pages/report/[id]";

export const affixes = {
  2: {
    name: "Skittish",
    icon: "spell_magic_lesserinvisibilty.jpg",
    seasonal: false,
  },
  3: { name: "Volcanic", icon: "spell_shaman_lavasurge.jpg", seasonal: false },
  4: {
    name: "Necrotic",
    icon: "spell_deathknight_necroticplague.jpg",
    seasonal: false,
  },
  6: {
    name: "Raging",
    icon: "ability_warrior_focusedrage.jpg",
    seasonal: false,
  },
  7: {
    name: "Bolstering",
    icon: "ability_warrior_battleshout.jpg",
    seasonal: false,
  },
  8: { name: "Sanguine", icon: "spell_shadow_bloodboil.jpg", seasonal: false },
  9: {
    name: "Tyrannical",
    icon: "achievement_boss_archaedas.jpg",
    seasonal: false,
  },
  10: { name: "Fortified", icon: "ability_toughness.jpg", seasonal: false },
  11: {
    name: "Bursting",
    icon: "ability_ironmaidens_whirlofblood.jpg",
    seasonal: false,
  },
  12: { name: "Grievous", icon: "ability_backstab.jpg", seasonal: false },
  13: {
    name: "Explosive",
    icon: "spell_fire_felflamering_red.jpg",
    seasonal: false,
  },
  14: { name: "Quaking", icon: "spell_nature_earthquake.jpg", seasonal: false },
  16: {
    name: "Infested",
    icon: "achievement_nazmir_boss_ghuun.jpg",
    seasonal: true,
  },
  117: {
    name: "Reaping",
    icon: "ability_racial_embraceoftheloa_bwonsomdi.jpg",
    seasonal: true,
  },
  119: {
    name: "Beguiling",
    icon: "spell_shadow_mindshear.jpg",
    seasonal: true,
  },
  120: {
    name: "Awakened",
    icon: "trade_archaeology_nerubian_obelisk.jpg",
    seasonal: true,
  },
  121: {
    name: "Prideful",
    icon: "spell_animarevendreth_buff.jpg",
    seasonal: true,
  },
  122: {
    name: "Inspiring",
    icon: "spell_holy_prayerofspirit.jpg",
    seasonal: false,
  },
  123: {
    name: "Spiteful",
    icon: "spell_holy_prayerofshadowprotection.jpg",
    seasonal: false,
  },
  124: { name: "Storming", icon: "spell_nature_cyclone.jpg", seasonal: false },
} as const;

export type Affixes = typeof affixes;
export type Affix = Affixes[keyof Affixes];
export type SeasonalAffixes = Extract<Affix, { seasonal: true }>;
export type RegularAffixes = Extract<Affix, { seasonal: false }>;
export type AffixIds = keyof Affixes;

type PickByValues<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]-?: T[K];
};

export type SeasonalAffixIds = keyof PickByValues<Affixes, { seasonal: true }>;
export type RegularAffixIds = keyof PickByValues<Affixes, { seasonal: false }>;

export const isSeasonalAffix = (affix: AffixIds): affix is SeasonalAffixIds =>
  affix === 121 || affix === 16 || affix === 117 || affix === 119;
export const isRegularAffix = (affix: AffixIds): affix is RegularAffixIds =>
  affix !== 121 && affix !== 16 && affix !== 117 && affix !== 119;

export const getSeasonalAffix = (fight: UIFight): SeasonalAffixIds | null =>
  fight.keystoneLevel >= 10
    ? fight.affixes.find(isSeasonalAffix) ?? null
    : null;
export const getRegularAffixes = (fight: UIFight): RegularAffixIds[] =>
  fight.affixes.filter(isRegularAffix);
