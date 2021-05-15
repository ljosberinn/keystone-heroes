import { prisma } from "../prismaClient";

import type { FooFight } from "../../pages/api/fight";

export type PlayerTalentInsert = {
  playerId: number;
  talents: FooFight["composition"][number]["talents"];
  fightId: number;
}[];

export const PlayerTalentRepo = {
  createMany: async (data: PlayerTalentInsert): Promise<void> => {
    // eslint-disable-next-line no-console
    console.info(`[PlayerTalentRepo/createMany] linking talents to player`);

    await prisma.playerTalent.createMany({
      skipDuplicates: true,
      data: data.flatMap((dataset) =>
        dataset.talents.map((talent) => {
          return {
            playerId: dataset.playerId,
            talentId: talent.id,
            fightId: dataset.fightId,
          };
        })
      ),
    });
  },
};
