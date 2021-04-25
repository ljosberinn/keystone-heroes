const createTimer = (initialTime: number): [number, number, number] => [
  initialTime * 60 * 1000,
  initialTime * 60 * 1000 * 0.8,
  initialTime * 60 * 1000 * 0.6,
];

export const dungeons = {
  2284: { name: "Sanguine Depths", timer: createTimer(41), slug: "SD" },
  2285: { name: "Spires of Ascension", timer: createTimer(39), slug: "SoA" },
  2286: { name: "The Necrotic Wake", timer: createTimer(36), slug: "NW" },
  2287: { name: "Halls of Atonement", timer: createTimer(31), slug: "HoA" },
  2289: { name: "Plaguefall", timer: createTimer(38), slug: "PF" },
  2290: {
    name: "Mists of Tirna Scithe",
    timer: createTimer(30),
    slug: "MoTS",
  },
  2291: { name: "De Other Side", timer: createTimer(43), slug: "DOS" },
  2293: { name: "Theatre of Pain", timer: createTimer(37), slug: "TOP" },
} as const;

export type Dungeons = typeof dungeons;
export type Dungeon = Dungeons[keyof Dungeons];
