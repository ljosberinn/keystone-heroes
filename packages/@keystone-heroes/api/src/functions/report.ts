import { getAffixByID } from "@keystone-heroes/db/data/affixes";
import { classMapByName } from "@keystone-heroes/db/data/classes";
import { dungeonMap } from "@keystone-heroes/db/data/dungeons";
import { seasons } from "@keystone-heroes/db/data/seasons";
import { specs } from "@keystone-heroes/db/data/specs";
import { weeks } from "@keystone-heroes/db/data/weeks";
import { prisma } from "@keystone-heroes/db/prisma";
import { Role } from "@keystone-heroes/db/types";
import type {
  PlayableClass,
  SpecName,
  Prisma,
  Affix,
  Dungeon,
  Week,
} from "@keystone-heroes/db/types";
import { MIN_KEYSTONE_LEVEL } from "@keystone-heroes/env";
import type {
  Conduit,
  CovenantTrait,
  LegendaryItem,
  Talent,
} from "@keystone-heroes/wcl/queries";
import {
  ItemQuality,
  getInitialReportData,
  getTableData,
} from "@keystone-heroes/wcl/queries";
import type { Report, Region, GameZone } from "@keystone-heroes/wcl/types";
import {
  isValidReportId,
  maybeOngoingReport,
} from "@keystone-heroes/wcl/utils";
import type { Awaited, DeepRequired } from "ts-essentials";

import {
  SERVICE_UNAVAILABLE,
  BAD_REQUEST,
  UNPROCESSABLE_ENTITY,
} from "../utils/statusCodes";
import type { RequestHandler } from "../utils/types";

type Request = {
  query: {
    reportID?: string | string[];
  };
};

export type ReportResponse =
  | (Pick<Report, "title" | "startTime" | "endTime"> & {
      region: Region["slug"];
      fights: (Omit<
        FightWithMeta,
        "gameZone" | "player" | "startTime" | "endTime"
      > & {
        dungeon: Pick<Dungeon, "name" | "time" | "id"> | null;
        player: (Pick<Player, "soulbindID" | "covenantID"> & {
          class: string;
          spec: string;
          legendary: Pick<
            LegendaryItem,
            "id" | "effectIcon" | "effectName"
          > | null;
        })[];
      })[];
      affixes: Omit<Affix, "id" | "seasonal">[];
    })
  | {
      error: typeof reportHandlerError[keyof typeof reportHandlerError];
    };

export const reportHandlerError = {
  NO_TIMED_KEYS: `This report does not appear to contain any timed keys above or matching the key level requirement (${MIN_KEYSTONE_LEVEL}).`,
  BROKEN_LOG_OR_WCL_UNAVAILABLE:
    "This report is either broken or the request to Warcraftlogs failed. Please try again at a later time.",
  SECONDARY_REQUEST_FAILED:
    "Warcraftlogs could not be reached or the API request limit has been reached. Please try again at a later time.",
  EMPTY_LOG: "This report does not contain any fights.",
} as const;

type DeepNullablePath<T, P> = P extends []
  ? T
  : P extends [infer A, ...infer B]
  ? DeepNullablePath<NonNullable<T>[A & keyof NonNullable<T>] | undefined, B>
  : never;

type MaybeFight = DeepNullablePath<
  Awaited<ReturnType<typeof getInitialReportData>>,
  ["reportData", "report", "fights", number]
>;

type Fight = Omit<DeepRequired<MaybeFight>, "gameZone"> & {
  gameZone: null | Pick<GameZone, "id">;
};

type Player = {
  class: PlayableClass;
  classID: number;
  spec: SpecName;
  specID: number;
  dps: number;
  hps: number;
  deaths: number;
  name: string;
  itemLevel: number;
  server: string;
  actorID: number;
  legendary: LegendaryItem | null;
  talents: Talent[];
  soulbindID: number | null;
  covenantID: number | null;
  covenantTraits: CovenantTrait[] | null;
  conduits: Conduit[];
};

type FightWithMeta = Omit<
  Fight,
  "friendlyPlayers" | "maps" | "__typename" | "keystoneAffixes" | "maps"
> & {
  player: Player[];
  dtps: number;
};

const fightIsFight = (fight: MaybeFight): fight is Fight => {
  return (
    typeof fight?.averageItemLevel === "number" &&
    typeof fight.keystoneBonus === "number" &&
    typeof fight.keystoneLevel === "number" &&
    typeof fight.keystoneTime === "number" &&
    Array.isArray(fight.friendlyPlayers) &&
    Array.isArray(fight.keystoneAffixes) &&
    Array.isArray(fight.maps) &&
    // broken gameZone is alright, will be fixed in /api/fight
    (fight?.gameZone === null || typeof fight.gameZone?.id === "number")
  );
};

const fightFulfillsKeystoneLevelRequirement = (fight: Fight) =>
  fight.keystoneLevel >= MIN_KEYSTONE_LEVEL;

const fightIsTimedKeystone = (fight: Fight) => fight.keystoneBonus > 0;

const fightHasFivePlayers = (fight: Fight) =>
  fight.friendlyPlayers.length === 5;

const createFightIsNotKnownFilter = (persistedFightIDs: number[]) => {
  if (persistedFightIDs.length === 0) {
    return () => true;
  }

  const set = new Set(persistedFightIDs);

  // skip any fight that is already stored
  return (fight: Fight) => !set.has(fight.id);
};

const persistServer = async (
  allServer: string[],
  regionID: number
): Promise<Record<string, number>> => {
  const data: Prisma.ServerCreateManyInput[] = allServer.map((server) => {
    return {
      regionID,
      name: server,
    };
  });

  await prisma.server.createMany({
    skipDuplicates: true,
    data,
  });

  const server = await prisma.server.findMany({
    where: {
      OR: data,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return Object.fromEntries(
    server.map((dataset) => [dataset.name, dataset.id])
  );
};

const createCharacterKey = (
  character: Omit<Prisma.CharacterCreateManyInput, "classID">
) => `${character.name}-${character.serverID}`;

const persistCharacters = async (
  data: Prisma.CharacterCreateManyInput[]
): Promise<Record<string, number>> => {
  await prisma.character.createMany({
    skipDuplicates: true,
    data,
  });

  const characters = await prisma.character.findMany({
    where: {
      OR: data,
    },
    select: {
      id: true,
      name: true,
      serverID: true,
    },
  });

  return Object.fromEntries(
    characters.map((character) => [createCharacterKey(character), character.id])
  );
};

type CreateManyPlayerReturn = {
  playerIDs: Prisma.PlayerFightCreateManyFightInput[];
  playerCovenantTraitCreateMany: Prisma.PlayerCovenantTraitCreateManyFightInput[];
  playerTalentCreateMany: Prisma.PlayerTalentCreateManyFightInput[];
  playerConduitCreateMany: Prisma.PlayerConduitCreateManyFightInput[];
};

const createManyPlayer = async (
  data: Player[],
  meta: {
    reportID: number;
    serverMap: Record<string, number>;
    characterMap: Record<string, number>;
  }
): Promise<CreateManyPlayerReturn> => {
  const playerCreateManyInput = data
    .map<Prisma.PlayerCreateManyInput | null>((dataset) => {
      const serverID = meta.serverMap[dataset.server];

      if (!serverID) {
        return null;
      }

      const characterID =
        meta.characterMap[createCharacterKey({ name: dataset.name, serverID })];

      // sanity check - shouldnt happen
      if (!characterID) {
        return null;
      }

      return {
        actorID: dataset.actorID,
        dps: dataset.dps,
        hps: dataset.hps,
        deaths: dataset.deaths,
        itemLevel: dataset.itemLevel,
        characterID,
        reportID: meta.reportID,
        specID: dataset.specID,
        covenantID: dataset.covenantID ? dataset.covenantID : undefined,
        soulbindID: dataset.soulbindID ? dataset.soulbindID : undefined,
        legendaryID: dataset.legendary ? dataset.legendary.effectID : undefined,
      };
    })
    .filter(
      (dataset): dataset is Prisma.PlayerCreateManyInput => dataset !== null
    );

  await prisma.player.createMany({
    skipDuplicates: true,
    data: playerCreateManyInput,
  });

  const createdPlayers = await prisma.player.findMany({
    where: {
      OR: playerCreateManyInput,
    },
    select: { id: true, characterID: true },
  });

  const dataWithPlayerID = data
    .map<(Player & { playerID: number }) | null>((dataset) => {
      const serverID = meta.serverMap[dataset.server];

      if (!serverID) {
        return null;
      }

      const characterID =
        meta.characterMap[createCharacterKey({ name: dataset.name, serverID })];

      // sanity check - shouldnt happen
      if (!characterID) {
        return null;
      }

      const match = createdPlayers.find(
        (player) => player.characterID === characterID
      );

      if (!match) {
        return null;
      }

      return { ...dataset, playerID: match.id };
    })
    .filter(
      (dataset): dataset is Player & { playerID: number } => dataset !== null
    );

  const playerIDs = createdPlayers.map((dataset) => {
    return {
      playerID: dataset.id,
    };
  });

  const playerTalentCreateMany = dataWithPlayerID.flatMap((dataset) =>
    dataset.talents.map<Prisma.PlayerTalentCreateManyFightInput>((talent) => {
      return {
        talentID: talent.guid,
        playerID: dataset.playerID,
      };
    })
  );

  const playerConduitCreateMany = dataWithPlayerID.flatMap((dataset) => {
    if (dataset.covenantID && dataset.covenantTraits) {
      return dataset.conduits.map<Prisma.PlayerConduitCreateManyFightInput>(
        (conduit) => {
          return {
            itemLevel: conduit.total,
            conduitID: conduit.guid,
            playerID: dataset.playerID,
          };
        }
      );
    }

    return [];
  });

  const playerCovenantTraitCreateMany = dataWithPlayerID.flatMap((dataset) => {
    if (dataset.covenantID && dataset.covenantTraits) {
      return dataset.covenantTraits.map<Prisma.PlayerCovenantTraitCreateManyFightInput>(
        (trait) => {
          return {
            covenantTraitID: trait.guid,
            playerID: dataset.playerID,
          };
        }
      );
    }

    return [];
  });

  return {
    playerIDs,
    playerTalentCreateMany,
    playerConduitCreateMany,
    playerCovenantTraitCreateMany,
  };
};

const sortByRole = (a: Role, b: Role) => {
  if (b === Role.tank || a === Role.dps) {
    return 1;
  }

  if (b === Role.dps || a === Role.tank) {
    return -1;
  }

  return 0;
};

type RawReport = {
  startTime: Date;
  endTime: Date;
  title: string;
  region: {
    slug: string;
  };
  Fight: {
    fightID: number;
    averageItemLevel: number;
    chests: number;
    keystoneTime: number;
    keystoneLevel: number;
    dps: number;
    hps: number;
    dtps: number;
    totalDeaths: number;
    dungeon: Pick<Dungeon, "name" | "time" | "id"> | null;
    PlayerFight: {
      player: {
        covenant: {
          id: number;
        } | null;
        soulbind: {
          id: number;
        } | null;
        spec: {
          name: SpecName;
          role: Role;
        };
        character: {
          class: {
            name: PlayableClass;
          };
        };
        legendary: Pick<
          LegendaryItem,
          "id" | "effectIcon" | "effectName"
        > | null;
      };
    }[];
  }[];
  week: {
    season: {
      affix: Omit<Affix, "id" | "seasonal">;
    };
    affix1: Omit<Affix, "id" | "seasonal">;
    affix2: Omit<Affix, "id" | "seasonal">;
    affix3: Omit<Affix, "id" | "seasonal">;
  };
} | null;

const getFightIDsOfExistingReport = (existingReport: RawReport) => {
  if (!existingReport) {
    return [];
  }

  return existingReport.Fight.map((fight) => fight.fightID);
};

const createResponseFromDB = (
  existingReport: NonNullable<RawReport>
): ReportResponse => {
  return {
    affixes: [
      existingReport.week.affix1,
      existingReport.week.affix2,
      existingReport.week.affix3,
      existingReport.week.season.affix,
    ],
    endTime: existingReport.endTime.getTime(),
    region: existingReport.region.slug,
    startTime: existingReport.startTime.getTime(),
    title: existingReport.title,
    fights: existingReport.Fight.map((fight) => {
      return {
        id: fight.fightID,
        player: [...fight.PlayerFight]
          .sort((a, b) => sortByRole(a.player.spec.role, b.player.spec.role))
          .map(({ player }) => {
            return {
              legendary: player.legendary ? player.legendary : null,
              class: player.character.class.name,
              spec: player.spec.name,
              covenantID: player.covenant ? player.covenant.id : null,
              soulbindID: player.soulbind ? player.soulbind.id : null,
            };
          }),
        averageItemLevel: Number.parseFloat(
          (fight.averageItemLevel / 100).toFixed(2)
        ),
        dtps: fight.dtps,
        hps: fight.hps,
        dps: fight.dps,
        keystoneLevel: fight.keystoneLevel,
        keystoneTime: fight.keystoneTime,
        totalDeaths: fight.totalDeaths,
        keystoneBonus: fight.chests,
        dungeon: fight.dungeon,
      };
    }),
  };
};

type RawData = {
  startTime: number;
  endTime: number;
  title: string;
  region: string;
  fightsWithMeta: FightWithMeta[];
  affixes: number[];
};

const createResponseFromRawData = ({
  startTime,
  endTime,
  title,
  region,
  fightsWithMeta,
  affixes,
}: RawData): ReportResponse => {
  return {
    endTime,
    startTime,
    title,
    region,
    fights: fightsWithMeta
      .map((fight) => {
        const { gameZone, player, startTime, endTime, ...rest } = fight;

        const dungeon = gameZone ? dungeonMap[gameZone.id] : null;

        return {
          ...rest,
          dps: player.reduce((acc, player) => acc + player.dps, 0),
          hps: player.reduce((acc, player) => acc + player.hps, 0),
          totalDeaths: player.reduce((acc, player) => acc + player.deaths, 0),
          dungeon:
            dungeon && gameZone
              ? {
                  name: dungeon.name,
                  time: dungeon.timer[0],
                  id: gameZone.id,
                }
              : null,
          player: player.map((player) => {
            return {
              class: player.class,
              spec: player.spec,
              soulbindID: player.soulbindID,
              covenantID: player.covenantID,
              legendary: player.legendary
                ? {
                    id: player.legendary.id,
                    effectIcon: player.legendary.effectIcon,
                    effectName: player.legendary.effectName,
                  }
                : null,
            };
          }),
        };
      })
      .sort((a, b) => a.id - b.id),
    affixes: affixes.map((affix) => {
      const { id, seasonal, ...data } = getAffixByID(affix);
      return data;
    }),
  };
};

const createReportFindFirst = (reportID: string) => {
  return {
    where: {
      report: reportID,
    },
    select: {
      startTime: true,
      endTime: true,
      title: true,
      region: {
        select: {
          slug: true,
        },
      },
      Fight: {
        orderBy: { fightID: "asc" },
        select: {
          fightID: true,
          averageItemLevel: true,
          chests: true,
          keystoneTime: true,
          keystoneLevel: true,
          dps: true,
          hps: true,
          dtps: true,
          totalDeaths: true,
          dungeon: {
            select: {
              name: true,
              time: true,
              id: true,
            },
          },
          PlayerFight: {
            select: {
              player: {
                select: {
                  spec: {
                    select: {
                      name: true,
                      role: true,
                    },
                  },
                  covenant: {
                    select: { id: true },
                  },
                  character: {
                    select: {
                      class: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                  legendary: {
                    select: {
                      id: true,
                      effectIcon: true,
                      effectName: true,
                    },
                  },
                  soulbind: {
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      },
      week: {
        select: {
          season: {
            select: {
              affix: {
                select: {
                  name: true,
                  icon: true,
                },
              },
            },
          },
          affix1: {
            select: {
              name: true,
              icon: true,
            },
          },
          affix2: {
            select: {
              name: true,
              icon: true,
            },
          },
          affix3: {
            select: {
              name: true,
              icon: true,
            },
          },
        },
      },
    },
  } as const;
};

export const reportHandler: RequestHandler<Request, ReportResponse> = async (
  req,
  res
) => {
  if (
    !req.query.reportID ||
    Array.isArray(req.query.reportID) ||
    !isValidReportId(req.query.reportID)
  ) {
    res.status(BAD_REQUEST).end();
    return;
  }

  const { reportID } = req.query;
  const existingReport: RawReport = await prisma.report.findFirst(
    createReportFindFirst(reportID)
  );

  if (existingReport && !maybeOngoingReport(existingReport.endTime.getTime())) {
    res.json(createResponseFromDB(existingReport));
    return;
  }

  const report = await getInitialReportData({ reportID });

  if (
    !report ||
    // no report
    !report.reportData?.report ||
    // broken report
    !report.reportData.report.region?.slug ||
    !report.reportData.report.fights
  ) {
    res.status(SERVICE_UNAVAILABLE).json({
      error: reportHandlerError.BROKEN_LOG_OR_WCL_UNAVAILABLE,
    });
    return;
  }

  // empty report
  if (
    report.reportData.report.fights.length === 0 ||
    report.reportData.report.startTime === report.reportData.report.endTime
  ) {
    res.status(UNPROCESSABLE_ENTITY).json({
      error: reportHandlerError.EMPTY_LOG,
    });
  }

  const {
    startTime,
    endTime,
    title,
    region: { slug: region },
  } = report.reportData.report;
  const persistedFightIDs = getFightIDsOfExistingReport(existingReport);
  const fightIsNotKnown = createFightIsNotKnownFilter(persistedFightIDs);

  const fights = report.reportData.report.fights
    .filter(
      (fight): fight is Fight =>
        fightIsFight(fight) &&
        fightIsTimedKeystone(fight) &&
        fightHasFivePlayers(fight) &&
        fightFulfillsKeystoneLevelRequirement(fight) &&
        fightIsNotKnown(fight)
    )
    .map((fight) => {
      return {
        ...fight,
        averageItemLevel: Number.parseFloat(fight.averageItemLevel.toFixed(2)),
        maps: [...new Set(fight.maps.map((map) => map.id))],
      };
    });

  // no valid (new) fights found
  if (fights.length === 0) {
    // maybeOngoingFight === true
    if (existingReport && persistedFightIDs.length > 0) {
      res.json(createResponseFromDB(existingReport));
      return;
    }

    res.status(BAD_REQUEST).json({
      error: reportHandlerError.NO_TIMED_KEYS,
    });
    return;
  }

  const maybeFightsWithMeta: (FightWithMeta | null)[] = await Promise.all(
    fights.map(async (fight) => {
      const table = await getTableData({
        reportID,
        startTime: fight.startTime,
        endTime: fight.endTime,
        fightIDs: [fight.id],
      });

      if (!table.reportData?.report?.table?.data) {
        return null;
      }

      const { friendlyPlayers, keystoneAffixes, maps, ...rest } = fight;
      const { damageDone, healingDone, deathEvents, damageTaken } =
        table.reportData.report.table.data;
      const playerDetails = Object.values(
        table.reportData.report.table.data.playerDetails
      ).flat();
      const keystoneTimeInSeconds = fight.keystoneTime / 1000;

      const maybePlayer = friendlyPlayers.map<Player | null>((id) => {
        const characterOrEventMatchesID = <T extends { id: number }>(
          dataset: T
        ) => dataset.id === id;

        const damageDoneMatch = damageDone.find(characterOrEventMatchesID);
        const healingDoneMatch = healingDone.find(characterOrEventMatchesID);
        const deaths = deathEvents.filter(characterOrEventMatchesID);
        const detailsMatch = playerDetails.find(characterOrEventMatchesID);

        if (!damageDoneMatch || !healingDoneMatch || !detailsMatch) {
          return null;
        }

        const classID = classMapByName[detailsMatch.type];
        const spec = specs.find(
          (spec) =>
            spec.classID === classID && spec.name === detailsMatch.specs[0]
        );

        if (!spec) {
          return null;
        }

        const dps = Math.round(damageDoneMatch.total / keystoneTimeInSeconds);
        const hps = Math.round(healingDoneMatch.total / keystoneTimeInSeconds);

        const legendary =
          detailsMatch.combatantInfo.gear.find(
            (item): item is LegendaryItem =>
              item.quality === ItemQuality.LEGENDARY
          ) ?? null;
        const covenantID = detailsMatch.combatantInfo.covenantID ?? null;
        const soulbindID = detailsMatch.combatantInfo.soulbindID ?? null;
        const covenantTraits = covenantID
          ? detailsMatch.combatantInfo.artifact.filter(
              (talent) => talent.guid !== 0
            )
          : null;

        return {
          name: detailsMatch.name,
          server: detailsMatch.server,
          class: detailsMatch.type,
          spec: detailsMatch.specs[0],
          classID,
          specID: spec.id,
          dps,
          hps,
          deaths: deaths.length,
          itemLevel: detailsMatch.maxItemLevel,
          actorID: id,
          talents: detailsMatch.combatantInfo.talents,
          conduits: detailsMatch.combatantInfo.heartOfAzeroth,
          legendary,
          soulbindID,
          covenantID,
          covenantTraits,
        };
      });

      const player = maybePlayer.filter(
        (player): player is Player => player !== null
      );

      if (player.length !== 5) {
        return null;
      }

      const dtps = Math.round(
        damageTaken.reduce((acc, dataset) => acc + dataset.total, 0) /
          keystoneTimeInSeconds
      );

      return {
        ...rest,
        player,
        dtps,
      };
    })
  );

  const fightsWithMeta = maybeFightsWithMeta.filter(
    (fight): fight is FightWithMeta => fight !== null
  );

  if (fightsWithMeta.length === 0) {
    res.status(SERVICE_UNAVAILABLE).json({
      error: reportHandlerError.SECONDARY_REQUEST_FAILED,
    });
    return;
  }

  const regionDataset = await prisma.region.upsert({
    select: {
      id: true,
    },
    create: {
      slug: region,
    },
    where: {
      slug: region,
    },
    update: {},
  });

  const week = findWeekbyTimestamp(startTime, endTime);

  const reportCreateInput: Prisma.ReportCreateInput = {
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    report: reportID,
    title,
    region: {
      connectOrCreate: {
        create: {
          slug: region,
        },
        where: {
          slug: region,
        },
      },
    },
    week: {
      connect: {
        id: week.id,
      },
    },
  };

  const createdReport = await prisma.report.create({
    data: reportCreateInput,
    select: { id: true },
  });

  const allPlayer = fightsWithMeta.flatMap((fight) => fight.player);

  const conduitCreateMany: Prisma.ConduitCreateManyInput[] = allPlayer.flatMap(
    (player) =>
      player.conduits.map((conduit) => {
        return {
          id: conduit.guid,
          name: conduit.name,
          icon: conduit.abilityIcon,
        };
      })
  );

  await prisma.conduit.createMany({
    skipDuplicates: true,
    data: conduitCreateMany,
  });

  const talentCreateMany: Prisma.TalentCreateManyInput[] = allPlayer.flatMap(
    (player) =>
      player.talents.map((talent) => {
        return {
          id: talent.guid,
          name: talent.name,
          icon: talent.abilityIcon,
          classID: player.classID,
          specID: player.specID,
        };
      })
  );

  await prisma.talent.createMany({
    skipDuplicates: true,
    data: talentCreateMany,
  });

  const covenantTraitCreateMany: Prisma.CovenantTraitCreateManyInput[] =
    allPlayer
      .filter(
        (
          dataset
        ): dataset is Omit<Player, "covenantTraits"> & {
          covenantTraits: CovenantTrait[];
          covenantID: number;
        } => dataset.covenantTraits !== null && dataset.covenantID !== null
      )
      .flatMap((dataset) =>
        dataset.covenantTraits.map((trait) => {
          return {
            id: trait.guid,
            name: trait.name,
            icon: trait.abilityIcon,
            covenantID: dataset.covenantID,
          };
        })
      );

  await prisma.covenantTrait.createMany({
    skipDuplicates: true,
    data: covenantTraitCreateMany,
  });

  const legendariesCreateMany: Prisma.LegendaryCreateManyInput[] = allPlayer
    .filter(
      (
        dataset
      ): dataset is Omit<Player, "legendary"> & {
        legendary: LegendaryItem;
      } => dataset.legendary !== null
    )
    .map((dataset) => {
      return {
        id: dataset.legendary.effectID,
        effectIcon: dataset.legendary.effectIcon,
        itemID: dataset.legendary.id,
        effectName: dataset.legendary.effectName,
      };
    });

  await prisma.legendary.createMany({
    skipDuplicates: true,
    data: legendariesCreateMany,
  });

  const serverMap = await persistServer(
    [...new Set(allPlayer.map((player) => player.server))],
    regionDataset.id
  );

  const characterMap = await persistCharacters(
    allPlayer.map((player) => {
      return {
        name: player.name,
        serverID: serverMap[player.server],
        classID: player.classID,
      };
    })
  );

  const fightsCreateInput = await Promise.all(
    fightsWithMeta.map<Promise<Prisma.FightCreateInput>>(async (fight) => {
      const {
        playerIDs,
        playerConduitCreateMany,
        playerCovenantTraitCreateMany,
        playerTalentCreateMany,
      } = await createManyPlayer(fight.player, {
        reportID: createdReport.id,
        serverMap,
        characterMap,
      });

      const dungeon: Prisma.DungeonCreateNestedOneWithoutFightInput =
        fight.gameZone
          ? {
              connect: {
                id: fight.gameZone.id,
              },
            }
          : {};

      return {
        startTime: fight.startTime,
        endTime: fight.endTime,
        averageItemLevel: fight.averageItemLevel * 100,
        chests: fight.keystoneBonus,
        fightID: fight.id,
        keystoneLevel: fight.keystoneLevel,
        dps: fight.player.reduce((acc, player) => acc + player.dps, 0),
        hps: fight.player.reduce((acc, player) => acc + player.hps, 0),
        dtps: fight.dtps,
        keystoneTime: fight.keystoneTime,
        totalDeaths: fight.player.reduce(
          (acc, player) => acc + player.deaths,
          0
        ),
        Report: {
          connect: {
            id: createdReport.id,
          },
        },
        dungeon,
        PlayerFight: {
          createMany: {
            data: playerIDs,
          },
        },
        PlayerConduit: {
          createMany: {
            data: playerConduitCreateMany,
          },
        },
        PlayerTalent: {
          createMany: {
            data: playerTalentCreateMany,
          },
        },
        PlayerCovenantTrait: {
          createMany: {
            data: playerCovenantTraitCreateMany,
          },
        },
      };
    })
  );

  await Promise.all(
    fightsCreateInput.map((data) =>
      prisma.fight.create({
        data,
      })
    )
  );

  res.json(
    createResponseFromRawData({
      endTime,
      startTime,
      title,
      region,
      fightsWithMeta,
      affixes: fights[0].keystoneAffixes,
    })
  );
};

const findWeekbyTimestamp = (
  startTime: number,
  endTime: number
  // TODO: adjust season start time based on region
  // region: string
): Week => {
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

  const thisSeasonsWeeks = weeks.filter((week) => week.seasonID === season.id);

  const amountOfWeeksThisSeason = thisSeasonsWeeks.length;
  const seasonStartTime = season.startTime.getTime();
  const timePassedSinceSeasonStart = startTime - seasonStartTime;

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
};
