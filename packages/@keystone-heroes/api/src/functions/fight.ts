import { dungeons } from "@keystone-heroes/db/data";
import { prisma } from "@keystone-heroes/db/prisma";
import type { Prisma } from "@keystone-heroes/db/prisma";
import type { PersistedDungeonPull } from "@keystone-heroes/db/wcl";
import { processEvents } from "@keystone-heroes/db/wcl";
import type { EventParams } from "@keystone-heroes/wcl/queries";
import {
  getPlayerDeathEvents,
  getDungeonSpecificEvents,
  getSeasonSpecificEvents,
  getAffixSpecificEvents,
  getRemarkableSpellCastEvents,
  getFightPulls,
} from "@keystone-heroes/wcl/queries";
import type { ReportMap } from "@keystone-heroes/wcl/types";
import nc from "next-connect";

import {
  createValidReportIDMiddleware,
  validFightIDMiddleware,
} from "../middleware";
import { BAD_REQUEST } from "../utils/statusCodes";
import type { RequestHandler } from "../utils/types";

// export type FightResponse = Pick<
//   Fight,
//   | "averageItemLevel"
//   | "chests"
//   | "dps"
//   | "dtps"
//   | "hps"
//   | "keystoneLevel"
//   | "keystoneTime"
//   | "totalDeaths"
//   | "fightID"
// > & {
//   dungeon: Dungeon & {
//     zones: Omit<Zone, "dungeonID" | "order">[];
//   };
//   affixes: Omit<Affix, "seasonal">[];
//   composition: Composition;
//   pulls: Pull[];
// };

// type Pull = Pick<
//   DungeonPull,
//   "x" | "y" | "startTime" | "endTime" | "boundingBox"
// > & {
//   events: (Omit<
//     Event,
//     | "pullID"
//     | "id"
//     | "sourceNPCID"
//     | "targetNPCID"
//     | "interruptedAbilityID"
//     | "abilityID"
//   > & {
//     sourceNPC: NPC | null;
//     targetNPC: NPC | null;
//     interruptedAbility: Ability | null;
//     ability: Ability | null;
//   })[];
//   zones: number[];
//   enemies: {
//     count: number;
//     npc: NPC;
//   }[];
// };

// type Composition = (Pick<
//   PrismaPlayer,
//   "dps" | "hps" | "deaths" | "itemLevel" | "actorID"
// > & {
//   playerID: PrismaPlayer["id"];
//   legendary: Legendary | null;
//   covenant: Pick<Covenant, "icon" | "name"> | null;
//   soulbind: Pick<Soulbind, "icon" | "name"> | null;
//   character: Pick<Character, "name"> & {
//     class: Class;
//     spec: Pick<Spec, "id" | "name">;
//     server: Pick<Server, "name">;
//   };
//   talents: (Omit<Talent, "guid" | "type" | "abilityIcon"> & {
//     id: number;
//     icon: string;
//   })[];
//   covenantTraits: Omit<CovenantTrait, "covenantID">[];
//   conduits: (Omit<Conduit, "guid" | "total"> & {
//     itemLevel: number;
//     id: number;
//   })[];
// })[];

// const extractQueryParams = (query: Required<Request["query"]>) => {
//   const { reportID, fightIDs } = query;

//   const ids = Array.isArray(fightIDs) ? fightIDs : [fightIDs];

//   return {
//     reportID,
//     fightIDs: ids.map((id) => Number.parseInt(id)),
//   };
// };

// const fightHandler: RequestHandler<Request, FightResponse[]> = async (
//   req,
//   res
// ) => {
//   if (!req.query.fightIDs) {
//     res.status(BAD_REQUEST).end();
//     return;
//   }

//   const { reportID, fightIDs } = extractQueryParams({
//     reportID: req.query.reportID,
//     fightIDs: req.query.fightIDs,
//   });

//   try {
//     const report = await ReportRepo.load(reportID);

//     if (!report) {
//       res.status(INTERNAL_SERVER_ERROR).end();
//       return;
//     }

//     // const ongoing = maybeOngoingReport(report.endTime);

//     const persistedFights = await FightRepo.loadFull(reportID, fightIDs);
//     const unseenFightIDs = fightIDs.filter(
//       (id) => !persistedFights.some((fight) => fight.fightID === id)
//     );

//     if (unseenFightIDs.length === 0) {
//       //   setCacheControl(
//       //     res,
//       //     ongoing ? CacheControl.ONE_MONTH : CacheControl.ONE_HOUR
//       //   );
//       res.json(persistedFights);
//       return;
//     }

//     const newFights = await wcl.fights({
//       reportID,
//       fightIDs: unseenFightIDs,
//     });

//     if (!newFights) {
//       // eslint-disable-next-line no-console
//       console.info(
//         `[api/fight] failed to load new fights from wcl for "${reportID}`
//       );

//       //   setCacheControl(res, CacheControl.ONE_HOUR);
//       res.json(persistedFights);
//       return;
//     }

//     if (newFights.length === 0) {
//       // eslint-disable-next-line no-console
//       console.info(`[api/fight] no new fights present for "${reportID}"`);

//       //   setCacheControl(
//       //     res,
//       //     ongoing ? CacheControl.ONE_HOUR : CacheControl.ONE_MONTH
//       //   );
//       res.json(persistedFights);
//       return;
//     }

//     const fightsWithTable = await enhanceFightsWithTable(reportID, newFights);
//     const fightsWithEvents = await enhanceFightsWithEvents(
//       reportID,
//       fightsWithTable
//     );

//     const insertableFights = fightsWithEvents.map<InsertableFight>((fight) => {
//       return {
//         id: fight.id,
//         startTime: fight.startTime,
//         endTime: fight.endTime,
//         keystoneLevel: fight.keystoneLevel,
//         keystoneTime: fight.keystoneTime,
//         chests: fight.keystoneBonus,
//         averageItemLevel: fight.averageItemLevel,
//         affixes: fight.keystoneAffixes,
//         dungeon: fight.gameZone.id,
//         totalDeaths: fight.table.deathEvents.length,
//         dps: calcMetricAverage(fight.keystoneTime, fight.table.damageDone),
//         dtps: calcMetricAverage(fight.keystoneTime, fight.table.damageTaken),
//         hps: calcMetricAverage(fight.keystoneTime, fight.table.healingDone),
//         pulls: fight.dungeonPulls.map<InsertableFight["pulls"][number]>(
//           (pull) => {
//             const eventsOfThisPull = fight.events.filter(
//               (event) =>
//                 event.timestamp >= pull.startTime &&
//                 event.timestamp <= pull.endTime
//             );

//             return {
//               startTime: pull.startTime,
//               endTime: pull.endTime,
//               x: pull.x,
//               y: pull.y,
//               maps: pull.maps,
//               events: eventsOfThisPull,
//               boundingBox: pull.boundingBox,
//               npcs: pull.enemyNPCs,
//             };
//           }
//         ),
//         composition: [
//           extractPlayerData(
//             fight.table.playerDetails.tanks[0],
//             fight.table,
//             fight.keystoneTime
//           ),
//           extractPlayerData(
//             fight.table.playerDetails.healers[0],
//             fight.table,
//             fight.keystoneTime
//           ),
//           extractPlayerData(
//             fight.table.playerDetails.dps[0],
//             fight.table,
//             fight.keystoneTime
//           ),
//           extractPlayerData(
//             fight.table.playerDetails.dps[1],
//             fight.table,
//             fight.keystoneTime
//           ),
//           extractPlayerData(
//             fight.table.playerDetails.dps[2],
//             fight.table,
//             fight.keystoneTime
//           ),
//         ],
//       };
//     });

//     if (insertableFights.length === 0) {
//       // eslint-disable-next-line no-console
//       console.info("[api/fight] no insertable fights found");

//       //   setCacheControl(
//       //     res,
//       //     ongoing ? CacheControl.ONE_HOUR : CacheControl.ONE_MONTH
//       //   );
//       res.json(persistedFights);
//       return;
//     }

//     const insertableFightsWithCharacterID =
//       await extendPlayersWithServerAndCharacterID(
//         report.region,
//         insertableFights
//       );

//     const allPlayers = insertableFightsWithCharacterID.flatMap(
//       (fight) => fight.composition
//     );

//     await Promise.all(
//       [
//         createLegendaries,
//         createConduits,
//         createTalents,
//         createCovenantTraits,
//       ].map((fn) => fn(allPlayers))
//     );

//     const fightsWithExtendedPlayers = await createFights(
//       report,
//       allPlayers,
//       insertableFightsWithCharacterID
//     );

//     const playersTODO_REFACTOR = fightsWithExtendedPlayers.flatMap(
//       (fight) => fight.composition
//     );

//     const actorPlayerMap = new Map(
//       fightsWithExtendedPlayers.flatMap((fight) =>
//         fight.composition.map((player) => [player.actorID, player.playerID])
//       )
//     );

//     await PullRepo.createMany(fightsWithExtendedPlayers, actorPlayerMap);

//     await Promise.all(
//       [
//         linkPlayerToConduits,
//         linkPlayerToTalents,
//         linkPlayerToCovenantTraits,
//       ].map((fn) => fn(playersTODO_REFACTOR))
//     );

//     const fullPersistedFights = await FightRepo.loadFull(
//       reportID,
//       unseenFightIDs
//     );

//     // setCacheControl(
//     //   res,
//     //   ongoing ? CacheControl.ONE_HOUR : CacheControl.ONE_MONTH
//     // );
//     res.json([...persistedFights, ...fullPersistedFights]);
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error(error);
//     res.json([]);
//   }
// };

type Request = {
  query: {
    reportID: string;
    fightID: string;
  };
};

export type Response = {};

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
    res.status(BAD_REQUEST).end();
    return;
  }

  if (maybeStoredFight.Pull.length === 0) {
    const maybeFightPulls = await getFightPulls({
      reportID,
      fightIDs: [maybeStoredFight.fightID],
    });

    if (!maybeFightPulls.reportData?.report?.fights?.[0]?.dungeonPulls) {
      res.status(BAD_REQUEST).end();
      return;
    }

    const dungeonPulls =
      maybeFightPulls.reportData.report.fights[0].dungeonPulls.reduce<
        Omit<PersistedDungeonPull, "id">[]
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
      res.status(BAD_REQUEST).end();
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

    const persistedPulls = await persistPulls(
      dungeonPulls,
      maybeStoredFight.id
    );

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

    const events = await Promise.all(
      maybeStoredFight.PlayerFight.map((playerFight) =>
        getRemarkableSpellCastEvents({
          ...params,
          sourceID: playerFight.player.actorID,
        })
      )
    );

    const playerDeathEvents = await getPlayerDeathEvents(params);
    const dungeonEvents = await getDungeonSpecificEvents(params);
    const affixEvents = await getAffixSpecificEvents(params);
    const seasonEvents = await getSeasonSpecificEvents(params);

    const allEvents = [
      ...events.flat(),
      ...playerDeathEvents,
      ...dungeonEvents,
      ...affixEvents,
      ...seasonEvents,
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
      data: "new",
    });
    return;
  }

  const { inCombatTime, outOfCombatTime } = calculateCombatTime(
    maybeStoredFight.keystoneTime,
    maybeStoredFight.Pull
  );

  res.json({ inCombatTime, outOfCombatTime, data: "old" });
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
  pulls: Omit<PersistedDungeonPull, "id">[]
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
