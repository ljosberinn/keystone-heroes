/* eslint-disable sonarjs/no-duplicate-string */
import { Role, SpecName, PlayableClass } from "@prisma/client";

type Ability = {
  name: string;
  id: number;
  cd:
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

type Class = {
  id: number;
  name: PlayableClass;
  specs: { name: SpecName; role: Role; cooldowns: Ability[] }[];
  cooldowns: Ability[];
  covenantAbilities: Ability[];
};

export const classes: Class[] = [
  {
    name: PlayableClass.Warrior,
    cooldowns: [
      {
        name: "Recklessness",
        id: 1719,
        cd: 90,
        icon: "warrior_talent_icon_innerrage",
      },
      {
        name: "Rallying Cry",
        id: 97_462,
        cd: 180,
        icon: "ability_warrior_rallyingcry",
      },
      {
        name: "Challenging Shout",
        id: 1161,
        cd: 240,
        icon: "ability_bullrush",
      },
      {
        name: "Intimidating Shout",
        id: 5246,
        cd: 90,
        icon: "ability_golemthunderclap",
      },
      {
        name: "Shattering Throw",
        id: 64_382,
        cd: 180,
        icon: "ability_warrior_shatteringthrow",
      },
      {
        name: "Berserker Rage",
        id: 18_499,
        cd: 60,
        icon: "spell_nature_ancestralguardian",
      },
      {
        name: "Pummel",
        id: 6552,
        cd: 15,
        icon: "inv_gauntlets_04",
      },
      {
        name: "Spell Reflection",
        id: 23_920,
        cd: 25,
        icon: "ability_warrior_shieldreflection",
      },
    ],
    covenantAbilities: [
      {
        name: "Spear of Bastion",
        id: 307_865,
        cd: 60,
        icon: "ability_bastion_warrior",
      },
      {
        name: "Conqueror's Banner",
        id: 324_143,
        cd: 120,
        icon: "ability_maldraxxus_warriorplantbanner",
      },
      {
        name: "Ancient Aftershock",
        id: 325_886,
        cd: 90,
        icon: "ability_ardenweald_warrior",
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
          },
          {
            name: "Avatar",
            id: 107_574,
            cd: 90,
            icon: "warrior_talent_icon_avatar",
          },
          {
            name: "Last Stand",
            id: 12_975,
            cd: 180,
            icon: "spell_holy_ashestoashes",
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
          },
          {
            name: "Enraged Regeneration",
            id: 184_364,
            cd: 120,
            icon: "ability_warrior_focusedrage",
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
          },
          {
            name: "Deadly Calm",
            id: 262_228,
            cd: 60,
            icon: "achievement_boss_kingymiron",
          },
          {
            name: "Bladestorm",
            id: 227_847,
            cd: 90,
            icon: "ability_warrior_bladestorm",
          },
          {
            name: "Colossus Smash",
            cd: 90,
            id: 167_105,
            icon: "ability_warrior_colossussmash",
          },
        ],
      },
    ],
    id: 1,
  },
  {
    name: PlayableClass.Mage,
    cooldowns: [
      {
        name: "Invisibility",
        id: 66,
        cd: 300,
        icon: "ability_mage_invisibility",
      },
      { name: "Time Warp", id: 80_353, cd: 300, icon: "ability_mage_timewarp" },
      { name: "Ice Block", id: 45_438, cd: 240, icon: "spell_frost_frost" },
      {
        name: "Mirror Image",
        id: 55_342,
        cd: 120,
        icon: "spell_magic_lesserinvisibilty",
      },
      {
        name: "Counterspell",
        id: 2139,
        cd: 24,
        icon: "spell_frost_iceshock",
      },
    ],
    covenantAbilities: [
      {
        name: "Mirrors of Torment",
        id: 314_793,
        cd: 90,
        icon: "ability_revendreth_mage",
      },
      {
        name: "Radiant Spark",
        id: 307_443,
        cd: 30,
        icon: "ability_bastion_mage",
      },
      {
        name: "Deathborne",
        id: 324_220,
        cd: 180,
        icon: "ability_maldraxxus_mage",
      },
      {
        name: "Shifting Power",
        id: 314_791,
        cd: 60,
        icon: "ability_ardenweald_mage",
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
          },
          {
            name: "Alter Time",
            id: 108_978,
            cd: 60,
            icon: "spell_mage_altertime",
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
          },
          {
            name: "Frozen Orb",
            id: 84_714,
            cd: 60,
            icon: "spell_frost_frozenorb",
          },
          {
            name: "Alter Time",
            id: 108_978,
            cd: 60,
            icon: "spell_mage_altertime",
          },
          {
            name: "Cold Snap",
            id: 235_219,
            cd: 270,
            icon: "spell_frost_wizardmark",
          },
          {
            name: "Ray of Frost",
            id: 205_021,
            cd: 75,
            icon: "ability_mage_rayoffrost",
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
          },
          {
            name: "Presence of Mind",
            id: 198_154,
            cd: 60,
            icon: "spell_nature_enchantarmor",
          },
        ],
      },
    ],
    id: 2,
  },
  {
    name: PlayableClass.Rogue,
    cooldowns: [
      {
        name: "Shroud of Concealment",
        id: 114_018,
        cd: 360,
        icon: "ability_rogue_shroudofconcealment",
      },
      { name: "Blind", id: 2094, cd: 120, icon: "spell_shadow_mindsteal" },
      { name: "Sprint", id: 2983, cd: 120, icon: "ability_rogue_sprint" },
      { name: "Evasion", id: 5277, cd: 120, icon: "spell_shadow_shadowward" },
      {
        name: "Cloak of Shadows",
        id: 31_224,
        cd: 120,
        icon: "spell_shadow_nethercloak",
      },
      { name: "Vanish", id: 1856, cd: 120, icon: "ability_vanish" },
      {
        name: "Marked for Death",
        id: 137_619,
        cd: 60,
        icon: "achievement_bg_killingblow_berserker",
      },
      {
        name: "Kick",
        id: 1766,
        cd: 15,
        icon: "ability_kick",
      },
    ],
    covenantAbilities: [
      {
        name: "Echoing Reprimand",
        id: 323_547,
        cd: 45,
        icon: "ability_bastion_rogue",
      },
      {
        name: "Flagellation",
        id: 323_654,
        cd: 90,
        icon: "ability_revendreth_rogue",
      },
      {
        name: "Serrated Bone Spike",
        id: 328_547,
        cd: 90,
        icon: "ability_maldraxxus_rogue",
      },
      { name: "Sepsis", id: 328_305, cd: 90, icon: "ability_ardenweald_rogue" },
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
          },
          {
            name: "Shadow Blades",
            id: 121_471,
            cd: 180,
            icon: "inv_knife_1h_grimbatolraid_d_03",
          },
          {
            name: "Shuriken Tornado",
            id: 277_925,
            cd: 60,
            icon: "ability_rogue_throwingspecialization",
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
          },
          {
            name: "Killing Spree",
            id: 51_690,
            cd: 120,
            icon: "ability_rogue_murderspree",
          },
        ],
      },
    ],
    id: 3,
  },
  {
    name: PlayableClass.Shaman,
    cooldowns: [
      {
        name: "Capacitator Totem",
        id: 192_058,
        cd: 60,
        icon: "spell_nature_brilliance",
      },
      { name: "Bloodlust", id: 2825, cd: 300, icon: "spell_nature_bloodlust" },
      { name: "Heroism", id: 32_182, cd: 300, icon: "ability_shaman_heroism" },
      {
        name: "Earth Elemental",
        id: 198_103,
        cd: 300,
        icon: "spell_nature_earthelemental_totem",
      },
      {
        name: "Astral Shift",
        id: 108_271,
        cd: 90,
        icon: "ability_shaman_astralshift",
      },
      {
        name: "Tremor Totem",
        id: 8143,
        cd: 60,
        icon: "spell_nature_tremortotem",
      },
      {
        name: "Wind Shear",
        id: 57_994,
        cd: 12,
        icon: "spell_nature_cyclone",
      },
    ],
    covenantAbilities: [
      {
        name: "Vesper Totem",
        id: 324_386,
        cd: 60,
        icon: "ability_bastion_shaman",
      },
      {
        name: "Chain Harvest",
        id: 320_674,
        cd: 90,
        icon: "ability_revendreth_shaman",
      },
      {
        name: "Primordial Wave",
        id: 326_059,
        cd: 30,
        icon: "ability_maldraxxus_shaman",
      },
      {
        name: "Fae Transfusion",
        id: 328_923,
        cd: 120,
        icon: "ability_ardenweald_shaman",
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
          },
          {
            name: "Spiritwalker's Grace",
            id: 79_206,
            cd: 120,
            icon: "spell_shaman_spiritwalkersgrace",
          },
          {
            name: "Ascendance",
            id: 114_052,
            cd: 180,
            icon: "spell_fire_elementaldevastation",
          },
          {
            name: "Ancestral Protection Totem",
            id: 207_399,
            cd: 300,
            icon: "spell_nature_reincarnation",
          },
          {
            name: "Healing Tide Totem",
            id: 108_280,
            cd: 180,
            icon: "ability_shaman_healingtide",
          },
          {
            name: "Mana Tide Totem",
            id: 16_191,
            cd: 180,
            icon: "spell_frost_summonwaterelemental",
          },
          {
            name: "Earthen Wall Totem",
            id: 198_838,
            cd: 60,
            icon: "spell_nature_stoneskintotem",
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
          },
          {
            name: "Stormkeeper",
            id: 191_634,
            cd: 60,
            icon: "ability_thunderking_lightningwhip",
          },
          {
            name: "Spiritwalker's Grace",
            id: 79_206,
            cd: 120,
            icon: "spell_shaman_spiritwalkersgrace",
          },
          {
            name: "Ancestral Guidance",
            id: 108_281,
            cd: 120,
            icon: "ability_shaman_ancestralguidance",
          },
          {
            name: "Liquid Magma Totem",
            id: 192_222,
            cd: 60,
            icon: "spell_shaman_spewlava",
          },
          {
            name: "Storm Elemental",
            id: 192_249,
            cd: 150,
            icon: "inv_stormelemental",
          },
          {
            name: "Fire Elemental",
            id: 198_067,
            cd: 150,
            icon: "spell_fire_elemental_totem",
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
          },
          {
            name: "Ascendance",
            id: 114_051,
            cd: 180,
            icon: "spell_fire_elementaldevastation",
          },
          {
            name: "Stormkeeper",
            id: 320_137,
            cd: 60,
            icon: "ability_thunderking_lightningwhip",
          },
          { name: "Spirit Walk", id: 58_875, cd: 60, icon: "ability_tracking" },
        ],
      },
    ],
    id: 4,
  },
  {
    name: PlayableClass.Priest,
    cooldowns: [
      {
        name: "Power Infusion",
        id: 10_060,
        cd: 120,
        icon: "spell_holy_powerinfusion",
      },
      {
        name: "Leap of Faith",
        id: 73_325,
        cd: 90,
        icon: "priest_spell_leapoffaith_a",
      },
      {
        name: "Desperate Prayer",
        id: 19_236,
        cd: 90,
        icon: "spell_holy_testoffaith",
      },
      {
        name: "Psychic Scream",
        id: 8122,
        cd: 60,
        icon: "spell_shadow_psychicscream",
      },
      {
        name: "Power Word: Barrier",
        id: 62_618,
        cd: 180,
        icon: "spell_holy_powerwordbarrier",
      },
    ],
    covenantAbilities: [
      {
        name: "Boon of the Ascended",
        id: 325_013,
        cd: 180,
        icon: "ability_bastion_priest",
      },
      {
        name: "Mindgames",
        id: 323_673,
        cd: 45,
        icon: "ability_revendreth_priest",
      },
      {
        name: "Unholy Nova",
        id: 324_724,
        cd: 60,
        icon: "ability_maldraxxus_priest",
      },
      {
        name: "Fae Guardians",
        id: 327_661,
        cd: 90,
        icon: "ability_ardenweald_priest",
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
          },
          {
            name: "Mindbender",
            id: 200_174,
            cd: 60,
            icon: "spell_shadow_soulleech_3",
          },
          {
            name: "Dispersion",
            id: 47_585,
            cd: 120,
            icon: "spell_shadow_dispersion",
          },
          {
            name: "Shadowfiend",
            id: 34_433,
            cd: 180,
            icon: "spell_shadow_shadowfiend",
          },
          {
            name: "Vampiric Embrace",
            id: 15_286,
            cd: 120,
            icon: "spell_shadow_unsummonbuilding",
          },
          {
            name: "Void Eruption",
            id: 228_260,
            cd: 90,
            icon: "spell_priest_void-blast",
          },
          {
            name: "Silence",
            id: 15_487,
            cd: 45,
            icon: "ability_priest_silence",
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
          },
          {
            name: "Divine Hymn",
            id: 64_843,
            cd: 180,
            icon: "spell_holy_divinehymn",
          },
          {
            name: "Symbol of Hope",
            id: 64_901,
            cd: 300,
            icon: "spell_holy_symbolofhope",
          },
          {
            name: "Apotheosis",
            id: 200_183,
            cd: 120,
            icon: "ability_priest_ascension",
          },
          {
            name: "Holy Word: Serenity",
            id: 2050,
            cd: 60,
            icon: "spell_holy_persuitofjustice",
          },
          {
            name: "Holy Word: Salvation",
            id: 265_202,
            cd: 720,
            icon: "ability_priest_archangel",
          },
          {
            name: "Holy Word: Sanctify",
            id: 34_861,
            cd: 60,
            icon: "spell_holy_divineprovidence",
          },
          {
            name: "Holy Word: Chastise",
            id: 88_625,
            cd: 60,
            icon: "spell_holy_chastise",
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
          },
          {
            name: "Evangelism",
            id: 246_287,
            cd: 90,
            icon: "spell_holy_divineillumination",
          },
          {
            name: "Spirit Shell",
            id: 109_964,
            cd: 90,
            icon: "ability_shaman_astralshift",
          },
          {
            name: "Power Word: Barrier",
            id: 62_618,
            cd: 180,
            icon: "spell_holy_powerwordbarrier",
          },
          { name: "Rapture", id: 47_536, cd: 90, icon: "spell_holy_rapture" },
          {
            name: "Mindbender",
            id: 123_040,
            cd: 60,
            icon: "spell_shadow_soulleech_3",
          },
          {
            name: "Shadowfiend",
            id: 34_433,
            cd: 180,
            icon: "spell_shadow_shadowfiend",
          },
        ],
      },
    ],
    id: 5,
  },
  {
    name: PlayableClass.Hunter,
    cooldowns: [
      {
        name: "Aspect of the Turtle",
        id: 186_265,
        cd: 180,
        icon: "ability_hunter_pet_turtle",
      },
      {
        name: "Aspect of the Cheetah",
        id: 186_257,
        cd: 180,
        icon: "ability_mount_jungletiger",
      },
      {
        name: "Exhilaration",
        id: 109_304,
        cd: 120,
        icon: "ability_hunter_onewithnature",
      },
      {
        name: "A Murder of Crows",
        id: 131_894,
        cd: 60,
        icon: "ability_hunter_murderofcrows",
      },
    ],
    covenantAbilities: [
      {
        name: "Wild Spirits",
        id: 328_231,
        cd: 120,
        icon: "ability_ardenweald_hunter",
      },
      {
        name: "Resonating Arrow",
        id: 308_491,
        cd: 60,
        icon: "ability_bastion_hunter",
      },
      {
        name: "Flayed Shot",
        id: 324_149,
        cd: 30,
        icon: "ability_revendreth_hunter",
      },
      {
        name: "Death Chakram",
        id: 325_028,
        cd: 45,
        icon: "ability_maldraxxus_hunter",
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
          },
          {
            name: "Aspect of the Wild",
            id: 193_530,
            cd: 120,
            icon: "spell_nature_protectionformnature",
          },
          {
            name: "Bloodshed",
            id: 321_530,
            cd: 60,
            icon: "ability_druid_primaltenacity",
          },
          {
            name: "Stampede",
            id: 201_430,
            cd: 120,
            icon: "ability_hunter_bestialdiscipline",
          },
          { name: "Intimidation", id: 19_577, cd: 60, icon: "ability_devour" },
          {
            name: "Counter Shot",
            id: 147_362,
            cd: 24,
            icon: "inv_ammo_arrow_03",
          },
        ],
      },
      {
        name: SpecName.Survival,
        role: Role.dps,
        cooldowns: [
          { name: "Intimidation", id: 19_577, cd: 60, icon: "ability_devour" },
          {
            name: "Aspect of the Eagle",
            id: 186_289,
            cd: 90,
            icon: "spell_hunter_aspectoftheironhawk",
          },
          {
            name: "Coordinated Assault",
            id: 266_779,
            cd: 120,
            icon: "inv_coordinatedassault",
          },
          {
            name: "Muzzle",
            id: 187_707,
            cd: 15,
            icon: "ability_hunter_negate",
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
          },
          { name: "Trueshot", id: 288_613, cd: 120, icon: "ability_trueshot" },
          {
            name: "Counter Shot",
            id: 147_362,
            cd: 24,
            icon: "inv_ammo_arrow_03",
          },
        ],
      },
    ],
    id: 6,
  },
  {
    name: PlayableClass.Monk,
    cooldowns: [
      { name: "Leg Sweep", id: 119_381, cd: 60, icon: "ability_monk_legsweep" },
      {
        name: "Dampen Harm",
        id: 122_278,
        cd: 120,
        icon: "ability_monk_dampenharm",
      },
    ],
    covenantAbilities: [
      {
        name: "Weapons of Order",
        id: 310_454,
        cd: 120,
        icon: "ability_bastion_monk",
      },
      {
        name: "Fallen Order",
        id: 326_860,
        cd: 180,
        icon: "ability_revendreth_monk",
      },
      {
        name: "Bonedust Brew",
        id: 325_216,
        cd: 60,
        icon: "ability_maldraxxus_monk",
      },
      {
        name: "Faeline Stomp",
        id: 327_104,
        cd: 30,
        icon: "ability_ardenweald_monk",
      },
      {
        name: "Touch of Death",
        id: 322_109,
        icon: "ability_monk_touchofdeath",
        cd: 180,
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
          },
          {
            name: "Invoke Yu'lon, the Jade Serpent",
            id: 322_118,
            cd: 180,
            icon: "ability_monk_dragonkick",
          },
          {
            name: "Invoke Chi-Ji, the Red Crane",
            id: 325_197,
            cd: 180,
            icon: "inv_pet_cranegod",
          },
          { name: "Revival", id: 115_310, cd: 180, icon: "spell_monk_revival" },
          {
            name: "Life Cocoon",
            id: 116_849,
            cd: 120,
            icon: "ability_monk_chicocoon",
          },
          {
            name: "Mana Tea",
            id: 197_908,
            cd: 90,
            icon: "monk_ability_cherrymanatea",
          },
          {
            name: "Fortifying Brew",
            id: 115_203,
            cd: 180,
            icon: "ability_monk_fortifyingale_new",
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
          },
          {
            name: "Black Ox Brew",
            id: 115_399,
            cd: 120,
            icon: "ability_monk_chibrew",
          },
          {
            name: "Invoke Niuzao, the Black Ox",
            id: 132_578,
            cd: 180,
            icon: "spell_monk_brewmaster_spec",
          },
          {
            name: "Zen Meditation",
            id: 115_176,
            cd: 300,
            icon: "ability_monk_zenmeditation",
          },
          {
            name: "Celestial Brew",
            id: 322_507,
            cd: 60,
            icon: "ability_monk_ironskinbrew",
          },
          {
            name: "Fortifying Brew",
            id: 115_203,
            cd: 360,
            icon: "ability_monk_fortifyingale_new",
          },
          {
            name: "Spear Hand Strike",
            id: 116_705,
            cd: 15,
            icon: "ability_monk_spearhand",
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
          },
          {
            name: "Storm, Earth and Fire",
            id: 137_639,
            cd: 90,
            icon: "spell_nature_giftofthewild",
          },
          {
            name: "Touch of Karma",
            id: 122_470,
            cd: 90,
            icon: "ability_monk_touchofkarma",
          },
          {
            name: "Diffuse Magic",
            id: 122_783,
            cd: 90,
            icon: "spell_monk_diffusemagic",
          },
          {
            name: "Fortifying Brew",
            id: 115_203,
            cd: 180,
            icon: "ability_monk_fortifyingale_new",
          },
          {
            name: "Serenity",
            id: 152_173,
            cd: 90,
            icon: "ability_monk_serenity",
          },
          {
            name: "Energy",
            id: 115_288,
            cd: 60,
            icon: "ability_monk_energizingwine",
          },
          {
            name: "Spear Hand Strike",
            id: 116_705,
            cd: 15,
            icon: "ability_monk_spearhand",
          },
        ],
      },
    ],
    id: 7,
  },
  {
    name: PlayableClass.Druid,
    cooldowns: [
      {
        name: "Rebirth",
        id: 20_484,
        cd: 600,
        icon: "spell_nature_reincarnation",
      },
      {
        name: "Barkskin",
        id: 22_812,
        cd: 60,
        icon: "spell_nature_stoneclawtotem",
      },
      { name: "Dash", id: 1850, cd: 120, icon: "ability_druid_dash" },
      {
        name: "Stampeding Roar",
        id: 106_898,
        cd: 120,
        icon: "spell_druid_stampedingroar_cat",
      },
      {
        name: "Ursol's Vortex",
        id: 102_793,
        cd: 60,
        icon: "spell_druid_ursolsvortex",
      },
      { name: "Mighty Bash", id: 5211, cd: 60, icon: "ability_druid_bash" },
      {
        name: "Heart of the Wild",
        id: 319_454,
        cd: 300,
        icon: "spell_holy_blessingofagility",
      },
      {
        name: "Renewal",
        id: 108_238,
        cd: 90,
        icon: "spell_nature_natureblessing",
      },
    ],
    covenantAbilities: [
      {
        name: "Convoke the Spirits",
        id: 323_764,
        cd: 120,
        icon: "ability_ardenweald_druid",
      },
      {
        name: "Ravenous Frenzy",
        id: 323_546,
        cd: 180,
        icon: "ability_revendreth_druid",
      },
      {
        name: "Kindred Spirits",
        id: 326_434,
        cd: 60,
        icon: "ability_bastion_druid",
      },
      {
        name: "Adaptive Swarm",
        id: 325_727,
        cd: 25,
        icon: "ability_maldraxxus_druid",
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
          },
          {
            name: "Nature's Swiftness",
            id: 132_158,
            cd: 60,
            icon: "spell_nature_ravenform",
          },
          {
            name: "Flourish",
            id: 197_721,
            cd: 90,
            icon: "spell_druid_wildburst",
          },
          {
            name: "Ironbark",
            id: 102_342,
            cd: 90,
            icon: "spell_druid_ironbark",
          },
          {
            name: "Tranquility",
            id: 740,
            cd: 180,
            icon: "spell_nature_tranquility",
          },
          {
            name: "Overgrowth",
            id: 203_651,
            cd: 60,
            icon: "ability_druid_overgrowth",
          },
          {
            name: "Incarnation: Tree of Life",
            id: 33_891,
            cd: 180,
            icon: "ability_druid_improvedtreeform",
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
          },
          {
            name: "Incarnation: Guardian of Ursoc",
            id: 102_558,
            cd: 180,
            icon: "spell_druid_incarnation",
          },
          {
            name: "Berserk",
            id: 50_334,
            cd: 180,
            icon: "ability_druid_berserk",
          },
          {
            name: "Skull Bash",
            id: 106_839,
            cd: 15,
            icon: "inv_bone_skull_04",
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
          },
          {
            name: "Innervate",
            id: 29_166,
            cd: 120,
            icon: "spell_nature_lightning",
          },
          {
            name: "Force of Nature",
            id: 205_636,
            cd: 60,
            icon: "ability_druid_forceofnature",
          },
          {
            name: "Solar Beam",
            id: 97_547, // technically 78_675
            cd: 60,
            icon: "ability_vehicle_sonicshockwave",
          },
          {
            name: "Celestial Alignment",
            id: 194_223,
            cd: 180,
            icon: "spell_nature_natureguardian",
          },
          {
            name: "Incarnation: Chosen of Elune",
            id: 102_560,
            cd: 180,
            icon: "spell_druid_incarnation",
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
          },
          {
            name: "Berserk",
            id: 106_951,
            cd: 180,
            icon: "ability_druid_berserk",
          },
          {
            name: "Survival Instincts",
            id: 61_336,
            cd: 180,
            icon: "ability_druid_tigersroar",
          },
          {
            name: "Skull Bash",
            id: 106_839,
            cd: 15,
            icon: "inv_bone_skull_04",
          },
        ],
      },
    ],
    id: 8,
  },
  {
    name: PlayableClass.DemonHunter,
    cooldowns: [
      {
        name: "Spectral Sight",
        id: 188_501,
        cd: 60,
        icon: "ability_demonhunter_spectralsight",
      },
      {
        name: "Disrupt",
        id: 183_752,
        cd: 15,
        icon: "ability_demonhunter_consumemagic",
      },
    ],
    covenantAbilities: [
      {
        name: "Elysian Decree",
        id: 306_830,
        cd: 60,
        icon: "ability_bastion_demonhunter",
      },
      {
        name: "The Hunt",
        id: 323_639,
        cd: 90,
        icon: "ability_ardenweald_demonhunter",
      },
      {
        name: "Sinful Brand",
        id: 317_009,
        cd: 60,
        icon: "ability_revendreth_demonhunter",
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
          },
          {
            name: "Fel Devastation",
            id: 212_084,
            cd: 60,
            icon: "ability_demonhunter_feldevastation",
          },
          {
            name: "Fiery Brand",
            id: 204_021,
            cd: 60,
            icon: "ability_demonhunter_fierybrand",
          },
          {
            name: "Bulk Extraction",
            id: 320_341,
            cd: 90,
            icon: "spell_shadow_shadesofdarkness",
          },
          {
            name: "Sigil of Silence",
            id: 202_137,
            cd: 60,
            icon: "ability_demonhunter_sigilofsilence",
          },
          {
            name: "Sigil of Chains",
            id: 202_138,
            cd: 90,
            icon: "ability_demonhunter_sigilofchains",
          },
          {
            name: "Sigil of Misery",
            id: 207_684,
            cd: 90,
            icon: "ability_demonhunter_sigilofmisery",
          },
          {
            name: "Last Resort",
            id: 209_258,
            cd: 480,
            icon: "inv_glaive_1h_artifactaldorchi_d_06",
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
          },
          { name: "Fel Barrage", id: 258_925, cd: 60, icon: "inv_felbarrage" },
          {
            name: "Darkness",
            id: 196_718,
            cd: 180,
            icon: "ability_demonhunter_darkness",
          },
          {
            name: "Netherwalk",
            id: 196_555,
            cd: 180,
            icon: "spell_warlock_demonsoul",
          },
          {
            name: "Metamorphosis",
            id: 191_427,
            cd: 240,
            icon: "ability_demonhunter_metamorphasisdps",
          },
          {
            name: "Blur",
            id: 198_589,
            cd: 60,
            icon: "ability_demonhunter_blur",
          },
        ],
      },
    ],
    id: 9,
  },
  {
    name: PlayableClass.Paladin,
    cooldowns: [
      {
        name: "Avenging Wrath",
        id: 31_884,
        cd: 120,
        icon: "spell_holy_avenginewrath",
      },
      {
        name: "Blessing of Protection",
        id: 1022,
        cd: 300,
        icon: "spell_holy_sealofprotection",
      },
      {
        name: "Divine Shield",
        id: 642,
        cd: 300,
        icon: "spell_holy_divineshield",
      },
      {
        name: "Blessing of Sacrifice",
        id: 6940,
        cd: 120,
        icon: "spell_holy_sealofsacrifice",
      },
      {
        name: "Hammer of Justice",
        id: 853,
        cd: 60,
        icon: "spell_holy_sealofmight",
      },
      { name: "Lay on Hands", id: 633, cd: 600, icon: "spell_holy_layonhands" },
      {
        name: "Blinding Light",
        id: 115_750,
        cd: 90,
        icon: "ability_paladin_blindinglight",
      },
    ],
    covenantAbilities: [
      {
        name: "Ashen Hallow",
        id: 316_958,
        cd: 240,
        icon: "ability_revendreth_paladin",
      },
      {
        name: "Divine Toll",
        id: 304_971,
        cd: 60,
        icon: "ability_bastion_paladin",
      },
      {
        name: "Vanquisher's Hammer",
        id: 328_204,
        cd: 30,
        icon: "ability_maldraxxus_paladin",
      },
      {
        name: "Blessing of Spring",
        id: 328_282,
        cd: 45,
        icon: "ability_ardenweald_paladin_spring",
      },
      {
        name: "Blessing of Summer",
        id: 328_620,
        cd: 45,
        icon: "ability_ardenweald_paladin_summer",
      },
      {
        name: "Blessing of Autumn",
        id: 328_622,
        cd: 45,
        icon: "ability_ardenweald_paladin_autumn",
      },
      {
        name: "Blessing of Winter",
        id: 328_281,
        cd: 45,
        icon: "ability_ardenweald_paladin_winter",
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
          },
          {
            name: "Ardent Defender",
            id: 31_850,
            cd: 120,
            icon: "spell_holy_ardentdefender",
          },
          {
            name: "Guardian of Ancient Kings",
            id: 86_659,
            cd: 300,
            icon: "spell_holy_heroism",
          },
          {
            name: "Blessing of Spellwarding",
            id: 204_018,
            cd: 180,
            icon: "spell_holy_blessingofprotection",
          },
          {
            name: "Moment of Glory",
            id: 327_193,
            cd: 90,
            icon: "ability_paladin_veneration",
          },
          {
            name: "Avenger's Shield",
            id: 31_935,
            cd: 15,
            icon: "spell_holy_avengersshield",
          },
          {
            name: "Rebuke",
            id: 96_231,
            cd: 15,
            icon: "spell_holy_rebuke",
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
          },
          {
            name: "Aura Mastery",
            id: 31_821,
            cd: 180,
            icon: "spell_holy_auramastery",
          },
          {
            name: "Divine Protection",
            id: 498,
            cd: 60,
            icon: "spell_holy_divineprotection",
          },
          {
            name: "Light's Hammer",
            id: 114_158,
            cd: 60,
            icon: "spell_paladin_lightshammer",
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
          },
          {
            name: "Execution Sentence",
            id: 343_527,
            cd: 60,
            icon: "spell_paladin_executionsentence",
          },
          {
            name: "Crusade",
            id: 231_895,
            cd: 120,
            icon: "ability_paladin_sanctifiedwrath",
          },
          {
            name: "Final Reckoning",
            id: 343_721,
            cd: 60,
            icon: "spell_holy_blessedresillience",
          },
          {
            name: "Eye for an Eye",
            id: 205_191,
            cd: 60,
            icon: "spell_holy_weaponmastery",
          },
          {
            name: "Rebuke",
            id: 96_231,
            cd: 15,
            icon: "spell_holy_rebuke",
          },
        ],
      },
    ],
    id: 10,
  },
  {
    name: PlayableClass.Warlock,
    cooldowns: [
      {
        name: "Create Soulwell",
        id: 29_893,
        cd: 120,
        icon: "spell_shadow_shadesofdarkness",
      },
      {
        name: "Shadowfury",
        id: 30_283,
        cd: 60,
        icon: "ability_warlock_shadowfurytga",
      },
      {
        name: "Unending Resolve",
        id: 104_773,
        cd: 180,
        icon: "spell_shadow_demonictactics",
      },
      { name: "Soulstone", id: 20_707, cd: 600, icon: "spell_shadow_soulgem" },
      {
        name: "Ritual of Summoning",
        id: 698,
        cd: 120,
        icon: "spell_shadow_twilight",
      },
      {
        name: "Ritual of Doom",
        id: 342_601,
        cd: 3600,
        icon: "warlock_sacrificial_pact",
      },
      {
        name: "Fel Domination",
        id: 333_889,
        cd: 180,
        icon: "spell_shadow_felmending",
      },
    ],
    covenantAbilities: [
      {
        name: "Impending Catastrophe",
        id: 321_792,
        cd: 60,
        icon: "ability_revendreth_warlock",
      },
      {
        name: "Soul Rot",
        id: 325_640,
        cd: 60,
        icon: "ability_ardenweald_warlock",
      },
      {
        name: "Scouring Tithe",
        id: 312_321,
        cd: 40,
        icon: "ability_bastion_warlock",
      },
      {
        name: "Decimating Bolt",
        id: 325_289,
        cd: 45,
        icon: "ability_maldraxxus_warlock",
      },
      {
        name: "Spell Lock",
        id: 19_647,
        cd: 24,
        icon: "spell_shadow_mindrot",
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
          },
          {
            name: "Summon Infernal",
            id: 1122,
            cd: 180,
            icon: "spell_shadow_summoninfernal",
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
          },
          {
            name: "Grimoire: Felguard",
            id: 111_898,
            cd: 120,
            icon: "spell_shadow_summonfelguard",
          },
          {
            name: "Summon Demonic Tyrant",
            id: 265_187,
            cd: 90,
            icon: "inv_summondemonictyrant",
          },
          {
            name: "Demonic Strength",
            id: 267_171,
            cd: 60,
            icon: "ability_warlock_demonicempowerment",
          },
          {
            name: "Axe Toss",
            id: 89_766,
            cd: 30,
            icon: "ability_warrior_titansgrip",
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
          },
          {
            name: "Summon Darkglare",
            id: 205_180,
            cd: 120,
            icon: "inv_beholderwarlock",
          },
        ],
      },
    ],
    id: 11,
  },
  {
    name: PlayableClass.DeathKnight,
    cooldowns: [
      {
        name: "Anti-Magic Shell",
        id: 48_707,
        cd: 60,
        icon: "spell_shadow_antimagicshell",
      },
      {
        name: "Icebound Fortitude",
        id: 48_792,
        cd: 180,
        icon: "spell_deathknight_iceboundfortitude",
      },
      {
        name: "Raise Ally",
        id: 61_999,
        cd: 600,
        icon: "spell_shadow_deadofnight",
      },
      {
        name: "Lichborne",
        id: 49_039,
        cd: 120,
        icon: "spell_shadow_raisedead",
      },
      {
        name: "Sacrificial Pact",
        id: 327_574,
        cd: 120,
        icon: "spell_shadow_corpseexplode",
      },
      { name: "Raise Dead", id: 46_585, cd: 120, icon: "inv_pet_ghoul" },
      {
        name: "Anti-Magic Zone",
        id: 51_052,
        cd: 120,
        icon: "spell_deathknight_antimagiczone",
      },
      {
        name: "Wraith Walk",
        id: 212_552,
        cd: 60,
        icon: "inv_helm_plate_raiddeathknight_p_01",
      },
      {
        name: "Death Pact",
        id: 48_743,
        cd: 120,
        icon: "spell_shadow_deathpact",
      },
      {
        name: "Mind Freeze",
        id: 47_528,
        cd: 15,
        icon: "spell_deathknight_mindfreeze",
      },
    ],
    covenantAbilities: [
      {
        name: "Shackle the Unworthy",
        id: 312_202,
        cd: 60,
        icon: "ability_bastion_deathknight",
      },
      {
        name: "Abomination Limb",
        id: 315_443,
        cd: 120,
        icon: "ability_maldraxxus_deathknight",
      },
      {
        name: "Swarming Mist",
        id: 311_648,
        cd: 60,
        icon: "ability_revendreth_deathknight",
      },
      {
        name: "Death's Due",
        id: 324_128,
        cd: 30,
        icon: "ability_ardenweald_deathknight",
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
          },
          { name: "Tombstone", id: 219_809, cd: 60, icon: "ability_fiegndead" },
          {
            name: "Blood Tap",
            id: 221_699,
            cd: 60,
            icon: "spell_deathknight_bloodtap",
          },
          {
            name: "Vampiric Blood",
            id: 55_233,
            cd: 90,
            icon: "spell_shadow_lifedrain",
          },
          {
            name: "Gorefiend's Grasp",
            id: 108_199,
            cd: 120,
            icon: "ability_deathknight_aoedeathgrip",
          },
          {
            name: "Dancing Rune Weapon",
            id: 49_028,
            cd: 120,
            icon: "inv_sword_07",
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
          },
          {
            name: "Unholy Assault",
            id: 207_289,
            cd: 75,
            icon: "spell_shadow_unholyfrenzy",
          },
          {
            name: "Army of the Dead",
            id: 42_650,
            cd: 480,
            icon: "spell_deathknight_armyofthedead",
          },
          {
            name: "Dark Transformation",
            id: 63_560,
            cd: 60,
            icon: "achievement_boss_festergutrotface",
          },
          {
            name: "Apocalypse",
            id: 275_699,
            cd: 90,
            icon: "artifactability_unholydeathknight_deathsembrace",
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
          },
          {
            name: "Empower Rune Weapon",
            id: 47_568,
            cd: 120,
            icon: "inv_sword_62",
          },
          {
            name: "Frostwyrm's Fury",
            id: 279_302,
            cd: 180,
            icon: "achievement_boss_sindragosa",
          },
          {
            name: "Blinding Sleet",
            id: 207_167,
            cd: 60,
            icon: "spell_frost_chillingblast",
          },
          {
            name: "Pillar of Frost",
            id: 51_271,
            cd: 60,
            icon: "ability_deathknight_pillaroffrost",
          },
        ],
      },
    ],
    id: 12,
  },
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
