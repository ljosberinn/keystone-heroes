import { DungeonIDs, dungeons } from "@keystone-heroes/db/data";
import { Affixes, prisma } from "@keystone-heroes/db/prisma";
import {
  getBolsteringEvents,
  getBurstingDamageTakenEvents,
  getExplosiveDamageTakenEvents,
  getExplosiveKillEvents,
  getGrievousDamageTakenEvents,
  getManifestationOfPrideDeathEvents,
  getManifestationOfPrideSourceID,
  getNecroticDamageTakenEvents,
  getNecroticWakeKyrianOrbDamageEvents,
  getNecroticWakeKyrianOrbHealEvents,
  getPFSlimeKills,
  getPlayerDeathEvents,
  getQuakingDamageTakenEvents,
  getQuakingInterruptEvents,
  getSanguineDamageTakenEvents,
  getSanguineHealingDoneEvents,
  getSpitefulDamageTakenEvents,
  getStormingDamageTakenEvents,
  getVolcanicDamageTakenEvents,
  getDamageDoneToManifestationOfPrideEvents,
  getDamageTakenByManifestatioNOfPrideEvents,
  getBitingColdDamageTakenEvents,
  getBottleOfSanguineIchorDamageEvents,
  getBottleOfSanguineIchorHealEvents,
  getDeOtherSideUrnUsage,
  getDecapitateDamageTakenEvents,
  getSanguineDepthsBuffEvents,
  getSanguineDepthsLanternUsages,
  getNecroticWakeHammerUsage,
  getNecroticWakeOrbUsage,
  getNecroticWakeSpearUsage,
  getSpiresOfAscensionSpearUsage,
  getHallsOfAtonementGargoyleCharms,
  getFifthSkullDamageEvents,
  getFrostLanceDamageTakenEvents,
  getSoulforgeFlamesDamageTakenEvents,
  getMassiveSmashDamageTakenEvents,
  getRazeDamageTakenEvents,
  getStoneWardHealEvents,
  getStygianKingsBarbsDamageEvents,
  getVolcanicPlumeDamageDoneEvents,
  getTheaterOfPainBannerUsage,
  getHighestNecroticStackAmount,
  getRemarkableSpellCastEvents,
  getFightPulls,
} from "@keystone-heroes/wcl/queries";
import type {
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  ApplyDebuffEvent,
  BeginCastEvent,
  CastEvent,
  DamageEvent,
  DeathEvent,
  HealEvent,
  RemoveBuffEvent,
  InterruptEvent,
  ApplyDebuffStackEvent,
} from "@keystone-heroes/wcl/src/queries";
import type {
  ReportDungeonPullNpc,
  ReportMap,
  ReportMapBoundingBox,
} from "@keystone-heroes/wcl/types";
import nc from "next-connect";
import type { DeepNonNullable } from "ts-essentials";

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
    console.time("getFightPulls");
    const maybeFightPulls = await getFightPulls({
      reportID,
      fightIDs: [maybeStoredFight.fightID],
    });
    console.timeEnd("getFightPulls");

    if (!maybeFightPulls.reportData?.report?.fights?.[0]?.dungeonPulls) {
      res.status(BAD_REQUEST).end();
      return;
    }

    const timeSpentOutOfCombat =
      maybeFightPulls.reportData.report.fights[0].dungeonPulls.reduce(
        (acc, pull) => {
          if (!pull) {
            return acc;
          }

          return acc - (pull.endTime - pull.startTime);
        },
        maybeStoredFight.keystoneTime
      );

    const timeSpentInCombat =
      maybeStoredFight.keystoneTime - timeSpentOutOfCombat;

    console.log({
      timeSpentOutOfCombat,
      timeSpentInCombat,
    });

    const dungeonPulls =
      maybeFightPulls.reportData.report.fights[0].dungeonPulls.reduce<
        DungeonPull[]
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
          (enemyNPC): enemyNPC is DungeonPull["enemyNPCs"][number] =>
            enemyNPC !== null
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

    const params: EventParams = {
      reportID,
      startTime: maybeStoredFight.startTime,
      endTime: maybeStoredFight.endTime,
      fightID: maybeStoredFight.fightID,
      dungeonID,
      affixes: new Set([
        maybeStoredFight.Report.week.affix1.name,
        maybeStoredFight.Report.week.affix2.name,
        maybeStoredFight.Report.week.affix3.name,
        maybeStoredFight.Report.week.season.affix.name,
      ]),
    };
    console.time("events");

    const events = await Promise.all(
      maybeStoredFight.PlayerFight.map((playerFight) =>
        getRemarkableSpellCastEvents({
          ...params,
          sourceID: playerFight.player.actorID,
        })
      )
    );
    console.timeEnd("events");

    console.time("playerDeathEvents");
    const playerDeathEvents = await getPlayerDeathEvents(params);
    console.timeEnd("playerDeathEvents");
    console.time("dungeonEvents");
    const dungeonEvents = await getDungeonSpecificEvents(params);
    console.timeEnd("dungeonEvents");
    console.time("affixEvents");
    const affixEvents = await getAffixSpecificEvents(params);
    console.timeEnd("affixEvents");
    console.time("seasonEvents");
    const seasonEvents = await getSeasonSpecificEvents(params);
    console.timeEnd("seasonEvents");

    const allEvents = [
      ...events.flat(),
      ...playerDeathEvents,
      ...dungeonEvents,
      ...affixEvents,
      ...seasonEvents,
    ].sort((a, b) => a.timestamp - b.timestamp);

    console.log(allEvents.length);

    res.json({
      dungeonEvents,
      affixEvents,
      seasonEvents,
    });
    return;
  }

  res.json(maybeStoredFight);
};

type EventParams = {
  reportID: string;
  startTime: number;
  endTime: number;
  dungeonID: DungeonIDs;
  fightID: number;
  affixes: Set<Affixes>;
};

const getDungeonSpecificEvents = async (
  params: EventParams
): Promise<
  (
    | ApplyDebuffEvent
    | DeathEvent
    | ApplyBuffEvent
    | CastEvent
    | BeginCastEvent
    | HealEvent
    | DamageEvent
    | ApplyBuffStackEvent
    | RemoveBuffEvent
  )[]
> => {
  switch (params.dungeonID) {
    case DungeonIDs.DE_OTHER_SIDE:
      return getDeOtherSideUrnUsage(params);
    case DungeonIDs.HALLS_OF_ATONEMENT:
      return getHallsOfAtonementGargoyleCharms(params);
    case DungeonIDs.PLAGUEFALL:
      return getPFSlimeKills(params);
    case DungeonIDs.SANGUINE_DEPTHS: {
      const lanternBeginCastEvents = await getSanguineDepthsLanternUsages(
        params
      );
      const sinfallBoonEvents = await getSanguineDepthsBuffEvents(params);

      // const chunks = lanternBeginCastEvents
      //   .map((beginCastEvent, index, arr) => {
      //     const applicationOrRefresh = sinfallBoonEvents.find(
      //       (event) =>
      //         event.timestamp > beginCastEvent.timestamp &&
      //         (event.type === "applybuff" || event.type === "applybuffstack")
      //     );

      //     if (!applicationOrRefresh) {
      //       return null;
      //     }

      //     const nextBeginCastEvent = arr[index + 1];
      //     const nextEvents = sinfallBoonEvents.filter((event) => {
      //       return (
      //         event.timestamp >= applicationOrRefresh.timestamp &&
      //         (nextBeginCastEvent
      //           ? event.timestamp < nextBeginCastEvent.timestamp
      //           : true)
      //       );
      //     });

      //     if (nextEvents.length === 0) {
      //       return null;
      //     }

      //     return [beginCastEvent, ...nextEvents];
      //   })
      //   .filter((arr) => arr !== null);

      return [...lanternBeginCastEvents, ...sinfallBoonEvents];
    }
    case DungeonIDs.SPIRES_OF_ASCENSION:
      return getSpiresOfAscensionSpearUsage(params);
    case DungeonIDs.THEATRE_OF_PAIN:
      return getTheaterOfPainBannerUsage(params);
    case DungeonIDs.THE_NECROTIC_WAKE: {
      return [
        ...(await getNecroticWakeKyrianOrbHealEvents(params)),
        ...(await getNecroticWakeKyrianOrbDamageEvents(params)),
        ...(await getNecroticWakeOrbUsage(params)),
        ...(await getNecroticWakeSpearUsage(params)),
        ...(await getNecroticWakeHammerUsage(params)),
      ];
    }
    default:
      return [];
  }
};

const getAffixSpecificEvents = async (
  params: EventParams
): Promise<
  (
    | HealEvent
    | DamageEvent
    | DeathEvent
    | InterruptEvent
    | ApplyBuffEvent
    | ApplyDebuffStackEvent
  )[]
> => {
  const hasSanguineAffix = params.affixes.has(Affixes.Sanguine);
  const hasExplosiveAffix = params.affixes.has(Affixes.Explosive);
  const hasGrievousAffix = params.affixes.has(Affixes.Grievous);
  const hasSpitefulAffix = params.affixes.has(Affixes.Spiteful);
  const hasNecroticAffix = params.affixes.has(Affixes.Necrotic);
  const hasStormingAffix = params.affixes.has(Affixes.Storming);
  const hasVolcanicAffix = params.affixes.has(Affixes.Volcanic);
  const hasBolsteringAffix = params.affixes.has(Affixes.Bolstering);
  const hasBurstingAffix = params.affixes.has(Affixes.Bursting);
  const hasQuakingAffix = params.affixes.has(Affixes.Quaking);

  const sanguineDamageEvents = hasSanguineAffix
    ? await getSanguineDamageTakenEvents(params)
    : [];
  const sanguineHealingEvents = hasSanguineAffix
    ? await getSanguineHealingDoneEvents(params)
    : [];
  const explosiveDamageTakenEvents = hasExplosiveAffix
    ? await getExplosiveDamageTakenEvents(params)
    : [];
  const explosiveKillEvents = hasExplosiveAffix
    ? await getExplosiveKillEvents(params)
    : [];
  const grievousDamageTakenEvents = hasGrievousAffix
    ? await getGrievousDamageTakenEvents(params)
    : [];
  const necroticDamageTakenEvents = hasNecroticAffix
    ? await getNecroticDamageTakenEvents(params)
    : [];
  const highestNecroticStackEvent = hasNecroticAffix
    ? await getHighestNecroticStackAmount(params)
    : [];
  const volcanicDamageTakenEvents = hasVolcanicAffix
    ? await getVolcanicDamageTakenEvents(params)
    : [];
  const burstingDamageTakenEvents = hasBurstingAffix
    ? await getBurstingDamageTakenEvents(params)
    : [];
  const spitefulDamageTakenEvents = hasSpitefulAffix
    ? await getSpitefulDamageTakenEvents(params)
    : [];
  const quakingDamageTakenEvents = hasQuakingAffix
    ? await getQuakingDamageTakenEvents(params)
    : [];
  const quakingInterruptEvents = hasQuakingAffix
    ? await getQuakingInterruptEvents(params)
    : [];
  const stormingDamageTakenEvents = hasStormingAffix
    ? await getStormingDamageTakenEvents(params)
    : [];

  const bolsteringEvents = hasBolsteringAffix
    ? await getBolsteringEvents(params)
    : [];

  return [
    ...sanguineDamageEvents,
    ...sanguineHealingEvents,
    ...explosiveDamageTakenEvents,
    ...explosiveKillEvents,
    ...grievousDamageTakenEvents,
    ...necroticDamageTakenEvents,
    ...highestNecroticStackEvent,
    ...volcanicDamageTakenEvents,
    ...burstingDamageTakenEvents,
    ...spitefulDamageTakenEvents,
    ...quakingDamageTakenEvents,
    ...quakingInterruptEvents,
    ...stormingDamageTakenEvents,
    ...bolsteringEvents,
  ];
};

const getSeasonSpecificEvents = async (
  params: EventParams
): Promise<(DeathEvent | DamageEvent | HealEvent)[]> => {
  const hasPrideful = params.affixes.has(Affixes.Prideful);
  const hasTormented = params.affixes.has(Affixes.Tormented);

  if (hasPrideful) {
    const prideSourceID = await getManifestationOfPrideSourceID(params);

    if (!prideSourceID) {
      return [];
    }

    const pridefulDeathEvents = await getManifestationOfPrideDeathEvents({
      ...params,
      sourceID: prideSourceID,
    });

    const damageTakenEvents = await Promise.all(
      pridefulDeathEvents.map(async (event, index, arr) => {
        if (!event.targetInstance) {
          return [];
        }

        // on the first pride death event, start searching for damageDone events
        // from the start of the key.
        // on subsequent death events, start searching beginning with the death
        // timestamp of the previous pride
        const startTime =
          index === 0 ? params.startTime : arr[index - 1].timestamp;

        // retrieve the timestamp at which the first damage was done to pride
        const [{ timestamp: firstDamageDoneTimestamp }] =
          await getDamageDoneToManifestationOfPrideEvents(
            {
              reportID: params.reportID,
              endTime: event.timestamp,
              startTime,
              targetID: prideSourceID,
              targetInstance: event.targetInstance,
            },
            true
          );

        return getDamageTakenByManifestatioNOfPrideEvents({
          reportID: params.reportID,
          targetID: prideSourceID,
          startTime: firstDamageDoneTimestamp,
          endTime: event.timestamp,
          targetInstance: event.targetInstance,
        });
      })
    );

    return [...pridefulDeathEvents, ...damageTakenEvents.flat()];
  }

  if (hasTormented) {
    return [
      ...(await getBottleOfSanguineIchorHealEvents(params)),
      ...(await getStoneWardHealEvents(params)),
      ...(await getMassiveSmashDamageTakenEvents(params)),
      ...(await getRazeDamageTakenEvents(params)),
      ...(await getDecapitateDamageTakenEvents(params)),
      ...(await getSoulforgeFlamesDamageTakenEvents(params)),
      ...(await getFrostLanceDamageTakenEvents(params)),
      ...(await getBottleOfSanguineIchorDamageEvents(params)),
      ...(await getVolcanicPlumeDamageDoneEvents(params)),
      ...(await getStygianKingsBarbsDamageEvents(params)),
      ...(await getFifthSkullDamageEvents(params)),
      ...(await getBitingColdDamageTakenEvents(params)),
    ];
  }

  return [];
};

type DungeonPull = {
  x: number;
  y: number;
  startTime: number;
  endTime: number;
  maps: number[];
  boundingBox: ReportMapBoundingBox;
  enemyNPCs: Pick<
    Required<DeepNonNullable<ReportDungeonPullNpc>>,
    "gameID" | "minimumInstanceID" | "maximumInstanceID" | "id"
  >[];
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
  pulls: DungeonPull[]
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

export const fightHandler = nc()
  .get(createValidReportIDMiddleware("reportID"))
  .get(validFightIDMiddleware)
  .get(handler);
