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
        5246, 871, 107_574, 97_462, 107_574, 1161, 325_886, 64_382, 12_975,
        167_105, 227_847, 324_143, 46_924, 307_865, 262_228, 18_499, 1719,
        184_364,
      ],
      specs: [
        {
          id: 3,
          name: "Arms",
          cooldowns: [107_574, 167_105, 227_847, 262_228],
        },
        { id: 1, name: "Protection", cooldowns: [871, 107_574, 12_975] },
        { id: 2, name: "Fury", cooldowns: [46_924, 184_364] },
      ],
    },
    "2": {
      name: "Mage",
      cooldowns: [
        314_791, 108_978, 235_219, 45_438, 108_978, 84_714, 12_472, 55_342,
        190_319, 80_353, 205_021, 314_793, 307_443, 198_154, 66, 12_042,
        324_220,
      ],
      specs: [
        { id: 4, name: "Fire", cooldowns: [108_978, 190_319] },
        { id: 6, name: "Arcane", cooldowns: [198_154, 12_042] },
        {
          id: 5,
          name: "Frost",
          cooldowns: [108_978, 235_219, 84_714, 12_472, 205_021],
        },
      ],
    },
    "3": {
      name: "Rogue",
      cooldowns: [
        328_305, 1856, 13_750, 2094, 323_547, 2983, 323_654, 5277, 328_547,
        121_471, 277_925, 51_690, 137_619, 114_018, 31_224, 79_140, 185_313,
      ],
      specs: [
        { id: 9, name: "Outlaw", cooldowns: [13_750, 51_690] },
        { id: 8, name: "Subtlety", cooldowns: [121_471, 277_925, 185_313] },
        { id: 7, name: "Assassination", cooldowns: [79_140] },
      ],
    },
    "4": {
      name: "Shaman",
      cooldowns: [
        198_103, 192_249, 192_222, 114_050, 114_051, 16_191, 58_875, 32_182,
        326_059, 51_533, 328_923, 108_280, 207_399, 2825, 324_386, 79_206,
        79_206, 320_137, 192_058, 114_052, 98_008, 108_271, 320_674, 108_281,
        8143, 191_634, 198_067, 198_838,
      ],
      specs: [
        {
          id: 12,
          name: "Enhancement",
          cooldowns: [114_051, 58_875, 51_533, 320_137],
        },
        {
          id: 10,
          name: "Restoration",
          cooldowns: [
            16_191, 108_280, 207_399, 79_206, 114_052, 98_008, 198_838,
          ],
        },
        {
          id: 11,
          name: "Elemental",
          cooldowns: [
            192_249, 192_222, 114_050, 79_206, 108_281, 191_634, 198_067,
          ],
        },
      ],
    },
    "5": {
      name: "Priest",
      cooldowns: [
        64_901, 64_843, 327_661, 34_861, 15_286, 319_952, 33_206, 246_287,
        34_433, 109_964, 62_618, 62_618, 47_536, 19_236, 47_585, 323_673,
        265_202, 8122, 325_013, 200_183, 10_060, 200_174, 88_625, 47_788,
        123_040, 2050, 34_433, 73_325, 324_724, 228_260,
      ],
      specs: [
        {
          id: 13,
          name: "Shadow",
          cooldowns: [15_286, 319_952, 34_433, 47_585, 200_174, 228_260],
        },
        {
          id: 14,
          name: "Holy",
          cooldowns: [
            64_901, 64_843, 34_861, 265_202, 200_183, 88_625, 47_788, 2050,
          ],
        },
        {
          id: 15,
          name: "Discipline",
          cooldowns: [
            33_206, 246_287, 109_964, 62_618, 47_536, 123_040, 34_433,
          ],
        },
      ],
    },
    "6": {
      name: "Hunter",
      cooldowns: [
        325_028, 19_577, 266_779, 201_430, 328_231, 131_894, 260_402, 186_257,
        19_574, 324_149, 288_613, 186_265, 19_577, 193_530, 109_304, 308_491,
        321_530, 186_289,
      ],
      specs: [
        {
          id: 16,
          name: "BeastMastery",
          cooldowns: [201_430, 19_574, 19_577, 193_530, 321_530],
        },
        { id: 17, name: "Survival", cooldowns: [19_577, 266_779, 186_289] },
        { id: 18, name: "Marksmanship", cooldowns: [260_402, 288_613] },
      ],
    },
    "7": {
      name: "Monk",
      cooldowns: [
        122_278, 115_203, 322_109, 115_176, 326_860, 119_381, 115_203, 310_454,
        122_470, 115_310, 115_288, 115_399, 325_197, 322_507, 325_153, 132_578,
        325_216, 115_203, 322_118, 122_783, 122_783, 116_849, 137_639, 197_908,
        152_173, 327_104, 123_904,
      ],
      specs: [
        {
          id: 21,
          name: "Windwalker",
          cooldowns: [
            115_203, 122_470, 115_288, 122_783, 137_639, 152_173, 123_904,
          ],
        },
        {
          id: 20,
          name: "Brewmaster",
          cooldowns: [115_176, 115_399, 322_507, 325_153, 132_578, 115_203],
        },
        {
          id: 19,
          name: "Mistweaver",
          cooldowns: [
            115_203, 115_310, 325_197, 322_118, 122_783, 116_849, 197_908,
          ],
        },
      ],
    },
    "8": {
      name: "Druid",
      cooldowns: [
        20_484, 325_727, 50_334, 326_434, 197_721, 102_560, 323_764, 61_336,
        106_951, 22_812, 78_675, 1850, 205_636, 108_238, 740, 61_336, 319_454,
        102_342, 132_158, 194_223, 102_793, 202_770, 106_898, 203_651, 323_546,
        29_166, 29_166, 102_558, 5211, 33_891, 102_543,
      ],
      specs: [
        { id: 25, name: "Feral", cooldowns: [106_951, 61_336, 102_543] },
        {
          id: 24,
          name: "Balance",
          cooldowns: [102_560, 78_675, 205_636, 194_223, 202_770, 29_166],
        },
        { id: 23, name: "Guardian", cooldowns: [50_334, 61_336, 102_558] },
        {
          id: 22,
          name: "Restoration",
          cooldowns: [197_721, 740, 102_342, 132_158, 203_651, 29_166, 33_891],
        },
      ],
    },
    "9": {
      name: "DemonHunter",
      cooldowns: [
        317_009, 198_589, 207_684, 344_867, 320_341, 209_258, 212_084, 202_137,
        191_427, 188_501, 204_021, 187_827, 196_718, 306_830, 196_555, 202_138,
        323_639, 258_925,
      ],
      specs: [
        {
          id: 26,
          name: "Vengeance",
          cooldowns: [
            207_684, 320_341, 209_258, 212_084, 202_137, 204_021, 187_827,
            202_138,
          ],
        },
        {
          id: 27,
          name: "Havoc",
          cooldowns: [198_589, 344_867, 191_427, 196_718, 196_555, 258_925],
        },
      ],
    },
    "10": {
      name: "Paladin",
      cooldowns: [
        343_527, 498, 633, 31_821, 327_193, 343_721, 304_971, 204_018, 328_622,
        6940, 316_958, 498, 31_884, 328_282, 642, 31_850, 231_895, 216_331,
        184_662, 114_158, 1022, 328_281, 86_659, 853, 328_204, 205_191, 328_620,
      ],
      specs: [
        {
          id: 28,
          name: "Protection",
          cooldowns: [498, 327_193, 204_018, 31_850, 86_659],
        },
        {
          id: 30,
          name: "Retribution",
          cooldowns: [343_527, 343_721, 231_895, 184_662, 205_191],
        },
        { id: 29, name: "Holy", cooldowns: [31_821, 498, 216_331, 114_158] },
      ],
    },
    "11": {
      name: "Warlock",
      cooldowns: [
        325_640, 698, 333_889, 113_858, 265_187, 29_893, 111_898, 321_792,
        20_707, 104_773, 312_321, 113_860, 30_283, 267_171, 1122, 205_180,
        267_217, 342_601, 325_289,
      ],
      specs: [
        { id: 31, name: "Destruction", cooldowns: [113_858, 1122] },
        { id: 33, name: "Affliction", cooldowns: [113_860, 205_180] },
        {
          id: 32,
          name: "Demonology",
          cooldowns: [265_187, 111_898, 267_171, 267_217],
        },
      ],
    },
    "12": {
      name: "DeathKnight",
      cooldowns: [
        61_999, 221_699, 46_585, 51_271, 194_844, 207_289, 48_707, 312_202,
        152_279, 315_443, 55_233, 48_792, 219_809, 51_052, 275_699, 49_206,
        311_648, 63_560, 324_128, 108_199, 47_568, 212_552, 42_650, 207_167,
        327_574, 49_039, 49_028, 48_743, 279_302,
      ],
      specs: [
        {
          id: 36,
          name: "Frost",
          cooldowns: [51_271, 152_279, 47_568, 207_167, 279_302],
        },
        {
          id: 34,
          name: "Blood",
          cooldowns: [221_699, 194_844, 55_233, 219_809, 108_199, 49_028],
        },
        {
          id: 35,
          name: "Unholy",
          cooldowns: [207_289, 275_699, 49_206, 63_560, 42_650],
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
};
