import type { Fight, Player, Role } from "@prisma/client";
import nc from "next-connect";

import { dungeonMap } from "../../db/data/dungeons";
import { specs } from "../../db/data/specs";
import { prisma } from "../../db/prisma";
import { MIN_KEYSTONE_LEVEL } from "../../web/env";
import { currentSeasonID } from "../../web/staticData";
import { configureScope, withSentry } from "../middleware";
import { sortByRole } from "../utils";
import {
  cacheControlKey,
  STALE_WHILE_REVALIDATE_TWO_HOURS,
} from "../utils/cache";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../utils/statusCodes";
import type { RequestHandler } from "../utils/types";

type Query = {
  query: {
    dungeonID?: string;
    minKeyLevel?: string;
    maxKeyLevel?: string;
    minItemLevelAvg?: string;
    maxItemLevelAvg?: string;
    maxDeaths?: string;
    maxPercent?: string;

    tank?: string;
    tankLegendary1?: string;
    tankLegendary2?: string;
    tankSoulbind?: string;
    tankCovenant?: string;

    heal?: string;
    healLegendary1?: string;
    healLegendary2?: string;
    healSoulbind?: string;
    healCovenant?: string;

    dps1?: string;
    dps1Legendary1?: string;
    dps1Legendary2?: string;
    dps1Soulbind?: string;
    dps1Covenant?: string;

    dps2?: string;
    dps2Legendary1?: string;
    dps2Legendary2?: string;
    dps2Soulbind?: string;
    dps2Covenant?: string;

    dps3?: string;
    dps3Legendary1?: string;
    dps3Legendary2?: string;
    dps3Soulbind?: string;
    dps3Covenant?: string;

    affix1?: string;
    affix2?: string;
    affix3?: string;
  };
};

export type DiscoveryQueryParams = Query["query"];

type Response =
  | {
      error: string;
    }
  | PublicDiscoveryResponse;

type InternalDiscoveryResponse = (Pick<
  Fight,
  | "averageItemLevel"
  | "dps"
  | "hps"
  | "chests"
  | "fightID"
  | "keystoneLevel"
  | "keystoneTime"
  | "chests"
  | "percent"
  | "totalDeaths"
> & {
  affixes: number[];
  dungeonID: number;
  report: string;
  player: (Pick<
    Player,
    "specID" | "dps" | "hps" | "itemLevel" | "soulbindID" | "covenantID"
  > & {
    talents: number[];
    legendaries: number[];
    classID: number;
  })[];
})[];

export type PublicDiscoveryResponse = (Pick<
  Fight,
  | "averageItemLevel"
  | "dps"
  | "hps"
  | "chests"
  | "fightID"
  | "keystoneLevel"
  | "keystoneTime"
  | "chests"
  | "percent"
  | "totalDeaths"
> & {
  affixes: number[];
  dungeonID: number;
  report: string;
  player: Pick<
    InternalDiscoveryResponse[number]["player"][number],
    "classID" | "specID"
  >[];
})[];

type InternalDiscoveryPlayer =
  InternalDiscoveryResponse[number]["player"][number];
export type DiscoveryPlayer = PublicDiscoveryResponse[number]["player"][number];

const validateQueryParams = (maybeParams: DiscoveryQueryParams) => {
  const dungeonID =
    maybeParams.dungeonID && maybeParams.dungeonID in dungeonMap
      ? Number.parseInt(maybeParams.dungeonID)
      : undefined;
  const minKeyLevel = maybeParams?.minKeyLevel
    ? Number.parseInt(maybeParams.minKeyLevel)
    : undefined;
  const maxKeyLevel = maybeParams?.maxKeyLevel
    ? Number.parseInt(maybeParams.maxKeyLevel)
    : undefined;
  const maxDeaths = maybeParams?.maxDeaths
    ? Number.parseInt(maybeParams.maxDeaths)
    : undefined;
  const minItemLevelAvg = maybeParams?.minItemLevelAvg
    ? Number.parseInt(maybeParams.minItemLevelAvg)
    : undefined;
  const maxItemLevelAvg = maybeParams?.maxItemLevelAvg
    ? Number.parseInt(maybeParams.maxItemLevelAvg)
    : undefined;
  const maxPercent = maybeParams?.maxPercent
    ? Number.parseInt(maybeParams.maxPercent)
    : undefined;

  const tank = maybeParams?.tank
    ? Number.parseInt(maybeParams.tank)
    : undefined;
  const heal = maybeParams?.heal
    ? Number.parseInt(maybeParams.heal)
    : undefined;
  const dps1 = maybeParams?.dps1
    ? Number.parseInt(maybeParams.dps1)
    : undefined;
  const dps2 = maybeParams?.dps2
    ? Number.parseInt(maybeParams.dps2)
    : undefined;
  const dps3 = maybeParams?.dps3
    ? Number.parseInt(maybeParams.dps3)
    : undefined;

  const specQuery = [tank, heal, dps1, dps2, dps3].filter(
    (dataset): dataset is number => dataset !== undefined
  );

  const tankLegendary1 = maybeParams?.tankLegendary1
    ? Number.parseInt(maybeParams.tankLegendary1)
    : undefined;
  const tankLegendary2 = maybeParams?.tankLegendary2
    ? Number.parseInt(maybeParams.tankLegendary2)
    : undefined;
  const tankCovenant = maybeParams?.tankCovenant
    ? Number.parseInt(maybeParams.tankCovenant)
    : undefined;
  const tankSoulbind = maybeParams?.tankSoulbind
    ? Number.parseInt(maybeParams.tankSoulbind)
    : undefined;

  const healLegendary1 = maybeParams?.healLegendary1
    ? Number.parseInt(maybeParams.healLegendary1)
    : undefined;
  const healLegendary2 = maybeParams?.healLegendary2
    ? Number.parseInt(maybeParams.healLegendary2)
    : undefined;
  const healCovenant = maybeParams?.healCovenant
    ? Number.parseInt(maybeParams.healCovenant)
    : undefined;
  const healSoulbind = maybeParams?.healSoulbind
    ? Number.parseInt(maybeParams.healSoulbind)
    : undefined;

  const dps1Legendary1 = maybeParams?.dps1Legendary1
    ? Number.parseInt(maybeParams.dps1Legendary1)
    : undefined;
  const dps1Legendary2 = maybeParams?.dps1Legendary2
    ? Number.parseInt(maybeParams.dps1Legendary2)
    : undefined;
  const dps1Covenant = maybeParams?.dps1Covenant
    ? Number.parseInt(maybeParams.dps1Covenant)
    : undefined;
  const dps1Soulbind = maybeParams?.dps1Soulbind
    ? Number.parseInt(maybeParams.dps1Soulbind)
    : undefined;

  const dps2Legendary1 = maybeParams?.dps2Legendary1
    ? Number.parseInt(maybeParams.dps2Legendary1)
    : undefined;
  const dps2Legendary2 = maybeParams?.dps2Legendary2
    ? Number.parseInt(maybeParams.dps2Legendary2)
    : undefined;
  const dps2Covenant = maybeParams?.dps2Covenant
    ? Number.parseInt(maybeParams.dps2Covenant)
    : undefined;
  const dps2Soulbind = maybeParams?.dps2Soulbind
    ? Number.parseInt(maybeParams.dps2Soulbind)
    : undefined;

  const dps3Legendary1 = maybeParams?.dps3Legendary1
    ? Number.parseInt(maybeParams.dps3Legendary1)
    : undefined;
  const dps3Legendary2 = maybeParams?.dps3Legendary2
    ? Number.parseInt(maybeParams.dps3Legendary2)
    : undefined;
  const dps3Covenant = maybeParams?.dps3Covenant
    ? Number.parseInt(maybeParams.dps3Covenant)
    : undefined;
  const dps3Soulbind = maybeParams?.dps3Soulbind
    ? Number.parseInt(maybeParams.dps3Soulbind)
    : undefined;

  const affix1 = maybeParams?.affix1
    ? Number.parseInt(maybeParams.affix1)
    : undefined;
  const affix2 = maybeParams?.affix2
    ? Number.parseInt(maybeParams.affix2)
    : undefined;
  const affix3 = maybeParams?.affix3
    ? Number.parseInt(maybeParams.affix3)
    : undefined;

  return {
    dungeonID,
    minKeyLevel,
    maxKeyLevel,
    maxDeaths,
    minItemLevelAvg,
    maxItemLevelAvg,
    specQuery,
    affix1,
    affix2,
    affix3,
    maxPercent,

    tank,
    tankLegendary1,
    tankLegendary2,
    tankCovenant,
    tankSoulbind,

    heal,
    healLegendary1,
    healLegendary2,
    healCovenant,
    healSoulbind,

    dps1,
    dps1Legendary1,
    dps1Legendary2,
    dps1Covenant,
    dps1Soulbind,

    dps2,
    dps2Legendary1,
    dps2Legendary2,
    dps2Covenant,
    dps2Soulbind,

    dps3,
    dps3Legendary1,
    dps3Legendary2,
    dps3Covenant,
    dps3Soulbind,
  };
};

const hasValidParams = ({
  minKeyLevel,
  maxDeaths,
  maxPercent,
  maxKeyLevel,
  maxItemLevelAvg,
  minItemLevelAvg,
}: {
  [Property in keyof Pick<
    DiscoveryQueryParams,
    | "minKeyLevel"
    | "maxDeaths"
    | "maxPercent"
    | "maxKeyLevel"
    | "maxItemLevelAvg"
    | "minItemLevelAvg"
  >]: number;
}) => {
  if (
    (minKeyLevel && minKeyLevel < MIN_KEYSTONE_LEVEL) ||
    (maxDeaths && maxDeaths < 0) ||
    (maxPercent && maxPercent < 100) ||
    (maxKeyLevel && maxKeyLevel > 45) ||
    (maxItemLevelAvg && maxItemLevelAvg > 400) ||
    (minItemLevelAvg && minItemLevelAvg < 180)
  ) {
    return false;
  }

  return true;
};

const handler: RequestHandler<Query, Response> = async (req, res) => {
  try {
    const { specQuery, ...queryParams } = validateQueryParams(req.query);

    if (!hasValidParams(queryParams)) {
      res.status(BAD_REQUEST);
      res.json([]);
    }

    Object.entries(queryParams)
      .filter(
        (param): param is [string, number] =>
          param[1] !== undefined && !Array.isArray(param[1])
      )
      .forEach(([key, value]) => {
        configureScope((scope) => {
          scope.setTag(key, value);
        });
      });

    const rawData = await prisma.fight.findMany({
      where: {
        chests: {
          gt: 0,
        },
        ...(queryParams.dungeonID
          ? { dungeonID: queryParams.dungeonID }
          : null),
        ...(queryParams.minKeyLevel || queryParams.maxKeyLevel
          ? {
              keystoneLevel: {
                ...(queryParams.minKeyLevel
                  ? { gte: queryParams.minKeyLevel }
                  : null),
                ...(queryParams.maxKeyLevel
                  ? { lte: queryParams.maxKeyLevel }
                  : null),
              },
            }
          : null),
        percent: {
          ...(queryParams.maxPercent ? { lte: queryParams.maxPercent } : null),
          gte: 100,
        },
        ...(queryParams.maxDeaths
          ? { totalDeaths: { lte: queryParams.maxDeaths } }
          : null),
        ...(queryParams.minItemLevelAvg || queryParams.maxItemLevelAvg
          ? {
              averageItemLevel: {
                ...(queryParams.minItemLevelAvg
                  ? { gte: queryParams.minItemLevelAvg }
                  : null),
                ...(queryParams.maxItemLevelAvg
                  ? { lte: queryParams.maxItemLevelAvg }
                  : null),
              },
            }
          : null),
        ...(specQuery.length === 1
          ? {
              PlayerFight: {
                some: {
                  player: {
                    specID: {
                      in: specQuery,
                    },
                  },
                },
              },
            }
          : null),
        Report: {
          week: {
            affix1ID: queryParams.affix1,
            affix2ID: queryParams.affix2,
            affix3ID: queryParams.affix3,
            season: {
              affixID: {
                in: currentSeasonID,
              },
            },
          },
        },
      },
      select: {
        fightID: true,
        averageItemLevel: true,
        dps: true,
        hps: true,
        dungeonID: true,
        chests: true,
        keystoneLevel: true,
        keystoneTime: true,
        totalDeaths: true,
        percent: true,
        PlayerFight: {
          select: {
            player: {
              select: {
                specID: true,
                character: {
                  select: {
                    classID: true,
                  },
                },
                dps: true,
                hps: true,
                itemLevel: true,
                soulbindID: true,
                covenantID: true,
                PlayerLegendary: {
                  select: {
                    legendaryID: true,
                  },
                },
                PlayerTalent: {
                  select: {
                    talentID: true,
                  },
                },
              },
            },
          },
        },
        Report: {
          select: {
            report: true,
            week: {
              select: {
                affix1ID: true,
                affix2ID: true,
                affix3ID: true,
                season: {
                  select: {
                    affixID: true,
                  },
                },
              },
            },
          },
        },
      },
      take: 250,
      orderBy: {
        keystoneLevel: "desc",
      },
    });

    if (rawData.length === 0) {
      res.json([]);
      return;
    }

    const specQueryFilter = createSpecQueryFilter({
      tank: queryParams.tank,
      heal: queryParams.heal,
      dps1: queryParams.dps1,
      dps2: queryParams.dps2,
      dps3: queryParams.dps3,
    });
    const legendaryFilter = createLegendaryFilter({
      tankLegendary1: queryParams.tankLegendary1,
      tankLegendary2: queryParams.tankLegendary2,
      healLegendary1: queryParams.healLegendary1,
      healLegendary2: queryParams.healLegendary2,
      dps1Legendary1: queryParams.dps1Legendary1,
      dps1Legendary2: queryParams.dps1Legendary2,
      dps2Legendary1: queryParams.dps2Legendary1,
      dps2Legendary2: queryParams.dps2Legendary2,
      dps3Legendary1: queryParams.dps3Legendary1,
      dps3Legendary2: queryParams.dps3Legendary2,
    });

    const soulbindFilter = createSoulbindFilter({
      tankSoulbind: queryParams.tankSoulbind,
      healSoulbind: queryParams.healSoulbind,
      dps1Soulbind: queryParams.dps1Soulbind,
      dps2Soulbind: queryParams.dps2Soulbind,
      dps3Soulbind: queryParams.dps3Soulbind,
    });

    const covenantFilter = createCovenantFilter({
      tankCovenant: queryParams.tankCovenant,
      healCovenant: queryParams.healCovenant,
      dps1Covenant: queryParams.dps1Covenant,
      dps2Covenant: queryParams.dps2Covenant,
      dps3Covenant: queryParams.dps3Covenant,
    });

    const transformed = rawData
      .map<InternalDiscoveryResponse[number] | null>(
        ({ PlayerFight, Report, dungeonID, ...rest }) => {
          if (!dungeonID) {
            return null;
          }

          return {
            ...rest,
            dungeonID,
            affixes: [
              Report.week.affix1ID,
              Report.week.affix2ID,
              Report.week.affix3ID,
              Report.week.season.affixID,
            ],
            report: Report.report.trim(),
            player: PlayerFight.map((playerFight) => {
              const classData = specs.find(
                (spec) => spec.id === playerFight.player.specID
              );

              if (!classData) {
                return null;
              }

              return {
                dps: playerFight.player.dps,
                hps: playerFight.player.hps,
                covenantID: playerFight.player.covenantID,
                itemLevel: playerFight.player.itemLevel,
                legendaries: playerFight.player.PlayerLegendary.map(
                  (playerLegendary) => playerLegendary.legendaryID
                ),
                soulbindID: playerFight.player.soulbindID,
                specID: playerFight.player.specID,
                talents: playerFight.player.PlayerTalent.map(
                  (playerTalent) => playerTalent.talentID
                ),
                classID: classData.classID,
              };
            })
              .filter(
                (
                  dataset
                ): dataset is InternalDiscoveryResponse[number]["player"][number] =>
                  dataset !== null
              )
              .sort((a, b) => {
                const aSpec = specs.find((spec) => spec.id === a.specID);
                const bSpec = specs.find((spec) => spec.id === b.specID);

                if (!aSpec || !bSpec) {
                  return -1;
                }

                return sortByRole(aSpec.role, bSpec.role);
              }),
          };
        }
      )
      .reduce<InternalDiscoveryResponse>((acc, dataset) => {
        if (
          dataset === null ||
          !specQueryFilter(dataset) ||
          !legendaryFilter(dataset) ||
          !soulbindFilter(dataset) ||
          !covenantFilter(dataset)
        ) {
          return acc;
        }

        return [...acc, dataset];
      }, [])
      .sort((a, b) => {
        if (a.keystoneLevel === b.keystoneLevel) {
          return a.keystoneTime - b.keystoneTime;
        }

        return b.keystoneLevel - a.keystoneLevel;
      })
      .slice(0, 25)
      .map<PublicDiscoveryResponse[number]>((dataset) => {
        return {
          ...dataset,
          player: dataset.player.map((player) => {
            return {
              classID: player.classID,
              specID: player.specID,
            };
          }),
        };
      });

    res.setHeader(cacheControlKey, STALE_WHILE_REVALIDATE_TWO_HOURS);
    res.json(transformed);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    res.status(INTERNAL_SERVER_ERROR);
    res.json([]);
  }
};

export const discoveryHandler = nc()
  // @ts-expect-error type incompatibility with next-connect, irrelevant
  .get(withSentry(handler));

type SpecFilterArgs = {
  tank?: number;
  heal?: number;
  dps1?: number;
  dps2?: number;
  dps3?: number;
};

const createSpecQueryFilter = ({
  dps1,
  dps3,
  heal,
  tank,
  dps2,
}: SpecFilterArgs) => {
  if (!dps1 && !dps2 && !dps3 && !tank && !heal) {
    return () => true;
  }

  return (dataset: InternalDiscoveryResponse[number]) => {
    const tankPlayer = dataset.player.find((player) => {
      return filterPlayerByRole(player, "tank");
    });

    if (!tankPlayer) {
      return false;
    }

    const healPlayer = dataset.player.find((player) => {
      return filterPlayerByRole(player, "healer");
    });

    if (!healPlayer) {
      return false;
    }

    const tankMatches = tank ? tankPlayer.specID === tank : true;
    const healMatches = heal ? healPlayer.specID === heal : true;

    if (!tankMatches || !healMatches) {
      return false;
    }

    const dpsSpecIDSet = new Set([dps1, dps2, dps3].filter(isNumber));

    if (dpsSpecIDSet.size === 0) {
      return true;
    }

    const dpsPlayer = dataset.player.filter((player) => {
      return filterPlayerByRole(player, "dps");
    });

    switch (dpsSpecIDSet.size) {
      case 3: {
        // every searched spec must be present
        return dpsPlayer.every((player) => dpsSpecIDSet.has(player.specID));
      }
      case 2: {
        const existingDpsSpecIDSet = new Set(
          dpsPlayer.map((player) => player.specID)
        );

        // both searched must be present
        return [...dpsSpecIDSet].every((id) => existingDpsSpecIDSet.has(id));
      }
      case 1: {
        // just any match is fine
        return dpsPlayer.some((player) => dpsSpecIDSet.has(player.specID));
      }
    }
  };
};

type LegendaryFilterArgs = {
  tankLegendary1?: number;
  tankLegendary2?: number;
  healLegendary1?: number;
  healLegendary2?: number;
  dps1Legendary1?: number;
  dps1Legendary2?: number;
  dps2Legendary1?: number;
  dps2Legendary2?: number;
  dps3Legendary1?: number;
  dps3Legendary2?: number;
};

const createLegendaryFilter = ({
  dps1Legendary1,
  dps1Legendary2,
  dps2Legendary1,
  dps2Legendary2,
  dps3Legendary1,
  dps3Legendary2,
  healLegendary1,
  healLegendary2,
  tankLegendary1,
  tankLegendary2,
}: LegendaryFilterArgs) => {
  if (
    !dps1Legendary1 &&
    !dps1Legendary2 &&
    !dps2Legendary1 &&
    !dps2Legendary2 &&
    !dps3Legendary1 &&
    !dps3Legendary2 &&
    !healLegendary1 &&
    !healLegendary2 &&
    !tankLegendary1 &&
    !tankLegendary2
  ) {
    return () => true;
  }

  return (dataset: InternalDiscoveryResponse[number]) => {
    const tankPlayer = dataset.player.find((player) => {
      return filterPlayerByRole(player, "tank");
    });

    if (!tankPlayer) {
      return false;
    }

    const tankLegendaries = new Set(
      [tankLegendary1, tankLegendary2].filter(isNumber)
    );
    const tankMatches =
      tankLegendaries.size === 0
        ? true
        : tankPlayer.legendaries.every((legendary) =>
            tankLegendaries.has(legendary)
          );

    if (!tankMatches) {
      return false;
    }

    const healPlayer = dataset.player.find((player) => {
      return filterPlayerByRole(player, "healer");
    });

    if (!healPlayer) {
      return false;
    }

    const healLegendaries = new Set(
      [healLegendary1, healLegendary2].filter(isNumber)
    );

    const healMatches =
      healLegendaries.size === 0
        ? true
        : healPlayer.legendaries.every((legendary) =>
            healLegendaries.has(legendary)
          );

    if (!healMatches) {
      return false;
    }

    const dps1LegendaryIDSet = new Set(
      [dps1Legendary1, dps1Legendary2].filter(isNumber)
    );
    const dps2LegendaryIDSet = new Set(
      [dps2Legendary1, dps2Legendary2].filter(isNumber)
    );
    const dps3LegendaryIDSet = new Set(
      [dps3Legendary1, dps3Legendary2].filter(isNumber)
    );

    const sets = [
      dps1LegendaryIDSet,
      dps2LegendaryIDSet,
      dps3LegendaryIDSet,
    ].filter((set) => set.size > 0);

    if (sets.length === 0) {
      return true;
    }

    const [dps1, dps2, dps3] = dataset.player.filter((player) => {
      return filterPlayerByRole(player, "dps");
    });

    const setSize = sets.reduce((acc, set) => acc + set.size, 0);

    if (setSize === 6) {
      const dps1MatchesAnySet = sets.find((set) =>
        dps1.legendaries.every((legendary) => set.has(legendary))
      );

      const dps2MatchesAnySet = sets.find((set) =>
        dps2.legendaries.every((legendary) => set.has(legendary))
      );

      const dps3MatchesAnySet = sets.find((set) =>
        dps3.legendaries.every((legendary) => set.has(legendary))
      );

      // at least one mismatch
      if (!dps1MatchesAnySet || !dps2MatchesAnySet || !dps3MatchesAnySet) {
        return false;
      }

      // none of the matching set may reference each other as that would
      // indicate an overlap instead of separate matches
      return (
        dps1MatchesAnySet !== dps2MatchesAnySet &&
        dps1MatchesAnySet !== dps3MatchesAnySet &&
        dps2MatchesAnySet !== dps3MatchesAnySet
      );
    }

    if (
      hasMismatch(dps1LegendaryIDSet, [dps1, dps2, dps3]) ||
      hasMismatch(dps2LegendaryIDSet, [dps1, dps2, dps3]) ||
      hasMismatch(dps3LegendaryIDSet, [dps1, dps2, dps3])
    ) {
      return false;
    }

    return true;
  };
};

const hasMismatch = (
  set: Set<number>,
  [dps1, dps2, dps3]: [
    InternalDiscoveryPlayer,
    InternalDiscoveryPlayer,
    InternalDiscoveryPlayer
  ]
) => {
  if (set.size === 0) {
    return false;
  }

  const dps1Matches = dps1.legendaries.every((legendary) => set.has(legendary));
  const dps2Matches = dps2.legendaries.every((legendary) => set.has(legendary));
  const dps3Matches = dps3.legendaries.every((legendary) => set.has(legendary));

  return !dps1Matches && !dps2Matches && !dps3Matches;
};

const isNumber = (dataset?: number): dataset is number => dataset !== undefined;

type CovenantFilterArgs = {
  tankCovenant?: number;
  healCovenant?: number;
  dps1Covenant?: number;
  dps2Covenant?: number;
  dps3Covenant?: number;
};

const createCovenantFilter = ({
  dps1Covenant,
  dps2Covenant,
  dps3Covenant,
  healCovenant,
  tankCovenant,
}: CovenantFilterArgs) => {
  if (
    !tankCovenant &&
    !healCovenant &&
    !dps1Covenant &&
    !dps2Covenant &&
    !dps3Covenant
  ) {
    return () => true;
  }

  return (dataset: InternalDiscoveryResponse[number]) => {
    const tankPlayer = dataset.player.find((player) => {
      return filterPlayerByRole(player, "tank");
    });

    const healPlayer = dataset.player.find((player) => {
      return filterPlayerByRole(player, "healer");
    });

    if (
      (tankCovenant && tankPlayer?.covenantID !== tankCovenant) ||
      (healCovenant && healPlayer?.covenantID !== healCovenant)
    ) {
      return false;
    }

    const dpsCovenantIDSet = new Set(
      [dps1Covenant, dps2Covenant, dps3Covenant].filter(isNumber)
    );

    if (dpsCovenantIDSet.size === 0) {
      return true;
    }

    const dpsPlayer = dataset.player.filter((player) => {
      return filterPlayerByRole(player, "dps");
    });

    if (dpsCovenantIDSet.size < 3) {
      return dpsPlayer.some((player) =>
        player.covenantID ? dpsCovenantIDSet.has(player.covenantID) : true
      );
    }

    const dpsPlayerCovenantIDSet = new Set(
      dpsPlayer.map((player) => player.covenantID)
    );

    // 3 explicit covenant requirements were made but this dataset does not have
    // 3 different covenant
    if (dpsPlayerCovenantIDSet.size !== 3) {
      return false;
    }

    return dpsPlayer.every((player) =>
      player.covenantID ? dpsCovenantIDSet.has(player.covenantID) : false
    );
  };
};

type SoulbindFilterArgs = {
  tankSoulbind?: number;
  healSoulbind?: number;
  dps1Soulbind?: number;
  dps2Soulbind?: number;
  dps3Soulbind?: number;
};

const createSoulbindFilter = ({
  tankSoulbind,
  healSoulbind,
  dps1Soulbind,
  dps2Soulbind,
  dps3Soulbind,
}: SoulbindFilterArgs) => {
  if (
    !tankSoulbind &&
    !healSoulbind &&
    !dps1Soulbind &&
    !dps2Soulbind &&
    !dps3Soulbind
  ) {
    return () => true;
  }

  return (dataset: InternalDiscoveryResponse[number]) => {
    const tankPlayer = dataset.player.find((player) => {
      return filterPlayerByRole(player, "tank");
    });

    const healPlayer = dataset.player.find((player) => {
      return filterPlayerByRole(player, "healer");
    });

    if (
      (tankSoulbind && tankPlayer?.soulbindID !== tankSoulbind) ||
      (healSoulbind && healPlayer?.soulbindID !== healSoulbind)
    ) {
      return false;
    }

    const dpsSoulbindIDSet = new Set(
      [dps1Soulbind, dps2Soulbind, dps3Soulbind].filter(isNumber)
    );

    if (dpsSoulbindIDSet.size === 0) {
      return true;
    }

    const dpsPlayer = dataset.player.filter((player) => {
      return filterPlayerByRole(player, "dps");
    });

    if (dpsSoulbindIDSet.size < 3) {
      return dpsPlayer.some((player) =>
        player.soulbindID ? dpsSoulbindIDSet.has(player.soulbindID) : true
      );
    }

    const dpsPlayerSoulbindIDSet = new Set(
      dpsPlayer.map((player) => player.soulbindID)
    );

    // 3 explicit soulbind requirements were made but this dataset does not have
    // 3 different soulbinds
    if (dpsPlayerSoulbindIDSet.size !== 3) {
      return false;
    }

    return dpsPlayer.every((player) =>
      player.soulbindID ? dpsSoulbindIDSet.has(player.soulbindID) : false
    );
  };
};

const filterPlayerByRole = (
  player: InternalDiscoveryResponse[number]["player"][number],
  role: Role
) => {
  const specData = specs.find((spec) => player.specID === spec.id);

  if (!specData) {
    return false;
  }

  return specData.role === role;
};
