import type { RegularAffixIds, SeasonalAffixIds } from "../../utils/affixes";
import { prisma } from "../prismaClient";

export const WeeksRepo = {
  findWeekByAffixes: async (
    startTime: number,
    // freshly created log has no fights, so affixes may not be present
    affixes: (SeasonalAffixIds | RegularAffixIds)[] = []
  ): Promise<number> => {
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
      throw new Error("week not found");
    }

    return week.id;
  },
};
