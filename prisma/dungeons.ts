import type { Dungeon } from "@prisma/client";

export const createDungeonTimer = (
  initialTime: number
): [number, number, number] => [
  initialTime * 60 * 1000,
  initialTime * 60 * 1000 * 0.8,
  initialTime * 60 * 1000 * 0.6,
];

export const dungeons: Record<
  Dungeon["id"],
  Omit<Dungeon, "id" | "time"> & { timer: [number, number, number] }
> = {
  2284: { name: "Sanguine Depths", timer: createDungeonTimer(41), slug: "SD" },
  2285: {
    name: "Spires of Ascension",
    timer: createDungeonTimer(39),
    slug: "SoA",
  },
  2286: {
    name: "The Necrotic Wake",
    timer: createDungeonTimer(36),
    slug: "NW",
  },
  2287: {
    name: "Halls of Atonement",
    timer: createDungeonTimer(31),
    slug: "HoA",
  },
  2289: { name: "Plaguefall", timer: createDungeonTimer(38), slug: "PF" },
  2290: {
    name: "Mists of Tirna Scithe",
    timer: createDungeonTimer(30),
    slug: "MoTS",
  },
  2291: { name: "De Other Side", timer: createDungeonTimer(43), slug: "DOS" },
  2293: { name: "Theatre of Pain", timer: createDungeonTimer(37), slug: "TOP" },
};
