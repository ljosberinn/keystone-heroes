import type { Fight, Player, Role } from "@prisma/client";
import nc from "next-connect";

import { dungeonMap } from "../../db/data/dungeons";
import { specs } from "../../db/data/specs";
import { prisma } from "../../db/prisma";
import { configureScope, withSentry } from "../middleware";
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
    minItemLevel?: string;
    maxItemLevel?: string;
    maxDeaths?: string;

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

    seasonAffix?: string;
  };
};

export type DiscoveryQueryParams = Query["query"];

type Response =
  | {
      error: string;
    }
  | DiscoveryResponse;

export type DiscoveryResponse = (Pick<
  Fight,
  | "averageItemLevel"
  | "dps"
  | "hps"
  | "chests"
  | "fightID"
  | "keystoneLevel"
  | "keystoneTime"
  | "percent"
  | "totalDeaths"
> & {
  affixes: number[];
  report: string;
  player: (Pick<
    Player,
    "specID" | "dps" | "hps" | "itemLevel" | "soulbindID" | "covenantID"
  > & {
    talents: number[];
    legendaries: number[];
  })[];
})[];

export type DiscoveryPlayer = DiscoveryResponse[number]["player"][number];

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
  const minItemLevel = maybeParams?.minItemLevel
    ? Number.parseInt(maybeParams.minItemLevel)
    : undefined;
  const maxItemLevel = maybeParams?.maxItemLevel
    ? Number.parseInt(maybeParams.maxItemLevel)
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
  const seasonalAffix = maybeParams?.seasonAffix
    ? Number.parseInt(maybeParams.seasonAffix)
    : undefined;

  return {
    dungeonID,
    minKeyLevel,
    maxKeyLevel,
    maxDeaths,
    minItemLevel,
    maxItemLevel,
    specQuery,
    affix1,
    affix2,
    affix3,
    seasonalAffix,

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

const handler: RequestHandler<Query, Response> = async (req, res) => {
  const {
    dungeonID,
    maxDeaths,
    maxItemLevel,
    maxKeyLevel,
    minItemLevel,
    minKeyLevel,
    specQuery,
    affix1,
    affix2,
    affix3,
    seasonalAffix,
    dps1Covenant,
    dps1Legendary1,
    dps1Legendary2,
    dps1Soulbind,
    dps2Covenant,
    dps2Legendary1,
    dps2Legendary2,
    dps2Soulbind,
    dps3Covenant,
    dps3Legendary1,
    dps3Legendary2,
    dps3Soulbind,
    healCovenant,
    healLegendary1,
    healLegendary2,
    healSoulbind,
    tankCovenant,
    tankLegendary1,
    tankLegendary2,
    tankSoulbind,
    dps1,
    dps2,
    dps3,
    heal,
    tank,
  } = validateQueryParams(req.query);

  if (!dungeonID) {
    res.status(BAD_REQUEST).end();
    return;
  }

  Object.entries({
    dungeonID,
    maxDeaths,
    maxItemLevel,
    maxKeyLevel,
    minItemLevel,
    minKeyLevel,
    affix1,
    affix2,
    affix3,
    seasonalAffix,
    dps1Covenant,
    dps1Legendary1,
    dps1Legendary2,
    dps1Soulbind,
    dps2Covenant,
    dps2Legendary1,
    dps2Legendary2,
    dps2Soulbind,
    dps3Covenant,
    dps3Legendary1,
    dps3Legendary2,
    dps3Soulbind,
    healCovenant,
    healLegendary1,
    healLegendary2,
    healSoulbind,
    tankCovenant,
    tankLegendary1,
    tankLegendary2,
    tankSoulbind,
    dps1,
    dps2,
    dps3,
    heal,
    tank,
  })
    .filter(([, value]) => !!value)
    .forEach(([key, value]) => {
      configureScope((scope) => {
        scope.setTag(key, value);
      });
    });

  try {
    res.setHeader(cacheControlKey, STALE_WHILE_REVALIDATE_TWO_HOURS);

    const rawData = await prisma.fight.findMany({
      where: {
        chests: {
          gt: 0,
        },
        dungeonID,
        totalDeaths: {
          lte: maxDeaths,
        },
        keystoneLevel: {
          gte: minKeyLevel,
          lte: maxKeyLevel,
        },
        PlayerFight: {
          every: {
            player: {
              itemLevel: {
                gte: minItemLevel,
                lte: maxItemLevel,
              },
            },
          },
          some: {
            player: {
              specID: {
                in: specQuery.length === 1 ? specQuery : undefined,
              },
            },
          },
        },
        Report: {
          week: {
            affix1ID: affix1,
            affix2ID: affix2,
            affix3ID: affix3,
            season: {
              affixID: {
                in: seasonalAffix,
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
    });

    if (rawData.length === 0) {
      res.json([]);
      return;
    }

    const specQueryFilter = createSpecQueryFilter({
      tank,
      heal,
      dps1,
      dps2,
      dps3,
    });
    const legendaryFilter = createLegendaryFilter({
      tankLegendary1,
      tankLegendary2,
      healLegendary1,
      healLegendary2,
      dps1Legendary1,
      dps1Legendary2,
      dps2Legendary1,
      dps2Legendary2,
      dps3Legendary1,
      dps3Legendary2,
    });

    const soulbindFilter = createSoulbindFilter({
      tankSoulbind,
      healSoulbind,
      dps1Soulbind,
      dps2Soulbind,
      dps3Soulbind,
    });

    const transformed = rawData
      .map<DiscoveryResponse[number] | null>(
        ({ PlayerFight, Report, dungeonID, ...rest }) => {
          if (!dungeonID) {
            return null;
          }

          return {
            ...rest,
            affixes: [
              Report.week.affix1ID,
              Report.week.affix2ID,
              Report.week.affix3ID,
              Report.week.season.affixID,
            ],
            report: Report.report.trim(),
            player: PlayerFight.map((playerFight) => {
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
              };
            }),
          };
        }
      )
      .reduce<DiscoveryResponse>((acc, dataset) => {
        if (
          dataset === null ||
          !specQueryFilter(dataset) ||
          !legendaryFilter(dataset) ||
          !soulbindFilter(dataset)
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
      });

    res.json(transformed);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    res.status(INTERNAL_SERVER_ERROR);

    if (error instanceof Error) {
      res.json({ error: error.message });
    }
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

  return (dataset: DiscoveryResponse[number]) => {
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

    return dpsPlayer.every((player) => dpsSpecIDSet.has(player.specID));
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

  return (dataset: DiscoveryResponse[number]) => {
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
  [dps1, dps2, dps3]: [DiscoveryPlayer, DiscoveryPlayer, DiscoveryPlayer]
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

  return (dataset: DiscoveryResponse[number]) => {
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
  player: DiscoveryResponse[number]["player"][number],
  role: Role
) => {
  const specData = specs.find((spec) => player.specID === spec.id);

  if (!specData) {
    return false;
  }

  return specData.role === role;
};
