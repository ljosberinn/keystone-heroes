import { DEV_USE_DB, IS_PROD } from "../../constants";
import type { InitialFightInformation } from "../../pages/report/[reportId]";
import { prisma } from "../prismaClient";

export const createFights = async (
  reportId: number,
  fights: InitialFightInformation[]
): Promise<void> => {
  if (!IS_PROD && !DEV_USE_DB) {
    // eslint-disable-next-line no-console
    console.info(`[reportId/getStaticProps] skipping db - create fights`);
    return;
  }

  await prisma.fights.createMany({
    data: fights.map((fight) => {
      return {
        fightId: fight.id,
        chests: fight.chests,
        dungeonId: fight.dungeonId,
        dps: fight.dps,
        hps: fight.hps,
        dtps: fight.dtps,
        averageItemLevel: fight.averageItemlevel,
        keystoneLevel: fight.keystoneLevel,
        keystoneTime: fight.keystoneTime,
        totalDeaths: fight.totalDeaths,
        reportId,
      };
    }),
    skipDuplicates: true,
  });
};
