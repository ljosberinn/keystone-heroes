import type { Dungeon, Zone } from "@prisma/client";
import { Covenants } from "@prisma/client";

import { SPITEFUL } from "../../wcl/queries/events/affixes/spiteful";
import { ExpansionEnum } from "./expansions";

export const createDungeonTimer = (
  initialTime: number
): [number, number, number] => [
  initialTime * 60 * 1000,
  initialTime * 60 * 1000 * 0.8,
  initialTime * 60 * 1000 * 0.6,
];

export enum Boss {
  // SoA
  KIN_TARA = 162_059,
  AZULES = 163_077,
  VENTUNAX = 162_058,
  ORYPHRION = 162_060,
  DEVOS = 162_061,
  // NW
  BLIGHTBONE = 162_691,
  AMARTH = 163_157,
  SURGEON_STITCHFLESH = 162_689,
  NALTHOR_THE_RIMEBINDER = 162_693,
  // DoS
  HAKKAR_THE_SOULFLAYER = 164_558,
  MILLHOUSE_MANASTORM = 164_556,
  MILLIFICIENT_MANASTORM = 164_555,
  DEALER_XY_EXA = 164_450,
  MUEH_ZALA = 166_608,
  // HoA
  HALKIAS = 165_408,
  ECHELON = 164_185,
  HIGH_ADJUDICATOR_ALEEZ = 165_410,
  LORD_CHAMBERLAIN = 164_218,
  // ToP
  PACERAN_THE_VIRULENT = 164_463,
  DESSIA_THE_DECAPITATOR = 164_451,
  SATHEL_THE_ACCURSED = 164_461,
  GORECHOP = 162_317,
  XAV_THE_UNFALLEN = 162_329,
  KUL_THAROK = 162_309,
  MORDRETHA_THE_ENDLESS_EMPRESS = 165_946,
  // SD
  KRYXIS_THE_VORACIOUS = 162_100,
  EXECUTOR_TARVOLD = 162_103,
  GRAND_PROCTOR_BERYLLIA = 162_102,
  GENERAL_KAAL = 162_099,
  // MotS
  INGRA_MALOCH = 164_567,
  DROMAN_OULFARRAN = 164_804,
  MISTCALLER = 164_501,
  TRED_OVA = 164_517,
  // PF
  GLOBGROG = 164_255,
  DOCTOR_ICKUS = 164_967,
  DOMINA_VENOMBLADE = 164_266,
  MARGRAVE_STRADAMA = 164_267,
  // TVL
  ZO_PHEX = 175_616,
  ZO_GRON = 176_563,
  ALCRUUX = 176_556,
  ACHILLITE = 176_555,
  VENZA_GOLDFUSE = 176_705,
  POST_MASTER = 175_646,
  SO_AZMI = 175_806,
  // TVU
  HYLBRANDE = 175_663,
  SO_LEAH = 177_269,
  TIMECAPN_HOOKTAIL = 175_546,
}

const multiTargetBossFights = new Set([
  Boss.KIN_TARA,
  Boss.AZULES,
  Boss.PACERAN_THE_VIRULENT,
  Boss.DESSIA_THE_DECAPITATOR,
  Boss.SATHEL_THE_ACCURSED,
]);

/**
 *
 * first boss in top  ends based on a _second_ death of Dessia
 * which leads to a false positive of Dessia appearing twice
 * same with Kin-Tara and her pet, so presumably all multi-target fights
 *
 * @see https://www.warcraftlogs.com/reports/YBgWNfR9qr7mA8Lz#fight=1&translate=true
 */
export const isMultiTargetBossFight = (id: number): boolean => {
  return multiTargetBossFights.has(id);
};

export enum DungeonIDs {
  // Shadowlands
  SANGUINE_DEPTHS = 2284,
  SPIRES_OF_ASCENSION = 2285,
  THE_NECROTIC_WAKE = 2286,
  HALLS_OF_ATONEMENT = 2287,
  PLAGUEFALL = 2289,
  MISTS_OF_TIRNA_SCITHE = 2290,
  DE_OTHER_SIDE = 2291,
  THEATER_OF_PAIN = 2293,
  // Battle for Azeroth
  // Legion
}

type DungeonMeta = Omit<Dungeon, "id" | "time"> & {
  /**
   * 1 chest / 2 chest / 3 chest in milliseconds
   */
  timer: [number, number, number];
  /**
   * an exhaustive list of all boss unit ids
   */
  bossIDs: Boss[];
  /**
   * the expansion this dungeon is in
   */
  expansionID: ExpansionEnum;
  /**
   * all zones this dungeon has
   */
  zones: Omit<Zone, "dungeonID">[];
  /**
   * a map mapping unit id to given count
   */
  unitCountMap: Record<number, number>;
  /**
   * required count in total for this dungeon
   */
  count: number;
  /**
   * the covenant granting advantages for this dungeon
   *
   * shadowlands only
   */
  covenant: Covenants | null;
};

/**
 * a list of IDs the site does not need to track due to various reasons, e.g.
 * - invisible dummy unit
 * - boss add
 */
export const EXCLUDED_NPCS = new Set([
  SPITEFUL.unit,
  // MOTS
  168_988, // Overgrowth, stun cast from Tirnenn Villager
  165_251, // Illusionary Vuplinvia Mistcaller
  165_108, // Ullusionary Clone via Mistcaller
  165_560, // Gormling Larva via Tred'ova
  // DOS
  171_685, // Primeval Grasp; some hidden unit present _exclusively_ in the first fight
  168_326, // Shattered Visage; totem during Mueh'zala fight
  165_905, // Son of Hakkar
  167_966, // Experimental Sludge, DOS Mechagon minigame
  // NW
  164_702, // Carrion Worm via Blightbone
  168_246, // Reanimated Crossbowman via Amarth
  164_427, // Reanimated Warrior via Amarth
  164_414, // Reanimated Mage via Amarth
  164_578, // Stitchflesh's Creation
  164_815, // Zolramus Siphoner via Nalthor the Rimebinder
  // HOA
  164_363, // Undying Stonefiend via Echelon
  165_913, // Ghastly Parishioner via Aleez
  167_898, // Manifestation of Envy; spawns in last room
  // SD
  166_589, // Animated Weapon
  168_882, // Fleeting Manifestation via Executor Tarvold (dies on pull)
  165_556, // Fleeting Manifestation via Executor Tarvold (spawned during fight)
  169_753, // Famished Tick - additionally spawned
  168_457, // Stonewall Gargon - gauntlet spawn
  156_540, // Scrawny Rat - critter
  168_703, // Spider - critter
  // TOP
  170_234, // Oppressive Banner via Xav the Unfallen
  165_260, // Oozing Leftovers via Gorechop
  166_524, // Deathwalker via Mordretha
  // PF
  164_362, // Slimy Morsel, adds spawned by Globgrog
  168_398, // Slimy Morsel, adds spawned by Plaguebelcher
  168_394, // Slimy Morsel, adds spawned by Plaguebelcher
  164_550, // Slithering Ooze, spawns from dead Blighted Spinebreaker
  165_010, // Congealed Slime via Doctor Ickus
  170_927, // Erupting Ooze via Doctor Ickus
  169_498, // Plague Bomb via Doctor Ickus
  168_837, // Stealthlings
  170_474, // Brood Assassin via Domina Venomblade
  165_430, // Malignant Spawn via Margrave Stradama
  171_188, // Plaguebound Devoted via Margrave Stradama
  168_747, // Venomfang
  // TVLV
  177_500, // Corsair Brute via Timecap'n Hooktail
  178_435, // Corsair Brute via Timecap'n Hooktail
]);

export const SOA_FINAL_BOSS_ANGELS = new Set([
  168_844, // Lakesis
  168_845, // Astronos
  168_843, // Klotos
]);

export const SANGUINE_DEPTHS: DungeonMeta = {
  name: "Sanguine Depths",
  timer: createDungeonTimer(41),
  slug: "SD",
  bossIDs: [
    Boss.KRYXIS_THE_VORACIOUS,
    Boss.EXECUTOR_TARVOLD,
    Boss.GRAND_PROCTOR_BERYLLIA,
    Boss.GENERAL_KAAL,
  ],
  expansionID: ExpansionEnum.SHADOWLANDS,
  zones: [
    {
      id: 1675,
      name: "Depths of Despair",
      order: 1,
      maxX: -594_563,
      maxY: -115_500,
      minX: -664_313,
      minY: -162_000,
    },
    {
      id: 1676,
      name: "Amphitheater of Sorrow",
      order: 2,
      maxX: -599_750,
      maxY: -122_500,
      minX: -661_250,
      minY: -163_500,
    },
  ],
  unitCountMap: {
    171_448: 4, // Dreadful Huntmaster
    // TODO: these respawn with the same ID aswell, so pull & thus total %
    // has minor deviations based on additionally spawned ticks
    162_046: 1, // Famished Tick
    166_396: 4, // Noble Skirmisher
    162_038: 7, // Regal Mistdancer
    165_076: 4, // Gluttonous Tick
    162_041: 2, // Grubby Dirtcruncher
    162_047: 7, // Insatiable Brute
    162_039: 4, // Wicked Oppressor
    167_956: 1, // Dark Acolyte
    162_056: 1, // Rockbound Sprite
    162_040: 7, // Grand Overseer
    167_955: 1, // Sanguine Cadet
    162_057: 7, // Chamber Sentinel
    162_049: 4, // Vestige of Doubt
    171_799: 7, // Depths Warden
    168_058: 1, // Infused Quill-feather
    171_384: 4, // Research Scribe
    171_805: 4, // Research Scribe
    162_051: 2, // Frenzied Ghoul
    171_455: 1, // Stonewall Gargon
    168_591: 4, // Ravenous Dreadbat
    172_265: 4, // Remnant of Fury,
    171_376: 10, // Head Custodian Javlin
  },
  count: 364,
  covenant: Covenants.Venthyr,
};

export const SPIRES_OF_ASCENSION: DungeonMeta = {
  name: "Spires of Ascension",
  timer: createDungeonTimer(39),
  slug: "SoA",
  bossIDs: [
    Boss.KIN_TARA,
    Boss.AZULES,
    Boss.VENTUNAX,
    Boss.ORYPHRION,
    Boss.DEVOS,
  ],
  expansionID: ExpansionEnum.SHADOWLANDS,
  zones: [
    {
      id: 1692,
      name: "Honor's Ascent",
      order: 1,
      maxX: 638_312,
      maxY: -113_917,
      minX: 594_688,
      minY: -143_000,
    },
    {
      id: 1693,
      name: "Garden of Repose",
      order: 2,
      maxX: 735_250,
      maxY: -54_000,
      minX: 604_750,
      minY: -141_000,
    },
    {
      id: 1694,
      name: "Font of Fealty",
      order: 3,
      maxX: 815_000,
      maxY: 18_000,
      minX: 687_500,
      minY: -67_000,
    },
    {
      id: 1695,
      name: "Seat of the Archon",
      order: 4,
      maxX: 782_000,
      maxY: 7167,
      minX: 735_000,
      minY: -24_167,
    },
  ],
  unitCountMap: {
    163_458: 4, // Forsworn Castigator
    163_459: 4, // Forsworn Mender
    163_457: 4, // Forsworn Vanguard
    168_318: 8, // Forsworn Goliath
    163_501: 4, // Forsworn Skirmisher
    163_503: 2, // Etherdiver
    163_524: 5, // Kyrian Dark-Praetor
    163_506: 4, // Forsworn Stealthclaw
    168_418: 4, // Forsworn Inquisitor
    163_520: 6, // Forsworn Squad-Leader
    168_420: 4, // Forsworn Champion
    168_681: 6, // Forsworn Helion
    166_411: 1, // Forsworn Usurper
    168_718: 4, // Forsworn Warden
    168_717: 4, // Forsworn Justicar
    168_844: 12, // Lakesis
    168_845: 12, // Astronos
    168_843: 12, // Klotos
  },
  count: 285,
  covenant: Covenants.Kyrian,
};

export const THE_NECROTIC_WAKE: DungeonMeta = {
  name: "The Necrotic Wake",
  timer: createDungeonTimer(36),
  slug: "NW",
  bossIDs: [
    Boss.BLIGHTBONE,
    Boss.AMARTH,
    Boss.SURGEON_STITCHFLESH,
    Boss.NALTHOR_THE_RIMEBINDER,
  ],
  expansionID: ExpansionEnum.SHADOWLANDS,
  zones: [
    {
      id: 1666,
      name: "The Necrotic Wake",
      order: 1,
      minX: 330_000,
      maxX: 394_583,
      minY: -357_500,
      maxY: -314_375,
    },
    {
      id: 1667,
      name: "Stitchwerks",
      order: 2,
      maxX: 14_000,
      maxY: 9333,
      minX: -14_000,
      minY: -9333,
    },
    {
      id: 1668,
      name: "Zolramus",
      order: 3,
      maxX: 17_250,
      maxY: 11_500,
      minX: -17_250,
      minY: -11_500,
    },
  ],
  unitCountMap: {
    162_729: 4, // Patchwerk Soldier
    165_138: 1, // Blightbag
    166_302: 4, // Corpse Harvester
    163_121: 5, // Stitched Vanguar
    165_137: 6, // Zolramus Gatekeeper
    165_872: 4, // Flesh Crafter
    163_128: 4, // Zolramus Sorcerer
    163_619: 4, // Zolramus Bonecarver
    163_618: 8, // Zolramus Necromancer
    163_126: 0, // Brittlebone Mage
    163_122: 0, // Brittlebone Warrior
    165_919: 6, // Skeletal Marauder
    165_222: 4, // Zolramus Bonemender
    165_824: 15, // Nar'zudah
    165_197: 12, // Skeletal Monstrosity
    166_079: 0, // Brittlebone Crossbowman
    171_500: 1, // Shuffling Corpse
    173_016: 4, // Corpse Collector
    172_981: 5, // Kyrian Stitchwerk
    166_264: 0, // Spare Parts
    165_911: 4, // Loyal Creation
    167_731: 4, // Separation Assistant
    173_044: 4, // Stitching Assistant
    163_621: 6, // Goregrind
    163_622: 0, // Goregrind Bits
    163_623: 0, // Rotspew Leftovers
    163_620: 6, // Rotspew
  },
  count: 283,
  covenant: Covenants.Kyrian,
};

export const HALLS_OF_ATONEMENT: DungeonMeta = {
  name: "Halls of Atonement",
  timer: createDungeonTimer(32),
  slug: "HoA",
  bossIDs: [
    Boss.HALKIAS,
    Boss.ECHELON,
    Boss.HIGH_ADJUDICATOR_ALEEZ,
    Boss.LORD_CHAMBERLAIN,
  ],
  expansionID: ExpansionEnum.SHADOWLANDS,
  zones: [
    {
      id: 1663,
      name: "Halls of Atonement",
      order: 1,
      maxX: -491_667,
      maxY: -193_333,
      minX: -568_542,
      minY: -244_583,
    },
    {
      id: 1664,
      name: "The Nave of Pain",
      order: 2,
      maxX: -547_250,
      maxY: -212_500,
      minX: -572_750,
      minY: -229_500,
    },
    {
      id: 1665,
      name: "The Sanctuary of Souls",
      order: 3,
      maxX: -545_000,
      maxY: -211_250,
      minX: -575_000,
      minY: -231_250,
    },
  ],
  unitCountMap: {
    165_515: 4, // Depraved Darkblade - male
    167_615: 4, // Depraved Darkblade - female
    164_562: 4, // Depraved Houndmaster
    164_563: 4, // Vicious Gargon
    165_414: 4, // Depraved Obliterator
    174_175: 4, // Loyal Stoneborn
    165_415: 2, // Toiling Groundskeeper
    165_529: 4, // Depraved Collector
    164_557: 10, // Shard of Halkias
    167_612: 6, // Stoneborn Reaver
    167_610: 1, // Stonefiend Anklebiter
    167_611: 4, // Stoneborn Eviscerator
    167_607: 7, // Stoneborn Slasher
    167_876: 20, // Inquisitor Sigar
  },
  count: 273,
  covenant: Covenants.Venthyr,
};

export const PLAGUEFALL: DungeonMeta = {
  name: "Plaguefall",
  timer: createDungeonTimer(38),
  slug: "PF",
  bossIDs: [
    Boss.GLOBGROG,
    Boss.DOCTOR_ICKUS,
    Boss.DOMINA_VENOMBLADE,
    Boss.MARGRAVE_STRADAMA,
  ],
  expansionID: ExpansionEnum.SHADOWLANDS,
  zones: [
    {
      id: 1674,
      name: "Plaguefall",
      order: 1,
      maxX: 459_166,
      maxY: 226_666,
      minX: 254_166,
      minY: 90_000,
    },
    {
      id: 1697,
      name: "The Festering Sanctum",
      order: 2,
      maxX: 394_875,
      maxY: 126_500,
      minX: 340_125,
      minY: 90_000,
    },
  ],
  unitCountMap: {
    169_696: 8, // Mire Soldier
    // TODO: some of these log a death event during combat due to RP on the side
    // which leads to invalid %
    168_969: 1, // Gushing Slime
    168_155: 0, // Plaguebound
    168_153: 12, // Plagueroc
    163_882: 14, // Decaying Flesh Giant
    168_572: 8, // Fungi Stormer
    168_580: 8, // Plagueborer
    163_915: 10, // Hatchling Nest
    171_474: 0, // Finger Food
    163_894: 12, // Blighted Spinebreaker
    164_707: 6, // Congealed Slime
    163_862: 8, // Defender of Many Eyes
    173_840: 4, // Plaguebound Devoted - first two units in The Festering Sanctum
    163_857: 4, // Plaguebound Devoted
    169_159: 0, // Unstable Canister
    168_627: 8, // Plaguebinder
    168_022: 10, // Slime Tentacle
    167_493: 8, // Venomous Sniper
    169_861: 25, // Ickor Bileflesh
    168_578: 8, // Fungalmancer
    168_361: 8, // Fen Hornet
    168_574: 8, // Pestilent Harvester
    168_396: 12, // Plaguebelcher
    168_393: 12, // Plaguebelcher
    163_892: 6, // Rotting Slimeclaw
    164_705: 6, // Pestilence Slime
    168_886: 25, // Virulax Blightweaver
    // 168_747: 0, // Venomfang; entirely disabled due to RP surrounding 3rd boss
    // ------- see excluded npcs
    168_907: 10, // Slime Tentacle
    164_737: 12, // Brood Ambusher
    168_968: 0, // Plaguebound Fallen
    168_878: 8, // Rigged Plagueborer
    168_891: 0, // Rigged Plagueborer - respawn
    163_891: 6, // Rotmarrow Slime
  },
  count: 600,
  covenant: Covenants.Necrolord,
};

export const MISTS_OF_TIRNA_SCITHE: DungeonMeta = {
  name: "Mists of Tirna Scithe",
  timer: createDungeonTimer(30),
  slug: "MoTS",
  bossIDs: [
    Boss.INGRA_MALOCH,
    Boss.DROMAN_OULFARRAN,
    Boss.MISTCALLER,
    Boss.TRED_OVA,
  ],
  expansionID: ExpansionEnum.SHADOWLANDS,
  zones: [
    {
      id: 1669,
      name: "Mists of Tirna Scithe",
      order: 1,
      maxX: -173_333,
      maxY: -674_166,
      minX: -304_792,
      minY: -761_875,
    },
  ],
  unitCountMap: {
    165_111: 2, // Drust Spiteclaw
    164_929: 7, // Tirnenn Villager
    164_920: 4, // Drust Soulcleaver
    164_926: 6, // Drust Boughbreaker
    164_921: 4, // Drust Harvester
    171_772: 4, // Mistveil Defender - pack of 2 directly after 1st boss
    163_058: 4, // Mistveil Defender - regular ID
    166_301: 4, // Mistveil Stalker
    166_304: 4, // Mistveil Stinger
    166_276: 4, // Mistveil Guardian
    166_299: 4, // Mistveil Tender
    166_275: 4, // Mistveil Shaper
    167_111: 5, // Spinemaw Staghorn
    167_113: 4, // Spinemaw Acidgullet
    172_312: 4, // Spinemaw Gorger
    167_117: 1, // Spinemaw Larva
    167_116: 4, // Spinemaw Reaver
    173_720: 16, // Mistveil Goregullet
    173_714: 16, // Mistveil Nightblossom
    173_655: 16, // Mistveil Matriarch
  },
  count: 260,
  covenant: Covenants.NightFae,
};

export const DE_OTHER_SIDE: DungeonMeta = {
  name: "De Other Side",
  timer: createDungeonTimer(43),
  slug: "DOS",
  bossIDs: [
    Boss.HAKKAR_THE_SOULFLAYER,
    Boss.MILLHOUSE_MANASTORM,
    Boss.MILLIFICIENT_MANASTORM,
    Boss.DEALER_XY_EXA,
    Boss.MUEH_ZALA,
  ],
  expansionID: ExpansionEnum.SHADOWLANDS,
  zones: [
    {
      id: 1677,
      name: "Ardenweald",
      order: 4,
      maxX: 324_166,
      maxY: 306_875,
      minX: 240_417,
      minY: 251_041,
    },
    {
      id: 1678,
      name: "Mechagon",
      order: 3,
      maxX: 250_500,
      maxY: 257_000,
      minX: 195_000,
      minY: 220_000,
    },
    {
      id: 1679,
      name: "Zul'Gurub",
      order: 2,
      maxX: 201_000,
      maxY: 288_333,
      minX: 156_500,
      minY: 258_666,
    },
    {
      id: 1680,
      name: "De Other Side",
      order: 1,
      maxX: 273_500,
      maxY: 314_000,
      minX: 170_000,
      minY: 245_000,
    },
  ],
  unitCountMap: {
    167_966: 0, // Experimental Sludge
    168_949: 4, // Risen Bonesoldier,
    168_992: 4, // Risen Cultist
    169_905: 6, // Risen Warlord
    168_986: 3, // Skeletal Raptor
    168_942: 6, // Death Speaker
    168_934: 8, // Enraged Spirit
    167_962: 8, // Defunct Dental Drill
    167_963: 5, // Headless Client
    167_964: 8, // 4.RF-4.RF,
    167_965: 5, // Lubricator
    167_967: 6, // Sentient Oil
    170_147: 0, // Volatile Memory
    170_572: 6, // Atal'ai Hoodoo Hexxer
    170_490: 5, // Atal'ai High Priest
    170_486: 2, // Atal'ai Devoted
    170_480: 5, // Atal'ai Deathwalker
    164_862: 3, // Weald Shimmermoth
    164_857: 2, // Spriggan Mendbender
    171_342: 2, // Juvenile Runestag
    164_873: 4, // Runestag Elderhorn
    164_861: 2, // Spriggan Barkbinder,
    171_341: 1, // Bladebeak Hatchling
    171_181: 4, // Territorial Bladebeak
    171_343: 5, // Bladebeak Matriarch
    171_184: 12, // Mythresh, Sky's Talons
  },
  count: 384,
  covenant: Covenants.NightFae,
};

export const THEATER_OF_PAIN: DungeonMeta = {
  name: "Theater of Pain",
  timer: createDungeonTimer(38),
  slug: "TOP",
  bossIDs: [
    Boss.PACERAN_THE_VIRULENT,
    Boss.DESSIA_THE_DECAPITATOR,
    Boss.SATHEL_THE_ACCURSED,
    Boss.GORECHOP,
    Boss.XAV_THE_UNFALLEN,
    Boss.KUL_THAROK,
    Boss.MORDRETHA_THE_ENDLESS_EMPRESS,
  ],
  expansionID: ExpansionEnum.SHADOWLANDS,
  zones: [
    {
      id: 1683,
      name: "Theater of Pain",
      order: 1,
      maxX: 298_125,
      maxY: 313_750,
      minX: 210_000,
      minY: 255_000,
    },
    {
      id: 1684,
      name: "Chamber of Conquest",
      order: 2,
      maxX: 289_250,
      maxY: 295_000,
      minX: 238_250,
      minY: 261_000,
    },
    {
      id: 1685,
      name: "Altars of Agony",
      order: 3,
      maxX: 273_375,
      maxY: 329_000,
      minX: 208_125,
      minY: 285_500,
    },
    {
      id: 1686,
      name: "Upper Barrow of Carnage",
      order: 4,
      maxX: 254_000,
      maxY: 299_500,
      minX: 223_500,
      minY: 279_167,
    },
    {
      id: 1687,
      name: "Lower Barrow of Carnage",
      order: 5,
      maxX: 254_000,
      maxY: 299_500,
      minX: 223_500,
      minY: 279_167,
    },
  ],
  unitCountMap: {
    174_197: 4, // Battlefield Ritualist
    170_838: 4, // Unyielding Contender
    170_850: 7, // Raging Bloodhorn
    164_510: 4, // Shambling Arbalest
    167_994: 4, // Ossified Conscript
    167_538: 20, // Dokigg the Brutalizer
    167_536: 20, // Harugia the Bloodthirsty
    164_506: 5, // Ancient Captain
    167_533: 20, // Advent Nevermore
    169_875: 2, // Shackled Soul
    167_998: 8, // Portal Guardian
    170_882: 4, // Bone Magus
    160_495: 4, // Maniacal Soulbinder
    162_763: 8, // Soulforged Bonereaver
    169_893: 6, // Nefarious Darkspeaker
    174_210: 4, // Blighted Sludge-Spewer
    163_089: 1, // Disgusting Refuse
    170_690: 4, // Diseased Horror
    169_927: 5, // Putrid Butcher
    162_744: 20, // Nekthara the Mangler
    167_532: 20, // Heavin the Breaker
    167_534: 20, // Rek the Hardened
    163_086: 8, // Rancid Gasbag
  },
  count: 271,
  covenant: Covenants.Necrolord,
};

export const TAZAVESH_LOWER: DungeonMeta = {
  bossIDs: [
    Boss.ZO_PHEX,
    Boss.ZO_GRON,
    Boss.ALCRUUX,
    Boss.ACHILLITE,
    Boss.VENZA_GOLDFUSE,
    Boss.POST_MASTER,
    Boss.SO_AZMI,
  ],
  count: 330,
  expansionID: ExpansionEnum.SHADOWLANDS,
  name: "Tazavesh: Streets of Wonder",
  slug: "TVL",
  timer: createDungeonTimer(38),
  unitCountMap: {
    177_807: 4, // Customs Security
    178_392: 10, // Gatewarden Zo'mazz,
    177_817: 4, // Support Officer
    177_816: 4, // Interrogation Specialist
    177_808: 8, // Armored Overseer
    179_334: 16, // Portalmancer Zo'honn
    179_837: 20, // Tracker Zo'korss,
    180_091: 12, // Ancient Core Houdn,
    180_495: 10, // Enraged Direhorn,
    180_567: 4, // Frenzied Nightclaw
    179_840: 4, // Market Peacekeeper
    179_841: 4, // Veteran Sparkcaster
    179_842: 8, // Commerce Enforcer
    179_821: 20, // Commander Zo'far,
    180_348: 8, // Cartel Muscle
    180_335: 4, // Cartel Smuggler
    180_336: 4, // Cartel Wiseguy
    179_893: 4, // Cartel Skulker

    179_269: 0, // Oasis Security
    176_565: 0, // Disruptive Patron,
    180_159: 0, // Brawling Patron
    176_562: 0, // Brawling Patron
    176_396: 2, // Defective Sorter
    176_394: 4, // P.O.S.T. Worker
    176_395: 4, // Overloaded Mailemental
  },
  zones: [
    {
      id: 1989,
      name: "The Veiled Market",
      order: 1,
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
    },
    {
      id: 1990,
      name: "The Grand Menagerie",
      order: 2,
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
    },
    {
      id: 1991,
      name: "The P.O.S.T.",
      order: 3,
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
    },
    {
      id: 1992,
      name: "Myza's Oasis",
      order: 4,
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
    },
  ],
  covenant: null,
};

export const TAZAVESH_UPPER: DungeonMeta = {
  bossIDs: [Boss.HYLBRANDE, Boss.SO_LEAH, Boss.TIMECAPN_HOOKTAIL],
  count: 160,
  expansionID: ExpansionEnum.SHADOWLANDS,
  name: "Tazavesh: So'leah's Gambit",
  slug: "TVU",
  timer: createDungeonTimer(30),
  unitCountMap: {
    178_163: 1, // Murkbrine Shorerunner
    178_139: 6, // Murkbrine Shellcrusher,
    178_165: 15, // Coastwalker Goliath
    180_431: 5, // Focused Ritualist
    180_015: 5, // Burly Deckhand
    178_133: 3, // Murkbrine Wavejumper
    179_388: 5, // Hourglass Tidesage
    179_399: 0, // Drunk Pirate
    178_142: 3, // Murkbrine Fishmancer
    178_141: 3, // Murkbrine Scalebinder,
    179_386: 5, // Corsair Officer
    178_171: 10, // Stormforged Guardian
    180_429: 10, // Adorned Starseer
    180_432: 5, // Devoted Accomplice
  },
  zones: [
    {
      id: 1995,
      name: "Stormheim",
      order: 1,
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
    },
    {
      id: 1995,
      name: "Boralus Harbor",
      order: 3,
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
    },
    {
      id: 1997,
      name: "Aggramar's Vault",
      order: 2,
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
    },
    {
      id: 1993,
      name: "The Opulent Nexus",
      order: 4,
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
    },
  ],
  covenant: null,
};

export const dungeonMap: Record<Dungeon["id"], DungeonMeta> = {
  [DungeonIDs.SANGUINE_DEPTHS]: SANGUINE_DEPTHS,
  [DungeonIDs.SPIRES_OF_ASCENSION]: SPIRES_OF_ASCENSION,
  [DungeonIDs.THE_NECROTIC_WAKE]: THE_NECROTIC_WAKE,
  [DungeonIDs.HALLS_OF_ATONEMENT]: HALLS_OF_ATONEMENT,
  [DungeonIDs.PLAGUEFALL]: PLAGUEFALL,
  [DungeonIDs.MISTS_OF_TIRNA_SCITHE]: MISTS_OF_TIRNA_SCITHE,
  [DungeonIDs.DE_OTHER_SIDE]: DE_OTHER_SIDE,
  [DungeonIDs.THEATER_OF_PAIN]: THEATER_OF_PAIN,
};

export const allBossIDs = new Set<number>(
  Object.values(Boss).filter((id): id is number => typeof id === "number")
);

export const dungeons: (Omit<Dungeon, "time"> & DungeonMeta)[] = Object.entries(
  dungeonMap
).map(([id, dataset]) => ({
  id: Number.parseInt(id),
  ...dataset,
}));
