import { prisma } from "../prismaClient";

import type { FooFight } from "../../pages/api/fight";

export type PlayerCovenantTraitInsert = {
  playerId: number;
  covenantTraits: FooFight["composition"][number]["covenantTraits"];
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
