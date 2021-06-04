import type { PlayerConduit } from "@prisma/client";

import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";
import type { Player } from "./players";

export type PlayerConduitInsert = (Pick<Player, "conduits"> & {
  playerID: number;
  fightID: number;
})[];

const createMany = async (data: PlayerConduitInsert): Promise<void> => {
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
};

export const PlayerConduitRepo = {
  createMany: withPerformanceLogging(
    createMany,
    "PlayerConduitRepo/createMany"
  ),
};
