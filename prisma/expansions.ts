import type { Dungeon, Expansion } from "@prisma/client";

export enum ExpansionEnum {
  LEGION = 6,
  BATTLE_FOR_AZEROTH = 7,
  SHADOWLANDS = 8,
}

export const expansions: (Expansion & { dungeonIds: Dungeon["id"][] })[] = [
  { id: ExpansionEnum.LEGION, name: "Legion", slug: "Legion", dungeonIds: [] },
  {
    id: ExpansionEnum.BATTLE_FOR_AZEROTH,
    name: "Battle for Azeroth",
    slug: "BfA",
    dungeonIds: [],
  },
  {
    id: ExpansionEnum.SHADOWLANDS,
    name: "Shadowlands",
    slug: "SL",
    dungeonIds: [2284, 2285, 2286, 2287, 2289, 2290, 2291, 2293],
  },
];
