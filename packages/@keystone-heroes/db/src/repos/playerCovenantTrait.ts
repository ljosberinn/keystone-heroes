import { prisma } from "../client";

import type { SoulbindTalent } from "@keystone-heroes/wcl/src/queries";
import type { PlayerCovenantTrait } from "@prisma/client";

export type PlayerCovenantTraitInsert = {
  playerID: number;
  covenantTraits: (Omit<SoulbindTalent, "guid"> & {
    id: SoulbindTalent["guid"];
    covenantID: number;
  })[];
  fightID: number;
}[];

export const PlayerCovenantTraitRepo = {
  createMany: async (data: PlayerCovenantTraitInsert): Promise<void> => {
    const payload = data.flatMap<Omit<PlayerCovenantTrait, "id">>((dataset) =>
      dataset.covenantTraits.map((conduit) => {
        return {
          playerID: dataset.playerID,
          covenantTraitID: conduit.id,
          fightID: dataset.fightID,
        };
      })
    );

    await prisma.playerCovenantTrait.createMany({
      data: payload,
      skipDuplicates: true,
    });
  },
};
