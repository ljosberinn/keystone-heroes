import { prisma } from "../client";

import type { SoulbindTalent } from "@keystone-heroes/wcl/queries";

export type PlayerCovenantTraitInsert = {
  playerId: number;
  covenantTraits: (Omit<SoulbindTalent, "guid"> & {
    id: SoulbindTalent["guid"];
    covenantId: number;
  })[];
  fightId: number;
}[];

export const PlayerCovenantTraitRepo = {
  createMany: async (data: PlayerCovenantTraitInsert): Promise<void> => {
    // eslint-disable-next-line no-console
    console.info(
      `[PlayerCovenantTraitRepo/createMany] linking covenantTraits to player`
    );

    await prisma.playerCovenantTrait.createMany({
      skipDuplicates: true,
      data: data.flatMap((dataset) =>
        dataset.covenantTraits.map((conduit) => {
          return {
            playerId: dataset.playerId,
            covenantTraitId: conduit.id,
            fightId: dataset.fightId,
          };
        })
      ),
    });
  },
};
