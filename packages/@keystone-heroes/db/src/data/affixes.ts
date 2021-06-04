import { Affixes } from "@prisma/client";
import type { Affix } from "@prisma/client";

export const affixMap: Record<Affix["id"], Omit<Affix, "id">> = {
  2: {
    name: Affixes.Skittish,
    icon: "spell_magic_lesserinvisibilty.jpg",
    seasonal: false,
  },
  3: {
    name: Affixes.Volcanic,
    icon: "spell_shaman_lavasurge.jpg",
    seasonal: false,
  },
  4: {
    name: Affixes.Necrotic,
    icon: "spell_deathknight_necroticplague.jpg",
    seasonal: false,
  },
  6: {
    name: Affixes.Raging,
    icon: "ability_warrior_focusedrage.jpg",
    seasonal: false,
  },
  7: {
    name: Affixes.Bolstering,
    icon: "ability_warrior_battleshout.jpg",
    seasonal: false,
  },
  8: {
    name: Affixes.Sanguine,
    icon: "spell_shadow_bloodboil.jpg",
    seasonal: false,
  },
  9: {
    name: Affixes.Tyrannical,
    icon: "achievement_boss_archaedas.jpg",
    seasonal: false,
  },
  10: {
    name: Affixes.Fortified,
    icon: "ability_toughness.jpg",
    seasonal: false,
  },
  11: {
    name: Affixes.Bursting,
    icon: "ability_ironmaidens_whirlofblood.jpg",
    seasonal: false,
  },
  12: {
    name: Affixes.Grievous,
    icon: "ability_backstab.jpg",
    seasonal: false,
  },
  13: {
    name: Affixes.Explosive,
    icon: "spell_fire_felflamering_red.jpg",
    seasonal: false,
  },
  14: {
    name: Affixes.Quaking,
    icon: "spell_nature_earthquake.jpg",
    seasonal: false,
  },
  16: {
    name: Affixes.Infested,
    icon: "achievement_nazmir_boss_ghuun.jpg",
    seasonal: true,
  },
  117: {
    name: Affixes.Reaping,
    icon: "ability_racial_embraceoftheloa_bwonsomdi.jpg",
    seasonal: true,
  },
  119: {
    name: Affixes.Beguiling,
    icon: "spell_shadow_mindshear.jpg",
    seasonal: true,
  },
  120: {
    name: Affixes.Awakened,
    icon: "trade_archaeology_nerubian_obelisk.jpg",
    seasonal: true,
  },
  121: {
    name: Affixes.Prideful,
    icon: "spell_animarevendreth_buff.jpg",
    seasonal: true,
  },
  122: {
    name: Affixes.Inspiring,
    icon: "spell_holy_prayerofspirit.jpg",
    seasonal: false,
  },
  123: {
    name: Affixes.Spiteful,
    icon: "spell_holy_prayerofshadowprotection.jpg",
    seasonal: false,
  },
  124: {
    name: Affixes.Storming,
    icon: "spell_nature_cyclone.jpg",
    seasonal: false,
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

  throw new Error("impossible");
};

export const getAffixById = (id: Affix["id"] | null): Affix => {
  const match = affixes.find((affix) => affix.id === id);

  if (match) {
    return match;
  }

  throw new Error("impossible");
};
