import type { FooFight } from "../../pages/api/fight";
import { prisma } from "../prismaClient";

export type PlayerConduitInsert = {
  playerId: number;
  conduits: FooFight["composition"][number]["conduits"];
  fightId: number;
}[];

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
