import type { Week } from "@prisma/client";
import { Affixes } from "@prisma/client";

import { getAffixByName } from "./affixes";
import { SeasonId } from "./seasons";

const createWeek = (
  seasonId: SeasonId,
  affixes: Affixes[],
  seasonWeekId: number
): Omit<Week, "id"> => {
  const [affix1, affix2, affix3] = affixes;

  return {
    seasonId,
    affix1Id: getAffixByName(affix1),
    affix2Id: getAffixByName(affix2),
    affix3Id: getAffixByName(affix3),
    seasonWeekId,
  };
};

export const weeks: Week[] = [
  {
    seasonId: SeasonId.SL_SEASON_1,
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
  .flatMap(({ seasonId, weeks }) =>
    weeks.map((week, index) => createWeek(seasonId, week, index))
  )
  .map((week, index) => ({ ...week, id: index + 1 }));
