import type {
  Report,
  Region,
  PlayableClass,
  SpecName,
  Prisma,
  Affix,
  Dungeon,
  Fight as PrismaFight,
  Role,
} from "@prisma/client";
import type { Awaited, DeepRequired, DeepNonNullable } from "ts-essentials";

import { getAffixByID } from "../../db/data/affixes";
import { classMapByName } from "../../db/data/classes";
import { dungeonMap } from "../../db/data/dungeons";
import { specs as allSpecs } from "../../db/data/specs";
import { prisma } from "../../db/prisma";
import type {
  Conduit,
  CovenantTrait,
  LegendaryItem,
  Talent,
} from "../../wcl/queries";
import {
  getInitialReportData,
  getTableData,
  ItemQuality,
} from "../../wcl/queries";
import type { GameZone } from "../../wcl/types";
import { isValidReportId, maybeOngoingReport } from "../../wcl/utils";
import { MIN_KEYSTONE_LEVEL } from "../../web/env";
import { createTransaction, withSentry } from "../middleware";
import { sortByRole } from "../utils";
import {
  cacheControlKey,
  PUBLIC_FIVE_MINUTES,
  PUBLIC_ONE_YEAR_IMMUTABLE,
  PUBLIC_THIRTY_MINUTES,
  PUBLIC_TWO_MINUTES,
} from "../utils/cache";
import type { ReportHandlerErrorType } from "../utils/errors";
import {
  SERVICE_UNAVAILABLE,
  BAD_REQUEST,
  UNPROCESSABLE_ENTITY,
} from "../utils/statusCodes";

type Request = {
  query: {
    reportID?: string | string[];
  };
};

export type ReportSuccessResponse = Pick<Report, "title"> & {
  startTime: number;
  endTime: number;
  region: Region["slug"];
  fights: (Omit<
    FightWithMeta,
    "gameZone" | "player" | "startTime" | "endTime"
  > & {
    dungeon: Dungeon | null;
    player: (Pick<Player, "soulbindID" | "covenantID"> & {
      class: string;
      spec: string;
      legendaries: Pick<LegendaryItem, "id" | "effectIcon" | "effectName">[];
    })[];
  })[];
  affixes: Omit<Affix, "id" | "seasonal">[];
};

export type ReportErrorResponse = {
  error: ReportHandlerErrorType;
};

export type ReportResponse = ReportSuccessResponse | ReportErrorResponse;

type DeepNullablePath<T, P> = P extends []
  ? T
  : P extends [infer A, ...infer B]
  ? DeepNullablePath<NonNullable<T>[A & keyof NonNullable<T>] | undefined, B>
  : never;

type MaybeFight = DeepNullablePath<
  Awaited<ReturnType<typeof getInitialReportData>>,
  ["reportData", "report", "fights", number]
>;

type FightWithNullableRating = Omit<
  DeepNonNullable<DeepRequired<MaybeFight>>,
  "rating" | "__typename" | "gameZone"
> & {
  // must be separately validated to indicate different error
  rating: number | null;
  // separately validated in /api/fight
  gameZone: null | Pick<GameZone, "id">;
};

type Fight = Omit<
  DeepNonNullable<DeepRequired<MaybeFight>>,
  "gameZone" | "__typename"
> &
  Pick<FightWithNullableRating, "gameZone">;

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
  legendaries: LegendaryItem[];
  talents: Talent[];
  soulbindID: number | null;
  covenantID: number | null;
  covenantTraits: CovenantTrait[] | null;
  conduits: Conduit[];
  role: Role;
};

type FightWithMeta = Omit<
  Fight,
  "friendlyPlayers" | "maps" | "__typename" | "keystoneAffixes" | "maps"
> & {
  player: Player[];
};

export const fightIsFight = (fight: MaybeFight): fight is Fight => {
  return (
    typeof fight?.averageItemLevel === "number" &&
    typeof fight.keystoneBonus === "number" &&
    typeof fight.keystoneLevel === "number" &&
    typeof fight.keystoneTime === "number" &&
    Array.isArray(fight.friendlyPlayers) &&
    Array.isArray(fight.keystoneAffixes) &&
    Array.isArray(fight.maps) &&
    // broken gameZone is alright, will be fixed in /api/fight
    (fight.gameZone === null || typeof fight.gameZone?.id === "number")
  );
};

export const fightFulfillsKeystoneLevelRequirement = (fight: Fight): boolean =>
  fight.keystoneLevel >= MIN_KEYSTONE_LEVEL;

/**
 * Raider.io has a built-in threshold to allow keys that supposedly were
 * NOT in time to still count as the official Battle.net API reports values that
 * indicate the key was not timed, while the game DID treat it as timed.
 *
 * These two keys resulted in an upgraded key, yet the Battle.net API says they
 * weren't timed.
 * @see https://raider.io/mythic-plus-runs/season-sl-1-post/35005362-14-mists-of-tirna-scithe
 * @see https://raider.io/mythic-plus-runs/season-sl-1/33815946-22-theater-of-pain
 *
 * @see https://discord.com/channels/311861458847662081/311861458847662081/860180000178438183
 *
 * Beginning SL Season 2 WCL uses the rating increase to detect timing a key
 * @see https://discord.com/channels/180033360939319296/681904912090529801/860180670298980412
 */
export const fightIsTimedKeystone = (fight: Fight): fight is Fight => {
  if (!fight.gameZone) {
    // defer checking whether its a timed key to later
    return true;
  }

  const [timer] = dungeonMap[fight.gameZone.id].timer;

  // 1 second threshold included
  return timer >= fight.keystoneTime - 750;
};

export const fightHasFivePlayers = (fight: Fight): boolean =>
  fight.friendlyPlayers.length === 5;

const isCraftableShadowlandsLegendary = (id: number) => id !== 186_414;

export const createFightIsUnknownFilter = (
  persistedFightIDs: number[]
): ((fight: Fight) => boolean) => {
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

const removeImageFormat = (icon: string) => {
  if (!icon.includes(".")) {
    return icon;
  }

  const [name] = icon.split(".");

  return name;
};

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
  playerLegendaryCreateMany: Prisma.PlayerLegendaryCreateManyFightInput[];
};

const createManyPlayer = async (
  data: Player[],
  meta: {
    reportID: number;
    serverMap: Record<string, number>;
    characterMap: Record<string, number>;
  }
): Promise<CreateManyPlayerReturn> => {
  const playerCreateManyInput = data.reduce<Prisma.PlayerCreateManyInput[]>(
    (acc, dataset) => {
      const serverID = meta.serverMap[dataset.server];

      if (!serverID) {
        return acc;
      }

      const characterID =
        meta.characterMap[createCharacterKey({ name: dataset.name, serverID })];

      // sanity check - shouldnt happen
      if (!characterID) {
        return acc;
      }

      return [
        ...acc,
        {
          actorID: dataset.actorID,
          dps: dataset.dps,
          hps: dataset.hps,
          deaths: dataset.deaths,
          itemLevel: dataset.itemLevel,
          characterID,
          reportID: meta.reportID,
          specID: dataset.specID,
          covenantID: dataset.covenantID ? dataset.covenantID : null,
          soulbindID: dataset.soulbindID ? dataset.soulbindID : null,
        },
      ];
    },
    []
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

  const dataWithPlayerID = data.reduce<(Player & { playerID: number })[]>(
    (acc, dataset) => {
      const serverID = meta.serverMap[dataset.server];

      if (!serverID) {
        return acc;
      }

      const characterID =
        meta.characterMap[createCharacterKey({ name: dataset.name, serverID })];

      // sanity check - shouldnt happen
      if (!characterID) {
        return acc;
      }

      const match = createdPlayers.find(
        (player) => player.characterID === characterID
      );

      if (!match) {
        return acc;
      }

      return [...acc, { ...dataset, playerID: match.id }];
    },
    []
  );

  const playerIDs = createdPlayers.map((dataset) => {
    return {
      playerID: dataset.id,
    };
  });

  const playerTalentCreateMany = dataWithPlayerID.flatMap((player) =>
    player.talents.map<Prisma.PlayerTalentCreateManyFightInput>((talent) => {
      return {
        talentID: talent.guid,
        playerID: player.playerID,
      };
    })
  );

  const playerConduitCreateMany = dataWithPlayerID.flatMap((player) => {
    if (player.covenantID && player.covenantTraits) {
      return player.conduits.map<Prisma.PlayerConduitCreateManyFightInput>(
        (conduit) => {
          return {
            itemLevel: conduit.total,
            conduitID: conduit.guid,
            playerID: player.playerID,
          };
        }
      );
    }

    return [];
  });

  const playerCovenantTraitCreateMany = dataWithPlayerID.flatMap((player) => {
    if (player.covenantID && player.covenantTraits) {
      return player.covenantTraits.map<Prisma.PlayerCovenantTraitCreateManyFightInput>(
        (trait) => {
          return {
            covenantTraitID: trait.guid,
            playerID: player.playerID,
          };
        }
      );
    }

    return [];
  });

  const playerLegendaryCreateMany = dataWithPlayerID.flatMap((player) => {
    return player.legendaries
      .filter((legendary) => isCraftableShadowlandsLegendary(legendary.id))
      .map<Prisma.PlayerLegendaryCreateManyFightInput>((legendary) => {
        return {
          playerID: player.playerID,
          legendaryID: legendary.effectID,
        };
      });
  });

  return {
    playerIDs,
    playerTalentCreateMany,
    playerConduitCreateMany,
    playerCovenantTraitCreateMany,
    playerLegendaryCreateMany,
  };
};

type RawReport = {
  id: number;
  startTime: Date;
  endTime: Date;
  title: string;
  region: {
    slug: string;
  };
  Fight: (Pick<
    PrismaFight,
    | "fightID"
    | "averageItemLevel"
    | "chests"
    | "keystoneLevel"
    | "keystoneTime"
    | "dps"
    | "hps"
    | "totalDeaths"
    | "rating"
  > & {
    dungeon: Dungeon | null;
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
        PlayerLegendary: {
          legendary: Pick<
            LegendaryItem,
            "id" | "effectIcon" | "effectName"
          > | null;
        }[];
      };
    }[];
  })[];
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

export const createResponseFromDB = (
  existingReport: NonNullable<RawReport>
): ReportSuccessResponse => {
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
              legendaries: player.PlayerLegendary.reduce<
                ReportSuccessResponse["fights"][number]["player"][number]["legendaries"]
              >((acc, playerLegendary) => {
                return playerLegendary.legendary
                  ? [...acc, playerLegendary.legendary]
                  : acc;
              }, []),
              class: player.character.class.name,
              spec: player.spec.name,
              covenantID: player.covenant ? player.covenant.id : null,
              soulbindID: player.soulbind ? player.soulbind.id : null,
            };
          }),
        averageItemLevel: fight.averageItemLevel,
        hps: fight.hps,
        dps: fight.dps,
        keystoneLevel: fight.keystoneLevel,
        keystoneTime: fight.keystoneTime,
        totalDeaths: fight.totalDeaths,
        keystoneBonus: fight.chests,
        dungeon: fight.dungeon,
        rating: fight.rating ?? 0,
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
}: RawData): ReportSuccessResponse => {
  return {
    endTime,
    startTime,
    title,
    region,
    fights: fightsWithMeta
      .map((fight) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                  slug: dungeon.slug,
                }
              : null,
          player: [...player]
            .sort((a, b) => sortByRole(a.role, b.role))
            .map((player) => {
              return {
                class: player.class,
                spec: player.spec,
                soulbindID: player.soulbindID,
                covenantID: player.covenantID,
                legendaries: player.legendaries.map((legendary) => ({
                  id: legendary.id,
                  effectIcon: legendary.effectIcon,
                  effectName: legendary.effectName,
                })),
              };
            }),
        };
      })
      .sort((a, b) => a.id - b.id),
    affixes: affixes.map((affix) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, seasonal, ...data } = getAffixByID(affix);
      return data;
    }),
  };
};

export const loadExistingReport = async (
  reportID: string
): Promise<RawReport> => {
  return prisma.report.findFirst({
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
      id: true,
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
          totalDeaths: true,
          rating: true,
          dungeon: {
            select: {
              name: true,
              time: true,
              id: true,
              slug: true,
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
                  PlayerLegendary: {
                    select: {
                      legendary: {
                        select: {
                          id: true,
                          effectIcon: true,
                          effectName: true,
                        },
                      },
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
};

export const reportHandler = withSentry<Request, ReportResponse>(
  async (req, res) => {
    if (
      !req.query.reportID ||
      Array.isArray(req.query.reportID) ||
      !isValidReportId(req.query.reportID)
    ) {
      res.status(BAD_REQUEST).end();
      return;
    }

    const { reportID } = req.query;
    const transaction = createTransaction(`/api/report?reportID=${reportID}`, {
      reportID,
    });

    const existingReport = await loadExistingReport(reportID);

    if (
      existingReport &&
      !maybeOngoingReport(existingReport.endTime.getTime())
    ) {
      transaction.setHttpStatus(200);
      transaction.finish();

      res.setHeader(cacheControlKey, PUBLIC_ONE_YEAR_IMMUTABLE);
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
      transaction.setHttpStatus(SERVICE_UNAVAILABLE);
      transaction.finish();

      res.setHeader(cacheControlKey, PUBLIC_FIVE_MINUTES);
      res.status(SERVICE_UNAVAILABLE).json({
        error: "BROKEN_LOG_OR_WCL_UNAVAILABLE",
      });
      return;
    }

    // empty report
    if (
      report.reportData.report.fights.length === 0 ||
      report.reportData.report.startTime === report.reportData.report.endTime
    ) {
      transaction.setHttpStatus(UNPROCESSABLE_ENTITY);
      transaction.finish();

      res.setHeader(cacheControlKey, PUBLIC_TWO_MINUTES);

      res.status(UNPROCESSABLE_ENTITY).json({
        error: "EMPTY_LOG",
      });
      return;
    }

    const {
      startTime,
      endTime,
      title,
      region: { slug: region },
    } = report.reportData.report;
    const persistedFightIDs = getFightIDsOfExistingReport(existingReport);
    const fightIsUnknown = createFightIsUnknownFilter(persistedFightIDs);

    const fights = report.reportData.report.fights.reduce<Fight[]>(
      (acc, fight) => {
        if (
          fightIsFight(fight) &&
          fightHasFivePlayers(fight) &&
          fightFulfillsKeystoneLevelRequirement(fight) &&
          fightIsUnknown(fight)
        ) {
          if (!fight.gameZone || fight.gameZone.id in dungeonMap) {
            return [...acc, fight];
          }

          const fightMaps = new Set(fight.maps.map((map) => map.id));

          // report K9Mfcb2CtjZ7pX6q contains zone 2222 as starting point, however
          // via .maps property its clear its the SD21 in the log, which is 2296
          const match = Object.entries(dungeonMap).find(([_, dungeon]) => {
            return dungeon.zones.every((zone) => fightMaps.has(zone.id));
          });

          if (!match) {
            return acc;
          }

          const fixedFight: Fight = {
            ...fight,
            gameZone: {
              id: Number.parseInt(match[0]),
            },
          };

          return [...acc, fixedFight];
        }

        return acc;
      },
      []
    );

    // no valid (new) fights found
    if (fights.length === 0) {
      // maybeOngoingFight === true
      if (existingReport && persistedFightIDs.length > 0) {
        transaction.setHttpStatus(200);
        transaction.finish();

        res.setHeader(cacheControlKey, PUBLIC_TWO_MINUTES);
        res.json(createResponseFromDB(existingReport));
        return;
      }

      transaction.setHttpStatus(BAD_REQUEST);
      transaction.finish();

      res.setHeader(cacheControlKey, PUBLIC_TWO_MINUTES);
      res.status(BAD_REQUEST).json({
        error: "NO_TIMED_KEYS",
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

        const {
          friendlyPlayers,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          keystoneAffixes,
          maps,
          averageItemLevel,
          ...rest
        } = fight;
        const { damageDone, healingDone, deathEvents } =
          table.reportData.report.table.data;
        const playerDetails = Object.values(
          table.reportData.report.table.data.playerDetails
        ).flat();
        const keystoneTimeInSeconds = fight.keystoneTime / 1000;

        const player = friendlyPlayers.reduce<Player[]>((acc, id) => {
          const characterOrEventMatchesID = <T extends { id: number }>(
            dataset: T
          ) => dataset.id === id;

          const damageDoneMatch = damageDone.find(characterOrEventMatchesID);
          const healingDoneMatch = healingDone.find(characterOrEventMatchesID);
          const detailsMatch = playerDetails.find(characterOrEventMatchesID);

          if (!damageDoneMatch || !healingDoneMatch || !detailsMatch) {
            return acc;
          }

          const {
            specs,
            combatantInfo,
            type,
            server = "Anonymous",
            maxItemLevel,
            name,
          } = detailsMatch;

          const classID = classMapByName[type];
          const spec = allSpecs.find(
            (spec) => spec.classID === classID && spec.name === specs[0]
          );

          if (!spec) {
            return acc;
          }

          const deaths = deathEvents.filter(characterOrEventMatchesID);
          const dps = Math.round(damageDoneMatch.total / keystoneTimeInSeconds);
          const hps = Math.round(
            healingDoneMatch.total / keystoneTimeInSeconds
          );

          const secureFields = {
            name,
            server,
            class: type,
            spec: specs[0],
            classID,
            specID: spec.id,
            role: spec.role,
            dps,
            hps,
            deaths: deaths.length,
            itemLevel: maxItemLevel,
            actorID: id,
            legendaries: [],
          };

          if (Array.isArray(combatantInfo)) {
            return [
              ...acc,
              {
                ...secureFields,
                legendary: null,
                covenantID: null,
                soulbindID: null,
                covenantTraits: null,
                conduits: [],
                talents: [],
              },
            ];
          }

          const legendaries =
            combatantInfo.gear.filter(
              (item): item is LegendaryItem =>
                item.quality === ItemQuality.LEGENDARY
            ) ?? null;
          const covenantID = combatantInfo.covenantID ?? null;
          const soulbindID = combatantInfo.soulbindID ?? null;
          const covenantTraits = covenantID
            ? (combatantInfo.artifact ?? combatantInfo.customPowerSet).filter(
                (talent) => talent.guid !== 0
              )
            : null;

          return [
            ...acc,
            {
              ...secureFields,
              talents: combatantInfo.talents,
              conduits:
                combatantInfo.heartOfAzeroth ??
                combatantInfo.secondaryCustomPowerSet,
              legendaries,
              soulbindID,
              covenantID,
              covenantTraits,
            },
          ];
        }, []);

        if (player.length !== 5) {
          return null;
        }

        const normalizedAverageItemLevel = Number.parseFloat(
          averageItemLevel.toFixed(2)
        );
        const uniqueMaps = [...new Set(maps.map((map) => map.id))];

        return {
          ...rest,
          player,
          averageItemLevel: normalizedAverageItemLevel,
          maps: uniqueMaps,
        };
      })
    );

    const fightsWithMeta = maybeFightsWithMeta.filter(
      (fight): fight is FightWithMeta => fight !== null
    );

    if (fightsWithMeta.length === 0) {
      transaction.setHttpStatus(SERVICE_UNAVAILABLE);
      transaction.finish();

      res.setHeader(cacheControlKey, PUBLIC_FIVE_MINUTES);
      res.status(SERVICE_UNAVAILABLE).json({
        error: "SECONDARY_REQUEST_FAILED",
      });
      return;
    }

    const internalReportID = await determineReportID(
      existingReport,
      fights[0],
      {
        endTime: new Date(endTime),
        startTime: new Date(startTime),
        title,
        report: reportID,
        region,
      }
    );

    const allPlayer = fightsWithMeta.flatMap((fight) => fight.player);

    const conduitCreateMany: Prisma.ConduitCreateManyInput[] =
      allPlayer.flatMap((player) =>
        player.conduits.map((conduit) => {
          return {
            id: conduit.guid,
            name: conduit.name,
            icon: removeImageFormat(conduit.abilityIcon),
          };
        })
      );

    const talentCreateMany: Prisma.TalentCreateManyInput[] = allPlayer.flatMap(
      (player) =>
        player.talents.map((talent) => {
          return {
            id: talent.guid,
            name: talent.name,
            icon: removeImageFormat(talent.abilityIcon),
            classID: player.classID,
            specID: player.specID,
          };
        })
    );

    const covenantTraitCreateMany: Prisma.CovenantTraitCreateManyInput[] =
      allPlayer
        .filter(
          (
            dataset
          ): dataset is Omit<Player, "covenantTraits"> & {
            covenantTraits: CovenantTrait[];
            covenantID: number;
          } => {
            return (
              dataset.covenantTraits !== null && dataset.covenantID !== null
            );
          }
        )
        .flatMap((dataset) => {
          return dataset.covenantTraits.map((trait) => {
            return {
              id: trait.guid,
              name: trait.name,
              icon: removeImageFormat(trait.abilityIcon),
              covenantID: dataset.covenantID,
            };
          });
        });

    const legendariesCreateMany: Prisma.LegendaryCreateManyInput[] =
      allPlayer.flatMap((player) =>
        player.legendaries
          .filter((legendary) => isCraftableShadowlandsLegendary(legendary.id))
          .map((legendary) => {
            return {
              id: legendary.effectID,
              effectIcon: removeImageFormat(legendary.effectIcon),
              itemID: legendary.id,
              effectName: legendary.effectName ?? "Unknown Legendary",
            };
          })
      );

    await prisma.conduit.createMany({
      skipDuplicates: true,
      data: conduitCreateMany,
    });

    await prisma.talent.createMany({
      skipDuplicates: true,
      data: talentCreateMany,
    });

    await prisma.covenantTrait.createMany({
      skipDuplicates: true,
      data: covenantTraitCreateMany,
    });

    await prisma.legendary.createMany({
      skipDuplicates: true,
      data: legendariesCreateMany,
    });

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
          playerLegendaryCreateMany,
        } = await createManyPlayer(fight.player, {
          reportID: internalReportID,
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
          averageItemLevel: fight.averageItemLevel,
          chests: fight.keystoneBonus,
          fightID: fight.id,
          keystoneLevel: fight.keystoneLevel,
          keystoneTime: fight.keystoneTime,
          rating: fight.rating ?? 0,
          dps: fight.player.reduce((acc, player) => acc + player.dps, 0),
          hps: fight.player.reduce((acc, player) => acc + player.hps, 0),
          totalDeaths: fight.player.reduce(
            (acc, player) => acc + player.deaths,
            0
          ),
          percent: 0,
          Report: {
            connect: {
              id: internalReportID,
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
          PlayerLegendary: {
            createMany: {
              data: playerLegendaryCreateMany,
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

    const previouslyStoredReports = existingReport
      ? createResponseFromDB(existingReport).fights
      : [];
    const response = createResponseFromRawData({
      endTime,
      startTime,
      title,
      region,
      fightsWithMeta,
      affixes: fights[0].keystoneAffixes,
    });

    transaction.setHttpStatus(200);
    transaction.finish();

    res.setHeader(cacheControlKey, PUBLIC_THIRTY_MINUTES);

    res.json({
      ...response,
      fights: [...previouslyStoredReports, ...response.fights],
    });
  }
);

const determineReportID = async (
  existingReport: RawReport,
  { keystoneAffixes }: Fight,
  {
    endTime,
    region,
    report,
    startTime,
    title,
  }: Pick<
    Prisma.ReportCreateInput,
    "startTime" | "endTime" | "report" | "title"
  > & { region: string }
) => {
  if (existingReport) {
    return Promise.resolve(existingReport.id);
  }

  const weekID = await findWeekByAffixes(keystoneAffixes);

  const reportCreateInput: Prisma.ReportCreateInput = {
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    report,
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
        id: weekID,
      },
    },
  };

  const createdReport = await prisma.report.create({
    data: reportCreateInput,
    select: { id: true },
  });

  return createdReport.id;
};

const findWeekByAffixes = async ([
  affix1ID,
  affix2ID,
  affix3ID,
  seasonalAffixID,
]: number[]): Promise<number> => {
  const existingWeek = await prisma.week.findFirst({
    where: {
      affix1: {
        id: affix1ID,
      },
      affix2: {
        id: affix2ID,
      },
      affix3: {
        id: affix3ID,
      },
      season: {
        affixID: seasonalAffixID,
      },
    },
    select: {
      id: true,
    },
  });

  if (!existingWeek) {
    const latestSeason = await prisma.season.findFirst({
      where: {
        id: {
          gt: 1,
        },
      },
      orderBy: {
        id: "desc",
      },
      take: 1,
      select: {
        id: true,
      },
    });

    if (!latestSeason) {
      throw new Error("no season found");
    }

    const lastSeasonWeek = await prisma.week.findFirst({
      where: {
        seasonWeekID: {
          gte: 0,
        },
        seasonID: latestSeason.id,
      },
      orderBy: {
        seasonWeekID: "desc",
      },
      take: 1,
      select: {
        seasonWeekID: true,
        id: true,
      },
    });

    const nextSeasonWeekID = (lastSeasonWeek?.seasonWeekID ?? -1) + 1;
    const nextID = (lastSeasonWeek?.id ?? 0) + 1;

    const newWeek = await prisma.week.create({
      data: {
        id: nextID,
        affix1ID,
        affix2ID,
        affix3ID,
        seasonID: latestSeason.id,
        seasonWeekID: nextSeasonWeekID,
      },
      select: {
        id: true,
      },
    });

    return newWeek.id;
  }

  return existingWeek.id;
};
