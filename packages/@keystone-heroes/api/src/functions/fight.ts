import { dungeons } from "@keystone-heroes/db/data";
import { prisma } from "@keystone-heroes/db/prisma";
import type { Prisma } from "@keystone-heroes/db/types";
import {
  getPlayerDeathEvents,
  getDungeonSpecificEvents,
  getSeasonSpecificEvents,
  getAffixSpecificEvents,
  getRemarkableSpellCastEvents,
  getFightPulls,
  processEvents,
  getInvisibilityUsage,
  getEngineeringBattleRezCastEvents,
} from "@keystone-heroes/wcl";
import type {
  PersistedDungeonPull,
  EventParams,
  ReportMap,
} from "@keystone-heroes/wcl";
import nc from "next-connect";

import {
  createValidReportIDMiddleware,
  validFightIDMiddleware,
} from "../middleware";
import {
  BAD_REQUEST,
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
} from "../utils/statusCodes";
import type { RequestHandler } from "../utils/types";
import { reportHandlerError } from "./report";

type Request = {
  query: {
    reportID: string;
    fightID: string;
  };
};

export type Response =
  | {
      error: typeof fightHandlerError[keyof typeof fightHandlerError];
    }
  | (ReturnType<typeof calculateCombatTime> & {});

export const fightHandlerError = {
  UNKNOWN_REPORT: "Unknown report.",
  BROKEN_LOG_OR_WCL_UNAVAILABLE:
    reportHandlerError.BROKEN_LOG_OR_WCL_UNAVAILABLE,
  MISSING_DUNGEON:
    "This fight appears to be broken and could not successfully be linked to a specific dungeon.",
} as const;

const handler: RequestHandler<Request, Response> = async (req, res) => {
  const { reportID } = req.query;
  const fightID = Number.parseInt(req.query.fightID);

  const maybeStoredFight = await prisma.fight.findFirst({
    where: {
      Report: {
        report: reportID,
      },
      fightID,
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      fightID: true,
      dungeon: {
        select: {
          name: true,
          time: true,
          id: true,
          Zone: {
            select: {
              id: true,
              name: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      chests: true,
      keystoneLevel: true,
      keystoneTime: true,
      PlayerFight: {
        select: {
          player: {
            select: {
              id: true,
              spec: {
                select: {
                  name: true,
                  role: true,
                },
              },
              legendary: {
                select: {
                  effectIcon: true,
                  effectName: true,
                  id: true,
                  itemID: true,
                },
              },
              PlayerConduit: {
                select: {
                  itemLevel: true,
                  conduit: {
                    select: {
                      icon: true,
                      name: true,
                    },
                  },
                },
              },
              PlayerCovenantTrait: {
                select: {
                  covenantTrait: {
                    select: {
                      icon: true,
                      name: true,
                    },
                  },
                },
              },
              PlayerTalent: {
                select: {
                  talent: {
                    select: {
                      icon: true,
                      name: true,
                    },
                  },
                },
              },
              actorID: true,
              deaths: true,
              dps: true,
              hps: true,
              itemLevel: true,
              covenant: {
                select: {
                  name: true,
                  icon: true,
                },
              },
              soulbind: {
                select: {
                  name: true,
                  icon: true,
                },
              },
              character: {
                select: {
                  name: true,
                  class: {
                    select: {
                      name: true,
                    },
                  },
                  server: {
                    select: {
                      id: true,
                      name: true,
                      region: {
                        select: {
                          id: true,
                          slug: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      dps: true,
      dtps: true,
      hps: true,
      totalDeaths: true,
      averageItemLevel: true,
      Pull: {
        orderBy: {
          startTime: "asc",
        },
        select: {
          startTime: true,
          endTime: true,
          x: true,
          y: true,
          minX: true,
          maxX: true,
          minY: true,
          maxY: true,
          isWipe: true,
          Event: {
            select: {
              eventType: true,
              timestamp: true,
              sourcePlayerID: true,
              targetPlayerID: true,
              sourceNPCInstance: true,
              targetNPCInstance: true,
              damage: true,
              healingDone: true,
              stacks: true,
              ability: true,
              interruptedAbility: true,
              sourceNPC: true,
              targetNPC: true,
            },
            orderBy: {
              timestamp: "asc",
            },
          },
          PullZone: {
            select: {
              zone: {
                select: {
                  id: true,
                },
              },
            },
          },
          PullNPC: {
            select: {
              count: true,
              npc: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      Report: {
        select: {
          id: true,
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
      },
    },
  });

  if (!maybeStoredFight) {
    res.status(NOT_FOUND).json({ error: fightHandlerError.UNKNOWN_REPORT });
    return;
  }

  if (maybeStoredFight.Pull.length === 0) {
    const maybeFightPulls = await getFightPulls({
      reportID,
      fightIDs: [maybeStoredFight.fightID],
    });

    if (!maybeFightPulls.reportData?.report?.fights?.[0]?.dungeonPulls) {
      res.status(BAD_REQUEST).end({
        error: fightHandlerError.BROKEN_LOG_OR_WCL_UNAVAILABLE,
      });
      return;
    }

    const dungeonPulls =
      maybeFightPulls.reportData.report.fights[0].dungeonPulls.reduce<
        Omit<PersistedDungeonPull, "id" | "isWipe">[]
      >((acc, pull) => {
        if (!pull || !pull.maps || !pull.enemyNPCs || !pull.boundingBox) {
          return acc;
        }

        const maps = pull.maps
          .filter((map): map is ReportMap => map !== null)
          .map((map) => map.id);

        if (maps.length === 0) {
          return acc;
        }

        const enemyNPCs = pull.enemyNPCs.filter(
          (
            enemyNPC
          ): enemyNPC is Omit<
            PersistedDungeonPull,
            "id"
          >["enemyNPCs"][number] => enemyNPC !== null
        );

        if (enemyNPCs.length === 0) {
          return acc;
        }

        return [
          ...acc,
          {
            x: pull.x,
            y: pull.y,
            startTime: pull.startTime,
            endTime: pull.endTime,
            maps,
            boundingBox: pull.boundingBox,
            enemyNPCs,
          },
        ];
      }, []);

    const dungeonID = ensureCorrectDungeonID(
      maybeStoredFight.dungeon,
      dungeonPulls
    );

    if (!dungeonID) {
      res.status(UNPROCESSABLE_ENTITY).end({
        error: fightHandlerError.MISSING_DUNGEON,
      });
      return;
    }

    if (dungeonID !== maybeStoredFight.dungeon?.id) {
      await prisma.fight.update({
        data: {
          dungeonID,
        },
        where: {
          fightID_reportID: {
            reportID: maybeStoredFight.Report.id,
            fightID: maybeStoredFight.fightID,
          },
        },
      });
    }

    const params: EventParams = {
      reportID,
      startTime: maybeStoredFight.startTime,
      endTime: maybeStoredFight.endTime,
      fightID: maybeStoredFight.fightID,
      dungeonID,
      affixes: [
        maybeStoredFight.Report.week.affix1.name,
        maybeStoredFight.Report.week.affix2.name,
        maybeStoredFight.Report.week.affix3.name,
        maybeStoredFight.Report.week.season.affix.name,
      ],
    };

    const playerDeathEvents = await getPlayerDeathEvents(params);
    const hasNoWipes = playerDeathEvents.length < 5;

    const pullsWithWipes = dungeonPulls.map<Omit<PersistedDungeonPull, "id">>(
      (pull) => {
        if (hasNoWipes) {
          return { ...pull, isWipe: false };
        }

        const deathsDuringThisPull = playerDeathEvents.filter(
          (event) =>
            event.timestamp >= pull.startTime && event.timestamp <= pull.endTime
        );

        if (deathsDuringThisPull.length === 0) {
          return { ...pull, isWipe: false };
        }

        const fiveDifferentPlayersHaveDied =
          [...new Set(deathsDuringThisPull.map((event) => event.targetID))]
            .length === 5;

        return {
          ...pull,
          isWipe: fiveDifferentPlayersHaveDied,
        };
      }
    );

    const persistedPulls = await persistPulls(
      pullsWithWipes,
      maybeStoredFight.id
    );

    const playerActorIDs = new Set(
      maybeStoredFight.PlayerFight.map(
        (playerFight) => playerFight.player.actorID
      )
    );

    const events = await getRemarkableSpellCastEvents(params, playerActorIDs);
    const dungeonEvents = await getDungeonSpecificEvents(params);
    const affixEvents = await getAffixSpecificEvents(params);
    const seasonEvents = await getSeasonSpecificEvents(params);
    const invisibilityEvents = await getInvisibilityUsage(params);
    const engineeringBattleRezEvents =
      playerDeathEvents.length > 0
        ? await getEngineeringBattleRezCastEvents(params)
        : [];

    const allEvents = [
      ...events,
      ...playerDeathEvents,
      ...dungeonEvents,
      ...affixEvents,
      ...seasonEvents,
      ...invisibilityEvents,
      ...engineeringBattleRezEvents,
    ].sort((a, b) => a.timestamp - b.timestamp);

    const persistableMaps =
      persistedPulls.flatMap<Prisma.PullZoneCreateManyInput>((pull) => {
        return pull.maps.map((map) => {
          return {
            pullID: pull.id,
            zoneID: map,
          };
        });
      });

    const persistableNPCs =
      persistedPulls.flatMap<Prisma.PullNPCCreateManyInput>((pull) => {
        return pull.enemyNPCs.map((npc) => {
          return {
            npcID: npc.gameID,
            count: npc.maximumInstanceID,
            pullID: pull.id,
          };
        });
      });

    const actorPlayerMap = new Map(
      maybeStoredFight.PlayerFight.map((playerFight) => [
        playerFight.player.actorID,
        playerFight.player.id,
      ])
    );

    const persistablePullEvents = persistedPulls.flatMap((pull) => {
      const thisPullsEvents = allEvents.filter(
        (event) =>
          event.timestamp >= pull.startTime && event.timestamp <= pull.endTime
      );

      const processedEvents = processEvents(
        pull,
        thisPullsEvents,
        actorPlayerMap
      );

      return processedEvents.map<Prisma.EventCreateManyInput>((event) => {
        return {
          ...event,
          pullID: pull.id,
        };
      });
    });

    await prisma.$transaction([
      prisma.pullZone.createMany({
        skipDuplicates: true,
        data: persistableMaps,
      }),
      prisma.pullNPC.createMany({
        skipDuplicates: true,
        data: persistableNPCs,
      }),
      prisma.event.createMany({
        skipDuplicates: true,
        data: persistablePullEvents,
      }),
    ]);

    const { inCombatTime, outOfCombatTime } = calculateCombatTime(
      maybeStoredFight.keystoneTime,
      dungeonPulls
    );

    res.json({
      inCombatTime,
      outOfCombatTime,
    });
    return;
  }

  const { inCombatTime, outOfCombatTime } = calculateCombatTime(
    maybeStoredFight.keystoneTime,
    maybeStoredFight.Pull
  );

  res.json({ inCombatTime, outOfCombatTime });
};

const ensureCorrectDungeonID = (
  storedDungeon: {
    Zone: {
      id: number;
      name: string;
    }[];
    id: number;
    name: string;
    time: number;
  } | null,
  pulls: Omit<PersistedDungeonPull, "id" | "isWipe">[]
) => {
  const allNPCIDs = new Set(
    pulls.flatMap((pull) => pull.enemyNPCs.map((npc) => npc.gameID))
  );

  const matchingDungeon = dungeons.find((dungeon) =>
    dungeon.bossIDs.every((bossID) => allNPCIDs.has(bossID))
  );

  if (matchingDungeon) {
    // some fights report the wrong zone
    // e.g. PhjZq1LBkf98bvx3/#fight=7 being NW showing up as SoA
    if (storedDungeon?.id === matchingDungeon.id) {
      return storedDungeon.id;
    }

    // some fights do not have a gameZone at all due to the log missing
    // the `zone_change` event
    // see https://discord.com/channels/180033360939319296/427632146019123201/836585255930429460
    return matchingDungeon.id;
  }

  return null;
};

const persistPulls = async (
  dungeonPulls: Omit<PersistedDungeonPull, "id">[],
  fightID: number
): Promise<PersistedDungeonPull[]> => {
  const pulls = dungeonPulls.map<Prisma.PullCreateManyInput>((pull) => {
    return {
      startTime: pull.startTime,
      endTime: pull.endTime,
      x: pull.x,
      y: pull.y,
      minX: pull.boundingBox.minX,
      maxX: pull.boundingBox.maxX,
      minY: pull.boundingBox.minY,
      maxY: pull.boundingBox.maxY,
      fightID,
      isWipe: pull.isWipe,
    };
  });

  await prisma.pull.createMany({
    skipDuplicates: true,
    data: pulls,
  });

  const storedPulls = await prisma.pull.findMany({
    where: {
      OR: pulls,
    },
    select: {
      startTime: true,
      endTime: true,
      id: true,
    },
  });

  return dungeonPulls
    .map<PersistedDungeonPull | null>((pull) => {
      const match = storedPulls.find(
        (storedPull) =>
          storedPull.startTime === pull.startTime &&
          storedPull.endTime === pull.endTime
      );

      if (!match) {
        return null;
      }

      return {
        ...pull,
        id: match.id,
      };
    })
    .filter((pull): pull is PersistedDungeonPull => pull !== null);
};

const calculateCombatTime = <
  Pull extends { startTime: number; endTime: number }
>(
  keystoneTime: number,
  pulls: Pull[]
) => {
  const outOfCombatTime = pulls.reduce((acc, pull) => {
    return acc - (pull.endTime - pull.startTime);
  }, keystoneTime);

  return {
    inCombatTime: keystoneTime - outOfCombatTime,
    outOfCombatTime,
  };
};

export const fightHandler = nc()
  .get(createValidReportIDMiddleware("reportID"))
  .get(validFightIDMiddleware)
  .get(handler);
