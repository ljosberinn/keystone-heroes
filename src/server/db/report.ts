import { DEV_USE_DB, IS_PROD, IS_TEST } from "../../constants";
import type { AffixIds } from "../../utils/affixes";
import type { Dungeons } from "../../utils/dungeons";
import type { ReportProps } from "../getStaticProps/reportId";
import { prisma } from "../prismaClient";
import type { Fight, Report } from "../queries/report";

export const loadReport = async (
  report: string
): Promise<ReportProps["report"]> => {
  if (!IS_PROD && !IS_TEST && !DEV_USE_DB) {
    // eslint-disable-next-line no-console
    console.info(`[reportId/gSP] skipping db - read report`);
    return null;
  }

  try {
    // eslint-disable-next-line no-console
    console.info(`[reportId/gSP] reading report "${report}" from db`);
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
            week: {
              select: {
                affix1Id: true,
                affix2Id: true,
                affix3Id: true,
                season: {
                  select: {
                    affixId: true,
                  },
                },
              },
            },
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
            affixes: [
              fight.week.affix1Id,
              fight.week.affix2Id,
              fight.week.affix3Id,
              fight.week.season.affixId,
            ] as AffixIds[],
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
  { endTime, startTime, title, region: { slug: region } }: Report
): Promise<number> => {
  if (!IS_PROD && !DEV_USE_DB) {
    // eslint-disable-next-line no-console
    console.info(`[reportId/gSP] skipping db - create report`);
    return -1;
  }

  const { id } = await prisma.reports.upsert({
    where: {
      report,
    },
    create: {
      endTime: new Date(endTime),
      startTime: new Date(startTime),
      region,
      title,
      report,
    },
    update: {},
    select: {
      id: true,
    },
  });

  return id;
};

export const getDbReportId = async (report: string): Promise<number | null> => {
  const dataset = await prisma.reports.findUnique({
    where: {
      report,
    },
    select: {
      id: true,
    },
  });

  return dataset ? dataset.id : null;
};
