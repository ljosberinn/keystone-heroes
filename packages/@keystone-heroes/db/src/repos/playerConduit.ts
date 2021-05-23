import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { Player } from "./players";
import type { PlayerConduit } from "@prisma/client";

export type PlayerConduitInsert = (Pick<Player, "conduits"> & {
  playerID: number;
  fightID: number;
})[];

export const PlayerConduitRepo = {
  createMany: withPerformanceLogging(
    async (data: PlayerConduitInsert): Promise<void> => {
      const payload = data.flatMap<Omit<PlayerConduit, "id">>((dataset) =>
        dataset.conduits.map((conduit) => {
          return {
            playerID: dataset.playerID,
            itemLevel: conduit.itemLevel,
            conduitID: conduit.id,
            fightID: dataset.fightID,
          };
        })
      );

      await prisma.playerConduit.createMany({
        skipDuplicates: true,
        data: payload,
      });
    },
    "PlayerConduitRepo/createMany"
  ),
};
