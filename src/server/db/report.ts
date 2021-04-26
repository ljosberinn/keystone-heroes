import { DEV_USE_DB, IS_PROD } from "../../constants";
import type { UIFightsResponse } from "../../pages/report/[reportId]";
import type { Dungeons } from "../../utils/dungeons";
import { prisma } from "../prismaClient";
import type { Fight, Report } from "../queries/report";

export const loadReport = async (
  report: string
): Promise<UIFightsResponse | null> => {
  if (!IS_PROD && !DEV_USE_DB) {
    // eslint-disable-next-line no-console
    console.info(`[reportId/getStaticProps] skipping db - read report`);
    return null;
  }

  try {
    // eslint-disable-next-line no-console
    console.info(
      `[reportId/getStaticProps] reading report "${report}" from db`
    );
    const rawReport = await prisma.reports.findFirst({
      where: {
        report,
      },
      select: {
        endTime: true,
        region: true,
        title: true,
        startTime: true,
        id: true,
        Fights: {
          select: {
            averageItemLevel: true,
            chests: true,
            dps: true,
            dtps: true,
            dungeonId: true,
            hps: true,
            keystoneLevel: true,
            keystoneTime: true,
            totalDeaths: true,
            fightId: true,
          },
        },
      },
    });

    if (rawReport) {
      return {
        endTime: rawReport.endTime.getTime(),
        id: report,
        region: rawReport.region,
        startTime: rawReport.startTime.getTime(),
        title: rawReport.title,
        fights: rawReport.Fights.map((fight) => {
          return {
            chests: fight.chests as Fight["keystoneBonus"],
            id: fight.fightId,
            dungeonId: fight.dungeonId as keyof Dungeons,
            totalDeaths: fight.totalDeaths,
            keystoneLevel: fight.keystoneLevel,
            keystoneTime: fight.keystoneTime,
            affixes: [],
            dps: fight.dps,
            hps: fight.hps,
            dtps: fight.dtps,
            composition: [],
            averageItemlevel: fight.averageItemLevel,
          };
        }),
      };
    }

    return null;
  } catch {
    return null;
  }
};

export const createReport = async (
  report: string,
  json: Report
): Promise<number> => {
  if (!IS_PROD && !DEV_USE_DB) {
    // eslint-disable-next-line no-console
    console.info(`[reportId/getStaticProps] skipping db - create report`);
    return -1;
  }

  const { id } = await prisma.reports.upsert({
    where: {
      report,
    },
    create: {
      endTime: new Date(json.endTime),
      startTime: new Date(json.startTime),
      region: json.region.slug,
      title: json.title,
      report,
    },
    update: {},
    select: {
      id: true,
    },
  });

  return id;
};
