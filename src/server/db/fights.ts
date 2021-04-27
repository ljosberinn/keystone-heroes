import { DEV_USE_DB, IS_PROD, IS_TEST } from "../../constants";
import type { UIFight } from "../../pages/report/[id]";
import { prisma } from "../prismaClient";
import type { Report } from "../queries/report";

export const createFights = async (
  reportId: number,
  fights: UIFight[],
  { startTime }: Report
): Promise<void> => {
  if (!IS_PROD && !IS_TEST && !DEV_USE_DB) {
    // eslint-disable-next-line no-console
    console.info(`[reportId/gSP] skipping db - create fights`);
    return;
  }

  // freshly created log has no fights, so affixes may not be present
  const affixes = fights[0]?.affixes ?? [];

  const week = await prisma.weeks.findFirst({
    where: {
      affix1Id: affixes[0],
      affix2Id: affixes[1],
      affix3Id: affixes[2],
      season: {
        startTime: {
          lte: new Date(startTime),
        },
        OR: {
          endTime: null,
        },
      },
    },
    orderBy: { seasonWeekId: "desc" },
    select: {
      id: true,
    },
  });

  if (!week) {
    throw new Error("missing week");
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
        weekId: week.id,
      };
    }),
    skipDuplicates: true,
  });
};
