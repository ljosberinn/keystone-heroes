/* eslint-disable sonarjs/no-duplicate-string */
import { Role, SpecName, PlayableClass } from "@prisma/client";

type Ability = {
  name: string;
  id: number;
  cd:
    | 6
    | 12
    | 15
    | 24
    | 25
    | 30
    | 40
    | 45
    | 60
    | 75
    | 90
    | 120
    | 150
    | 180
    | 240
    | 270
    | 300
    | 360
    | 480
    | 600
    | 720
    | 3600;
  icon: string;
};

type CooldownType =
  // anything that interrupts single or multiple targets, e.g. kick
  | "interrupt"
  // anything that boosts damage or does damage itself
  | "damage"
  // every cd with at least 120s is automatically major
  | "major"
  // any spell with no other purpose than applying cc, e.g. sigil of silence, blind, ...
  | "cc"
  // e.g. bubble, turtle
  | "immunity"
  | "dispel"
  // just all covenant abilities in general
  | "covenant"
  // e.g. roar, sprint
  | "utility"
  // self-cds, e.g. raw % reduced damage taken
  | "defensive";

type Class = {
  id: number;
  name: PlayableClass;
  specs: {
    name: SpecName;
    role: Role;
    cooldowns: (Ability & { type: CooldownType[] })[];
  }[];
  cooldowns: (Ability & { type: CooldownType[] })[];
  covenantAbilities: (Ability & {
    type: [Extract<CooldownType, "covenant">];
  })[];
};

const warrior: Class = {
  name: PlayableClass.Warrior,
  cooldowns: [
    {
      name: "Recklessness",
      id: 1719,
      cd: 90,
      icon: "warrior_talent_icon_innerrage",
      type: [],
    },
    {
      name: "Rallying Cry",
      id: 97_462,
      cd: 180,
      icon: "ability_warrior_rallyingcry",
      type: [],
    },
    {
      name: "Challenging Shout",
      id: 1161,
      cd: 240,
      icon: "ability_bullrush",
      type: [],
    },
    {
      name: "Intimidating Shout",
      id: 5246,
      cd: 90,
      icon: "ability_golemthunderclap",
      type: ["cc", "utility", "defensive"],
    },
    {
      name: "Shattering Throw",
      id: 64_382,
      cd: 180,
      icon: "ability_warrior_shatteringthrow",
      type: [],
    },
    {
      name: "Berserker Rage",
      id: 18_499,
      cd: 60,
      icon: "spell_nature_ancestralguardian",
      type: [],
    },
    {
      name: "Pummel",
      id: 6552,
      cd: 15,
      icon: "inv_gauntlets_04",
      type: ["interrupt"],
    },
    {
      name: "Spell Reflection",
      id: 23_920,
      cd: 25,
      icon: "ability_warrior_shieldreflection",
      type: [],
    },
  ],
  covenantAbilities: [
    {
      name: "Spear of Bastion",
      id: 307_865,
      cd: 60,
      icon: "ability_bastion_warrior",
      type: ["covenant"],
    },
    {
      name: "Conqueror's Banner",
      id: 324_143,
      cd: 120,
      icon: "ability_maldraxxus_warriorplantbanner",
      type: ["covenant"],
    },
    {
      name: "Ancient Aftershock",
      id: 325_886,
      cd: 90,
      icon: "ability_ardenweald_warrior",
      type: ["covenant"],
    },
    {
      name: "Condemn",
      id: 317_349,
      cd: 6,
      icon: "ability_revendreth_warrior",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.Protection,
      role: Role.tank,
      cooldowns: [
        {
          name: "Shield Wall",
          id: 871,
          cd: 240,
          icon: "ability_warrior_shieldwall",
          type: ["major"],
        },
        {
          name: "Avatar",
          id: 107_574,
          cd: 90,
          icon: "warrior_talent_icon_avatar",
          type: [],
        },
        {
          name: "Last Stand",
          id: 12_975,
          cd: 180,
          icon: "spell_holy_ashestoashes",
          type: ["major"],
        },
      ],
    },
    {
      name: SpecName.Fury,
      role: Role.dps,
      cooldowns: [
        {
          name: "Bladestorm",
          id: 46_924,
          cd: 60,
          icon: "ability_warrior_bladestorm",
          type: ["damage"],
        },
        {
          name: "Enraged Regeneration",
          id: 184_364,
          cd: 120,
          icon: "ability_warrior_focusedrage",
          type: [],
        },
      ],
    },
    {
      name: SpecName.Arms,
      role: Role.dps,
      cooldowns: [
        {
          name: "Avatar",
          id: 107_574,
          cd: 90,
          icon: "warrior_talent_icon_avatar",
          type: ["damage"],
        },
        {
          name: "Deadly Calm",
          id: 262_228,
          cd: 60,
          icon: "achievement_boss_kingymiron",
          type: [],
        },
        {
          name: "Bladestorm",
          id: 227_847,
          cd: 90,
          icon: "ability_warrior_bladestorm",
          type: ["damage"],
        },
        {
          name: "Colossus Smash",
          cd: 90,
          id: 167_105,
          icon: "ability_warrior_colossussmash",
          type: [],
        },
      ],
    },
  ],
  id: 1,
};

const mage: Class = {
  name: PlayableClass.Mage,
  cooldowns: [
    {
      name: "Invisibility",
      id: 66,
      cd: 300,
      icon: "ability_mage_invisibility",
      type: ["utility"],
    },
    {
      name: "Time Warp",
      id: 80_353,
      cd: 300,
      icon: "ability_mage_timewarp",
      type: ["major", "utility"],
    },
    {
      name: "Ice Block",
      id: 45_438,
      cd: 240,
      icon: "spell_frost_frost",
      type: ["major", "immunity"],
    },
    {
      name: "Mirror Image",
      id: 55_342,
      cd: 120,
      icon: "spell_magic_lesserinvisibilty",
      type: ["utility", "defensive"],
    },
    {
      name: "Counterspell",
      id: 2139,
      cd: 24,
      icon: "spell_frost_iceshock",
      type: ["interrupt"],
    },
  ],
  covenantAbilities: [
    {
      name: "Mirrors of Torment",
      id: 314_793,
      cd: 90,
      icon: "ability_revendreth_mage",
      type: ["covenant"],
    },
    {
      name: "Radiant Spark",
      id: 307_443,
      cd: 30,
      icon: "ability_bastion_mage",
      type: ["covenant"],
    },
    {
      name: "Deathborne",
      id: 324_220,
      cd: 180,
      icon: "ability_maldraxxus_mage",
      type: ["covenant"],
    },
    {
      name: "Shifting Power",
      id: 314_791,
      cd: 60,
      icon: "ability_ardenweald_mage",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.Fire,
      role: Role.dps,
      cooldowns: [
        {
          name: "Combustion",
          id: 190_319,
          cd: 120,
          icon: "spell_fire_sealoffire",
          type: ["major"],
        },
        {
          name: "Alter Time",
          id: 108_978,
          cd: 60,
          icon: "spell_mage_altertime",
          type: ["utility", "defensive"],
        },
      ],
    },
    {
      name: SpecName.Frost,
      role: Role.dps,
      cooldowns: [
        {
          name: "Icy Veins",
          id: 12_472,
          cd: 180,
          icon: "spell_frost_coldhearted",
          type: ["major"],
        },
        {
          name: "Frozen Orb",
          id: 84_714,
          cd: 60,
          icon: "spell_frost_frozenorb",
          type: ["damage"],
        },
        {
          name: "Alter Time",
          id: 108_978,
          cd: 60,
          icon: "spell_mage_altertime",
          type: ["utility", "defensive"],
        },
        {
          name: "Cold Snap",
          id: 235_219,
          cd: 270,
          icon: "spell_frost_wizardmark",
          type: ["major"],
        },
        {
          name: "Ray of Frost",
          id: 205_021,
          cd: 75,
          icon: "ability_mage_rayoffrost",
          type: ["damage"],
        },
      ],
    },
    {
      name: SpecName.Arcane,
      role: Role.dps,
      cooldowns: [
        {
          name: "Arcane Power",
          id: 12_042,
          cd: 120,
          icon: "spell_nature_lightning",
          type: ["major"],
        },
        {
          name: "Presence of Mind",
          id: 198_154,
          cd: 60,
          icon: "spell_nature_enchantarmor",
          type: ["utility"],
        },
      ],
    },
  ],
  id: 2,
};

const rogue: Class = {
  name: PlayableClass.Rogue,
  cooldowns: [
    {
      name: "Shroud of Concealment",
      id: 114_018,
      cd: 360,
      icon: "ability_rogue_shroudofconcealment",
      type: ["utility", "major"],
    },
    {
      name: "Blind",
      id: 2094,
      cd: 120,
      icon: "spell_shadow_mindsteal",
      type: ["cc", "utility", "major"],
    },
    {
      name: "Sprint",
      id: 2983,
      cd: 120,
      icon: "ability_rogue_sprint",
      type: ["utility", "major"],
    },
    {
      name: "Evasion",
      id: 5277,
      cd: 120,
      icon: "spell_shadow_shadowward",
      type: ["defensive", "major"],
    },
    {
      name: "Cloak of Shadows",
      id: 31_224,
      cd: 120,
      icon: "spell_shadow_nethercloak",
      type: ["defensive", "major"],
    },
    {
      name: "Vanish",
      id: 1856,
      cd: 120,
      icon: "ability_vanish",
      type: ["damage", "defensive", "major"],
    },
    {
      name: "Marked for Death",
      id: 137_619,
      cd: 60,
      icon: "achievement_bg_killingblow_berserker",
      type: ["damage"],
    },
    {
      name: "Kick",
      id: 1766,
      cd: 15,
      icon: "ability_kick",
      type: ["interrupt"],
    },
  ],
  covenantAbilities: [
    {
      name: "Echoing Reprimand",
      id: 323_547,
      cd: 45,
      icon: "ability_bastion_rogue",
      type: ["covenant"],
    },
    {
      name: "Flagellation",
      id: 323_654,
      cd: 90,
      icon: "ability_revendreth_rogue",
      type: ["covenant"],
    },
    {
      name: "Serrated Bone Spike",
      id: 328_547,
      cd: 90,
      icon: "ability_maldraxxus_rogue",
      type: ["covenant"],
    },
    {
      name: "Sepsis",
      id: 328_305,
      cd: 90,
      icon: "ability_ardenweald_rogue",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.Assassination,
      role: Role.dps,
      cooldowns: [
        {
          name: "Vendetta",
          id: 79_140,
          cd: 120,
          icon: "ability_rogue_deadliness",
          type: ["major", "damage"],
        },
      ],
    },
    {
      name: SpecName.Subtlety,
      role: Role.dps,
      cooldowns: [
        {
          name: "Shadow Dance",
          id: 185_313,
          cd: 60,
          icon: "ability_rogue_shadowdance",
          type: ["damage"],
        },
        {
          name: "Shadow Blades",
          id: 121_471,
          cd: 180,
          icon: "inv_knife_1h_grimbatolraid_d_03",
          type: ["damage", "major"],
        },
        {
          name: "Shuriken Tornado",
          id: 277_925,
          cd: 60,
          icon: "ability_rogue_throwingspecialization",
          type: ["damage"],
        },
      ],
    },
    {
      name: SpecName.Outlaw,
      role: Role.dps,
      cooldowns: [
        {
          name: "Adrenaline Rush",
          id: 13_750,
          cd: 180,
          icon: "spell_shadow_shadowworddominate",
          type: ["damage", "major"],
        },
        {
          name: "Killing Spree",
          id: 51_690,
          cd: 120,
          icon: "ability_rogue_murderspree",
          type: ["damage", "major"],
        },
      ],
    },
  ],
  id: 3,
};

const shaman: Class = {
  name: PlayableClass.Shaman,
  cooldowns: [
    {
      name: "Capacitator Totem",
      id: 192_058,
      cd: 60,
      icon: "spell_nature_brilliance",
      type: ["cc"],
    },
    {
      name: "Bloodlust",
      id: 2825,
      cd: 300,
      icon: "spell_nature_bloodlust",
      type: ["utility", "major"],
    },
    {
      name: "Heroism",
      id: 32_182,
      cd: 300,
      icon: "ability_shaman_heroism",
      type: ["utility", "major"],
    },
    {
      name: "Earth Elemental",
      id: 198_103,
      cd: 300,
      icon: "spell_nature_earthelemental_totem",
      type: ["utility", "defensive"],
    },
    {
      name: "Astral Shift",
      id: 108_271,
      cd: 90,
      icon: "ability_shaman_astralshift",
      type: ["defensive"],
    },
    {
      name: "Tremor Totem",
      id: 8143,
      cd: 60,
      icon: "spell_nature_tremortotem",
      type: ["utility"],
    },
    {
      name: "Wind Shear",
      id: 57_994,
      cd: 12,
      icon: "spell_nature_cyclone",
      type: ["interrupt"],
    },
  ],
  covenantAbilities: [
    {
      name: "Vesper Totem",
      id: 324_386,
      cd: 60,
      icon: "ability_bastion_shaman",
      type: ["covenant"],
    },
    {
      name: "Chain Harvest",
      id: 320_674,
      cd: 90,
      icon: "ability_revendreth_shaman",
      type: ["covenant"],
    },
    {
      name: "Primordial Wave",
      id: 326_059,
      cd: 30,
      icon: "ability_maldraxxus_shaman",
      type: ["covenant"],
    },
    {
      name: "Fae Transfusion",
      id: 328_923,
      cd: 120,
      icon: "ability_ardenweald_shaman",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.Restoration,
      role: Role.healer,
      cooldowns: [
        {
          name: "Spirit Link Totem",
          id: 98_008,
          cd: 180,
          icon: "spell_shaman_spiritlink",
          type: ["defensive", "major"],
        },
        {
          name: "Spiritwalker's Grace",
          id: 79_206,
          cd: 120,
          icon: "spell_shaman_spiritwalkersgrace",
          type: ["utility", "major"],
        },
        {
          name: "Ascendance",
          id: 114_052,
          cd: 180,
          icon: "spell_fire_elementaldevastation",
          type: ["defensive", "major"],
        },
        {
          name: "Ancestral Protection Totem",
          id: 207_399,
          cd: 300,
          icon: "spell_nature_reincarnation",
          type: ["defensive", "major"],
        },
        {
          name: "Healing Tide Totem",
          id: 108_280,
          cd: 180,
          icon: "ability_shaman_healingtide",
          type: ["defensive", "major"],
        },
        {
          name: "Mana Tide Totem",
          id: 16_191,
          cd: 180,
          icon: "spell_frost_summonwaterelemental",
          type: ["utility", "major"],
        },
        {
          name: "Earthen Wall Totem",
          id: 198_838,
          cd: 60,
          icon: "spell_nature_stoneskintotem",
          type: ["utility", "defensive"],
        },
      ],
    },
    {
      name: SpecName.Elemental,
      role: Role.dps,
      cooldowns: [
        {
          name: "Ascendance",
          id: 114_050,
          cd: 180,
          icon: "spell_fire_elementaldevastation",
          type: ["damage", "major"],
        },
        {
          name: "Stormkeeper",
          id: 191_634,
          cd: 60,
          icon: "ability_thunderking_lightningwhip",
          type: ["damage"],
        },
        {
          name: "Spiritwalker's Grace",
          id: 79_206,
          cd: 120,
          icon: "spell_shaman_spiritwalkersgrace",
          type: ["defensive", "major"],
        },
        {
          name: "Ancestral Guidance",
          id: 108_281,
          cd: 120,
          icon: "ability_shaman_ancestralguidance",
          type: ["defensive", "major"],
        },
        {
          name: "Liquid Magma Totem",
          id: 192_222,
          cd: 60,
          icon: "spell_shaman_spewlava",
          type: ["damage"],
        },
        {
          name: "Storm Elemental",
          id: 192_249,
          cd: 150,
          icon: "inv_stormelemental",
          type: ["damage", "major"],
        },
        {
          name: "Fire Elemental",
          id: 198_067,
          cd: 150,
          icon: "spell_fire_elemental_totem",
          type: ["damage", "major"],
        },
      ],
    },
    {
      name: SpecName.Enhancement,
      role: Role.dps,
      cooldowns: [
        {
          name: "Feral Spirit",
          id: 51_533,
          cd: 120,
          icon: "spell_shaman_feralspirit",
          type: ["damage", "major"],
        },
        {
          name: "Ascendance",
          id: 114_051,
          cd: 180,
          icon: "spell_fire_elementaldevastation",
          type: ["damage", "major"],
        },
        {
          name: "Stormkeeper",
          id: 320_137,
          cd: 60,
          icon: "ability_thunderking_lightningwhip",
          type: ["damage"],
        },
        {
          name: "Spirit Walk",
          id: 58_875,
          cd: 60,
          icon: "ability_tracking",
          type: ["utility"],
        },
      ],
    },
  ],
  id: 4,
};

const priest: Class = {
  name: PlayableClass.Priest,
  cooldowns: [
    {
      name: "Power Infusion",
      id: 10_060,
      cd: 120,
      icon: "spell_holy_powerinfusion",
      type: ["major", "utility"],
    },
    {
      name: "Leap of Faith",
      id: 73_325,
      cd: 90,
      icon: "priest_spell_leapoffaith_a",
      type: [],
    },
    {
      name: "Desperate Prayer",
      id: 19_236,
      cd: 90,
      icon: "spell_holy_testoffaith",
      type: ["defensive"],
    },
    {
      name: "Psychic Scream",
      id: 8122,
      cd: 60,
      icon: "spell_shadow_psychicscream",
      type: ["cc", "defensive"],
    },
    {
      name: "Power Word: Barrier",
      id: 62_618,
      cd: 180,
      icon: "spell_holy_powerwordbarrier",
      type: ["major", "defensive"],
    },
  ],
  covenantAbilities: [
    {
      name: "Boon of the Ascended",
      id: 325_013,
      cd: 180,
      icon: "ability_bastion_priest",
      type: ["covenant"],
    },
    {
      name: "Mindgames",
      id: 323_673,
      cd: 45,
      icon: "ability_revendreth_priest",
      type: ["covenant"],
    },
    {
      name: "Unholy Nova",
      id: 324_724,
      cd: 60,
      icon: "ability_maldraxxus_priest",
      type: ["covenant"],
    },
    {
      name: "Fae Guardians",
      id: 327_661,
      cd: 90,
      icon: "ability_ardenweald_priest",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.Shadow,
      role: Role.dps,
      cooldowns: [
        {
          name: "Surrender to Madness",
          id: 319_952,
          cd: 90,
          icon: "achievement_boss_generalvezax_01",
          type: [],
        },
        {
          name: "Mindbender",
          id: 200_174,
          cd: 60,
          icon: "spell_shadow_soulleech_3",
          type: ["damage"],
        },
        {
          name: "Dispersion",
          id: 47_585,
          cd: 120,
          icon: "spell_shadow_dispersion",
          type: ["defensive", "major"],
        },
        {
          name: "Shadowfiend",
          id: 34_433,
          cd: 180,
          icon: "spell_shadow_shadowfiend",
          type: ["major", "damage"],
        },
        {
          name: "Vampiric Embrace",
          id: 15_286,
          cd: 120,
          icon: "spell_shadow_unsummonbuilding",
          type: ["major", "damage", "defensive"],
        },
        {
          name: "Void Eruption",
          id: 228_260,
          cd: 90,
          icon: "spell_priest_void-blast",
          type: ["damage"],
        },
        {
          name: "Silence",
          id: 15_487,
          cd: 45,
          icon: "ability_priest_silence",
          type: ["interrupt"],
        },
      ],
    },
    {
      name: SpecName.Holy,
      role: Role.healer,
      cooldowns: [
        {
          name: "Guardian Spirit",
          id: 47_788,
          cd: 180,
          icon: "spell_holy_guardianspirit",
          type: ["defensive", "major"],
        },
        {
          name: "Divine Hymn",
          id: 64_843,
          cd: 180,
          icon: "spell_holy_divinehymn",
          type: ["defensive", "major"],
        },
        {
          name: "Symbol of Hope",
          id: 64_901,
          cd: 300,
          icon: "spell_holy_symbolofhope",
          type: ["utility", "major"],
        },
        {
          name: "Apotheosis",
          id: 200_183,
          cd: 120,
          icon: "ability_priest_ascension",
          type: [],
        },
        {
          name: "Holy Word: Serenity",
          id: 2050,
          cd: 60,
          icon: "spell_holy_persuitofjustice",
          type: [],
        },
        {
          name: "Holy Word: Salvation",
          id: 265_202,
          cd: 720,
          icon: "ability_priest_archangel",
          type: [],
        },
        {
          name: "Holy Word: Sanctify",
          id: 34_861,
          cd: 60,
          icon: "spell_holy_divineprovidence",
          type: [],
        },
        {
          name: "Holy Word: Chastise",
          id: 88_625,
          cd: 60,
          icon: "spell_holy_chastise",
          type: [],
        },
      ],
    },
    {
      name: SpecName.Discipline,
      role: Role.healer,
      cooldowns: [
        {
          name: "Pain Suppression",
          id: 33_206,
          cd: 180,
          icon: "spell_holy_painsupression",
          type: ["defensive", "major"],
        },
        {
          name: "Evangelism",
          id: 246_287,
          cd: 90,
          icon: "spell_holy_divineillumination",
          type: [],
        },
        {
          name: "Spirit Shell",
          id: 109_964,
          cd: 90,
          icon: "ability_shaman_astralshift",
          type: [],
        },
        {
          name: "Power Word: Barrier",
          id: 62_618,
          cd: 180,
          icon: "spell_holy_powerwordbarrier",
          type: ["major", "defensive"],
        },
        {
          name: "Rapture",
          id: 47_536,
          cd: 90,
          icon: "spell_holy_rapture",
          type: [],
        },
        {
          name: "Mindbender",
          id: 123_040,
          cd: 60,
          icon: "spell_shadow_soulleech_3",
          type: [],
        },
        {
          name: "Shadowfiend",
          id: 34_433,
          cd: 180,
          icon: "spell_shadow_shadowfiend",
          type: [],
        },
      ],
    },
  ],
  id: 5,
};

const hunter: Class = {
  name: PlayableClass.Hunter,
  cooldowns: [
    {
      name: "Aspect of the Turtle",
      id: 186_265,
      cd: 180,
      icon: "ability_hunter_pet_turtle",
      type: ["immunity", "major"],
    },
    {
      name: "Aspect of the Cheetah",
      id: 186_257,
      cd: 180,
      icon: "ability_mount_jungletiger",
      type: ["utility"],
    },
    {
      name: "Exhilaration",
      id: 109_304,
      cd: 120,
      icon: "ability_hunter_onewithnature",
      type: ["defensive", "major"],
    },
    {
      name: "A Murder of Crows",
      id: 131_894,
      cd: 60,
      icon: "ability_hunter_murderofcrows",
      type: [],
    },
  ],
  covenantAbilities: [
    {
      name: "Wild Spirits",
      id: 328_231,
      cd: 120,
      icon: "ability_ardenweald_hunter",
      type: ["covenant"],
    },
    {
      name: "Resonating Arrow",
      id: 308_491,
      cd: 60,
      icon: "ability_bastion_hunter",
      type: ["covenant"],
    },
    {
      name: "Flayed Shot",
      id: 324_149,
      cd: 30,
      icon: "ability_revendreth_hunter",
      type: ["covenant"],
    },
    {
      name: "Death Chakram",
      id: 325_028,
      cd: 45,
      icon: "ability_maldraxxus_hunter",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.BeastMastery,
      role: Role.dps,
      cooldowns: [
        {
          name: "Bestial Wrath",
          id: 19_574,
          cd: 90,
          icon: "ability_druid_ferociousbite",
          type: ["damage"],
        },
        {
          name: "Aspect of the Wild",
          id: 193_530,
          cd: 120,
          icon: "spell_nature_protectionformnature",
          type: [],
        },
        {
          name: "Bloodshed",
          id: 321_530,
          cd: 60,
          icon: "ability_druid_primaltenacity",
          type: [],
        },
        {
          name: "Stampede",
          id: 201_430,
          cd: 120,
          icon: "ability_hunter_bestialdiscipline",
          type: [],
        },
        {
          name: "Intimidation",
          id: 19_577,
          cd: 60,
          icon: "ability_devour",
          type: ["cc"],
        },
        {
          name: "Counter Shot",
          id: 147_362,
          cd: 24,
          icon: "inv_ammo_arrow_03",
          type: ["interrupt"],
        },
      ],
    },
    {
      name: SpecName.Survival,
      role: Role.dps,
      cooldowns: [
        {
          name: "Intimidation",
          id: 19_577,
          cd: 60,
          icon: "ability_devour",
          type: ["cc"],
        },
        {
          name: "Aspect of the Eagle",
          id: 186_289,
          cd: 90,
          icon: "spell_hunter_aspectoftheironhawk",
          type: [],
        },
        {
          name: "Coordinated Assault",
          id: 266_779,
          cd: 120,
          icon: "inv_coordinatedassault",
          type: [],
        },
        {
          name: "Muzzle",
          id: 187_707,
          cd: 15,
          icon: "ability_hunter_negate",
          type: ["interrupt"],
        },
      ],
    },
    {
      name: SpecName.Marksmanship,
      role: Role.dps,
      cooldowns: [
        {
          name: "Double Tap",
          id: 260_402,
          cd: 60,
          icon: "ability_hunter_crossfire",
          type: ["damage"],
        },
        {
          name: "Trueshot",
          id: 288_613,
          cd: 120,
          icon: "ability_trueshot",
          type: ["damage", "major"],
        },
        {
          name: "Counter Shot",
          id: 147_362,
          cd: 24,
          icon: "inv_ammo_arrow_03",
          type: ["interrupt"],
        },
      ],
    },
  ],
  id: 6,
};

const monk: Class = {
  name: PlayableClass.Monk,
  cooldowns: [
    {
      name: "Leg Sweep",
      id: 119_381,
      cd: 60,
      icon: "ability_monk_legsweep",
      type: ["cc"],
    },
    {
      name: "Dampen Harm",
      id: 122_278,
      cd: 120,
      icon: "ability_monk_dampenharm",
      type: [],
    },
    {
      name: "Touch of Death",
      id: 322_109,
      cd: 180,
      icon: "ability_monk_touchofdeath",
      type: [],
    },
  ],
  covenantAbilities: [
    {
      name: "Weapons of Order",
      id: 310_454,
      cd: 120,
      icon: "ability_bastion_monk",
      type: ["covenant"],
    },
    {
      name: "Fallen Order",
      id: 326_860,
      cd: 180,
      icon: "ability_revendreth_monk",
      type: ["covenant"],
    },
    {
      name: "Bonedust Brew",
      id: 325_216,
      cd: 60,
      icon: "ability_maldraxxus_monk",
      type: ["covenant"],
    },
    {
      name: "Faeline Stomp",
      id: 327_104,
      cd: 30,
      icon: "ability_ardenweald_monk",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.Mistweaver,
      role: Role.healer,
      cooldowns: [
        {
          name: "Diffuse Magic",
          id: 122_783,
          cd: 90,
          icon: "spell_monk_diffusemagic",
          type: [],
        },
        {
          name: "Invoke Yu'lon, the Jade Serpent",
          id: 322_118,
          cd: 180,
          icon: "ability_monk_dragonkick",
          type: [],
        },
        {
          name: "Invoke Chi-Ji, the Red Crane",
          id: 325_197,
          cd: 180,
          icon: "inv_pet_cranegod",
          type: [],
        },
        {
          name: "Revival",
          id: 115_310,
          cd: 180,
          icon: "spell_monk_revival",
          type: [],
        },
        {
          name: "Life Cocoon",
          id: 116_849,
          cd: 120,
          icon: "ability_monk_chicocoon",
          type: ["defensive", "major"],
        },
        {
          name: "Mana Tea",
          id: 197_908,
          cd: 90,
          icon: "monk_ability_cherrymanatea",
          type: [],
        },
        {
          name: "Fortifying Brew",
          id: 115_203,
          cd: 180,
          icon: "ability_monk_fortifyingale_new",
          type: [],
        },
      ],
    },
    {
      name: SpecName.Brewmaster,
      role: Role.tank,
      cooldowns: [
        {
          name: "Exploding Keg",
          id: 325_153,
          cd: 60,
          icon: "archaeology_5_0_emptykegofbrewfatherxinwoyin",
          type: [],
        },
        {
          name: "Black Ox Brew",
          id: 115_399,
          cd: 120,
          icon: "ability_monk_chibrew",
          type: [],
        },
        {
          name: "Invoke Niuzao, the Black Ox",
          id: 132_578,
          cd: 180,
          icon: "spell_monk_brewmaster_spec",
          type: [],
        },
        {
          name: "Zen Meditation",
          id: 115_176,
          cd: 300,
          icon: "ability_monk_zenmeditation",
          type: [],
        },
        {
          name: "Celestial Brew",
          id: 322_507,
          cd: 60,
          icon: "ability_monk_ironskinbrew",
          type: [],
        },
        {
          name: "Fortifying Brew",
          id: 115_203,
          cd: 360,
          icon: "ability_monk_fortifyingale_new",
          type: [],
        },
        {
          name: "Spear Hand Strike",
          id: 116_705,
          cd: 15,
          icon: "ability_monk_spearhand",
          type: ["interrupt"],
        },
      ],
    },
    {
      name: SpecName.Windwalker,
      role: Role.dps,
      cooldowns: [
        {
          name: "Invoke Xuen, the White Tiger",
          id: 123_904,
          cd: 120,
          icon: "ability_monk_summontigerstatue",
          type: ["damage", "major"],
        },
        {
          name: "Storm, Earth and Fire",
          id: 137_639,
          cd: 90,
          icon: "spell_nature_giftofthewild",
          type: ["damage", "major"],
        },
        {
          name: "Touch of Karma",
          id: 122_470,
          cd: 90,
          icon: "ability_monk_touchofkarma",
          type: [],
        },
        {
          name: "Diffuse Magic",
          id: 122_783,
          cd: 90,
          icon: "spell_monk_diffusemagic",
          type: [],
        },
        {
          name: "Fortifying Brew",
          id: 115_203,
          cd: 180,
          icon: "ability_monk_fortifyingale_new",
          type: [],
        },
        {
          name: "Serenity",
          id: 152_173,
          cd: 90,
          icon: "ability_monk_serenity",
          type: [],
        },
        {
          name: "Energy",
          id: 115_288,
          cd: 60,
          icon: "ability_monk_energizingwine",
          type: [],
        },
        {
          name: "Spear Hand Strike",
          id: 116_705,
          cd: 15,
          icon: "ability_monk_spearhand",
          type: ["interrupt"],
        },
      ],
    },
  ],
  id: 7,
};

const druid: Class = {
  name: PlayableClass.Druid,
  cooldowns: [
    {
      name: "Rebirth",
      id: 20_484,
      cd: 600,
      icon: "spell_nature_reincarnation",
      type: ["major", "utility"],
    },
    {
      name: "Barkskin",
      id: 22_812,
      cd: 60,
      icon: "spell_nature_stoneclawtotem",
      type: ["defensive"],
    },
    {
      name: "Dash",
      id: 1850,
      cd: 120,
      icon: "ability_druid_dash",
      type: ["utility"],
    },
    {
      name: "Stampeding Roar",
      id: 106_898,
      cd: 120,
      icon: "spell_druid_stampedingroar_cat",
      type: ["major", "utility"],
    },
    {
      name: "Ursol's Vortex",
      id: 102_793,
      cd: 60,
      icon: "spell_druid_ursolsvortex",
      type: ["utility"],
    },
    {
      name: "Mighty Bash",
      id: 5211,
      cd: 60,
      icon: "ability_druid_bash",
      type: ["cc"],
    },
    {
      name: "Heart of the Wild",
      id: 319_454,
      cd: 300,
      icon: "spell_holy_blessingofagility",
      type: [],
    },
    {
      name: "Renewal",
      id: 108_238,
      cd: 90,
      icon: "spell_nature_natureblessing",
      type: [],
    },
  ],
  covenantAbilities: [
    {
      name: "Convoke the Spirits",
      id: 323_764,
      cd: 120,
      icon: "ability_ardenweald_druid",
      type: ["covenant"],
    },
    {
      name: "Ravenous Frenzy",
      id: 323_546,
      cd: 180,
      icon: "ability_revendreth_druid",
      type: ["covenant"],
    },
    {
      name: "Kindred Spirits",
      id: 326_434,
      cd: 60,
      icon: "ability_bastion_druid",
      type: ["covenant"],
    },
    {
      name: "Adaptive Swarm",
      id: 325_727,
      cd: 25,
      icon: "ability_maldraxxus_druid",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.Restoration,
      role: Role.healer,
      cooldowns: [
        {
          name: "Innervate",
          id: 29_166,
          cd: 120,
          icon: "spell_nature_lightning",
          type: ["utility", "major"],
        },
        {
          name: "Nature's Swiftness",
          id: 132_158,
          cd: 60,
          icon: "spell_nature_ravenform",
          type: ["utility"],
        },
        {
          name: "Flourish",
          id: 197_721,
          cd: 90,
          icon: "spell_druid_wildburst",
          type: [],
        },
        {
          name: "Ironbark",
          id: 102_342,
          cd: 90,
          icon: "spell_druid_ironbark",
          type: [],
        },
        {
          name: "Tranquility",
          id: 740,
          cd: 180,
          icon: "spell_nature_tranquility",
          type: ["major"],
        },
        {
          name: "Overgrowth",
          id: 203_651,
          cd: 60,
          icon: "ability_druid_overgrowth",
          type: [],
        },
        {
          name: "Incarnation: Tree of Life",
          id: 33_891,
          cd: 180,
          icon: "ability_druid_improvedtreeform",
          type: [],
        },
      ],
    },
    {
      name: SpecName.Guardian,
      role: Role.tank,
      cooldowns: [
        {
          name: "Survival Instincts",
          id: 61_336,
          cd: 180,
          icon: "ability_druid_tigersroar",
          type: [],
        },
        {
          name: "Incarnation: Guardian of Ursoc",
          id: 102_558,
          cd: 180,
          icon: "spell_druid_incarnation",
          type: [],
        },
        {
          name: "Berserk",
          id: 50_334,
          cd: 180,
          icon: "ability_druid_berserk",
          type: [],
        },
        {
          name: "Skull Bash",
          id: 106_839,
          cd: 15,
          icon: "inv_bone_skull_04",
          type: [],
        },
      ],
    },
    {
      name: SpecName.Balance,
      role: Role.dps,
      cooldowns: [
        {
          name: "Fury of Elune",
          id: 202_770,
          cd: 60,
          icon: "ability_druid_dreamstate",
          type: ["damage"],
        },
        {
          name: "Innervate",
          id: 29_166,
          cd: 120,
          icon: "spell_nature_lightning",
          type: ["utility", "major"],
        },
        {
          name: "Force of Nature",
          id: 205_636,
          cd: 60,
          icon: "ability_druid_forceofnature",
          type: ["defensive", "utility"],
        },
        {
          name: "Solar Beam",
          id: 97_547, // technically 78_675
          cd: 60,
          icon: "ability_vehicle_sonicshockwave",
          type: ["interrupt"],
        },
        {
          name: "Celestial Alignment",
          id: 194_223,
          cd: 180,
          icon: "spell_nature_natureguardian",
          type: ["damage", "major"],
        },
        {
          name: "Incarnation: Chosen of Elune",
          id: 102_560,
          cd: 180,
          icon: "spell_druid_incarnation",
          type: [],
        },
      ],
    },
    {
      name: SpecName.Feral,
      role: Role.dps,
      cooldowns: [
        {
          name: "Incarnation: King of the Jungle",
          id: 102_543,
          cd: 180,
          icon: "spell_druid_incarnation",
          type: [],
        },
        {
          name: "Berserk",
          id: 106_951,
          cd: 180,
          icon: "ability_druid_berserk",
          type: [],
        },
        {
          name: "Survival Instincts",
          id: 61_336,
          cd: 180,
          icon: "ability_druid_tigersroar",
          type: [],
        },
        {
          name: "Skull Bash",
          id: 106_839,
          cd: 15,
          icon: "inv_bone_skull_04",
          type: ["interrupt"],
        },
      ],
    },
  ],
  id: 8,
};

const demonhunter: Class = {
  name: PlayableClass.DemonHunter,
  cooldowns: [
    {
      name: "Spectral Sight",
      id: 188_501,
      cd: 60,
      icon: "ability_demonhunter_spectralsight",
      type: ["utility"],
    },
    {
      name: "Disrupt",
      id: 183_752,
      cd: 15,
      icon: "ability_demonhunter_consumemagic",
      type: ["interrupt"],
    },
  ],
  covenantAbilities: [
    {
      name: "Elysian Decree",
      id: 306_830,
      cd: 60,
      icon: "ability_bastion_demonhunter",
      type: ["covenant"],
    },
    {
      name: "The Hunt",
      id: 323_639,
      cd: 90,
      icon: "ability_ardenweald_demonhunter",
      type: ["covenant"],
    },
    {
      name: "Sinful Brand",
      id: 317_009,
      cd: 60,
      icon: "ability_revendreth_demonhunter",
      type: ["covenant"],
    },
    // Fodder to the Flame is passive
  ],
  specs: [
    {
      name: SpecName.Vengeance,
      role: Role.tank,
      cooldowns: [
        {
          name: "Metamorphosis",
          id: 187_827,
          cd: 180,
          icon: "ability_demonhunter_metamorphasistank",
          type: ["major", "defensive"],
        },
        {
          name: "Fel Devastation",
          id: 212_084,
          cd: 60,
          icon: "ability_demonhunter_feldevastation",
          type: ["defensive", "damage"],
        },
        {
          name: "Fiery Brand",
          id: 204_021,
          cd: 60,
          icon: "ability_demonhunter_fierybrand",
          type: ["defensive", "damage"],
        },
        {
          name: "Bulk Extraction",
          id: 320_341,
          cd: 90,
          icon: "spell_shadow_shadesofdarkness",
          type: ["damage"],
        },
        {
          name: "Sigil of Silence",
          id: 202_137,
          cd: 60,
          icon: "ability_demonhunter_sigilofsilence",
          type: ["cc", "interrupt"],
        },
        {
          name: "Sigil of Chains",
          id: 202_138,
          cd: 90,
          icon: "ability_demonhunter_sigilofchains",
          type: ["cc"],
        },
        {
          name: "Sigil of Misery",
          id: 207_684,
          cd: 90,
          icon: "ability_demonhunter_sigilofmisery",
          type: ["cc"],
        },
        {
          name: "Last Resort",
          id: 209_258,
          cd: 480,
          icon: "inv_glaive_1h_artifactaldorchi_d_06",
          type: ["defensive", "major"],
        },
      ],
    },
    {
      name: SpecName.Havoc,
      role: Role.dps,
      cooldowns: [
        {
          name: "Chaos Nova",
          id: 344_867,
          cd: 60,
          icon: "spell_fire_felfirenova",
          type: ["cc", "damage"],
        },
        {
          name: "Fel Barrage",
          id: 258_925,
          cd: 60,
          icon: "inv_felbarrage",
          type: ["damage"],
        },
        {
          name: "Darkness",
          id: 196_718,
          cd: 180,
          icon: "ability_demonhunter_darkness",
          type: ["defensive", "major"],
        },
        {
          name: "Netherwalk",
          id: 196_555,
          cd: 180,
          icon: "spell_warlock_demonsoul",
          type: ["defensive", "utility", "major"],
        },
        {
          name: "Metamorphosis",
          id: 191_427,
          cd: 240,
          icon: "ability_demonhunter_metamorphasisdps",
          type: ["damage", "major"],
        },
        {
          name: "Blur",
          id: 198_589,
          cd: 60,
          icon: "ability_demonhunter_blur",
          type: ["defensive"],
        },
      ],
    },
  ],
  id: 9,
};

const paladin: Class = {
  name: PlayableClass.Paladin,
  cooldowns: [
    {
      name: "Avenging Wrath",
      id: 31_884,
      cd: 120,
      icon: "spell_holy_avenginewrath",
      type: [],
    },
    {
      name: "Blessing of Protection",
      id: 1022,
      cd: 300,
      icon: "spell_holy_sealofprotection",
      type: ["defensive", "utility", "major"],
    },
    {
      name: "Divine Shield",
      id: 642,
      cd: 300,
      icon: "spell_holy_divineshield",
      type: ["defensive", "major"],
    },
    {
      name: "Blessing of Sacrifice",
      id: 6940,
      cd: 120,
      icon: "spell_holy_sealofsacrifice",
      type: ["defensive", "major"],
    },
    {
      name: "Hammer of Justice",
      id: 853,
      cd: 60,
      icon: "spell_holy_sealofmight",
      type: ["cc"],
    },
    {
      name: "Lay on Hands",
      id: 633,
      cd: 600,
      icon: "spell_holy_layonhands",
      type: ["major", "defensive"],
    },
    {
      name: "Blinding Light",
      id: 115_750,
      cd: 90,
      icon: "ability_paladin_blindinglight",
      type: ["cc"],
    },
  ],
  covenantAbilities: [
    {
      name: "Ashen Hallow",
      id: 316_958,
      cd: 240,
      icon: "ability_revendreth_paladin",
      type: ["covenant"],
    },
    {
      name: "Divine Toll",
      id: 304_971,
      cd: 60,
      icon: "ability_bastion_paladin",
      type: ["covenant"],
    },
    {
      name: "Vanquisher's Hammer",
      id: 328_204,
      cd: 30,
      icon: "ability_maldraxxus_paladin",
      type: ["covenant"],
    },
    {
      name: "Blessing of Spring",
      id: 328_282,
      cd: 45,
      icon: "ability_ardenweald_paladin_spring",
      type: ["covenant"],
    },
    {
      name: "Blessing of Summer",
      id: 328_620,
      cd: 45,
      icon: "ability_ardenweald_paladin_summer",
      type: ["covenant"],
    },
    {
      name: "Blessing of Autumn",
      id: 328_622,
      cd: 45,
      icon: "ability_ardenweald_paladin_autumn",
      type: ["covenant"],
    },
    {
      name: "Blessing of Winter",
      id: 328_281,
      cd: 45,
      icon: "ability_ardenweald_paladin_winter",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.Protection,
      role: Role.tank,
      cooldowns: [
        {
          name: "Divine Protection",
          id: 498,
          cd: 60,
          icon: "spell_holy_divineprotection",
          type: [],
        },
        {
          name: "Ardent Defender",
          id: 31_850,
          cd: 120,
          icon: "spell_holy_ardentdefender",
          type: ["defensive", "major"],
        },
        {
          name: "Guardian of Ancient Kings",
          id: 86_659,
          cd: 300,
          icon: "spell_holy_heroism",
          type: ["defensive", "major"],
        },
        {
          name: "Blessing of Spellwarding",
          id: 204_018,
          cd: 180,
          icon: "spell_holy_blessingofprotection",
          type: [],
        },
        {
          name: "Moment of Glory",
          id: 327_193,
          cd: 90,
          icon: "ability_paladin_veneration",
          type: [],
        },
        {
          name: "Avenger's Shield",
          id: 31_935,
          cd: 15,
          icon: "spell_holy_avengersshield",
          type: ["damage", "interrupt"],
        },
        {
          name: "Rebuke",
          id: 96_231,
          cd: 15,
          icon: "spell_holy_rebuke",
          type: ["interrupt"],
        },
      ],
    },
    {
      name: SpecName.Holy,
      role: Role.healer,
      cooldowns: [
        {
          name: "Avenging Crusader",
          id: 216_331,
          cd: 120,
          icon: "ability_paladin_veneration",
          type: [],
        },
        {
          name: "Aura Mastery",
          id: 31_821,
          cd: 180,
          icon: "spell_holy_auramastery",
          type: ["major", "defensive"],
        },
        {
          name: "Divine Protection",
          id: 498,
          cd: 60,
          icon: "spell_holy_divineprotection",
          type: [],
        },
        {
          name: "Light's Hammer",
          id: 114_158,
          cd: 60,
          icon: "spell_paladin_lightshammer",
          type: [],
        },
      ],
    },
    {
      name: SpecName.Retribution,
      role: Role.dps,
      cooldowns: [
        {
          name: "Shield of Vengeance",
          id: 184_662,
          cd: 120,
          icon: "ability_paladin_shieldofthetemplar",
          type: [],
        },
        {
          name: "Execution Sentence",
          id: 343_527,
          cd: 60,
          icon: "spell_paladin_executionsentence",
          type: [],
        },
        {
          name: "Crusade",
          id: 231_895,
          cd: 120,
          icon: "ability_paladin_sanctifiedwrath",
          type: [],
        },
        {
          name: "Final Reckoning",
          id: 343_721,
          cd: 60,
          icon: "spell_holy_blessedresillience",
          type: [],
        },
        {
          name: "Eye for an Eye",
          id: 205_191,
          cd: 60,
          icon: "spell_holy_weaponmastery",
          type: [],
        },
        {
          name: "Rebuke",
          id: 96_231,
          cd: 15,
          icon: "spell_holy_rebuke",
          type: ["interrupt"],
        },
      ],
    },
  ],
  id: 10,
};

const warlock: Class = {
  name: PlayableClass.Warlock,
  cooldowns: [
    {
      name: "Create Soulwell",
      id: 29_893,
      cd: 120,
      icon: "spell_shadow_shadesofdarkness",
      type: ["major", "utility"],
    },
    {
      name: "Shadowfury",
      id: 30_283,
      cd: 60,
      icon: "ability_warlock_shadowfurytga",
      type: ["damage", "cc"],
    },
    {
      name: "Unending Resolve",
      id: 104_773,
      cd: 180,
      icon: "spell_shadow_demonictactics",
      type: ["major", "defensive"],
    },
    {
      name: "Soulstone",
      id: 20_707,
      cd: 600,
      icon: "spell_shadow_soulgem",
      type: ["utility", "major"],
    },
    {
      name: "Ritual of Summoning",
      id: 698,
      cd: 120,
      icon: "spell_shadow_twilight",
      type: ["utility", "major"],
    },
    {
      name: "Ritual of Doom",
      id: 342_601,
      cd: 3600,
      icon: "warlock_sacrificial_pact",
      type: ["major"],
    },
    {
      name: "Fel Domination",
      id: 333_889,
      cd: 180,
      icon: "spell_shadow_felmending",
      type: [],
    },
  ],
  covenantAbilities: [
    {
      name: "Impending Catastrophe",
      id: 321_792,
      cd: 60,
      icon: "ability_revendreth_warlock",
      type: ["covenant"],
    },
    {
      name: "Soul Rot",
      id: 325_640,
      cd: 60,
      icon: "ability_ardenweald_warlock",
      type: ["covenant"],
    },
    {
      name: "Scouring Tithe",
      id: 312_321,
      cd: 40,
      icon: "ability_bastion_warlock",
      type: ["covenant"],
    },
    {
      name: "Decimating Bolt",
      id: 325_289,
      cd: 45,
      icon: "ability_maldraxxus_warlock",
      type: ["covenant"],
    },
    {
      name: "Spell Lock",
      id: 19_647,
      cd: 24,
      icon: "spell_shadow_mindrot",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.Destruction,
      role: Role.dps,
      cooldowns: [
        {
          name: "Dark Soul: Instability",
          id: 113_858,
          cd: 120,
          icon: "spell_warlock_soulburn",
          type: [],
        },
        {
          name: "Summon Infernal",
          id: 1122,
          cd: 180,
          icon: "spell_shadow_summoninfernal",
          type: ["major", "damage"],
        },
      ],
    },
    {
      name: SpecName.Demonology,
      role: Role.dps,
      cooldowns: [
        {
          name: "Nether Portal",
          id: 267_217,
          cd: 180,
          icon: "inv_netherportal",
          type: [],
        },
        {
          name: "Grimoire: Felguard",
          id: 111_898,
          cd: 120,
          icon: "spell_shadow_summonfelguard",
          type: [],
        },
        {
          name: "Summon Demonic Tyrant",
          id: 265_187,
          cd: 90,
          icon: "inv_summondemonictyrant",
          type: [],
        },
        {
          name: "Demonic Strength",
          id: 267_171,
          cd: 60,
          icon: "ability_warlock_demonicempowerment",
          type: [],
        },
        {
          name: "Axe Toss",
          id: 89_766,
          cd: 30,
          icon: "ability_warrior_titansgrip",
          type: ["interrupt"],
        },
      ],
    },
    {
      name: SpecName.Affliction,
      role: Role.dps,
      cooldowns: [
        {
          name: "Dark Soul: Misery",
          id: 113_860,
          cd: 120,
          icon: "spell_warlock_soulburn",
          type: [],
        },
        {
          name: "Summon Darkglare",
          id: 205_180,
          cd: 120,
          icon: "inv_beholderwarlock",
          type: ["damage", "major"],
        },
      ],
    },
  ],
  id: 11,
};

const deathknight: Class = {
  name: PlayableClass.DeathKnight,
  cooldowns: [
    {
      name: "Anti-Magic Shell",
      id: 48_707,
      cd: 60,
      icon: "spell_shadow_antimagicshell",
      type: ["defensive"],
    },
    {
      name: "Icebound Fortitude",
      id: 48_792,
      cd: 180,
      icon: "spell_deathknight_iceboundfortitude",
      type: ["defensive", "major"],
    },
    {
      name: "Raise Ally",
      id: 61_999,
      cd: 600,
      icon: "spell_shadow_deadofnight",
      type: ["utility", "major"],
    },
    {
      name: "Lichborne",
      id: 49_039,
      cd: 120,
      icon: "spell_shadow_raisedead",
      type: [],
    },
    {
      name: "Sacrificial Pact",
      id: 327_574,
      cd: 120,
      icon: "spell_shadow_corpseexplode",
      type: [],
    },
    {
      name: "Raise Dead",
      id: 46_585,
      cd: 120,
      icon: "inv_pet_ghoul",
      type: [],
    },
    {
      name: "Anti-Magic Zone",
      id: 51_052,
      cd: 120,
      icon: "spell_deathknight_antimagiczone",
      type: ["major", "defensive"],
    },
    {
      name: "Wraith Walk",
      id: 212_552,
      cd: 60,
      icon: "inv_helm_plate_raiddeathknight_p_01",
      type: ["utility"],
    },
    {
      name: "Death Pact",
      id: 48_743,
      cd: 120,
      icon: "spell_shadow_deathpact",
      type: [],
    },
    {
      name: "Mind Freeze",
      id: 47_528,
      cd: 15,
      icon: "spell_deathknight_mindfreeze",
      type: ["interrupt"],
    },
  ],
  covenantAbilities: [
    {
      name: "Shackle the Unworthy",
      id: 312_202,
      cd: 60,
      icon: "ability_bastion_deathknight",
      type: ["covenant"],
    },
    {
      name: "Abomination Limb",
      id: 315_443,
      cd: 120,
      icon: "ability_maldraxxus_deathknight",
      type: ["covenant"],
    },
    {
      name: "Swarming Mist",
      id: 311_648,
      cd: 60,
      icon: "ability_revendreth_deathknight",
      type: ["covenant"],
    },
    {
      name: "Death's Due",
      id: 324_128,
      cd: 30,
      icon: "ability_ardenweald_deathknight",
      type: ["covenant"],
    },
  ],
  specs: [
    {
      name: SpecName.Blood,
      role: Role.tank,
      cooldowns: [
        {
          name: "Bonestorm",
          id: 194_844,
          cd: 60,
          icon: "achievement_boss_lordmarrowgar",
          type: [],
        },
        {
          name: "Tombstone",
          id: 219_809,
          cd: 60,
          icon: "ability_fiegndead",
          type: [],
        },
        {
          name: "Blood Tap",
          id: 221_699,
          cd: 60,
          icon: "spell_deathknight_bloodtap",
          type: [],
        },
        {
          name: "Vampiric Blood",
          id: 55_233,
          cd: 90,
          icon: "spell_shadow_lifedrain",
          type: [],
        },
        {
          name: "Gorefiend's Grasp",
          id: 108_199,
          cd: 120,
          icon: "ability_deathknight_aoedeathgrip",
          type: [],
        },
        {
          name: "Dancing Rune Weapon",
          id: 49_028,
          cd: 120,
          icon: "inv_sword_07",
          type: [],
        },
      ],
    },
    {
      name: SpecName.Unholy,
      role: Role.dps,
      cooldowns: [
        {
          name: "Summon Gargoyle",
          id: 49_206,
          cd: 180,
          icon: "ability_deathknight_summongargoyle",
          type: ["damage", "major"],
        },
        {
          name: "Unholy Assault",
          id: 207_289,
          cd: 75,
          icon: "spell_shadow_unholyfrenzy",
          type: [],
        },
        {
          name: "Army of the Dead",
          id: 42_650,
          cd: 480,
          icon: "spell_deathknight_armyofthedead",
          type: ["damage", "major"],
        },
        {
          name: "Dark Transformation",
          id: 63_560,
          cd: 60,
          icon: "achievement_boss_festergutrotface",
          type: ["damage"],
        },
        {
          name: "Apocalypse",
          id: 275_699,
          cd: 90,
          icon: "artifactability_unholydeathknight_deathsembrace",
          type: ["damage"],
        },
      ],
    },
    {
      name: SpecName.Frost,
      role: Role.dps,
      cooldowns: [
        {
          name: "Breath of Sindragosa",
          id: 152_279,
          cd: 120,
          icon: "spell_deathknight_breathofsindragosa",
          type: [],
        },
        {
          name: "Empower Rune Weapon",
          id: 47_568,
          cd: 120,
          icon: "inv_sword_62",
          type: [],
        },
        {
          name: "Frostwyrm's Fury",
          id: 279_302,
          cd: 180,
          icon: "achievement_boss_sindragosa",
          type: [],
        },
        {
          name: "Blinding Sleet",
          id: 207_167,
          cd: 60,
          icon: "spell_frost_chillingblast",
          type: [],
        },
        {
          name: "Pillar of Frost",
          id: 51_271,
          cd: 60,
          icon: "ability_deathknight_pillaroffrost",
          type: [],
        },
      ],
    },
  ],
  id: 12,
};

export const classes: Class[] = [
  warrior,
  mage,
  rogue,
  shaman,
  priest,
  hunter,
  monk,
  druid,
  demonhunter,
  paladin,
  warlock,
  deathknight,
];

export const classMapById: Record<Class["id"], Class["name"]> =
  Object.fromEntries(
    classes.map((classData) => [classData.id, classData.name])
  );

export const classMapByName = Object.fromEntries<Class["id"]>(
  classes.map((classData) => [classData.name, classData.id])
);

export const classMap = Object.fromEntries(
  classes.map(({ id, ...rest }) => [id, rest])
);
