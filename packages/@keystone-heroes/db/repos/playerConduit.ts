import { prisma } from "../client";

import type { Player } from "./players";

export type PlayerConduitInsert = (Pick<Player, "conduits"> & {
  playerId: number;
  fightId: number;
})[];

export const PlayerConduitRepo = {
  createMany: async (data: PlayerConduitInsert): Promise<void> => {
    // eslint-disable-next-line no-console
    console.info(`[PlayerConduitRepo/createMany] linking conduits to player`);

    await prisma.playerConduit.createMany({
      skipDuplicates: true,
      data: data.flatMap((dataset) =>
        dataset.conduits.map((conduit) => {
          return {
            playerId: dataset.playerId,
            itemLevel: conduit.itemLevel,
            conduitId: conduit.id,
            fightId: dataset.fightId,
          };
        })
      ),
    });
  },
};
