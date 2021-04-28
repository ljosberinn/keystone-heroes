import type { Player } from "../../pages/api/report";
import type { UIFight } from "../../pages/report/[id]";
import { prisma } from "../prismaClient";

export const PlayersRepo = {
  create: async (player: Player): Promise<number> => {
    const playerDataset = await prisma.player.create({
      data: {
        characterId: player.guid,
        dps: player.dps,
        deaths: player.deaths,
        hps: player.hps,
        itemLevel: player.itemLevel,
      },
      select: {
        id: true,
      },
    });

    if (!playerDataset) {
      throw new Error("could not insert player");
    }

    return playerDataset.id;
  },
  /**
   * creates a player for each player in a composition for each fight
   */
  createMany: async (fights: UIFight[]): Promise<Record<number, number>> => {
    const playerTuples = await Promise.all(
      fights.flatMap((fight) => {
        return fight.composition.map<Promise<[number, number]>>(
          async (player) => {
            const playerId = await PlayersRepo.create(player);

            return [player.guid, playerId];
          }
        );
      })
    );

    return Object.fromEntries(playerTuples);
  },
};
