import { Affixes } from "@prisma/client";
import type { Week } from "@prisma/client";

import { getAffixByName } from "./affixes";
import { SeasonID } from "./seasons";

const createWeek = (
  seasonID: SeasonID,
  affixes: Affixes[],
  seasonWeekID: number
): Omit<Week, "id"> => {
  const [affix1, affix2, affix3] = affixes;

  return {
    seasonID,
    affix1ID: getAffixByName(affix1),
    affix2ID: getAffixByName(affix2),
    affix3ID: getAffixByName(affix3),
    seasonWeekID,
  };
};

export const weeks: Week[] = [
  {
    seasonID: SeasonID.SL_SEASON_1,
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
  {
    seasonID: SeasonID.SL_POST_SEASON_1,
    weeks: [
      [Affixes.Fortified, Affixes.Sanguine, Affixes.Quaking, Affixes.Prideful],
    ],
  },
  {
    seasonID: SeasonID.SL_SEASON_2,
    weeks: [
      [
        Affixes.Fortified,
        Affixes.Bursting,
        Affixes.Storming,
        Affixes.Tormented,
      ],
      [Affixes.Tyrannical, Affixes.Raging, Affixes.Volcanic, Affixes.Tormented],
      [
        Affixes.Fortified,
        Affixes.Inspiring,
        Affixes.Grievous,
        Affixes.Tormented,
      ],
      [
        Affixes.Tyrannical,
        Affixes.Spiteful,
        Affixes.Necrotic,
        Affixes.Tormented,
      ],
      [
        Affixes.Fortified,
        Affixes.Bolstering,
        Affixes.Quaking,
        Affixes.Tormented,
      ],
      [
        Affixes.Tyrannical,
        Affixes.Sanguine,
        Affixes.Storming,
        Affixes.Tormented,
      ],
      [Affixes.Fortified, Affixes.Raging, Affixes.Explosive, Affixes.Tormented],
      [
        Affixes.Tyrannical,
        Affixes.Bursting,
        Affixes.Volcanic,
        Affixes.Tormented,
      ],
      [
        Affixes.Fortified,
        Affixes.Spiteful,
        Affixes.Grievous,
        Affixes.Tormented,
      ],
      [
        Affixes.Tyrannical,
        Affixes.Inspiring,
        Affixes.Quaking,
        Affixes.Tormented,
      ],
      [
        Affixes.Fortified,
        Affixes.Sanguine,
        Affixes.Necrotic,
        Affixes.Tormented,
      ],
      [
        Affixes.Tyrannical,
        Affixes.Bolstering,
        Affixes.Explosive,
        Affixes.Tormented,
      ],
    ],
  },
]
  .flatMap(({ seasonID, weeks }) =>
    weeks.map((week, index) => createWeek(seasonID, week, index))
  )
  .map((week, index) => ({ ...week, id: index + 1 }));
