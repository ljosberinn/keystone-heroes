import type { Player } from "../../pages/api/report";
import type { UIFight } from "../../pages/report/[id]";
import { prisma } from "../prismaClient";

export const PlayersRepo = {
  create: async (player: Player, reportId: number): Promise<number> => {
    const playerDataset = await prisma.player.create({
      data: {
        dps: player.dps,
        deaths: player.deaths,
        hps: player.hps,
        itemLevel: player.itemLevel,
        spec: {
          connect: {
            name: player.spec,
          },
        },
        report: {
          connect: {
            id: reportId,
          },
        },
        character: {
          connect: {
            id: player.guid,
          },
        },
        covenant: {
          connect: {
            id: player.covenant.id,
          },
        },
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
  createMany: async (
    fights: UIFight[],
    reportId: number
  ): Promise<Record<number, number>> => {
    const playerTuples = await Promise.all(
      fights.flatMap((fight) => {
        return fight.composition.map<Promise<[number, number]>>(
          async (player) => {
            const playerId = await PlayersRepo.create(player, reportId);

            return [player.guid, playerId];
          }
        );
      })
    );

    return Object.fromEntries(playerTuples);
  },
};
