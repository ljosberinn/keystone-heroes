import type { Region, Report } from "@prisma/client";

import { prisma } from "../prismaClient";
import type { RawReport } from "../queries/report";

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
};
