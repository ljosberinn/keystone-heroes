import type { Week } from "@prisma/client";

import { seasons, weeks } from "../data";

export const WeekRepo = {
  findWeekbyTimestamp: (startTime: number, endTime: number): Week => {
    const season = seasons.find((season) => {
      const startedAfterThisSeason = startTime > season.startTime.getTime();
      const endedWithinThisSeason = season.endTime
        ? endTime < season.endTime.getTime()
        : true;

      return startedAfterThisSeason && endedWithinThisSeason;
    });

    if (!season) {
      throw new Error("season not implemented");
    }

    const thisSeasonsWeeks = weeks.filter(
      (week) => week.seasonID === season.id
    );

    const amountOfWeeksThisSeason = thisSeasonsWeeks.length;
    const timePassedSinceSeasonStart = startTime - season.startTime.getTime();

    const weeksPassedSinceSeasonStart = Math.floor(
      timePassedSinceSeasonStart / 1000 / 60 / 60 / 24 / 7
    );

    // report is within the first rotation of affixes of this season
    if (amountOfWeeksThisSeason > weeksPassedSinceSeasonStart) {
      return thisSeasonsWeeks[weeksPassedSinceSeasonStart];
    }

    const cycles = Math.floor(
      weeksPassedSinceSeasonStart / amountOfWeeksThisSeason
    );

    const excessWeeks =
      weeksPassedSinceSeasonStart - amountOfWeeksThisSeason * cycles;

    return thisSeasonsWeeks[excessWeeks];
  },
};
