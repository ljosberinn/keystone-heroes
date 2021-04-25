export const affixes = {
  3: { name: "Volcanic", icon: "spell_shaman_lavasurge.jpg" },
  4: { name: "Necrotic", icon: "spell_deathknight_necroticplague.jpg" },
  6: { name: "Raging", icon: "ability_warrior_focusedrage.jpg" },
  7: { name: "Bolstering", icon: "ability_warrior_battleshout.jpg" },
  8: { name: "Sanguine", icon: "spell_shadow_bloodboil.jpg" },
  9: { name: "Tyrannical", icon: "achievement_boss_archaedas.jpg" },
  10: { name: "Fortified", icon: "ability_toughness.jpg" },
  11: { name: "Bursting", icon: "ability_ironmaidens_whirlofblood.jpg" },
  12: { name: "Grievous", icon: "ability_backstab.jpg" },
  13: { name: "Explosive", icon: "spell_fire_felflamering_red.jpg" },
  14: { name: "Quaking", icon: "spell_nature_earthquake.jpg" },
  121: { name: "Prideful", icon: "spell_animarevendreth_buff.jpg" },
  122: { name: "Inspiring", icon: "spell_holy_prayerofspirit.jpg" },
  123: { name: "Spiteful", icon: "spell_holy_prayerofshadowprotection.jpg" },
  124: { name: "Storming", icon: "spell_nature_cyclone.jpg" },
} as const;

export type Affixes = typeof affixes;
export type Affix = Affixes[keyof Affixes];
