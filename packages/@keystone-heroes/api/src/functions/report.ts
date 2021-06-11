import {
  classMapByName,
  dungeonMap,
  getAffixByID,
  seasons,
  specs,
  weeks,
} from "@keystone-heroes/db/data";
import { Role, prisma } from "@keystone-heroes/db/prisma";
import type {
  PlayableClass,
  SpecName,
  Prisma,
  Affix,
  Dungeon,
} from "@keystone-heroes/db/prisma";
import { MIN_KEYSTONE_LEVEL } from "@keystone-heroes/env";
import type {
  Conduit,
  LegendaryItem,
  CovenantTrait,
  Talent,
} from "@keystone-heroes/wcl/src/queries";
import {
  ItemQuality,
  getInitialReportData,
  getTableData,
} from "@keystone-heroes/wcl/src/queries";
import type { Report, Region, GameZone } from "@keystone-heroes/wcl/types";
import { maybeOngoingReport } from "@keystone-heroes/wcl/utils";
import type { Week } from "@prisma/client";
import nc from "next-connect";
import type { Awaited, DeepRequired } from "ts-essentials";

import { createValidReportIDMiddleware } from "../middleware";
import { NO_CONTENT } from "../utils/statusCodes";
import type { RequestHandler } from "../utils/types";

type Request = {
  query: {
    reportID: string;
  };
};

export type ReportResponse = Pick<Report, "title" | "startTime" | "endTime"> & {
  region: Region["slug"];
  fights: (Omit<
    FightWithMeta,
    "gameZone" | "player" | "startTime" | "endTime"
  > & {
    dungeon: Pick<Dungeon, "name" | "time" | "id"> | null;
    player: (Pick<Player, "soulbindID" | "covenantID"> & {
      class: string;
      spec: string;
      legendary: Pick<LegendaryItem, "id" | "effectIcon" | "effectName"> | null;
    })[];
  })[];
  affixes: Omit<Affix, "id" | "seasonal">[];
};

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

      // TODO: batch create legendaries upfront

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

const handler: RequestHandler<Request, ReportResponse> = async (req, res) => {
  const { reportID } = req.query;
  console.time(reportID);

  const existingReport = await prisma.report.findFirst({
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
  });

  if (existingReport && !maybeOngoingReport(existingReport.endTime.getTime())) {
    const response: ReportResponse = {
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
    console.timeEnd(reportID);

    res.json(response);
    return;
  }

  console.time(`wcl.report${reportID}`);
  const report = await getInitialReportData({ reportID });
  console.timeEnd(`wcl.report${reportID}`);

  if (
    !report ||
    // no report
    !report.reportData?.report ||
    // broken report
    !report.reportData.report.region?.slug ||
    !report.reportData.report.fights ||
    // empty report
    report.reportData.report.fights.length === 0 ||
    report.reportData.report.startTime === report.reportData.report.endTime
  ) {
    res.status(NO_CONTENT).end();
    return;
  }

  const {
    startTime,
    endTime,
    title,
    region: { slug: region },
  } = report.reportData.report;

  console.time(`fightfiltering${reportID}`);
  const fights = report.reportData.report.fights
    .filter(
      (fight): fight is Fight =>
        fightIsFight(fight) &&
        fightIsTimedKeystone(fight) &&
        fightHasFivePlayers(fight) &&
        fightFulfillsKeystoneLevelRequirement(fight)
    )
    .map((fight) => {
      return {
        ...fight,
        averageItemLevel: Number.parseFloat(fight.averageItemLevel.toFixed(2)),
        maps: [...new Set(fight.maps.map((map) => map.id))],
      };
    });
  console.timeEnd(`fightfiltering${reportID}`);

  if (fights.length === 0) {
    res.status(NO_CONTENT).end();
    return;
  }

  console.time(`maybeFightsWithMeta${reportID}`);
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
  console.timeEnd(`maybeFightsWithMeta${reportID}`);

  const fightsWithMeta = maybeFightsWithMeta.filter(
    (fight): fight is FightWithMeta => fight !== null
  );

  if (fightsWithMeta.length === 0) {
    res.status(NO_CONTENT).end();
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

  console.time(`fightsCreateInput${reportID}`);
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
  console.timeEnd(`fightsCreateInput${reportID}`);

  console.time(`prisma.fight.create${reportID}`);
  await Promise.all(
    fightsCreateInput.map((data) =>
      prisma.fight.create({
        data,
      })
    )
  );
  console.timeEnd(`prisma.fight.create${reportID}`);

  const response: ReportResponse = {
    endTime,
    startTime,
    title,
    region,
    fights: fightsWithMeta.map((fight) => {
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
    }),
    affixes: fights[0].keystoneAffixes.map((affix) => {
      const { id, seasonal, ...data } = getAffixByID(affix);
      return data;
    }),
  };

  console.timeEnd(reportID);

  res.json(response);

  // const report = await ReportRepo.load(reportID);

  // if (report) {
  //   if (!maybeOngoingReport(report.endTime)) {
  //     // eslint-disable-next-line no-console
  //     console.info("[api/report] known & finished report");
  //     const { id: dbId, region, ...rest } = report;

  //     //   setCacheControl(res, CacheControl.ONE_MONTH);

  //     res.json({
  //       ...rest,
  //       reportID,
  //       region: region.slug,
  //     });
  //     return;
  //   }

  //   const rawReport = await wcl.report({ reportID });

  //   if (!rawReport) {
  //     // eslint-disable-next-line no-console
  //     console.info(
  //       "[api/report] known report - failed to load report from WCL"
  //     );

  //     const { id: dbId, region, ...rest } = report;

  //     //   setCacheControl(res, CacheControl.ONE_HOUR);

  //     res.json({
  //       ...rest,
  //       reportID,
  //       region: region.slug,
  //     });
  //     return;
  //   }

  //   await ReportRepo.upsert(reportID, rawReport);

  //   res.json({
  //     reportID,
  //     endTime: rawReport.endTime,
  //     startTime: rawReport.startTime,
  //     title: rawReport.title,
  //     region: rawReport.region.slug,
  //     fights: rawReport.fights,
  //   });
  //   return;
  // }

  // const rawReport = await wcl.report({ reportID });

  // if (!rawReport) {
  //   // eslint-disable-next-line no-console
  //   console.info(
  //     "[api/report] unknown report - failed to load report from WCL"
  //   );

  //   res.status(NO_CONTENT).end();
  //   return;
  // }

  // await ReportRepo.upsert(reportID, rawReport);

  // //   setCacheControl(
  // //     res,
  // //     maybeOngoingReport(rawReport.endTime)
  // //       ? CacheControl.ONE_HOUR
  // //       : CacheControl.ONE_MONTH
  // //   );

  // res.json({
  //   reportID,
  //   endTime: rawReport.endTime,
  //   startTime: rawReport.startTime,
  //   title: rawReport.title,
  //   region: rawReport.region.slug,
  //   fights: rawReport.fights,
  // });
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

export const reportHandler = nc()
  .get(createValidReportIDMiddleware("reportID"))
  .use(handler);
