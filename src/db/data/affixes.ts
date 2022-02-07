import { Affixes } from "@prisma/client";
import type { Affix } from "@prisma/client";

export const affixMap: Record<
  Affix["id"],
  Omit<Affix, "id"> & { level: 2 | 4 | 7 | 10 }
> = {
  // 1: {
  //   name: Affixes.Overflowing,
  //   icon: '',
  //   seasonal: false,
  //   level: 7,
  // },
  2: {
    name: Affixes.Skittish,
    icon: "spell_magic_lesserinvisibilty",
    seasonal: false,
    level: 7,
  },
  3: {
    name: Affixes.Volcanic,
    icon: "spell_shaman_lavasurge",
    seasonal: false,
    level: 7,
  },
  4: {
    name: Affixes.Necrotic,
    icon: "spell_deathknight_necroticplague",
    seasonal: false,
    level: 7,
  },
  6: {
    name: Affixes.Raging,
    icon: "ability_warrior_focusedrage",
    seasonal: false,
    level: 4,
  },
  7: {
    name: Affixes.Bolstering,
    icon: "ability_warrior_battleshout",
    seasonal: false,
    level: 4,
  },
  8: {
    name: Affixes.Sanguine,
    icon: "spell_shadow_bloodboil",
    seasonal: false,
    level: 4,
  },
  9: {
    name: Affixes.Tyrannical,
    icon: "achievement_boss_archaedas",
    seasonal: false,
    level: 2,
  },
  10: {
    name: Affixes.Fortified,
    icon: "ability_toughness",
    seasonal: false,
    level: 2,
  },
  11: {
    name: Affixes.Bursting,
    icon: "ability_ironmaidens_whirlofblood",
    seasonal: false,
    level: 4,
  },
  12: {
    name: Affixes.Grievous,
    icon: "ability_backstab",
    seasonal: false,
    level: 7,
  },
  13: {
    name: Affixes.Explosive,
    icon: "spell_fire_felflamering_red",
    seasonal: false,
    level: 7,
  },
  14: {
    name: Affixes.Quaking,
    icon: "spell_nature_earthquake",
    seasonal: false,
    level: 7,
  },
  16: {
    name: Affixes.Infested,
    icon: "achievement_nazmir_boss_ghuun",
    seasonal: true,
    level: 10,
  },
  117: {
    name: Affixes.Reaping,
    icon: "ability_racial_embraceoftheloa_bwonsomdi",
    seasonal: true,
    level: 10,
  },
  119: {
    name: Affixes.Beguiling,
    icon: "spell_shadow_mindshear",
    seasonal: true,
    level: 10,
  },
  120: {
    name: Affixes.Awakened,
    icon: "trade_archaeology_nerubian_obelisk",
    seasonal: true,
    level: 10,
  },
  121: {
    name: Affixes.Prideful,
    icon: "spell_animarevendreth_buff",
    seasonal: true,
    level: 10,
  },
  122: {
    name: Affixes.Inspiring,
    icon: "spell_holy_prayerofspirit",
    seasonal: false,
    level: 4,
  },
  123: {
    name: Affixes.Spiteful,
    icon: "spell_holy_prayerofshadowprotection",
    seasonal: false,
    level: 4,
  },
  124: {
    name: Affixes.Storming,
    icon: "spell_nature_cyclone",
    seasonal: false,
    level: 7,
  },
  128: {
    name: Affixes.Tormented,
    icon: "spell_animamaw_orb",
    seasonal: true,
    level: 10,
  },
  130: {
    name: Affixes.Encrypted,
    icon: "spell_progenitor_orb",
    seasonal: true,
    level: 10,
  },
  129: {
    name: Affixes.Infernal,
    icon: "inv_infernalbrimstone",
    seasonal: true,
    level: 10,
  },
};

export const affixes = Object.entries(affixMap).map(([key, dataset]) => ({
  id: Number.parseInt(key),
  ...dataset,
}));

export const getAffixByName = (name: Affixes): number => {
  const match = Object.entries(affixMap).find(
    ([, affix]) => affix.name === name
  );

  if (match) {
    return Number.parseInt(match[0]);
  }

  throw new Error(`getAffixByName - missmig match for '${name}'`);
};

export const getAffixByID = (id: Affix["id"] | null): Affix => {
  const match = affixes.find((affix) => affix.id === id);

  if (match) {
    return match;
  }

  throw new Error(
    `getAffixByID - missimg match for affix id '${id ?? "no id given"}'`
  );
};
