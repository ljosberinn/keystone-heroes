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
  spells: Record<string, { icon: string; name: string; cd: number }>;
};
