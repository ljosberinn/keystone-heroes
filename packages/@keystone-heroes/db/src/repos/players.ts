import { prisma } from "../client";

import type {
  Conduit,
  LegendaryItem,
  Talent,
  SoulbindTalent,
} from "@keystone-heroes/wcl/src/queries";
import type {
  Player as PrismaPlayer,
  Server,
  Spec,
  Character,
} from "@prisma/client";

export type Player = {
  server: string;
  name: string;
  classID: number;
  // spec: SpecName;
  specId: number;
  covenantID: number | null;
  soulbindID: number | null;
  actorID: number;
  itemLevel: number;
  deaths: number;
  hps: number;
  dps: number;
  legendary:
    | null
    | (Pick<LegendaryItem, "id" | "effectIcon" | "effectName"> & {
        effectID: number;
      });
  conduits: (Omit<Conduit, "total" | "guid"> & {
    id: Conduit["guid"];
    itemLevel: Conduit["total"];
  })[];
  talents: (Omit<Talent, "type" | "guid"> & {
    id: Talent["guid"];
    classID: number;
    specID: number;
  })[];
  covenantTraits: (Omit<SoulbindTalent, "guid"> & {
    id: SoulbindTalent["guid"];
    covenantID: number;
  })[];
};

export type PlayerInsert = Pick<
  Player,
  | "dps"
  | "hps"
  | "deaths"
  | "itemLevel"
  | "covenantID"
  | "soulbindID"
  | "legendary"
  | "actorID"
> & {
  serverID: Server["id"];
  specID: Spec["id"];
  characterID: Character["id"];
};

export const PlayerRepo = {
  createMany: async (
    player: PlayerInsert[],
    reportID: number
  ): Promise<Record<number, number>> => {
    const payload = player.map<Omit<PrismaPlayer, "id">>((dataset) => {
      return {
        dps: dataset.dps,
        hps: dataset.hps,
        deaths: dataset.deaths,
        reportID,
        itemLevel: dataset.itemLevel,
        soulbindID: dataset.soulbindID,
        covenantID: dataset.covenantID,
        specID: dataset.specID,
        characterID: dataset.characterID,
        legendaryID: dataset.legendary?.effectID ?? null,
        actorID: dataset.actorID,
      };
    });

    await prisma.player.createMany({
      data: payload,
      skipDuplicates: true,
    });

    const playerData = await prisma.player.findMany({
      where: {
        OR: player.map((dataset) => {
          return {
            characterID: dataset.characterID,
            reportID,
          };
        }),
      },
    });

    return Object.fromEntries(
      playerData.map((dataset) => [dataset.characterID, dataset.id])
    );
  },
};
