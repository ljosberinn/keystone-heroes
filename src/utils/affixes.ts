export const affixes = [
  {
    name: "Volcanic",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/spell_shaman_lavasurge.jpg",
    id: 3,
  },
  {
    name: "Necrotic",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/spell_deathknight_necroticplague.jpg",
    id: 4,
  },
  {
    name: "Raging",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/ability_warrior_focusedrage.jpg",
    id: 6,
  },
  {
    name: "Bolstering",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/ability_warrior_battleshout.jpg",
    id: 7,
  },
  {
    name: "Sanguine",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/spell_shadow_bloodboil.jpg",
    id: 8,
  },
  {
    name: "Tyrannical",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/achievement_boss_archaedas.jpg",
    id: 9,
  },
  {
    name: "Fortified",
    icon: "//assets.rpglogs.com/img/warcraft/abilities/ability_toughness.jpg",
    id: 10,
  },
  {
    name: "Bursting",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/ability_ironmaidens_whirlofblood.jpg",
    id: 11,
  },
  {
    name: "Grievous",
    icon: "//assets.rpglogs.com/img/warcraft/abilities/ability_backstab.jpg",
    id: 12,
  },
  {
    name: "Explosive",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/spell_fire_felflamering_red.jpg",
    id: 13,
  },
  {
    name: "Quaking",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/spell_nature_earthquake.jpg",
    id: 14,
  },
  {
    name: "Prideful",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/spell_animarevendreth_buff.jpg",
    id: 121,
  },
  {
    name: "Inspiring",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/spell_holy_prayerofspirit.jpg",
    id: 122,
  },
  {
    name: "Spiteful",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/spell_holy_prayerofshadowprotection.jpg",
    id: 123,
  },
  {
    name: "Storming",
    icon:
      "//assets.rpglogs.com/img/warcraft/abilities/spell_nature_cyclone.jpg",
    id: 124,
  },
] as const;

export type Affix = typeof affixes[number];
