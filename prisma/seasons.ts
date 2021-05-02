import { getAffix } from "./affixes";

// via https://raider.io/api#/mythic_plus/getApiV1MythicplusStaticdata
export const seasons = [
  // Legion
  {
    slug: "season-7.2.0",
    name: "Season 7.2",
    expansionId: 6,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: null,
  },
  {
    slug: "season-7.2.5",
    name: "Season 7.2.5",
    expansionId: 6,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: null,
  },
  {
    slug: "season-7.3.0",
    name: "Season 7.3",
    expansionId: 6,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: null,
  },
  {
    slug: "season-7.3.2",
    name: "Season 7.3.2",
    expansionId: 6,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: null,
  },
  {
    slug: "season-post-legion",
    name: "Legion Post-Season",
    expansionId: 6,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: null,
  },
  {
    slug: "season-pre-bfa",
    name: "BFA Pre-Season",
    expansionId: 6,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: null,
  },
  // BFA
  {
    slug: "season-bfa-1",
    name: "BFA Season 1",
    expansionId: 7,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: getAffix("Infested"),
  },
  {
    slug: "season-bfa-2",
    name: "BFA Season 2",
    expansionId: 7,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: getAffix("Reaping"),
  },
  {
    slug: "season-bfa-2-post",
    name: "BFA Post-Season 2",
    expansionId: 7,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: getAffix("Reaping"),
  },
  {
    slug: "season-bfa-3",
    name: "BFA Season 3",
    expansionId: 7,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: getAffix("Beguiling"),
  },
  {
    slug: "season-bfa-3-post",
    name: "BFA Post-Season 3",
    expansionId: 7,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: getAffix("Beguiling"),
  },
  {
    slug: "season-bfa-4",
    name: "BFA Season 4",
    expansionId: 7,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: getAffix("Awakened"),
  },
  {
    slug: "season-bfa-4-post",
    name: "BFA Post-Season 4",
    expansionId: 7,
    startTime: new Date(0),
    endTime: new Date(1),
    affixId: getAffix("Awakened"),
  },
  // SL
  {
    slug: "season-sl-1",
    name: "SL Season 1",
    expansionId: 8,
    startTime: new Date(1_607_385_600 * 1000),
    endTime: null,
    affixId: getAffix("Prideful"),
  },
].map((dataset, index) => ({ ...dataset, id: index }));

export const getSeasonId = (name: string): number => {
  const match = seasons.find((season) => season.name === name);

  if (match) {
    return match.id;
  }

  throw new Error("impossible");
};
