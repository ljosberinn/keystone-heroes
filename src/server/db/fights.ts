import { DEV_USE_DB, IS_PROD, IS_TEST } from "../../constants";
import type { UIFight } from "../../pages/report/[id]";
import { prisma } from "../prismaClient";
import type { Report } from "../queries/report";
import type { UpsertableCharacter } from "./characters";
import { CharacterRepo } from "./characters";
import { PlayersRepo } from "./players";
import { WeeksRepo } from "./weeks";

export const FightsRepo = {
  createFights: async (
    reportId: number,
    fights: UIFight[],
    { startTime }: Report
  ): Promise<void> => {
    if (!IS_PROD && !IS_TEST && !DEV_USE_DB) {
      // eslint-disable-next-line no-console
      console.info(`[FightsRepo/createFights] skipped`);
      return;
    }

    const weekId = await WeeksRepo.findWeekByAffixes(
      startTime,
      fights[0]?.affixes
    );

    await CharacterRepo.createMany(
      fights.flatMap<UpsertableCharacter>((fight) =>
        fight.composition.map((player) => {
          return {
            id: player.guid,
            name: player.name,
            server: player.server,
          };
        })
      )
    );

    const playerIdMap = await PlayersRepo.createMany(fights, reportId);

    await prisma.fights.createMany({
      data: fights.map((fight) => {
        const [tank, heal, dps1, dps2, dps3] = fight.composition;

        return {
          reportId,
          weekId,
          fightId: fight.id,
          chests: fight.chests,
          dungeonId: fight.dungeonId,
          dps: fight.dps,
          hps: fight.hps,
          dtps: fight.dtps,
          averageItemLevel: fight.averageItemLevel * 100,
          keystoneLevel: fight.keystoneLevel,
          keystoneTime: fight.keystoneTime,
          totalDeaths: fight.totalDeaths,
          player1: playerIdMap[tank.guid],
          player2: playerIdMap[heal.guid],
          player3: playerIdMap[dps1.guid],
          player4: playerIdMap[dps2.guid],
          player5: playerIdMap[dps3.guid],
        };
      }),
      skipDuplicates: true,
    });
  },
};
