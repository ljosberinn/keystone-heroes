import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { Player } from "./players";
import type { PlayerTalent } from "@prisma/client";

export type PlayerTalentInsert = (Pick<Player, "talents"> & {
  playerID: number;
  fightID: number;
})[];

const createMany = async (data: PlayerTalentInsert): Promise<void> => {
  const payload = data.flatMap<Omit<PlayerTalent, "id">>((dataset) =>
    dataset.talents.map((talent) => {
      return {
        playerID: dataset.playerID,
        talentID: talent.id,
        fightID: dataset.fightID,
      };
    })
  );

  await prisma.playerTalent.createMany({
    skipDuplicates: true,
    data: payload,
  });
};

export const PlayerTalentRepo = {
  createMany: withPerformanceLogging(createMany, "PlayerTalentRepo/createMany"),
};
