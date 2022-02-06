import { Affixes } from "@prisma/client";
import type { Affix } from "@prisma/client";

export const affixMap: Record<Affix["id"], Omit<Affix, "id">> = {
  2: {
    name: Affixes.Skittish,
    icon: "spell_magic_lesserinvisibilty",
    seasonal: false,
  },
  3: {
    name: Affixes.Volcanic,
    icon: "spell_shaman_lavasurge",
    seasonal: false,
  },
  4: {
    name: Affixes.Necrotic,
    icon: "spell_deathknight_necroticplague",
    seasonal: false,
  },
  6: {
    name: Affixes.Raging,
    icon: "ability_warrior_focusedrage",
    seasonal: false,
  },
  7: {
    name: Affixes.Bolstering,
    icon: "ability_warrior_battleshout",
    seasonal: false,
  },
  8: {
    name: Affixes.Sanguine,
    icon: "spell_shadow_bloodboil",
    seasonal: false,
  },
  9: {
    name: Affixes.Tyrannical,
    icon: "achievement_boss_archaedas",
    seasonal: false,
  },
  10: {
    name: Affixes.Fortified,
    icon: "ability_toughness",
    seasonal: false,
  },
  11: {
    name: Affixes.Bursting,
    icon: "ability_ironmaidens_whirlofblood",
    seasonal: false,
  },
  12: {
    name: Affixes.Grievous,
    icon: "ability_backstab",
    seasonal: false,
  },
  13: {
    name: Affixes.Explosive,
    icon: "spell_fire_felflamering_red",
    seasonal: false,
  },
  14: {
    name: Affixes.Quaking,
    icon: "spell_nature_earthquake",
    seasonal: false,
  },
  16: {
    name: Affixes.Infested,
    icon: "achievement_nazmir_boss_ghuun",
    seasonal: true,
  },
  117: {
    name: Affixes.Reaping,
    icon: "ability_racial_embraceoftheloa_bwonsomdi",
    seasonal: true,
  },
  119: {
    name: Affixes.Beguiling,
    icon: "spell_shadow_mindshear",
    seasonal: true,
  },
  120: {
    name: Affixes.Awakened,
    icon: "trade_archaeology_nerubian_obelisk",
    seasonal: true,
  },
  121: {
    name: Affixes.Prideful,
    icon: "spell_animarevendreth_buff",
    seasonal: true,
  },
  122: {
    name: Affixes.Inspiring,
    icon: "spell_holy_prayerofspirit",
    seasonal: false,
  },
  123: {
    name: Affixes.Spiteful,
    icon: "spell_holy_prayerofshadowprotection",
    seasonal: false,
  },
  124: {
    name: Affixes.Storming,
    icon: "spell_nature_cyclone",
    seasonal: false,
  },
  128: {
    name: Affixes.Tormented,
    icon: "spell_animamaw_orb",
    seasonal: true,
  },
  130: {
    name: Affixes.Encrypted,
    icon: "spell_progenitor_orb",
    seasonal: true,
  },
  129: {
    name: Affixes.Infernal,
    icon: "inv_infernalbrimstone",
    seasonal: true,
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
