import type { Week } from "@prisma/client";
import { Affixes } from "@prisma/client";

import { getAffix } from "./affixes";
import { getSeasonId } from "./seasons";

const createWeek = (
  seasonName: string,
  affixes: Affixes[],
  seasonWeekId: number
): Omit<Week, "id"> => {
  const [affix1, affix2, affix3] = affixes;

  return {
    seasonId: getSeasonId(seasonName),
    affix1Id: getAffix(affix1),
    affix2Id: getAffix(affix2),
    affix3Id: getAffix(affix3),
    seasonWeekId,
  };
};

export const weeks: Week[] = [
  {
    seasonName: "SL Season 1",
    weeks: [
      [Affixes.Fortified, Affixes.Bursting, Affixes.Volcanic, Affixes.Prideful],
      [
        Affixes.Tyrannical,
        Affixes.Bolstering,
        Affixes.Storming,
        Affixes.Prideful,
      ],
      [Affixes.Fortified, Affixes.Spiteful, Affixes.Grievous, Affixes.Prideful],
      [
        Affixes.Tyrannical,
        Affixes.Inspiring,
        Affixes.Necrotic,
        Affixes.Prideful,
      ],
      [Affixes.Fortified, Affixes.Sanguine, Affixes.Quaking, Affixes.Prideful],
      [Affixes.Tyrannical, Affixes.Raging, Affixes.Explosive, Affixes.Prideful],
      [Affixes.Fortified, Affixes.Spiteful, Affixes.Volcanic, Affixes.Prideful],
      [
        Affixes.Tyrannical,
        Affixes.Bolstering,
        Affixes.Necrotic,
        Affixes.Prideful,
      ],
      [
        Affixes.Fortified,
        Affixes.Inspiring,
        Affixes.Storming,
        Affixes.Prideful,
      ],
      [
        Affixes.Tyrannical,
        Affixes.Bursting,
        Affixes.Explosive,
        Affixes.Prideful,
      ],
      [Affixes.Fortified, Affixes.Sanguine, Affixes.Grievous, Affixes.Prideful],
      [Affixes.Tyrannical, Affixes.Raging, Affixes.Quaking, Affixes.Prideful],
    ],
  },
]
  .flatMap(({ seasonName, weeks }) =>
    weeks.map((week, index) => createWeek(seasonName, week, index))
  )
  .map((week, index) => ({ ...week, id: index + 1 }));
