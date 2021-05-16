import { ONGOING_REPORT_THRESHOLD } from "@keystone-heroes/wcl/utils";

import { prisma } from "../client";

import type { RawReport } from "@keystone-heroes/wcl/queries";
import type { Region, Report } from "@prisma/client";

export const ReportRepo = {
  upsert: async (
    report: string,
    { endTime, startTime, title, region }: RawReport
  ): Promise<number> => {
    // eslint-disable-next-line no-console
    console.info(`[ReportRepo/upsert] creating "${report}"`);

    const { id } = await prisma.report.upsert({
      where: {
        report,
      },
      create: {
        endTime: new Date(endTime),
        startTime: new Date(startTime),
        region: {
          connectOrCreate: {
            create: {
              slug: region.slug,
            },
            where: {
              slug: region.slug,
            },
          },
        },
        title,
        report,
      },
      update: {},
      select: {
        id: true,
      },
    });

    return id;
  },
  load: async (
    report: string
  ): Promise<
    | (Omit<Report, "startTime" | "endTime" | "regionId"> & {
        fights: number[];
        startTime: number;
        endTime: number;
        region: Region;
      })
    | null
  > => {
    try {
      // eslint-disable-next-line no-console
      console.info(`[ReportRepo/load] reading "${report}" from db`);

      const data = await prisma.report.findUnique({
        where: {
          report,
        },
        select: {
          id: true,
          endTime: true,
          startTime: true,
          title: true,
          region: true,
          report: true,
          Fight: {
            select: {
              fightId: true,
            },
          },
        },
      });

      if (!data) {
        return null;
      }

      const { Fight, ...rest } = data;

      return {
        ...rest,
        startTime: data.startTime.getTime(),
        endTime: data.endTime.getTime(),
        fights: Fight.map((fight) => fight.fightId),
      };
    } catch {
      return null;
    }
  },
  loadFinishedReports: async (): Promise<string[]> => {
    // eslint-disable-next-line no-console
    console.info(`[ReportRepo/loadFinishedReports]`);

    try {
      const data = await prisma.report.findMany({
        where: {
          endTime: {
            lte: new Date(Date.now() - ONGOING_REPORT_THRESHOLD),
          },
        },
        select: {
          report: true,
        },
      });

      return data.map((dataset) => dataset.report);
    } catch {
      return [];
    }
  },
  loadFinishedFull: async (): Promise<
    (Omit<Report, "startTime" | "endTime" | "regionId"> & {
      fights: number[];
      startTime: number;
      endTime: number;
      region: Region;
    })[]
  > => {
    // eslint-disable-next-line no-console
    console.info(`[ReportRepo/loadFinishedFull]`);

    try {
      const data = await prisma.report.findMany({
        select: {
          id: true,
          endTime: true,
          startTime: true,
          title: true,
          region: true,
          report: true,
          Fight: {
            select: {
              fightId: true,
            },
          },
        },
      });

      return data.map((report) => {
        const { Fight, ...rest } = report;

        return {
          ...rest,
          startTime: report.startTime.getTime(),
          endTime: report.endTime.getTime(),
          fights: Fight.map((fight) => fight.fightId),
        };
      });
    } catch {
      return [];
    }
  },
};
