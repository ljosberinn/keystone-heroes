import type { Dungeon } from "@prisma/client";

export const createDungeonTimer = (
  initialTime: number
): [number, number, number] => [
  initialTime * 60 * 1000,
  initialTime * 60 * 1000 * 0.8,
  initialTime * 60 * 1000 * 0.6,
];

enum Boss {
  // SoA
  KIN_TARA = 162_059,
  VENZULES = 163_077,
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
}

export const dungeonMap: Record<
  Dungeon["id"],
  Omit<Dungeon, "id" | "time"> & {
    timer: [number, number, number];
    bossIds: Boss[];
  }
> = {
  2284: {
    name: "Sanguine Depths",
    timer: createDungeonTimer(41),
    slug: "SD",
    bossIds: [
      Boss.KRYXIS_THE_VORACIOUS,
      Boss.EXECUTOR_TARVOLD,
      Boss.GRAND_PROCTOR_BERYLLIA,
      Boss.GENERAL_KAAL,
    ],
  },
  2285: {
    name: "Spires of Ascension",
    timer: createDungeonTimer(39),
    slug: "SoA",
    bossIds: [
      Boss.KIN_TARA,
      Boss.VENZULES,
      Boss.VENTUNAX,
      Boss.ORYPHRION,
      Boss.DEVOS,
    ],
  },
  2286: {
    name: "The Necrotic Wake",
    timer: createDungeonTimer(36),
    slug: "NW",
    bossIds: [
      Boss.BLIGHTBONE,
      Boss.AMARTH,
      Boss.SURGEON_STITCHFLESH,
      Boss.NALTHOR_THE_RIMEBINDER,
    ],
  },
  2287: {
    name: "Halls of Atonement",
    timer: createDungeonTimer(31),
    slug: "HoA",
    bossIds: [
      Boss.HALKIAS,
      Boss.ECHELON,
      Boss.HIGH_ADJUDICATOR_ALEEZ,
      Boss.LORD_CHAMBERLAIN,
    ],
  },
  2289: {
    name: "Plaguefall",
    timer: createDungeonTimer(38),
    slug: "PF",
    bossIds: [
      Boss.GLOBGROG,
      Boss.DOCTOR_ICKUS,
      Boss.DOMINA_VENOMBLADE,
      Boss.MARGRAVE_STRADAMA,
    ],
  },
  2290: {
    name: "Mists of Tirna Scithe",
    timer: createDungeonTimer(30),
    slug: "MoTS",
    bossIds: [
      Boss.INGRA_MALOCH,
      Boss.DROMAN_OULFARRAN,
      Boss.MISTCALLER,
      Boss.TRED_OVA,
    ],
  },
  2291: {
    name: "De Other Side",
    timer: createDungeonTimer(43),
    slug: "DOS",
    bossIds: [
      Boss.HAKKAR_THE_SOULFLAYER,
      Boss.MILLHOUSE_MANASTORM,
      Boss.MILLIFICIENT_MANASTORM,
      Boss.DEALER_XY_EXA,
      Boss.MUEH_ZALA,
    ],
  },
  2293: {
    name: "Theatre of Pain",
    timer: createDungeonTimer(37),
    slug: "TOP",
    bossIds: [
      Boss.PACERAN_THE_VIRULENT,
      Boss.DESSIA_THE_DECAPITATOR,
      Boss.SATHEL_THE_ACCURSED,
      Boss.GORECHOP,
      Boss.XAV_THE_UNFALLEN,
      Boss.KUL_THAROK,
      Boss.MORDRETHA_THE_ENDLESS_EMPRESS,
    ],
  },
};

export const dungeons: (Omit<Dungeon, "time"> & {
  bossIds: Boss[];
})[] = Object.entries(dungeonMap).map(([id, dataset]) => ({
  id: Number.parseInt(id),
  ...dataset,
}));
