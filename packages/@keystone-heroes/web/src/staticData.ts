const tormentedLieutenantIDs = new Set<number>([
  179_891, 179_446, 179_892, 179_890,
]);
const allBossIDs = new Set<number>([
  162_059, 163_077, 162_058, 162_060, 162_061, 162_691, 163_157, 162_689,
  162_693, 164_558, 164_556, 164_555, 164_450, 166_608, 165_408, 164_185,
  165_410, 164_218, 164_463, 164_451, 164_461, 162_317, 162_329, 162_309,
  165_946, 162_100, 162_103, 162_102, 162_099, 164_567, 164_804, 164_501,
  164_517, 164_255, 164_967, 164_266, 164_267,
]);
export const staticData = {
  dungeons: {
    "2284": {
      name: "Sanguine Depths",
      slug: "SD",
      time: 2_460_000,
      zones: [
        { id: 1675, name: "Depths of Despair" },
        { id: 1676, name: "Amphitheater of Sorrow" },
      ],
    },
    "2285": {
      name: "Spires of Ascension",
      slug: "SoA",
      time: 2_340_000,
      zones: [
        { id: 1692, name: "Honor's Ascent" },
        { id: 1693, name: "Garden of Repose" },
        { id: 1694, name: "Font of Fealty" },
        { id: 1695, name: "Seat of the Archon" },
      ],
    },
    "2286": {
      name: "The Necrotic Wake",
      slug: "NW",
      time: 2_160_000,
      zones: [
        { id: 1666, name: "The Necrotic Wake" },
        { id: 1667, name: "Stitchwerks" },
        { id: 1668, name: "Zolramus" },
      ],
    },
    "2287": {
      name: "Halls of Atonement",
      slug: "HoA",
      time: 1_920_000,
      zones: [
        { id: 1663, name: "Halls of Atonement" },
        { id: 1664, name: "The Nave of Pain" },
        { id: 1665, name: "The Sanctuary of Souls" },
      ],
    },
    "2289": {
      name: "Plaguefall",
      slug: "PF",
      time: 2_280_000,
      zones: [
        { id: 1674, name: "Plaguefall" },
        { id: 1697, name: "The Festering Sanctum" },
      ],
    },
    "2290": {
      name: "Mists of Tirna Scithe",
      slug: "MoTS",
      time: 1_800_000,
      zones: [{ id: 1669, name: "Mists of Tirna Scithe" }],
    },
    "2291": {
      name: "De Other Side",
      slug: "DOS",
      time: 2_580_000,
      zones: [
        { id: 1680, name: "De Other Side" },
        { id: 1679, name: "Zul'Gurub" },
        { id: 1678, name: "Mechagon" },
        { id: 1677, name: "Ardenweald" },
      ],
    },
    "2293": {
      name: "Theater of Pain",
      slug: "TOP",
      time: 2_220_000,
      zones: [
        { id: 1683, name: "Theater of Pain" },
        { id: 1684, name: "Chamber of Conquest" },
        { id: 1685, name: "Altars of Agony" },
        { id: 1686, name: "Upper Barrow of Carnage" },
        { id: 1687, name: "Lower Barrow of Carnage" },
      ],
    },
  },
  affixes: {
    "2": { name: "Skittish", icon: "spell_magic_lesserinvisibilty" },
    "3": { name: "Volcanic", icon: "spell_shaman_lavasurge" },
    "4": { name: "Necrotic", icon: "spell_deathknight_necroticplague" },
    "6": { name: "Raging", icon: "ability_warrior_focusedrage" },
    "7": { name: "Bolstering", icon: "ability_warrior_battleshout" },
    "8": { name: "Sanguine", icon: "spell_shadow_bloodboil" },
    "9": { name: "Tyrannical", icon: "achievement_boss_archaedas" },
    "10": { name: "Fortified", icon: "ability_toughness" },
    "11": { name: "Bursting", icon: "ability_ironmaidens_whirlofblood" },
    "12": { name: "Grievous", icon: "ability_backstab" },
    "13": { name: "Explosive", icon: "spell_fire_felflamering_red" },
    "14": { name: "Quaking", icon: "spell_nature_earthquake" },
    "16": { name: "Infested", icon: "achievement_nazmir_boss_ghuun" },
    "117": {
      name: "Reaping",
      icon: "ability_racial_embraceoftheloa_bwonsomdi",
    },
    "119": { name: "Beguiling", icon: "spell_shadow_mindshear" },
    "120": { name: "Awakened", icon: "trade_archaeology_nerubian_obelisk" },
    "121": { name: "Prideful", icon: "spell_animarevendreth_buff" },
    "122": { name: "Inspiring", icon: "spell_holy_prayerofspirit" },
    "123": { name: "Spiteful", icon: "spell_holy_prayerofshadowprotection" },
    "124": { name: "Storming", icon: "spell_nature_cyclone" },
    "128": { name: "Tormented", icon: "spell_animamaw_orb" },
  },
  soulbinds: {
    "1": { name: "Niya", covenantID: 3 },
    "2": { name: "Dreamweaver", covenantID: 3 },
    "3": { name: "Draven", covenantID: 2 },
    "4": { name: "Marileth", covenantID: 4 },
    "5": { name: "Emeni", covenantID: 4 },
    "6": { name: "Korayn", covenantID: 3 },
    "7": { name: "Pelagos", covenantID: 1 },
    "8": { name: "Nadjia", covenantID: 2 },
    "9": { name: "Theotar", covenantID: 2 },
    "10": { name: "Bonesmith Heirmir", covenantID: 4 },
    "13": { name: "Kleia", covenantID: 1 },
    "18": { name: "Mikanikos", covenantID: 1 },
  },
  classes: {
    "1": {
      name: "Warrior",
      cooldowns: [
        97_462, 64_382, 5246, 262_228, 307_865, 1161, 871, 325_886, 1719,
        167_105, 46_924, 227_847, 324_143, 12_975, 184_364, 107_574, 107_574,
        18_499,
      ],
      specs: [
        { id: 2, name: "Fury", cooldowns: [46_924, 184_364] },
        { id: 1, name: "Protection", cooldowns: [871, 12_975, 107_574] },
        {
          id: 3,
          name: "Arms",
          cooldowns: [262_228, 167_105, 227_847, 107_574],
        },
      ],
    },
    "2": {
      name: "Mage",
      cooldowns: [
        66, 12_042, 314_793, 205_021, 45_438, 84_714, 80_353, 190_319, 198_154,
        307_443, 108_978, 324_220, 55_342, 12_472, 235_219, 314_791, 108_978,
      ],
      specs: [
        { id: 4, name: "Fire", cooldowns: [190_319, 108_978] },
        {
          id: 5,
          name: "Frost",
          cooldowns: [205_021, 84_714, 108_978, 12_472, 235_219],
        },
        { id: 6, name: "Arcane", cooldowns: [12_042, 198_154] },
      ],
    },
    "3": {
      name: "Rogue",
      cooldowns: [
        31_224, 2094, 323_654, 328_547, 328_305, 2983, 185_313, 51_690, 79_140,
        323_547, 5277, 137_619, 13_750, 121_471, 114_018, 1856, 277_925,
      ],
      specs: [
        { id: 7, name: "Assassination", cooldowns: [79_140] },
        { id: 9, name: "Outlaw", cooldowns: [51_690, 13_750] },
        { id: 8, name: "Subtlety", cooldowns: [185_313, 121_471, 277_925] },
      ],
    },
    "4": {
      name: "Shaman",
      cooldowns: [
        192_058, 108_280, 320_137, 8143, 198_067, 320_674, 108_281, 32_182,
        198_838, 79_206, 192_249, 51_533, 114_051, 324_386, 191_634, 108_271,
        16_191, 2825, 207_399, 58_875, 326_059, 192_222, 98_008, 114_052,
        198_103, 114_050, 328_923, 79_206,
      ],
      specs: [
        {
          id: 10,
          name: "Restoration",
          cooldowns: [
            108_280, 198_838, 79_206, 16_191, 207_399, 98_008, 114_052,
          ],
        },
        {
          id: 12,
          name: "Enhancement",
          cooldowns: [320_137, 51_533, 114_051, 58_875],
        },
        {
          id: 11,
          name: "Elemental",
          cooldowns: [
            198_067, 108_281, 192_249, 191_634, 192_222, 114_050, 79_206,
          ],
        },
      ],
    },
    "5": {
      name: "Priest",
      cooldowns: [
        47_788, 123_040, 323_673, 64_901, 265_202, 62_618, 200_183, 47_585,
        15_286, 88_625, 319_952, 73_325, 109_964, 33_206, 8122, 228_260, 62_618,
        10_060, 34_433, 47_536, 200_174, 246_287, 325_013, 34_861, 327_661,
        2050, 19_236, 64_843, 34_433, 324_724,
      ],
      specs: [
        {
          id: 14,
          name: "Holy",
          cooldowns: [
            47_788, 64_901, 265_202, 200_183, 88_625, 34_861, 2050, 64_843,
          ],
        },
        {
          id: 13,
          name: "Shadow",
          cooldowns: [47_585, 15_286, 319_952, 228_260, 34_433, 200_174],
        },
        {
          id: 15,
          name: "Discipline",
          cooldowns: [
            123_040, 109_964, 33_206, 62_618, 47_536, 246_287, 34_433,
          ],
        },
      ],
    },
    "6": {
      name: "Hunter",
      cooldowns: [
        325_028, 186_289, 186_257, 19_577, 324_149, 308_491, 321_530, 19_574,
        193_530, 201_430, 109_304, 260_402, 131_894, 266_779, 19_577, 186_265,
        328_231, 288_613,
      ],
      specs: [
        { id: 18, name: "Marksmanship", cooldowns: [260_402, 288_613] },
        { id: 17, name: "Survival", cooldowns: [186_289, 19_577, 266_779] },
        {
          id: 16,
          name: "BeastMastery",
          cooldowns: [321_530, 19_574, 193_530, 201_430, 19_577],
        },
      ],
    },
    "7": {
      name: "Monk",
      cooldowns: [
        310_454, 325_153, 115_310, 122_470, 325_197, 137_639, 116_849, 115_203,
        122_278, 322_109, 119_381, 322_507, 115_203, 327_104, 115_176, 326_860,
        132_578, 325_216, 123_904, 115_399, 152_173, 197_908, 122_783, 122_783,
        115_203, 322_118, 115_288,
      ],
      specs: [
        {
          id: 20,
          name: "Brewmaster",
          cooldowns: [325_153, 322_507, 115_176, 132_578, 115_399, 115_203],
        },
        {
          id: 21,
          name: "Windwalker",
          cooldowns: [
            122_470, 137_639, 115_203, 123_904, 152_173, 122_783, 115_288,
          ],
        },
        {
          id: 19,
          name: "Mistweaver",
          cooldowns: [
            115_310, 325_197, 116_849, 115_203, 197_908, 122_783, 322_118,
          ],
        },
      ],
    },
    "8": {
      name: "Druid",
      cooldowns: [
        20_484, 323_764, 194_223, 132_158, 205_636, 319_454, 102_558, 22_812,
        325_727, 202_770, 5211, 197_721, 203_651, 102_560, 61_336, 106_898, 740,
        106_951, 1850, 102_342, 102_543, 102_793, 33_891, 326_434, 29_166,
        29_166, 78_675, 108_238, 61_336, 323_546, 50_334,
      ],
      specs: [
        { id: 25, name: "Feral", cooldowns: [61_336, 106_951, 102_543] },
        {
          id: 22,
          name: "Restoration",
          cooldowns: [132_158, 197_721, 203_651, 740, 102_342, 33_891, 29_166],
        },
        {
          id: 24,
          name: "Balance",
          cooldowns: [194_223, 205_636, 202_770, 102_560, 29_166, 78_675],
        },
        { id: 23, name: "Guardian", cooldowns: [102_558, 61_336, 50_334] },
      ],
    },
    "9": {
      name: "DemonHunter",
      cooldowns: [
        204_021, 202_137, 306_830, 317_009, 196_718, 207_684, 344_867, 209_258,
        320_341, 188_501, 258_925, 187_827, 196_555, 202_138, 323_639, 191_427,
        212_084, 198_589,
      ],
      specs: [
        {
          id: 26,
          name: "Vengeance",
          cooldowns: [
            204_021, 202_137, 207_684, 209_258, 320_341, 187_827, 202_138,
            212_084,
          ],
        },
        {
          id: 27,
          name: "Havoc",
          cooldowns: [196_718, 344_867, 258_925, 196_555, 191_427, 198_589],
        },
      ],
    },
    "10": {
      name: "Paladin",
      cooldowns: [
        642, 327_193, 853, 31_850, 31_884, 328_622, 343_527, 328_282, 184_662,
        316_958, 304_971, 216_331, 498, 205_191, 1022, 31_821, 6940, 498,
        328_204, 114_158, 204_018, 633, 86_659, 328_620, 343_721, 328_281,
        231_895,
      ],
      specs: [
        {
          id: 30,
          name: "Retribution",
          cooldowns: [343_527, 184_662, 205_191, 343_721, 231_895],
        },
        { id: 29, name: "Holy", cooldowns: [216_331, 498, 31_821, 114_158] },
        {
          id: 28,
          name: "Protection",
          cooldowns: [327_193, 31_850, 498, 204_018, 86_659],
        },
      ],
    },
    "11": {
      name: "Warlock",
      cooldowns: [
        20_707, 113_858, 333_889, 325_289, 325_640, 104_773, 111_898, 1122, 698,
        267_217, 29_893, 267_171, 321_792, 113_860, 342_601, 265_187, 30_283,
        205_180, 312_321,
      ],
      specs: [
        { id: 33, name: "Affliction", cooldowns: [113_860, 205_180] },
        {
          id: 32,
          name: "Demonology",
          cooldowns: [111_898, 267_217, 267_171, 265_187],
        },
        { id: 31, name: "Destruction", cooldowns: [113_858, 1122] },
      ],
    },
    "12": {
      name: "DeathKnight",
      cooldowns: [
        324_128, 207_167, 219_809, 207_289, 48_707, 51_052, 108_199, 61_999,
        221_699, 48_743, 194_844, 63_560, 49_206, 312_202, 47_568, 327_574,
        49_028, 311_648, 42_650, 212_552, 275_699, 48_792, 46_585, 279_302,
        315_443, 152_279, 49_039, 55_233, 51_271,
      ],
      specs: [
        {
          id: 36,
          name: "Frost",
          cooldowns: [207_167, 47_568, 279_302, 152_279, 51_271],
        },
        {
          id: 35,
          name: "Unholy",
          cooldowns: [207_289, 63_560, 49_206, 42_650, 275_699],
        },
        {
          id: 34,
          name: "Blood",
          cooldowns: [219_809, 108_199, 221_699, 194_844, 49_028, 55_233],
        },
      ],
    },
  },
  covenants: {
    "1": { name: "Kyrian", icon: "ui_sigil_kyrian" },
    "2": { name: "Venthyr", icon: "ui_sigil_venthyr" },
    "3": { name: "NightFae", icon: "ui_sigil_nightfae" },
    "4": { name: "Necrolord", icon: "ui_sigil_necrolord" },
  },
  spells: {
    "66": { icon: "ability_mage_invisibility", name: "Invisibility", cd: 300 },
    "498": {
      icon: "spell_holy_divineprotection",
      name: "Divine Protection",
      cd: 60,
    },
    "633": { icon: "spell_holy_layonhands", name: "Lay on Hands", cd: 600 },
    "642": { icon: "spell_holy_divineshield", name: "Divine Shield", cd: 300 },
    "698": {
      icon: "spell_shadow_twilight",
      name: "Ritual of Summoning",
      cd: 120,
    },
    "740": { icon: "spell_nature_tranquility", name: "Tranquility", cd: 180 },
    "853": {
      icon: "spell_holy_sealofmight",
      name: "Hammer of Justice",
      cd: 60,
    },
    "871": { icon: "ability_warrior_shieldwall", name: "Shield Wall", cd: 240 },
    "1022": {
      icon: "spell_holy_sealofprotection",
      name: "Blessing of Protection",
      cd: 300,
    },
    "1122": {
      icon: "spell_shadow_summoninfernal",
      name: "Summon Infernal",
      cd: 180,
    },
    "1161": { icon: "ability_bullrush", name: "Challenging Shout", cd: 240 },
    "1719": {
      icon: "warrior_talent_icon_innerrage",
      name: "Recklessness",
      cd: 90,
    },
    "1850": { icon: "ability_druid_dash", name: "Dash", cd: 120 },
    "1856": { icon: "ability_vanish", name: "Vanish", cd: 120 },
    "2050": {
      icon: "spell_holy_persuitofjustice",
      name: "Holy Word: Serenity",
      cd: 60,
    },
    "2094": { icon: "spell_shadow_mindsteal", name: "Blind", cd: 120 },
    "2825": { icon: "spell_nature_bloodlust", name: "Bloodlust", cd: 300 },
    "2983": { icon: "ability_rogue_sprint", name: "Sprint", cd: 120 },
    "5211": { icon: "ability_druid_bash", name: "Mighty Bash", cd: 60 },
    "5246": {
      icon: "ability_golemthunderclap",
      name: "Intimidating Shout",
      cd: 90,
    },
    "5277": { icon: "spell_shadow_shadowward", name: "Evasion", cd: 120 },
    "6940": {
      icon: "spell_holy_sealofsacrifice",
      name: "Blessing of Sacrifice",
      cd: 120,
    },
    "8122": {
      icon: "spell_shadow_psychicscream",
      name: "Psychic Scream",
      cd: 60,
    },
    "8143": { icon: "spell_nature_tremortotem", name: "Tremor Totem", cd: 60 },
    "10060": {
      icon: "spell_holy_powerinfusion",
      name: "Power Infusion",
      cd: 120,
    },
    "12042": { icon: "spell_nature_lightning", name: "Arcane Power", cd: 120 },
    "12472": { icon: "spell_frost_coldhearted", name: "Icy Veins", cd: 180 },
    "12975": { icon: "spell_holy_ashestoashes", name: "Last Stand", cd: 180 },
    "13750": {
      icon: "spell_shadow_shadowworddominate",
      name: "Adrenaline Rush",
      cd: 180,
    },
    "15286": {
      icon: "spell_shadow_unsummonbuilding",
      name: "Vampiric Embrace",
      cd: 120,
    },
    "16191": {
      icon: "spell_frost_summonwaterelemental",
      name: "Mana Tide Totem",
      cd: 180,
    },
    "18499": {
      icon: "spell_nature_ancestralguardian",
      name: "Berserker Rage",
      cd: 60,
    },
    "19236": {
      icon: "spell_holy_testoffaith",
      name: "Desperate Prayer",
      cd: 90,
    },
    "19574": {
      icon: "ability_druid_ferociousbite",
      name: "Bestial Wrath",
      cd: 90,
    },
    "19577": { icon: "ability_devour", name: "Intimidation", cd: 60 },
    "20484": { icon: "spell_nature_reincarnation", name: "Rebirth", cd: 600 },
    "20707": { icon: "spell_shadow_soulgem", name: "Soulstone", cd: 600 },
    "22812": { icon: "spell_nature_stoneclawtotem", name: "Barkskin", cd: 60 },
    "29166": { icon: "spell_nature_lightning", name: "Innervate", cd: 120 },
    "29893": {
      icon: "spell_shadow_shadesofdarkness",
      name: "Create Soulwell",
      cd: 120,
    },
    "30283": {
      icon: "ability_warlock_shadowfurytga",
      name: "Shadowfury",
      cd: 60,
    },
    "31224": {
      icon: "spell_shadow_nethercloak",
      name: "Cloak of Shadows",
      cd: 120,
    },
    "31821": { icon: "spell_holy_auramastery", name: "Aura Mastery", cd: 180 },
    "31850": {
      icon: "spell_holy_ardentdefender",
      name: "Ardent Defender",
      cd: 120,
    },
    "31884": {
      icon: "spell_holy_avenginewrath",
      name: "Avenging Wrath",
      cd: 180,
    },
    "32182": { icon: "ability_shaman_heroism", name: "Heroism", cd: 300 },
    "33206": {
      icon: "spell_holy_painsupression",
      name: "Pain Suppression",
      cd: 180,
    },
    "33891": {
      icon: "ability_druid_improvedtreeform",
      name: "Incarnation: Tree of Life",
      cd: 180,
    },
    "34433": { icon: "spell_shadow_shadowfiend", name: "Shadowfiend", cd: 180 },
    "34861": {
      icon: "spell_holy_divineprovidence",
      name: "Holy Word: Sanctify",
      cd: 60,
    },
    "42650": {
      icon: "spell_deathknight_armyofthedead",
      name: "Army of the Dead",
      cd: 480,
    },
    "45438": { icon: "spell_frost_frost", name: "Ice Block", cd: 240 },
    "46585": { icon: "inv_pet_ghoul", name: "Raise Dead", cd: 120 },
    "46924": { icon: "ability_warrior_bladestorm", name: "Bladestorm", cd: 90 },
    "47536": { icon: "spell_holy_rapture", name: "Rapture", cd: 90 },
    "47568": { icon: "inv_sword_62", name: "Empower Rune Weapon", cd: 120 },
    "47585": { icon: "spell_shadow_dispersion", name: "Dispersion", cd: 120 },
    "47788": {
      icon: "spell_holy_guardianspirit",
      name: "Guardian Spirit",
      cd: 180,
    },
    "48707": {
      icon: "spell_shadow_antimagicshell",
      name: "Anti-Magic Shell",
      cd: 60,
    },
    "48743": { icon: "spell_shadow_deathpact", name: "Death Pact", cd: 120 },
    "48792": {
      icon: "spell_deathknight_iceboundfortitude",
      name: "Icebound Fortitude",
      cd: 180,
    },
    "49028": { icon: "inv_sword_07", name: "Dancing Rune Weapon", cd: 120 },
    "49039": { icon: "spell_shadow_raisedead", name: "Lichborne", cd: 120 },
    "49206": {
      icon: "ability_deathknight_summongargoyle",
      name: "Summon Gargoyle",
      cd: 180,
    },
    "50334": { icon: "ability_druid_berserk", name: "Berserk", cd: 180 },
    "51052": {
      icon: "spell_deathknight_antimagiczone",
      name: "Anti-Magic Zone",
      cd: 120,
    },
    "51271": {
      icon: "ability_deathknight_pillaroffrost",
      name: "Pillar of Frost",
      cd: 60,
    },
    "51533": {
      icon: "spell_shaman_feralspirit",
      name: "Feral Spirit",
      cd: 120,
    },
    "51690": {
      icon: "ability_rogue_murderspree",
      name: "Killing Spree",
      cd: 120,
    },
    "55233": { icon: "spell_shadow_lifedrain", name: "Vampiric Blood", cd: 90 },
    "55342": {
      icon: "spell_magic_lesserinvisibilty",
      name: "Mirror Image",
      cd: 120,
    },
    "58875": { icon: "ability_tracking", name: "Spirit Walk", cd: 60 },
    "61336": {
      icon: "ability_druid_tigersroar",
      name: "Survival Instincts",
      cd: 180,
    },
    "61999": { icon: "spell_shadow_deadofnight", name: "Raise Ally", cd: 600 },
    "62618": {
      icon: "spell_holy_powerwordbarrier",
      name: "Power Word: Barrier",
      cd: 180,
    },
    "63560": {
      icon: "achievement_boss_festergutrotface",
      name: "Dark Transformation",
      cd: 60,
    },
    "64382": {
      icon: "ability_warrior_shatteringthrow",
      name: "Shattering Throw",
      cd: 180,
    },
    "64843": { icon: "spell_holy_divinehymn", name: "Divine Hymn", cd: 180 },
    "64901": {
      icon: "spell_holy_symbolofhope",
      name: "Symbol of Hope",
      cd: 300,
    },
    "73325": {
      icon: "priest_spell_leapoffaith_a",
      name: "Leap of Faith",
      cd: 90,
    },
    "78675": {
      icon: "ability_vehicle_sonicshockwave",
      name: "Solar Beam",
      cd: 60,
    },
    "79140": { icon: "ability_rogue_deadliness", name: "Vendetta", cd: 120 },
    "79206": {
      icon: "spell_shaman_spiritwalkersgrace",
      name: "Spiritwalker's Grace",
      cd: 120,
    },
    "80353": { icon: "ability_mage_timewarp", name: "Time Warp", cd: 300 },
    "84714": { icon: "spell_frost_frozenorb", name: "Frozen Orb", cd: 60 },
    "86659": {
      icon: "spell_holy_heroism",
      name: "Guardian of Ancient Kings",
      cd: 300,
    },
    "88625": {
      icon: "spell_holy_chastise",
      name: "Holy Word: Chastise",
      cd: 60,
    },
    "97462": {
      icon: "ability_warrior_rallyingcry",
      name: "Rallying Cry",
      cd: 180,
    },
    "98008": {
      icon: "spell_shaman_spiritlink",
      name: "Spirit Link Totem",
      cd: 180,
    },
    "102342": { icon: "spell_druid_ironbark", name: "Ironbark", cd: 90 },
    "102543": {
      icon: "spell_druid_incarnation",
      name: "Incarnation: King of the Jungle",
      cd: 180,
    },
    "102558": {
      icon: "spell_druid_incarnation",
      name: "Incarnation: Guardian of Ursoc",
      cd: 180,
    },
    "102560": {
      icon: "spell_druid_incarnation",
      name: "Incarnation: Chosen of Elune",
      cd: 180,
    },
    "102793": {
      icon: "spell_druid_ursolsvortex",
      name: "Ursol's Vortex",
      cd: 60,
    },
    "104773": {
      icon: "spell_shadow_demonictactics",
      name: "Unending Resolve",
      cd: 180,
    },
    "106898": {
      icon: "spell_druid_stampedingroar_cat",
      name: "Stampeding Roar",
      cd: 120,
    },
    "106951": { icon: "ability_druid_berserk", name: "Berserk", cd: 180 },
    "107574": { icon: "warrior_talent_icon_avatar", name: "Avatar", cd: 90 },
    "108199": {
      icon: "ability_deathknight_aoedeathgrip",
      name: "Gorefiend's Grasp",
      cd: 120,
    },
    "108238": { icon: "spell_nature_natureblessing", name: "Renewal", cd: 90 },
    "108271": {
      icon: "ability_shaman_astralshift",
      name: "Astral Shift",
      cd: 90,
    },
    "108280": {
      icon: "ability_shaman_healingtide",
      name: "Healing Tide Totem",
      cd: 180,
    },
    "108281": {
      icon: "ability_shaman_ancestralguidance",
      name: "Ancestral Guidance",
      cd: 120,
    },
    "108978": { icon: "spell_mage_altertime", name: "Alter Time", cd: 60 },
    "109304": {
      icon: "ability_hunter_onewithnature",
      name: "Exhilaration",
      cd: 120,
    },
    "109964": {
      icon: "ability_shaman_astralshift",
      name: "Spirit Shell",
      cd: 90,
    },
    "111898": {
      icon: "spell_shadow_summonfelguard",
      name: "Grimoire: Felguard",
      cd: 120,
    },
    "113858": {
      icon: "spell_warlock_soulburn",
      name: "Dark Soul: Instability",
      cd: 120,
    },
    "113860": {
      icon: "spell_warlock_soulburn",
      name: "Dark Soul: Misery",
      cd: 120,
    },
    "114018": {
      icon: "ability_rogue_shroudofconcealment",
      name: "Shroud of Concealment",
      cd: 360,
    },
    "114050": {
      icon: "spell_fire_elementaldevastation",
      name: "Ascendance",
      cd: 180,
    },
    "114051": {
      icon: "spell_fire_elementaldevastation",
      name: "Ascendance",
      cd: 180,
    },
    "114052": {
      icon: "spell_fire_elementaldevastation",
      name: "Ascendance",
      cd: 180,
    },
    "114158": {
      icon: "spell_paladin_lightshammer",
      name: "Light's Hammer",
      cd: 60,
    },
    "115176": {
      icon: "ability_monk_zenmeditation",
      name: "Zen Meditation",
      cd: 300,
    },
    "115203": {
      icon: "ability_monk_fortifyingale_new",
      name: "Fortifying Brew",
      cd: 180,
    },
    "115288": {
      icon: "ability_monk_energizingwine",
      name: "Energizing Elixir",
      cd: 60,
    },
    "115310": { icon: "spell_monk_revival", name: "Revival", cd: 180 },
    "115399": { icon: "ability_monk_chibrew", name: "Black Ox Brew", cd: 120 },
    "116849": { icon: "ability_monk_chicocoon", name: "Life Cocoon", cd: 120 },
    "119381": { icon: "ability_monk_legsweep", name: "Leg Sweep", cd: 60 },
    "121471": {
      icon: "inv_knife_1h_grimbatolraid_d_03",
      name: "Shadow Blades",
      cd: 180,
    },
    "122278": { icon: "ability_monk_dampenharm", name: "Dampen Harm", cd: 120 },
    "122470": {
      icon: "ability_monk_touchofkarma",
      name: "Touch of Karma",
      cd: 90,
    },
    "122783": {
      icon: "spell_monk_diffusemagic",
      name: "Diffuse Magic",
      cd: 90,
    },
    "123040": { icon: "spell_shadow_soulleech_3", name: "Mindbender", cd: 60 },
    "123904": {
      icon: "ability_monk_summontigerstatue",
      name: "Invoke Xuen, the White Tiger",
      cd: 120,
    },
    "131894": {
      icon: "ability_hunter_murderofcrows",
      name: "A Murder of Crows",
      cd: 60,
    },
    "132158": {
      icon: "spell_nature_ravenform",
      name: "Nature's Swiftness",
      cd: 60,
    },
    "132578": {
      icon: "spell_monk_brewmaster_spec",
      name: "Invoke Niuzao, the Black Ox",
      cd: 180,
    },
    "137619": {
      icon: "achievement_bg_killingblow_berserker",
      name: "Marked for Death",
      cd: 60,
    },
    "137639": {
      icon: "spell_nature_giftofthewild",
      name: "Storm, Earth, and Fire",
      cd: 90,
    },
    "152173": { icon: "ability_monk_serenity", name: "Serenity", cd: 90 },
    "152279": {
      icon: "spell_deathknight_breathofsindragosa",
      name: "Breath of Sindragosa",
      cd: 120,
    },
    "167105": {
      icon: "ability_warrior_colossussmash",
      name: "Colossus Smash",
      cd: 90,
    },
    "184364": {
      icon: "ability_warrior_focusedrage",
      name: "Enraged Regeneration",
      cd: 120,
    },
    "184662": {
      icon: "ability_paladin_shieldofthetemplar",
      name: "Shield of Vengeance",
      cd: 120,
    },
    "185313": {
      icon: "ability_rogue_shadowdance",
      name: "Shadow Dance",
      cd: 60,
    },
    "186257": {
      icon: "ability_mount_jungletiger",
      name: "Aspect of the Cheetah",
      cd: 180,
    },
    "186265": {
      icon: "ability_hunter_pet_turtle",
      name: "Aspect of the Turtle",
      cd: 180,
    },
    "186289": {
      icon: "spell_hunter_aspectoftheironhawk",
      name: "Aspect of the Eagle",
      cd: 90,
    },
    "187827": {
      icon: "ability_demonhunter_metamorphasistank",
      name: "Metamorphosis",
      cd: 180,
    },
    "188501": {
      icon: "ability_demonhunter_spectralsight",
      name: "Spectral Sight",
      cd: 60,
    },
    "190319": { icon: "spell_fire_sealoffire", name: "Combustion", cd: 120 },
    "191427": {
      icon: "ability_demonhunter_metamorphasisdps",
      name: "Metamorphosis",
      cd: 240,
    },
    "191634": {
      icon: "ability_thunderking_lightningwhip",
      name: "Stormkeeper",
      cd: 60,
    },
    "192058": {
      icon: "spell_nature_brilliance",
      name: "Capacitor Totem",
      cd: 60,
    },
    "192222": {
      icon: "spell_shaman_spewlava",
      name: "Liquid Magma Totem",
      cd: 60,
    },
    "192249": { icon: "inv_stormelemental", name: "Storm Elemental", cd: 150 },
    "193530": {
      icon: "spell_nature_protectionformnature",
      name: "Aspect of the Wild",
      cd: 120,
    },
    "194223": {
      icon: "spell_nature_natureguardian",
      name: "Celestial Alignment",
      cd: 180,
    },
    "194844": {
      icon: "achievement_boss_lordmarrowgar",
      name: "Bonestorm",
      cd: 60,
    },
    "196555": { icon: "spell_warlock_demonsoul", name: "Netherwalk", cd: 180 },
    "196718": {
      icon: "ability_demonhunter_darkness",
      name: "Darkness",
      cd: 180,
    },
    "197721": { icon: "spell_druid_wildburst", name: "Flourish", cd: 90 },
    "197908": { icon: "monk_ability_cherrymanatea", name: "Mana Tea", cd: 90 },
    "198067": {
      icon: "spell_fire_elemental_totem",
      name: "Fire Elemental",
      cd: 150,
    },
    "198103": {
      icon: "spell_nature_earthelemental_totem",
      name: "Earth Elemental",
      cd: 300,
    },
    "198154": {
      icon: "spell_nature_enchantarmor",
      name: "Presence of Mind",
      cd: 60,
    },
    "198589": { icon: "ability_demonhunter_blur", name: "Blur", cd: 60 },
    "198838": {
      icon: "spell_nature_stoneskintotem",
      name: "Earthen Wall Totem",
      cd: 60,
    },
    "200174": { icon: "spell_shadow_soulleech_3", name: "Mindbender", cd: 60 },
    "200183": { icon: "ability_priest_ascension", name: "Apotheosis", cd: 120 },
    "201430": {
      icon: "ability_hunter_bestialdiscipline",
      name: "Stampede",
      cd: 120,
    },
    "202137": {
      icon: "ability_demonhunter_sigilofsilence",
      name: "Sigil of Silence",
      cd: 60,
    },
    "202138": {
      icon: "ability_demonhunter_sigilofchains",
      name: "Sigil of Chains",
      cd: 90,
    },
    "202770": {
      icon: "ability_druid_dreamstate",
      name: "Fury of Elune",
      cd: 60,
    },
    "203651": { icon: "ability_druid_overgrowth", name: "Overgrowth", cd: 60 },
    "204018": {
      icon: "spell_holy_blessingofprotection",
      name: "Blessing of Spellwarding",
      cd: 180,
    },
    "204021": {
      icon: "ability_demonhunter_fierybrand",
      name: "Fiery Brand",
      cd: 60,
    },
    "205021": { icon: "ability_mage_rayoffrost", name: "Ray of Frost", cd: 75 },
    "205180": {
      icon: "inv_beholderwarlock",
      name: "Summon Darkglare",
      cd: 180,
    },
    "205191": {
      icon: "spell_holy_weaponmastery",
      name: "Eye for an Eye",
      cd: 60,
    },
    "205636": {
      icon: "ability_druid_forceofnature",
      name: "Force of Nature",
      cd: 60,
    },
    "207167": {
      icon: "spell_frost_chillingblast",
      name: "Blinding Sleet",
      cd: 60,
    },
    "207289": {
      icon: "spell_shadow_unholyfrenzy",
      name: "Unholy Assault",
      cd: 75,
    },
    "207399": {
      icon: "spell_nature_reincarnation",
      name: "Ancestral Protection Totem",
      cd: 300,
    },
    "207684": {
      icon: "ability_demonhunter_sigilofmisery",
      name: "Sigil of Misery",
      cd: 90,
    },
    "209258": {
      icon: "inv_glaive_1h_artifactaldorchi_d_06",
      name: "Last Resort",
      cd: 480,
    },
    "212084": {
      icon: "ability_demonhunter_feldevastation",
      name: "Fel Devastation",
      cd: 60,
    },
    "212552": {
      icon: "inv_helm_plate_raiddeathknight_p_01",
      name: "Wraith Walk",
      cd: 60,
    },
    "216331": {
      icon: "ability_paladin_veneration",
      name: "Avenging Crusader",
      cd: 120,
    },
    "219809": { icon: "ability_fiegndead", name: "Tombstone", cd: 60 },
    "221699": { icon: "spell_deathknight_bloodtap", name: "Blood Tap", cd: 60 },
    "227847": {
      icon: "ability_warrior_bladestorm",
      name: "Bladestorm",
      cd: 90,
    },
    "228260": {
      icon: "spell_priest_void-blast",
      name: "Void Eruption",
      cd: 90,
    },
    "231895": {
      icon: "ability_paladin_sanctifiedwrath",
      name: "Crusade",
      cd: 120,
    },
    "235219": { icon: "spell_frost_wizardmark", name: "Cold Snap", cd: 300 },
    "246287": {
      icon: "spell_holy_divineillumination",
      name: "Evangelism",
      cd: 90,
    },
    "258925": { icon: "inv_felbarrage", name: "Fel Barrage", cd: 60 },
    "260402": { icon: "ability_hunter_crossfire", name: "Double Tap", cd: 60 },
    "262228": {
      icon: "achievement_boss_kingymiron",
      name: "Deadly Calm",
      cd: 60,
    },
    "265187": {
      icon: "inv_summondemonictyrant",
      name: "Summon Demonic Tyrant",
      cd: 90,
    },
    "265202": {
      icon: "ability_priest_archangel",
      name: "Holy Word: Salvation",
      cd: 720,
    },
    "266779": {
      icon: "inv_coordinatedassault",
      name: "Coordinated Assault",
      cd: 120,
    },
    "267171": {
      icon: "ability_warlock_demonicempowerment",
      name: "Demonic Strength",
      cd: 60,
    },
    "267217": { icon: "inv_netherportal", name: "Nether Portal", cd: 180 },
    "275699": {
      icon: "artifactability_unholydeathknight_deathsembrace",
      name: "Apocalypse",
      cd: 90,
    },
    "277925": {
      icon: "ability_rogue_throwingspecialization",
      name: "Shuriken Tornado",
      cd: 60,
    },
    "279302": {
      icon: "achievement_boss_sindragosa",
      name: "Frostwyrm's Fury",
      cd: 180,
    },
    "288613": { icon: "ability_trueshot", name: "Trueshot", cd: 120 },
    "304971": { icon: "ability_bastion_paladin", name: "Divine Toll", cd: 60 },
    "306830": {
      icon: "ability_bastion_demonhunter",
      name: "Elysian Decree",
      cd: 60,
    },
    "307443": { icon: "ability_bastion_mage", name: "Radiant Spark", cd: 30 },
    "307865": {
      icon: "ability_bastion_warrior",
      name: "Spear of Bastion",
      cd: 60,
    },
    "308491": {
      icon: "ability_bastion_hunter",
      name: "Resonating Arrow",
      cd: 60,
    },
    "310454": {
      icon: "ability_bastion_monk",
      name: "Weapons of Order",
      cd: 120,
    },
    "311648": {
      icon: "ability_revendreth_deathknight",
      name: "Swarming Mist",
      cd: 60,
    },
    "312202": {
      icon: "ability_bastion_deathknight",
      name: "Shackle the Unworthy",
      cd: 60,
    },
    "312321": {
      icon: "ability_bastion_warlock",
      name: "Scouring Tithe",
      cd: 40,
    },
    "314791": {
      icon: "ability_ardenweald_mage",
      name: "Shifting Power",
      cd: 60,
    },
    "314793": {
      icon: "ability_revendreth_mage",
      name: "Mirrors of Torment",
      cd: 90,
    },
    "315443": {
      icon: "ability_maldraxxus_deathknight",
      name: "Abomination Limb",
      cd: 120,
    },
    "316958": {
      icon: "ability_revendreth_paladin",
      name: "Ashen Hallow",
      cd: 240,
    },
    "317009": {
      icon: "ability_revendreth_demonhunter",
      name: "Sinful Brand",
      cd: 60,
    },
    "319454": {
      icon: "spell_holy_blessingofagility",
      name: "Heart of the Wild",
      cd: 300,
    },
    "319952": {
      icon: "achievement_boss_generalvezax_01",
      name: "Surrender to Madness",
      cd: 90,
    },
    "320137": {
      icon: "ability_thunderking_lightningwhip",
      name: "Stormkeeper",
      cd: 60,
    },
    "320341": {
      icon: "spell_shadow_shadesofdarkness",
      name: "Bulk Extraction",
      cd: 90,
    },
    "320674": {
      icon: "ability_revendreth_shaman",
      name: "Chain Harvest",
      cd: 90,
    },
    "321530": {
      icon: "ability_druid_primaltenacity",
      name: "Bloodshed",
      cd: 60,
    },
    "321792": {
      icon: "ability_revendreth_warlock",
      name: "Impending Catastrophe",
      cd: 60,
    },
    "322109": {
      icon: "ability_monk_touchofdeath",
      name: "Touch of Death",
      cd: 180,
    },
    "322118": {
      icon: "ability_monk_dragonkick",
      name: "Invoke Yu'lon, the Jade Serpent",
      cd: 180,
    },
    "322507": {
      icon: "ability_monk_ironskinbrew",
      name: "Celestial Brew",
      cd: 60,
    },
    "323546": {
      icon: "ability_revendreth_druid",
      name: "Ravenous Frenzy",
      cd: 180,
    },
    "323547": {
      icon: "ability_bastion_rogue",
      name: "Echoing Reprimand",
      cd: 45,
    },
    "323639": {
      icon: "ability_ardenweald_demonhunter",
      name: "The Hunt",
      cd: 90,
    },
    "323654": {
      icon: "ability_revendreth_rogue",
      name: "Flagellation",
      cd: 90,
    },
    "323673": { icon: "ability_revendreth_priest", name: "Mindgames", cd: 45 },
    "323764": {
      icon: "ability_ardenweald_druid",
      name: "Convoke the Spirits",
      cd: 120,
    },
    "324128": {
      icon: "ability_ardenweald_deathknight",
      name: "Death's Due",
      cd: 30,
    },
    "324143": {
      icon: "ability_maldraxxus_warriorplantbanner",
      name: "Conqueror's Banner",
      cd: 120,
    },
    "324149": {
      icon: "ability_revendreth_hunter",
      name: "Flayed Shot",
      cd: 30,
    },
    "324220": { icon: "ability_maldraxxus_mage", name: "Deathborne", cd: 180 },
    "324386": { icon: "ability_bastion_shaman", name: "Vesper Totem", cd: 60 },
    "324724": {
      icon: "ability_maldraxxus_priest",
      name: "Unholy Nova",
      cd: 60,
    },
    "325013": {
      icon: "ability_bastion_priest",
      name: "Boon of the Ascended",
      cd: 180,
    },
    "325028": {
      icon: "ability_maldraxxus_hunter",
      name: "Death Chakram",
      cd: 45,
    },
    "325153": {
      icon: "archaeology_5_0_emptykegofbrewfatherxinwoyin",
      name: "Exploding Keg",
      cd: 60,
    },
    "325197": {
      icon: "inv_pet_cranegod",
      name: "Invoke Chi-Ji, the Red Crane",
      cd: 180,
    },
    "325216": {
      icon: "ability_maldraxxus_monk",
      name: "Bonedust Brew",
      cd: 60,
    },
    "325289": {
      icon: "ability_maldraxxus_warlock",
      name: "Decimating Bolt",
      cd: 45,
    },
    "325640": { icon: "ability_ardenweald_warlock", name: "Soul Rot", cd: 60 },
    "325727": {
      icon: "ability_maldraxxus_druid",
      name: "Adaptive Swarm",
      cd: 25,
    },
    "325886": {
      icon: "ability_ardenweald_warrior",
      name: "Ancient Aftershock",
      cd: 90,
    },
    "326059": {
      icon: "ability_maldraxxus_shaman",
      name: "Primordial Wave",
      cd: 30,
    },
    "326434": {
      icon: "ability_bastion_druid",
      name: "Kindred Spirits",
      cd: 60,
    },
    "326860": {
      icon: "ability_revendreth_monk",
      name: "Fallen Order",
      cd: 180,
    },
    "327104": {
      icon: "ability_ardenweald_monk",
      name: "Faeline Stomp",
      cd: 30,
    },
    "327193": {
      icon: "ability_paladin_veneration",
      name: "Moment of Glory",
      cd: 90,
    },
    "327574": {
      icon: "spell_shadow_corpseexplode",
      name: "Sacrificial Pact",
      cd: 120,
    },
    "327661": {
      icon: "ability_ardenweald_priest",
      name: "Fae Guardians",
      cd: 90,
    },
    "328204": {
      icon: "ability_maldraxxus_paladin",
      name: "Vanquisher's Hammer",
      cd: 30,
    },
    "328231": {
      icon: "ability_ardenweald_hunter",
      name: "Wild Spirits",
      cd: 120,
    },
    "328281": {
      icon: "ability_ardenweald_paladin_winter",
      name: "Blessing of Winter",
      cd: 45,
    },
    "328282": {
      icon: "ability_ardenweald_paladin_spring",
      name: "Blessing of Spring",
      cd: 45,
    },
    "328305": { icon: "ability_ardenweald_rogue", name: "Sepsis", cd: 90 },
    "328547": {
      icon: "ability_maldraxxus_rogue",
      name: "Serrated Bone Spike",
      cd: 90,
    },
    "328620": {
      icon: "ability_ardenweald_paladin_summer",
      name: "Blessing of Summer",
      cd: 45,
    },
    "328622": {
      icon: "ability_ardenweald_paladin_autumn",
      name: "Blessing of Autumn",
      cd: 45,
    },
    "328923": {
      icon: "ability_ardenweald_shaman",
      name: "Fae Transfusion",
      cd: 120,
    },
    "333889": {
      icon: "spell_shadow_felmending",
      name: "Fel Domination",
      cd: 180,
    },
    "342601": {
      icon: "warlock_sacrificial_pact",
      name: "Ritual of Doom",
      cd: 3600,
    },
    "343527": {
      icon: "spell_paladin_executionsentence",
      name: "Execution Sentence",
      cd: 60,
    },
    "343721": {
      icon: "spell_holy_blessedresillience",
      name: "Final Reckoning",
      cd: 60,
    },
    "344867": { icon: "spell_fire_felfirenova", name: "Chaos Nova", cd: 60 },
  },
  tormentedLieutenants: {
    "179446": {
      name: "Incinerator Arkolath",
      icon: "ability_warlock_fireandbrimstone",
    },
    "179890": { name: "Executioner Varruth", icon: "spell_misc_emotionafraid" },
    "179891": { name: "Soggodon the Breaker", icon: "inv_icon_wingbroken04a" },
    "179892": { name: "Oros Coldheart", icon: "spell_shadow_soulleech_2" },
  },
  tormentedPowers: {
    "356827": {
      name: "Tiny Dancing Shoes",
      icon: "inv_boots_pvppriest_e_01",
      sourceTormentorID: [179_891],
    },
    "356828": {
      name: "Dripping Fang",
      icon: "inv_misc_monsterfang_01",
      sourceTormentorID: [179_891],
    },
    "357524": {
      name: "The Stone Ward",
      icon: "ability_mage_shattershield",
      sourceTormentorID: [179_891],
    },
    "357556": {
      name: "Self-Embalming Kit",
      icon: "inv_mummypet",
      sourceTormentorID: [179_891],
    },
    "357575": {
      name: "Champion's Brand",
      icon: "spell_warrior_sharpenblade",
      sourceTormentorID: [179_446, 179_890],
    },
    "357604": {
      name: "Siegebreaker's Stand",
      icon: "ability_warrior_unrelentingassault",
      sourceTormentorID: [179_890],
    },
    "357609": {
      name: "Dagger of Necrotic Wounding",
      icon: "inv_glaive_1h_maldraxxusquest_b_01",
      sourceTormentorID: [179_890],
    },
    "357706": {
      name: "Volcanig Plumage",
      icon: "artifactability_firemage_phoenixbolt",
      sourceTormentorID: [179_890],
    },
    "357747": {
      name: "Overflowing Chalice",
      icon: "inv_drink_22",
      sourceTormentorID: [179_890],
    },
    "357778": {
      name: "Broken Mirror",
      icon: "trade_archaeology_highbornesoulmirror",
      sourceTormentorID: [179_891],
    },
    "357814": {
      name: "Regenerative Fungus",
      icon: "inv_misc_starspecklemushroom",
      sourceTormentorID: [179_892],
    },
    "357815": {
      name: "Satchel of the Hunt",
      icon: "inv_misc_coinbag11",
      sourceTormentorID: [179_892],
    },
    "357817": {
      name: "Huntman's Horn",
      icon: "inv_misc_horn_01",
      sourceTormentorID: [179_892],
    },
    "357820": {
      name: "Pendant of the Martyr",
      icon: "inv_jewelry_necklace_75",
      sourceTormentorID: [179_892],
    },
    "357825": {
      name: "Vial of Desperation",
      icon: "trade_archaeology_crackedcrystalvial",
      sourceTormentorID: [179_892],
    },
    "357829": {
      name: "Gavel of Judgement",
      icon: "inv_hammer_17",
      sourceTormentorID: [179_892],
    },
    "357834": {
      name: "Handbook of Uncivil Etiquette",
      icon: "inv_misc_profession_book_cooking",
      sourceTormentorID: [179_892],
    },
    "357839": {
      name: "The Fifth Skull",
      icon: "inv_misc_bone_skull_02",
      sourceTormentorID: [179_446],
    },
    "357842": {
      name: "Portable Feeding Trough",
      icon: "inv_crate_07",
      sourceTormentorID: [179_892],
    },
    "357847": {
      name: "Stabilizing Diamond Alembic",
      icon: "inv_trinket_80_alchemy01",
      sourceTormentorID: [179_890],
    },
    "357848": {
      name: "Signet of Bolstering",
      icon: "ability_socererking_arcanefortification",
      sourceTormentorID: [179_446],
    },
    "357863": {
      name: "The Stygian King's Barbs",
      icon: "inv_misc_herb_goldthorn_bramble",
      sourceTormentorID: [179_890],
    },
    "357864": {
      name: "Raging Battle-Axe",
      icon: "ability_hunter_swiftstrike",
      sourceTormentorID: [179_446],
    },
    "357889": {
      name: "Pedestal of Utter Hubris",
      icon: "ability_paladin_beaconoflight",
      sourceTormentorID: [179_446],
    },
    "357897": {
      name: "Crumbling Bulwark",
      icon: "trade_archaeology_stoneshield",
      sourceTormentorID: [179_446],
    },
    "357900": {
      name: "Bottle of Sanguine Ichor",
      icon: "inv_potion_27",
      sourceTormentorID: [179_446],
    },
  },
  legendaries: {
    "327364": {
      effectName: "Freezing Winds",
      icon: "spell_shadow_soulleech_2",
    },
    "327365": {
      effectName: "Disciplinary Command",
      icon: "spell_fire_masterofelements",
    },
    "327508": {
      effectName: "Slick Ice",
      icon: "inv_enchant_shardshadowfrostlarge",
    },
    "334888": {
      effectName: "Frenzied Monstrosity",
      icon: "ability_warlock_baneofhavoc",
    },
    "334949": { effectName: "Deadliest Coil", icon: "spell_shadow_deathcoil" },
    "335266": {
      effectName: "Signet of Tormented Kings",
      icon: "inv_60crafted_ring4b",
    },
    "335889": {
      effectName: "Primal Tide Core",
      icon: "ability_shaman_repulsiontotem",
    },
    "335902": {
      effectName: "Doom Winds",
      icon: "ability_ironmaidens_swirlingvortex",
    },
    "336266": {
      effectName: "Flash Concentration",
      icon: "ability_priest_flashoflight",
    },
    "336844": {
      effectName: "Rylakstalker's Piercing Fangs",
      icon: "inv_misc_monsterfang_02",
    },
    "336867": {
      effectName: "Surging Shots",
      icon: "ability_hunter_resistanceisfutile",
    },
    "337020": {
      effectName: "Wilfred's Sigil of Superior Summoning",
      icon: "spell_warlock_demonicportal_purple",
    },
    "337166": {
      effectName: "Cinders of the Azj'Aqir",
      icon: "spell_fire_fireball",
    },
    "337298": {
      effectName: "Invoker's Delight",
      icon: "inv_inscription_80_warscroll_battleshout",
    },
    "337544": {
      effectName: "Razelikh's Defilement",
      icon: "ability_demonhunter_concentratedsigils",
    },
    "337547": { effectName: "Fiery Soul", icon: "inv__felbarrage" },
    "337594": {
      effectName: "The Mad Paragon",
      icon: "ability_paladin_conviction",
    },
    "337825": {
      effectName: "Shock Barrier",
      icon: "spell_holy_greaterblessingoflight",
    },
    "339056": {
      effectName: "Ursoc's Fury Remembered",
      icon: "achievement_emeraldnightmare_ursoc",
    },
    "339942": {
      effectName: "Balance of All Things",
      icon: "ability_druid_balanceofpower",
    },
    "340087": { effectName: "Celerity", icon: "ability_rogue_slicedice" },
    "340089": { effectName: "Finality", icon: "ability_rogue_eviscerate" },
    "346279": { effectName: "Burning Wound", icon: "spell_fire_felhellfire" },
    "354109": {
      effectName: "Sinful Hysteria",
      icon: "ability_revendreth_druid",
    },
    "354118": {
      effectName: "Celestial Spirits",
      icon: "ability_ardenweald_druid",
    },
    "354703": { effectName: "Obedience", icon: "ability_revendreth_rogue" },
    "356362": {
      effectName: "Decaying Soul Satchel",
      icon: "spell_misc_zandalari_council_soulswap",
    },
    "356375": {
      effectName: "Fragments of the Elder Antlers",
      icon: "trade_archaeology_antleredcloakclasp",
    },
    "356789": {
      effectName: "Raging Vesper Vortex",
      icon: "ability_bastion_shaman",
    },
  },
  talents: {
    "6789": { name: "Mortal Coil", icon: "ability_warlock_mortalcoil" },
    "31230": { name: "Cheat Death", icon: "ability_rogue_cheatdeath" },
    "46924": { name: "Bladestorm", icon: "ability_warrior_bladestorm" },
    "48181": { name: "Haunt", icon: "ability_warlock_haunt" },
    "51485": { name: "Earthgrab Totem", icon: "spell_nature_stranglevines" },
    "56377": { name: "Splitting Ice", icon: "spell_frost_ice-shards" },
    "102359": {
      name: "Mass Entanglement",
      icon: "spell_druid_massentanglement",
    },
    "102401": { name: "Wild Charge", icon: "spell_druid_wildcharge" },
    "102558": {
      name: "Incarnation: Guardian of Ursoc",
      icon: "spell_druid_incarnation",
    },
    "105809": { name: "Holy Avenger", icon: "ability_paladin_holyavenger" },
    "107570": { name: "Storm Bolt", icon: "warrior_talent_icon_stormbolt" },
    "108194": { name: "Asphyxiate", icon: "ability_deathknight_asphixiate" },
    "108216": { name: "Dirty Tricks", icon: "ability_rogue_dirtydeeds" },
    "108238": { name: "Renewal", icon: "spell_nature_natureblessing" },
    "108283": {
      name: "Echo of the Elements",
      icon: "ability_shaman_echooftheelements",
    },
    "108416": { name: "Dark Pact", icon: "spell_shadow_deathpact" },
    "109186": { name: "Surge of Light", icon: "spell_holy_surgeoflight" },
    "109215": { name: "Posthaste", icon: "ability_hunter_posthaste" },
    "109248": { name: "Binding Shot", icon: "spell_shaman_bindelemental" },
    "111400": {
      name: "Burning Rush",
      icon: "ability_deathwing_sealarmorbreachtga",
    },
    "113724": { name: "Ring of Frost", icon: "spell_frost_ring-of-frost" },
    "113858": {
      name: "Dark Soul: Instability",
      icon: "spell_warlock_soulburn",
    },
    "113860": { name: "Dark Soul: Misery", icon: "spell_warlock_soulburn" },
    "114052": { name: "Ascendance", icon: "spell_fire_elementaldevastation" },
    "114107": { name: "Soul of the Forest", icon: "ability_druid_manatree" },
    "114154": { name: "Unbreakable Spirit", icon: "spell_holy_holyguidance" },
    "114158": { name: "Light's Hammer", icon: "spell_paladin_lightshammer" },
    "115396": { name: "Ascension", icon: "ability_monk_ascension" },
    "115750": { name: "Blinding Light", icon: "ability_paladin_blindinglight" },
    "115989": { name: "Unholy Blight", icon: "spell_shadow_contagion" },
    "116011": { name: "Rune of Power", icon: "spell_mage_runeofpower" },
    "116841": { name: "Tiger's Lust", icon: "ability_monk_tigerslust" },
    "116844": { name: "Ring of Peace", icon: "spell_monk_ringofpeace" },
    "121536": {
      name: "Angelic Feather",
      icon: "ability_priest_angelicfeather",
    },
    "122783": { name: "Diffuse Magic", icon: "spell_monk_diffusemagic" },
    "123986": { name: "Chi Burst", icon: "spell_arcane_arcanetorrent" },
    "137619": {
      name: "Marked for Death",
      icon: "achievement_bg_killingblow_berserker",
    },
    "152108": { name: "Cataclysm", icon: "achievement_zone_cataclysm" },
    "152175": {
      name: "Whirling Dragon Punch",
      icon: "ability_monk_hurricanestrike",
    },
    "152262": { name: "Seraphim", icon: "ability_paladin_seraphim" },
    "152278": {
      name: "Anger Management",
      icon: "warrior_talent_icon_angermanagement",
    },
    "155148": { name: "Kindling", icon: "spell_mage_kindling" },
    "155149": { name: "Thermal Void", icon: "spell_mage_thermalvoid" },
    "156910": {
      name: "Beacon of Faith",
      icon: "ability_paladin_beaconsoflight",
    },
    "157153": {
      name: "Cloudburst Totem",
      icon: "ability_shaman_condensationtotem",
    },
    "158476": { name: "Soul of the Forest", icon: "ability_druid_manatree" },
    "183778": {
      name: "Judgment of Light",
      icon: "spell_holy_divineprovidence",
    },
    "191384": {
      name: "Aspect of the Beast",
      icon: "ability_deathwing_assualtaspects",
    },
    "192077": { name: "Wind Rush Totem", icon: "ability_shaman_windwalktotem" },
    "192088": {
      name: "Graceful Spirit",
      icon: "spell_shaman_spectraltransformation",
    },
    "193157": { name: "Benediction", icon: "spell_monk_diffusemagic" },
    "193532": { name: "Scent of Blood", icon: "ability_hunter_sickem" },
    "193539": { name: "Alacrity", icon: "ability_paladin_speedoflight" },
    "194917": {
      name: "Pestilent Pustules",
      icon: "spell_yorsahj_bloodboil_purpleoil",
    },
    "196102": { name: "Writhe in Agony", icon: "spell_shadow_curseofsargeras" },
    "196226": { name: "Sow the Seeds", icon: "spell_shadow_seedofdestruction" },
    "196447": {
      name: "Channel Demonfire",
      icon: "spell_fire_ragnaros_lavaboltgreen",
    },
    "196555": { name: "Netherwalk", icon: "spell_warlock_demonsoul" },
    "196607": {
      name: "Eye of the Tiger",
      icon: "ability_druid_primalprecision",
    },
    "196725": {
      name: "Refreshing Jade Wind",
      icon: "ability_monk_rushingjadewind",
    },
    "196924": { name: "Acrobatic Strikes", icon: "spell_warrior_wildstrike" },
    "196938": { name: "Quick Draw", icon: "inv_weapon_rifle_40" },
    "197488": {
      name: "Balance Affinity",
      icon: "ability_druid_improvedmoonkinform",
    },
    "197492": {
      name: "Restoration Affinity",
      icon: "ability_druid_improvedtreeform",
    },
    "197900": { name: "Mist Wrap", icon: "ability_monk_pathofmists" },
    "197908": { name: "Mana Tea", icon: "monk_ability_cherrymanatea" },
    "197995": { name: "Wellspring", icon: "ability_shawaterelemental_split" },
    "198590": { name: "Drain Soul", icon: "spell_shadow_haunting" },
    "198838": {
      name: "Earthen Wall Totem",
      icon: "spell_nature_stoneskintotem",
    },
    "199483": { name: "Camouflage", icon: "ability_hunter_camouflage" },
    "199530": { name: "Stomp", icon: "warrior_talent_icon_thunderstruck" },
    "200071": { name: "Undulation", icon: "spell_nature_healingwavelesser" },
    "200072": { name: "Torrent", icon: "spell_nature_riptide" },
    "200128": { name: "Trail of Light", icon: "ability_priest_wordsofmeaning" },
    "200183": { name: "Apotheosis", icon: "ability_priest_ascension" },
    "200209": {
      name: "Guardian Angel",
      icon: "ability_priest_pathofthedevout",
    },
    "202031": { name: "Sabertooth", icon: "inv_misc_monsterfang_01" },
    "202138": {
      name: "Sigil of Chains",
      icon: "ability_demonhunter_sigilofchains",
    },
    "202354": { name: "Stellar Drift", icon: "ability_druid_starfall" },
    "202430": {
      name: "Nature's Balance",
      icon: "ability_druid_balanceofpower",
    },
    "202770": { name: "Fury of Elune", icon: "ability_druid_dreamstate" },
    "203555": { name: "Demon Blades", icon: "inv_weapon_shortblade_92" },
    "203556": {
      name: "Master of the Glaive",
      icon: "inv_glaive_1h_demonhunter_a_01",
    },
    "203962": { name: "Blood Frenzy", icon: "ability_druid_primaltenacity" },
    "203974": { name: "Earthwarden", icon: "spell_shaman_blessingofeternals" },
    "204053": { name: "Rend and Tear", icon: "ability_druid_swipe" },
    "204263": { name: "Shining Force", icon: "ability_paladin_blindinglight2" },
    "205024": {
      name: "Lonely Winter",
      icon: "achievement_dungeon_frozenthrone",
    },
    "205029": { name: "Flame On", icon: "inv_helm_circlet_firelands_d_01" },
    "205036": { name: "Ice Ward", icon: "spell_frost_frostward" },
    "205037": { name: "Flame Patch", icon: "spell_mage_flameorb" },
    "205148": {
      name: "Reverse Entropy",
      icon: "spell_fire_playingwithfiregreen",
    },
    "205184": { name: "Roaring Blaze", icon: "ability_warlock_inferno" },
    "205636": { name: "Force of Nature", icon: "ability_druid_forceofnature" },
    "206315": { name: "Massacre", icon: "inv_sword_48" },
    "206476": { name: "Momentum", icon: "ability_foundryraid_demolition" },
    "207264": { name: "Bursting Sores", icon: "ability_druid_infectedwound" },
    "207272": {
      name: "Infected Claws",
      icon: "spell_deathknight_thrash_ghoul",
    },
    "207289": { name: "Unholy Assault", icon: "spell_shadow_unholyfrenzy" },
    "207311": { name: "Clawing Shadows", icon: "warlock_curse_shadow" },
    "207401": {
      name: "Ancestral Vigor",
      icon: "spell_shaman_blessingoftheeternals",
    },
    "207548": {
      name: "Agonizing Flames",
      icon: "achievment_raid_houroftwilight",
    },
    "207739": {
      name: "Burning Alive",
      icon: "spell_fire_elementaldevastation",
    },
    "208154": { name: "Warpaint", icon: "ability_rogue_preparation" },
    "209258": {
      name: "Last Resort",
      icon: "inv_glaive_1h_artifactaldorchi_d_06",
    },
    "209281": {
      name: "Quickened Sigils",
      icon: "ability_demonhunter_concentratedsigils",
    },
    "212431": { name: "Explosive Shot", icon: "ability_hunter_explosiveshot" },
    "212552": {
      name: "Wraith Walk",
      icon: "inv_helm_plate_raiddeathknight_p_01",
    },
    "212653": { name: "Shimmer", icon: "spell_arcane_massdispel" },
    "219272": { name: "Demon Skin", icon: "spell_shadow_felarmour" },
    "232893": { name: "Felblade", icon: "ability_demonhunter_felblade" },
    "235224": { name: "Frigid Winds", icon: "ability_mage_deepfreeze" },
    "236058": { name: "Frenetic Speed", icon: "spell_fire_burningspeed" },
    "248033": { name: "Awakening", icon: "inv_helm_plate_raidpaladin_n_01" },
    "257944": {
      name: "Thrill of the Hunt",
      icon: "ability_hunter_thrillofthehunt",
    },
    "258860": { name: "Essence Break", icon: "spell_shadow_ritualofsacrifice" },
    "260243": { name: "Volley", icon: "ability_hunter_rapidkilling" },
    "260309": {
      name: "Master Marksman",
      icon: "ability_hunter_mastermarksman",
    },
    "260367": { name: "Streamline", icon: "ability_hunter_runningshot" },
    "260402": { name: "Double Tap", icon: "ability_hunter_crossfire" },
    "260878": { name: "Spirit Wolf", icon: "spell_hunter_lonewolf" },
    "261947": {
      name: "Fist of the White Tiger",
      icon: "inv_fistofthewhitetiger",
    },
    "263642": { name: "Fracture", icon: "ability_creature_felsunder" },
    "266086": { name: "Rain of Chaos", icon: "spell_fire_felrainoffire" },
    "267115": { name: "Flashover", icon: "ability_warlock_backdraft" },
    "267116": {
      name: "Animal Companion",
      icon: "ability_hunter_bestialdiscipline",
    },
    "269644": { name: "Searing Touch", icon: "ability_warlock_backdraft" },
    "270233": { name: "Freezing Rain", icon: "spell_frost_frozenorb" },
    "270581": { name: "Natural Mending", icon: "ability_hunter_onewithnature" },
    "271877": { name: "Blade Rush", icon: "ability_arakkoa_spinning_blade" },
    "273952": { name: "Grip of the Dead", icon: "ability_creature_disease_05" },
    "274963": { name: "Upwelling", icon: "ability_monk_surgingmist" },
    "276837": {
      name: "Army of the Damned",
      icon: "artifactability_unholydeathknight_deathsembrace",
    },
    "278309": { name: "Chain Reaction", icon: "spell_frost_frostblast" },
    "280721": {
      name: "Sudden Death",
      icon: "ability_warrior_improveddisciplines",
    },
    "285381": {
      name: "Primal Wrath",
      icon: "artifactability_feraldruid_ashamanesbite",
    },
    "319230": { name: "Unholy Pact", icon: "spell_shadow_deathsembrace" },
    "319439": { name: "Bloodtalons", icon: "spell_druid_bloodythrash" },
    "319454": {
      name: "Heart of the Wild",
      icon: "spell_holy_blessingofagility",
    },
    "321453": { name: "Demonic", icon: "spell_shadow_demonform" },
    "325201": { name: "Dance of Chi-Ji", icon: "ability_monk_cranekick_new" },
    "335070": { name: "Cruelty", icon: "spell_nature_focusedmind" },
    "336639": { name: "Charred Flesh", icon: "ability_warlock_backdraft" },
    "343294": { name: "Soul Reaper", icon: "ability_deathknight_soulreaper" },
    "347461": {
      name: "Unbound Chaos",
      icon: "artifactability_vengeancedemonhunter_painbringer",
    },
  },
  conduits: {
    "334993": {
      name: "Stalwart Guardian",
      icon: "ability_warrior_shieldmastery",
    },
    "335034": { name: "Inspiring Presence", icon: "ability_toughness" },
    "336191": { name: "Indelible Victory", icon: "ability_warrior_secondwind" },
    "336379": { name: "Harm Denial", icon: "ability_monk_chiswirl" },
    "336460": { name: "Unrelenting Cold", icon: "spell_fire_blueflamering" },
    "336472": { name: "Shivering Core", icon: "spell_fire_blueflamestrike" },
    "336522": { name: "Icy Propulsion", icon: "spell_frost_coldhearted" },
    "336526": {
      name: "Calculated Strikes",
      icon: "spell_magic_lesserinvisibilty",
    },
    "336569": { name: "Ice Bite", icon: "spell_frost_frostblast" },
    "336598": {
      name: "Coordinated Offensive",
      icon: "ability_fixated_state_red",
    },
    "336632": { name: "Grounding Breath", icon: "inv_misc_volatileearth" },
    "336636": { name: "Flow of Time", icon: "spell_arcane_blink" },
    "336773": { name: "Jade Bond", icon: "inv_inscription_deck_jadeserpent" },
    "336777": {
      name: "Grounding Surge",
      icon: "ability_priest_surgeofdarkness",
    },
    "336821": { name: "Infernal Cascade", icon: "ability_rhyolith_immolation" },
    "336852": { name: "Master Flame", icon: "inv_elemental_primal_fire" },
    "336884": {
      name: "Lingering Numbness",
      icon: "sha_ability_rogue_bloodyeye",
    },
    "336890": { name: "Dizzying Tumble", icon: "inv_elemental_mote_air01" },
    "336992": {
      name: "Discipline of the Grove",
      icon: "achievement_bg_wineos",
    },
    "337084": {
      name: "Tumbling Technique",
      icon: "ability_titankeeper_phasing",
    },
    "337087": { name: "Siphoned Malice", icon: "inv_artifact_stolenpower" },
    "337099": { name: "Rising Sun Revival", icon: "spell_monk_revival" },
    "337123": { name: "Cryo-Freeze", icon: "spell_frost_icefloes" },
    "337136": { name: "Diverted Energy", icon: "inv_soulbarrier" },
    "337162": { name: "Depths of Insanity", icon: "spell_shadow_summonimp" },
    "337250": { name: "Evasive Stride", icon: "ability_monk_uplift" },
    "337264": { name: "Walk with the Ox", icon: "monk_stance_drunkenox" },
    "337275": { name: "Incantation of Swiftness", icon: "rogue_burstofspeed" },
    "337293": {
      name: "Tempest Barrier",
      icon: "inv_shield_1h_artifactstormfist_d_04",
    },
    "337295": { name: "Bone Marrow Hops", icon: "spell_animamaldraxxus_nova" },
    "337381": { name: "Eternal Hunger", icon: "inv_artifact_stolenpower" },
    "337704": {
      name: "Chilled Resilience",
      icon: "ability_deathknight_heartstopaura",
    },
    "337705": { name: "Spirit Drain", icon: "spell_deathknight_mindfreeze" },
    "337748": { name: "Light's Inspiration", icon: "spell_holy_restoration" },
    "337762": {
      name: "Power Unto Others",
      icon: "ability_priest_wordsofmeaning",
    },
    "337764": {
      name: "Reinforced Shell",
      icon: "spell_deathknight_antimagiczone",
    },
    "337811": { name: "Lasting Spirit", icon: "inv_icon_wing06a" },
    "337947": { name: "Resonant Words", icon: "spell_holy_holybolt" },
    "337972": { name: "Hardened Bones", icon: "spell_deathknight_subversion" },
    "337974": {
      name: "Refreshing Waters",
      icon: "ability_shaman_fortifyingwaters",
    },
    "337981": { name: "Vital Accretion", icon: "ability_accretion" },
    "338033": { name: "Thunderous Paws", icon: "ability_hunter_longevity" },
    "338042": { name: "Totemic Surge", icon: "spell_shaman_dropall_03" },
    "338048": {
      name: "Spiritual Resonance",
      icon: "spell_arcane_prismaticcloak",
    },
    "338330": {
      name: "Insatiable Appetite",
      icon: "ability_ironmaidens_bloodritual",
    },
    "338339": { name: "Swirling Currents", icon: "spell_holy_serendipity" },
    "338343": { name: "Heavy Rainfall", icon: "shaman_pvp_ripplingwaters" },
    "338345": { name: "Holy Oration", icon: "ability_priest_bindingprayers" },
    "338553": {
      name: "Convocation of the Dead",
      icon: "ability_deathknight_deathsiphon2",
    },
    "338671": { name: "Fel Defender", icon: "inv_armor_shield_naxxramas_d_01" },
    "338682": {
      name: "Viscous Ink",
      icon: "inv_archaeology_orcclans_tattooknife",
    },
    "338787": {
      name: "Shielding Words",
      icon: "ability_vehicle_sonicshockwave",
    },
    "338793": {
      name: "Shattered Restoration",
      icon: "ability_warlock_soulsiphon",
    },
    "338799": { name: "Felfire Haste", icon: "inv_boots_cloth_35v4" },
    "339018": {
      name: "Enfeebled Mark",
      icon: "ability_blackhand_marked4death",
    },
    "339048": {
      name: "Demonic Parole",
      icon: "inv_misc_codexofxerrath_chains",
    },
    "339109": {
      name: "Spirit Attunement",
      icon: "inv_archaeology_70_spiritofechero",
    },
    "339114": { name: "Golden Path", icon: "ability_priest_cascade" },
    "339130": { name: "Fel Celerity", icon: "spell_shadow_felmending" },
    "339182": { name: "Elysian Dirge", icon: "ability_monk_forcesphere" },
    "339186": { name: "Tumbling Waves", icon: "spell_animamaldraxxus_wave" },
    "339231": { name: "Growing Inferno", icon: "spell_fel_incinerate" },
    "339264": {
      name: "Marksman's Advantage",
      icon: "ability_argus_soulbombdebuffsmall",
    },
    "339268": {
      name: "Light's Barding",
      icon: "inv_lightforgedmatrixability_lightsjudgment",
    },
    "339272": { name: "Resolute Barrier", icon: "spell_shadow_felarmour" },
    "339316": {
      name: "Echoing Blessings",
      icon: "achievement_dungeon_heroic_gloryoftheraider",
    },
    "339399": { name: "Rejuvenating Wind", icon: "ability_druid_galewinds" },
    "339459": {
      name: "Resilience of the Hunter",
      icon: "spell_nature_spiritarmor",
    },
    "339481": { name: "Rolling Agony", icon: "warlock_pvp_cursefragility" },
    "339495": { name: "Reversal of Fortune", icon: "inv_trickshot" },
    "339558": { name: "Cheetah's Vigor", icon: "rogue_burstofspeed" },
    "339576": { name: "Withering Bolt", icon: "spell_shadow_shadowbolt" },
    "339704": {
      name: "Ferocious Appetite",
      icon: "ability_hunter_rapidkilling",
    },
    "339890": { name: "Duplicitous Havoc", icon: "spell_fel_firebolt" },
    "339892": { name: "Ashen Remains", icon: "inv_enchanting_dust" },
    "339895": { name: "Repeat Decree", icon: "ability_mount_goatmountwhite" },
    "339920": {
      name: "Sharpshooter's Focus",
      icon: "ability_creature_cursed_04",
    },
    "339939": {
      name: "Destructive Reverberations",
      icon: "spell_animaardenweald_wave",
    },
    "339948": { name: "Disturb the Peace", icon: "warrior_disruptingshout" },
    "339973": {
      name: "Deadly Chain",
      icon: "ability_hunter_resistanceisfutile",
    },
    "339984": { name: "Focused Light", icon: "item_holyspark" },
    "340033": { name: "Powerful Precision", icon: "ability_hunter_markedshot" },
    "340041": { name: "Infernal Brand", icon: "warlock_pvp_burninglegion" },
    "340212": {
      name: "Hallowed Discernment",
      icon: "spell_animarevendreth_groundstate",
    },
    "340218": { name: "Ringing Clarity", icon: "spell_animabastion_orb" },
    "340348": { name: "Soul Eater", icon: "ability_ardenweald_warlock" },
    "340540": { name: "Ursine Vigor", icon: "ability_druid_markofursol" },
    "340543": { name: "Innate Resolve", icon: "spell_nature_healingway" },
    "340552": { name: "Unchecked Aggression", icon: "ability_druid_berserk" },
    "340553": {
      name: "Well-Honed Instincts",
      icon: "ability_druid_tigersroar",
    },
    "340562": { name: "Diabolic Bloodstone", icon: "warlock_-bloodstone" },
    "340605": { name: "Layered Mane", icon: "ability_druid_ironfur" },
    "340682": { name: "Taste for Blood", icon: "ability_druid_ferociousbite" },
    "340705": {
      name: "Carnivorous Instinct",
      icon: "ability_mount_jungletiger",
    },
    "340706": {
      name: "Precise Alignment",
      icon: "spell_nature_natureguardian",
    },
    "340876": { name: "Echoing Call", icon: "ability_fixated_state_yellow" },
    "341280": { name: "Born Anew", icon: "spell_nature_reincarnation" },
    "341312": { name: "Recuperator", icon: "inv_gizmo_runichealthinjector" },
    "341383": { name: "Endless Thirst", icon: "ability_revendreth_druid" },
    "341446": { name: "Conflux of Elements", icon: "ability_ardenweald_druid" },
    "341450": {
      name: "Front of the Pack",
      icon: "spell_druid_stampedingroar_cat",
    },
    "341451": {
      name: "Born of the Wilds",
      icon: "ability_hunter_huntervswild",
    },
    "341529": {
      name: "Cloaked in Shadows",
      icon: "inv_helm_cloth_shadowmoonclan_b_01",
    },
    "341535": { name: "Prepared for All", icon: "ability_rogue_ghostpirate" },
    "341543": { name: "Sleight of Hand", icon: "inv_misc_dice_02" },
    "341546": { name: "Count the Odds", icon: "inv_misc_dice_01" },
    "344358": {
      name: "Unnatural Malice",
      icon: "spell_animaardenweald_missile",
    },
    "357888": {
      name: "Condensed Anima Sphere",
      icon: "spell_animarevendreth_orb",
    },
    "357902": {
      name: "Adaptive Armor Fragment",
      icon: "inv_belt_plate_ardenweald_d_01",
    },
  },
  isBoss: (id: number): boolean => allBossIDs.has(id),
  isTormentedLieutenant: (id: number): boolean =>
    tormentedLieutenantIDs.has(id),
};

export type StaticData = {
  classes: Record<
    number,
    typeof staticData.classes[keyof typeof staticData.classes]
  >;
  dungeons: Record<
    number,
    typeof staticData.dungeons[keyof typeof staticData.dungeons]
  >;
  affixes: Record<
    number,
    typeof staticData.affixes[keyof typeof staticData.affixes]
  >;
  soulbinds: Record<
    number,
    typeof staticData.soulbinds[keyof typeof staticData.soulbinds]
  >;
  covenants: Record<
    number,
    typeof staticData.covenants[keyof typeof staticData.covenants]
  >;
  spells: Record<number, { icon: string; name: string; cd: number }>;
  tormentedLieutenants: Record<
    number,
    typeof staticData.tormentedLieutenants[keyof typeof staticData.tormentedLieutenants]
  >;
  tormentedPowers: Record<
    number,
    typeof staticData.tormentedPowers[keyof typeof staticData.tormentedPowers]
  >;
  isBoss: (id: number) => boolean;
  isTormentedLieutenant: (id: number) => boolean;
  legendaries: Record<
    number,
    typeof staticData.legendaries[keyof typeof staticData.legendaries]
  >;
  talents: Record<
    number,
    typeof staticData.talents[keyof typeof staticData.talents]
  >;
  conduits: Record<
    number,
    typeof staticData.conduits[keyof typeof staticData.conduits]
  >;
};
