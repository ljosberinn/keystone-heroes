import { Role, PlayableClass, SpecName } from "@prisma/client";

type Ability = {
  name: string;
  id: number;
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
    id: 1,
    name: PlayableClass.Warrior,
    cooldowns: [
      { name: "Recklessness", id: 1719 },
      { name: "Rallying Cry", id: 97_462 },
      { name: "Challenging Shout", id: 1161 },
      { name: "Intimidating Shout", id: 5246 },
      { name: "Shattering Throw", id: 64_382 },
      { name: "Berserker Rage", id: 18_499 },
    ],
    covenantAbilities: [
      { name: "Spear of Bastion", id: 307_865 },
      { name: "Conqueror's Banner", id: 324_143 },
      { name: "Ancient Aftershock", id: 325_886 },
      { name: "Condemn", id: 317_349 },
    ],
    specs: [
      {
        name: SpecName.Protection,
        role: Role.tank,
        cooldowns: [
          { name: "Shield Wall", id: 871 },
          { name: "Avatar", id: 107_574 },
          { name: "Last Stand", id: 12_975 },
        ],
      },
      {
        name: SpecName.Fury,
        role: Role.dps,
        cooldowns: [
          { name: "Bladestorm", id: 46_924 },
          { name: "Enraged Regeneration", id: 184_364 },
        ],
      },
      {
        name: SpecName.Arms,
        role: Role.dps,
        cooldowns: [
          { name: "Colosus Smash", id: 167_105 },
          { name: "Avatar", id: 107_574 },
          { name: "Deadly Calm", id: 262_228 },
          { name: "Bladestorm", id: 227_847 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: PlayableClass.Mage,
    cooldowns: [
      { name: "Polymorph", id: 118 },
      { name: "Invisibility", id: 66 },
      { name: "Time Warp", id: 80_353 },
      { name: "Ice Block", id: 45_438 },
      { name: "Mirror Image", id: 55_342 },
    ],
    covenantAbilities: [
      { name: "Mirrors of Torment", id: 314_793 },
      { name: "Radiant Spark", id: 307_443 },
      { name: "Deathborne", id: 324_220 },
      { name: "Shifting Power", id: 314_791 },
    ],
    specs: [
      {
        name: SpecName.Fire,
        role: Role.dps,
        cooldowns: [
          { name: "Combustion", id: 190_319 },
          { name: "Alter Time", id: 108_978 },
        ],
      },
      {
        name: SpecName.Frost,
        role: Role.dps,
        cooldowns: [
          { name: "Icy Veins", id: 12_472 },
          { name: "Frozen Orb", id: 84_714 },
          { name: "Alter Time", id: 108_978 },
          { name: "Cold Snap", id: 235_219 },
          { name: "Ray of Frost", id: 205_021 },
        ],
      },
      {
        name: SpecName.Arcane,
        role: Role.dps,
        cooldowns: [
          { name: "Arcane Power", id: 12_042 },
          { name: "Presence of Mind", id: 198_154 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: PlayableClass.Rogue,
    cooldowns: [
      { name: "Shroud of Concealment", id: 114_018 },
      { name: "Sap", id: 6770 },
      { name: "Blind", id: 2094 },
      { name: "Sprint", id: 2983 },
      { name: "Evasion", id: 37_683 },
      { name: "Cloak of Shadows", id: 31_224 },
      { name: "Vanish", id: 1856 },
      { name: "Marked for Death", id: 137_619 },
    ],
    covenantAbilities: [
      { name: "Echoing Reprimand", id: 323_547 },
      { name: "Flagellation", id: 323_654 },
      { name: "Serrated Bone Spike", id: 328_547 },
      { name: "Sepsis", id: 328_305 },
    ],
    specs: [
      {
        name: SpecName.Assassination,
        role: Role.dps,
        cooldowns: [{ name: "Vendetta", id: 79_140 }],
      },
      {
        name: SpecName.Subtlety,
        role: Role.dps,
        cooldowns: [
          { name: "Shadow Dance", id: 185_313 },
          { name: "Shadow Blades", id: 121_471 },
          { name: "Shuriken Tornado", id: 277_925 },
        ],
      },
      {
        name: SpecName.Outlaw,
        role: Role.dps,
        cooldowns: [
          { name: "Adrenaline Rush", id: 13_750 },
          { name: "Killing Spree", id: 51_690 },
        ],
      },
    ],
  },
  {
    id: 4,
    name: PlayableClass.Shaman,
    cooldowns: [
      { name: "Capacitator Totem", id: 192_058 },
      { name: "Bloodlust", id: 2825 },
      { name: "Heroism", id: 32_182 },
      { name: "Earth Elemental", id: 198_103 },
      { name: "Astral Shift", id: 108_271 },
      { name: "Tremor Totem", id: 8143 },
    ],
    covenantAbilities: [
      { name: "Vesper Totem", id: 324_386 },
      { name: "Chain Harvest", id: 320_674 },
      { name: "Primordial Wave", id: 326_059 },
      { name: "Fae Transfusion", id: 328_923 },
    ],
    specs: [
      {
        name: SpecName.Restoration,
        role: Role.healer,
        cooldowns: [
          { name: "Spirit Link Totem", id: 98_008 },
          { name: "Spiritwalker's Grace", id: 79_206 },
          { name: "Ascendance", id: 114_052 },
          { name: "Ancestral Protection Totem", id: 207_399 },
          { name: "Healing Tide Totem", id: 108_280 },
          { name: "Mana Tide Totem", id: 16_191 },
          { name: "Earthen Wall Totem", id: 198_838 },
        ],
      },
      {
        name: SpecName.Elemental,
        role: Role.dps,
        cooldowns: [
          { name: "Ascendance", id: 114_050 },
          { name: "Stormkeeper", id: 191_634 },
          { name: "Spiritwalker's Grace", id: 79_206 },
          { name: "Ancestral Guidance", id: 108_281 },
          { name: "Liquid Magma Totem", id: 192_222 },
          { name: "Storm Elemental", id: 192_249 },
          { name: "Fire Elemental", id: 198_067 },
        ],
      },
      {
        name: SpecName.Enhancement,
        role: Role.dps,
        cooldowns: [
          { name: "Feral Spirit", id: 51_533 },
          { name: "Ascendance", id: 114_051 },
          { name: "Stormkeeper", id: 320_137 },
          { name: "Spirit Walk", id: 58_875 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: PlayableClass.Priest,
    cooldowns: [
      { name: "Power Infusion ", id: 10_060 },
      { name: "Leap of Faith", id: 73_325 },
      { name: "Desperate Prayer", id: 19_236 },
      { name: "Psychic Scream", id: 8122 },
      { name: "Power Word: Barrier", id: 81_782 },
    ],
    covenantAbilities: [
      { name: "Boon of the Ascended", id: 325_013 },
      { name: "Mindgames", id: 323_673 },
      { name: "Unholy Nova", id: 324_724 },
      { name: "Fae Guardians", id: 327_661 },
    ],
    specs: [
      {
        name: SpecName.Shadow,
        role: Role.dps,
        cooldowns: [
          { name: "Surrender to Madness", id: 319_952 },
          { name: "Mindbender", id: 200_174 },
          { name: "Dispersion", id: 47_585 },
          { name: "Shadowfiend", id: 34_433 },
          { name: "Vampiric Embrace", id: 15_286 },
          { name: "Void Eruption", id: 228_260 },
        ],
      },
      {
        name: SpecName.Holy,
        role: Role.healer,
        cooldowns: [
          { name: "Guardian Spirit", id: 47_788 },
          { name: "Divine Hymn", id: 64_843 },
          { name: "Symbol of Hope", id: 64_901 },
          { name: "Apotheosis", id: 200_183 },
          { name: "Holy Word: Serenity", id: 2050 },
          { name: "Holy Word: Salvation", id: 265_202 },
          { name: "Holy Word: Sanctify", id: 34_861 },
          { name: "Holy Word: Chastise", id: 88_625 },
        ],
      },
      {
        name: SpecName.Discipline,
        role: Role.healer,
        cooldowns: [
          { name: "Pain Suppression", id: 33_206 },
          { name: "Evangelism", id: 246_287 },
          { name: "Spirit Shell", id: 109_964 },
          { name: "Power Word: Barrier", id: 62_618 },
          { name: "Rapture", id: 47_536 },
          { name: "Mindbender", id: 123_040 },
          { name: "Shadowfiend", id: 34_433 },
        ],
      },
    ],
  },
  {
    id: 6,
    name: PlayableClass.Hunter,
    cooldowns: [
      { name: "Aspect of the Turtle", id: 186_265 },
      { name: "Aspect of the Cheetah", id: 186_257 },
      { name: "Aspect of the Chameleon", id: 61_648 },
      { name: "Exhilaration", id: 109_304 },
      { name: "A Murder of Crows", id: 131_894 },
    ],
    covenantAbilities: [
      { name: "Wild Spirits", id: 328_231 },
      { name: "Resonating Arrow", id: 308_491 },
      { name: "Flayed Shot", id: 324_149 },
      { name: "Death Chakram", id: 325_028 },
    ],
    specs: [
      {
        // eslint-disable-next-line inclusive-language/use-inclusive-words
        name: SpecName.BeastMastery,
        role: Role.dps,
        cooldowns: [
          { name: "Bestial Wrath", id: 19_574 },
          { name: "Aspect of the Wild", id: 193_530 },
          { name: "Bloodshed", id: 321_530 },
          { name: "Stampede", id: 201_430 },
          { name: "Intimidation", id: 19_577 },
        ],
      },
      {
        name: SpecName.Survival,
        role: Role.dps,
        cooldowns: [
          { name: "Intimidation", id: 19_577 },
          { name: "Aspect of the Eagle", id: 186_289 },
          { name: "Coordinated Assault", id: 266_779 },
        ],
      },
      {
        name: SpecName.Marksmanship,
        role: Role.dps,
        cooldowns: [
          { name: "Double Tap", id: 260_402 },
          { name: "Trueshot", id: 288_613 },
        ],
      },
    ],
  },
  {
    id: 7,
    name: PlayableClass.Monk,
    cooldowns: [
      { name: "Touch of Death", id: 322_109 },
      { name: "Fortifying Brew", id: 115_203 },
      { name: "Leg Sweep", id: 119_381 },
      { name: "Touch of Fatality", id: 169_340 },
    ],
    covenantAbilities: [
      { name: "Weapons of Order", id: 310_454 },
      { name: "Fallen Order", id: 326_860 },
      { name: "Bonedust Brew", id: 325_216 },
      { name: "Faeline Stomp", id: 327_104 },
    ],
    specs: [
      {
        name: SpecName.Mistweaver,
        role: Role.healer,
        cooldowns: [{ name: "Diffuse Magic", id: 122_783 }],
      },
      {
        // eslint-disable-next-line inclusive-language/use-inclusive-words
        name: SpecName.Brewmaster,
        role: Role.tank,
        cooldowns: [
          { name: "Invoke Niuzao, the Black Ox", id: 132_578 },
          { name: "Dampen Harm", id: 122_278 },
          { name: "Zen Meditation", id: 115_176 },
        ],
      },
      {
        name: SpecName.Windwalker,
        role: Role.dps,
        cooldowns: [
          { name: "Invoke Xuen, the White Tiger", id: 123_904 },
          { name: "Storm, Earth and Fire", id: 137_639 },
          { name: "Touch of Karma", id: 122_470 },
          { name: "Diffuse Magic", id: 122_783 },
        ],
      },
    ],
  },
  {
    id: 8,
    name: PlayableClass.Druid,
    cooldowns: [
      { name: "Rebirth", id: 20_484 },
      { name: "Barkskin", id: 22_812 },
      { name: "Dash", id: 1850 },
      { name: "Stampeding Roar", id: 106_898 },
      // through Resto affinity
      { name: "Ursol's Vortex", id: 102_793 },
    ],
    covenantAbilities: [
      { name: "Convoke the Spirits", id: 323_764 },
      { name: "Ravenous Frenzy", id: 323_546 },
      { name: "Kindred Spirits", id: 326_434 },
      { name: "Adaptive Swarm", id: 325_727 },
    ],
    specs: [
      {
        name: SpecName.Restoration,
        role: Role.healer,
        cooldowns: [
          { name: "Innervate", id: 29_166 },
          { name: "Nature's Swiftness", id: 132_158 },
          { name: "Flourish", id: 197_721 },
          { name: "Ironbark", id: 102_342 },
          { name: "Tranquility", id: 740 },
          { name: "Overgrowth", id: 203_651 },
          { name: "Incarnation: Tree of Life", id: 33_891 },
        ],
      },
      {
        name: SpecName.Guardian,
        role: Role.tank,
        cooldowns: [
          { name: "Survival Instincts", id: 61_336 },
          { name: "Incarnation: Guardian of Ursoc", id: 102_558 },
          { name: "Berserk", id: 50_334 },
        ],
      },
      {
        name: SpecName.Balance,
        role: Role.dps,
        cooldowns: [
          { name: "Fury of Elune", id: 202_770 },
          { name: "Innervate", id: 29_166 },
          { name: "Force of Nature", id: 205_636 },
          { name: "Solar Beam", id: 78_675 },
          { name: "Celestial Alignment", id: 194_223 },
          { name: "Incarnation: Chosen of Elune", id: 102_560 },
        ],
      },
      {
        name: SpecName.Feral,
        role: Role.dps,
        cooldowns: [
          { name: "Incarnation: King of the Jungle", id: 102_543 },
          { name: "Berserk", id: 106_951 },
          { name: "Survival Instincts", id: 61_336 },
        ],
      },
    ],
  },
  {
    id: 9,
    name: PlayableClass.DemonHunter,
    cooldowns: [{ name: "Spectral Sight", id: 188_501 }],
    covenantAbilities: [
      { name: "Elysian Decree", id: 306_830 },
      { name: "The Hunt", id: 323_639 },
      { name: "Fodder to the Flame", id: 329_554 },
      { name: "Sinful Brand", id: 317_009 },
    ],
    specs: [
      {
        name: SpecName.Vengeance,
        role: Role.tank,
        cooldowns: [
          { name: "Metamorphosis", id: 187_827 },
          { name: "Fel Devastation", id: 212_084 }, // applies "applybuff" with meta id, "applybuff" fel deva and "cast" event
          { name: "Fiery Brand", id: 204_021 }, // applies "cast" and "damage" events
          { name: "Bulk Extraction", id: 320_341 },
          { name: "Sigil of Silence", id: 202_137 },
          { name: "Sigil of Chains", id: 202_138 },
          { name: "Sigil of Misery", id: 207_684 },
          // todo: does this count as cast event?
          { name: "Last Resort", id: 209_258 },
        ],
      },
      {
        name: SpecName.Havoc,
        role: Role.dps,
        cooldowns: [
          { name: "Chaos Nova", id: 344_867 },
          { name: "Fel Barrage", id: 258_925 },
          { name: "Darkness", id: 196_718 },
          { name: "Netherwalk", id: 196_555 },
          { name: "Blur", id: 198_589 },
          { name: "Metamorphosis", id: 191_427 },
        ],
      },
    ],
  },
  {
    id: 10,
    name: PlayableClass.Paladin,
    cooldowns: [
      { name: "Avenging Wrath", id: 31_884 },
      { name: "Blessing of Protection", id: 1022 },
      { name: "Divine Shield", id: 642 },
      { name: "Blessing of Sacrifice", id: 6940 },
      { name: "Hammer of Justice", id: 853 },
      { name: "Lay on Hands", id: 633 },
    ],
    covenantAbilities: [
      { name: "Ashen Hallow", id: 316_958 },
      { name: "Divine Toll", id: 304_971 },
      { name: "Vanquisher's Hammer", id: 328_204 },
      { name: "Blessing of the Season", id: 328_278 },
    ],
    specs: [
      {
        name: SpecName.Protection,
        role: Role.tank,
        cooldowns: [
          { name: "Divine Protection", id: 498 },
          { name: "Ardent Defender", id: 31_850 },
          { name: "Guardian of Ancient Kings", id: 86_659 },
          { name: "Blessing of Spellwarding", id: 204_018 },
          { name: "Moment of Glory", id: 327_193 },
        ],
      },
      {
        name: SpecName.Holy,
        role: Role.healer,
        cooldowns: [
          { name: "Avenging Crusader", id: 216_331 },
          { name: "Aura Mastery", id: 31_821 },
          { name: "Divine Protection", id: 498 },
          { name: "Light's Hammer", id: 114_158 },
        ],
      },
      {
        name: SpecName.Retribution,
        role: Role.dps,
        cooldowns: [
          { name: "Shield of Vengeance", id: 184_662 },
          { name: "Execution Sentence", id: 343_527 },
          { name: "Crusade", id: 231_895 },
          { name: "Final Reckoning", id: 343_721 },
          { name: "Eye for an Eye", id: 205_191 },
        ],
      },
    ],
  },
  {
    id: 11,
    name: PlayableClass.Warlock,
    cooldowns: [
      { name: "Create Soulwell", id: 29_893 },
      { name: "Shadowfury", id: 30_283 },
      { name: "Unending Resolve", id: 104_773 },
      { name: "Soulstone", id: 20_707 },
      { name: "Ritual of Summoning", id: 698 },
      { name: "Ritual of Doom", id: 342_601 },
      { name: "Fel Domination", id: 333_889 },
    ],
    covenantAbilities: [
      { name: "Impending Catastrophe", id: 321_792 },
      { name: "Soul Rot", id: 325_640 },
      { name: "Scouring Tithe", id: 312_321 },
      { name: "Decimating Bolt", id: 325_289 },
    ],
    specs: [
      {
        name: SpecName.Destruction,
        role: Role.dps,
        cooldowns: [
          { name: "Dark Soul: Instability", id: 113_858 },
          { name: "Summon Infernal", id: 1122 },
        ],
      },
      {
        name: SpecName.Demonology,
        role: Role.dps,
        cooldowns: [
          { name: "Nether Portal", id: 267_217 },
          { name: "Grimoire: Felguard", id: 111_898 },
          { name: "Summon Demonic Tyrant", id: 265_187 },
          { name: "Demonic Strength", id: 267_171 },
        ],
      },
      {
        name: SpecName.Affliction,
        role: Role.dps,
        cooldowns: [
          { name: "Dark Soul: Misery", id: 113_860 },
          { name: "Summon Darkglare", id: 205_180 },
        ],
      },
    ],
  },
  {
    id: 12,
    name: PlayableClass.DeathKnight,
    cooldowns: [
      { name: "Anti-Magic Shell", id: 48_707 },
      { name: "Icebound Fortitude", id: 48_792 },
      { name: "Raise Ally", id: 61_999 },
      { name: "Lichborne", id: 49_039 },
      { name: "Sacrificial Pact", id: 327_574 },
      { name: "Raise Dead", id: 46_585 },
      { name: "Anti-Magic Zone", id: 51_052 },
      { name: "Wraith Walk", id: 212_552 },
      { name: "Death Pact", id: 48_743 },
    ],
    covenantAbilities: [
      { name: "Shackle the Unworthy", id: 312_202 },
      { name: "Abomination Limb", id: 315_443 },
      { name: "Swarming Mist", id: 311_648 },
      { name: "Death's Due", id: 324_128 },
    ],
    specs: [
      {
        name: SpecName.Blood,
        role: Role.tank,
        cooldowns: [
          { name: "Bonestorm", id: 194_844 },
          { name: "Tombstone", id: 219_809 },
          { name: "Blood Tap", id: 221_699 },
          { name: "Vampiric Blood", id: 55_233 },
          { name: "Gorefiend's Grasp", id: 108_199 },
          { name: "Dancing Rune Weapon", id: 49_028 },
        ],
      },
      {
        name: SpecName.Unholy,
        role: Role.dps,
        cooldowns: [
          { name: "Summon Gargoyle", id: 49_206 },
          { name: "Unholy Assault", id: 207_289 },
          { name: "Army of the Dead", id: 42_650 },
          { name: "Dark Transformation", id: 63_560 },
          { name: "Apocalypse", id: 275_699 },
        ],
      },
      {
        name: SpecName.Frost,
        role: Role.dps,
        cooldowns: [
          { name: "Breath of Sindragosa", id: 152_279 },
          { name: "Empower Rune Weapon", id: 47_568 },
          { name: "Frostwyrm's Fury", id: 279_302 },
          { name: "Blinding Sleet", id: 207_167 },
          { name: "Pillar of Frost", id: 51_271 },
        ],
      },
    ],
  },
];

export const classMapById: Record<Class["id"], Class["name"]> =
  Object.fromEntries(
    classes.map((classData) => [classData.id, classData.name])
  );

export const classMapByName = Object.fromEntries<Class["id"]>(
  classes.map((classData) => [classData.name, classData.id])
);
