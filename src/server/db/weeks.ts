import type { Week } from "@prisma/client";

import { seasons } from "../../../prisma/seasons";
import { weeks } from "../../../prisma/weeks";
import { prisma } from "../prismaClient";

export const WeekRepo = {
  findWeekByAffixes: async (
    startTime: number,
    affixes: number[]
  ): Promise<Week> => {
    // TODO: affixes < +10
    const match = weeks.find((week) => {
      const regularAffixesMatch =
        week.affix1Id === affixes[0] &&
        week.affix2Id === affixes[1] &&
        week.affix3Id === affixes[2];

      if (!regularAffixesMatch) {
        return false;
      }

      // Legion has no seasonal affixes
      if (affixes.length === 3) {
        return true;
      }

      const currentSeason = seasons.find(
        (season) => week.seasonId === season.id
      );

      return currentSeason?.affixId === affixes[3];
    });

    if (match) {
      return match;
    }

    const week = await prisma.week.findFirst({
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
    });

    if (!week) {
      throw new Error("week not found");
    }

    return week;
  },
};
