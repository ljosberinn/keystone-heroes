import type { DungeonIDs } from "@keystone-heroes/db/data/dungeons";
import {
  dungeonMap,
  dungeons,
  EXCLUDED_NPCS,
} from "@keystone-heroes/db/data/dungeons";
import { prisma } from "@keystone-heroes/db/prisma";
import type {
  Dungeon,
  Prisma,
  Zone,
  Fight,
  Player,
  Spec,
  Legendary,
  PlayerConduit,
  Conduit,
  CovenantTrait,
  Talent,
  Covenant,
  Soulbind,
  Character,
  Class,
  Region,
  Server,
  Pull,
  Event,
  NPC,
  Ability,
  Report,
  Affix,
  PullNPC,
} from "@keystone-heroes/db/types";
import { getFightPulls } from "@keystone-heroes/wcl/queries";
import type { EventParams } from "@keystone-heroes/wcl/queries/events";
import { getEvents } from "@keystone-heroes/wcl/queries/events";
import type { DeathEvent } from "@keystone-heroes/wcl/queries/events/types";
import { processEvents } from "@keystone-heroes/wcl/transform";
import type { PersistedDungeonPull } from "@keystone-heroes/wcl/transform/utils";
import type { ReportMap } from "@keystone-heroes/wcl/types";
import nc from "next-connect";

import {
  createValidReportIDMiddleware,
  validFightIDMiddleware,
} from "../middleware";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
  OK,
} from "../utils/statusCodes";
import type { RequestHandler } from "../utils/types";
import { reportHandlerError } from "./report";

type Request = {
  query: {
    reportID: string;
    fightID: string;
  };
};

export type FightResponse =
  | {
      error: typeof fightHandlerError[keyof typeof fightHandlerError];
    }
  | {
      meta: Pick<
        Fight,
        | "dps"
        | "dtps"
        | "hps"
        | "totalDeaths"
        | "averageItemLevel"
        | "percent"
        | "chests"
      > & {
        chests: Fight["chests"];
        time: Fight["keystoneTime"];
        level: Fight["keystoneLevel"];
        inCombatTime: number;
        outOfCombatTime: number;
      };
      dungeon: {
        id: DungeonIDs;
        name: string;
        time: number;
        zones: Pick<Zone, "id" | "name">[];
      };
      affixes: Pick<Affix, "name" | "icon">[];
      player: (Pick<
        Player,
        "id" | "actorID" | "deaths" | "dps" | "hps" | "itemLevel"
      > & {
        spec: Pick<Spec, "name" | "role">;
        legendary: Pick<
          Legendary,
          "effectIcon" | "effectName" | "id" | "itemID"
        > | null;
        conduits: (Pick<Conduit, "icon" | "name"> & {
          itemLevel: PlayerConduit["itemLevel"];
        })[];
        covenantTraits: Pick<CovenantTrait, "icon" | "name">[];
        talents: Pick<Talent, "icon" | "name">[];
        covenant: Pick<Covenant, "name" | "icon"> | null;
        soulbind: Pick<Soulbind, "name" | "icon"> | null;
        name: Character["name"];
        class: Class["name"];
        server: Server["name"];
        region: Region["slug"];
      })[];
      pulls: (Pick<
        Pull,
        | "startTime"
        | "endTime"
        | "x"
        | "y"
        | "minX"
        | "minY"
        | "maxX"
        | "maxY"
        | "isWipe"
      > & {
        events: unknown[];
        zones: Zone["id"][];
        percent: number;
        npcs: (Pick<PullNPC, "count"> & Pick<NPC, "id" | "name">)[];
      })[];
    };

export const fightHandlerError = {
  UNKNOWN_REPORT: "Unknown report.",
  BROKEN_LOG_OR_WCL_UNAVAILABLE:
    reportHandlerError.BROKEN_LOG_OR_WCL_UNAVAILABLE,
  MISSING_DUNGEON:
    "This fight appears to be broken and could not successfully be linked to a specific dungeon.",
  BROKEN_FIGHT: "This fight could not be matched to any dungeon.",
  FATAL_ERROR: "Something went wrong.",
} as const;

const fightHasDungeon = (fight: RawFight): fight is RawFightWithDungeon => {
  return fight?.dungeon !== null;
};

type RawFightWithDungeon = Omit<NonNullable<RawFight>, "dungeon"> & {
  dungeon: Pick<Dungeon, "id" | "name" | "time"> & {
    Zone: Pick<Zone, "id" | "name">[];
  };
};

type RawFight =
  | (Pick<
      Fight,
      | "id"
      | "fightID"
      | "startTime"
      | "endTime"
      | "chests"
      | "keystoneLevel"
      | "keystoneTime"
      | "dps"
      | "dtps"
      | "hps"
      | "totalDeaths"
      | "averageItemLevel"
      | "percent"
    > & {
      dungeon:
        | (Pick<Dungeon, "name" | "id" | "time"> & {
            Zone: Pick<Zone, "id" | "name">[];
          })
        | null;
      PlayerFight: {
        player: Pick<
          Player,
          "id" | "actorID" | "deaths" | "dps" | "hps" | "itemLevel"
        > & {
          spec: Pick<Spec, "name" | "role">;
          legendary: Pick<
            Legendary,
            "effectIcon" | "effectName" | "id" | "itemID"
          > | null;
          PlayerConduit: (Pick<PlayerConduit, "itemLevel"> & {
            conduit: Pick<Conduit, "icon" | "name">;
          })[];
          PlayerCovenantTrait: {
            covenantTrait: Pick<CovenantTrait, "icon" | "name">;
          }[];
          PlayerTalent: {
            talent: Pick<Talent, "icon" | "name">;
          }[];
          covenant: Pick<Covenant, "name" | "icon"> | null;
          soulbind: Pick<Soulbind, "name" | "icon"> | null;
          character: Pick<Character, "name"> & {
            class: Pick<Class, "name">;
            // TODO: re-evaluate whether we need ids here; maybe for x-linking?
            server: Pick<Server, "id" | "name"> & {
              region: Pick<Region, "id" | "slug">;
            };
          };
        };
      }[];
      Pull: (Pick<
        Pull,
        | "startTime"
        | "endTime"
        | "x"
        | "y"
        | "minX"
        | "maxY"
        | "minY"
        | "maxX"
        | "isWipe"
        | "percent"
      > & {
        PullZone: { zone: Pick<Zone, "id"> }[];
        PullNPC: (Pick<PullNPC, "count"> & { npc: Pick<NPC, "id" | "name"> })[];
        Event: (Pick<
          Event,
          | "eventType"
          | "timestamp"
          | "sourcePlayerID"
          | "targetPlayerID"
          | "sourceNPCInstance"
          | "targetNPCInstance"
          | "damage"
          | "healingDone"
          | "stacks"
        > & {
          sourceNPC: NPC | null;
          targetNPC: NPC | null;
          ability: Ability | null;
          interruptedAbility: Ability | null;
        })[];
      })[];
      Report: Pick<Report, "id"> & {
        week: {
          season: {
            affix: Pick<Affix, "name" | "icon">;
          };
          affix1: Pick<Affix, "name" | "icon">;
          affix2: Pick<Affix, "name" | "icon">;
          affix3: Pick<Affix, "name" | "icon">;
        };
      };
    })
  | null;

const createFightFindFirst = (reportID: string, fightID: number) => {
  return {
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
      dps: true,
      dtps: true,
      hps: true,
      totalDeaths: true,
      averageItemLevel: true,
      chests: true,
      keystoneLevel: true,
      keystoneTime: true,
      percent: true,
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
      PlayerFight: {
        select: {
          player: {
            select: {
              id: true,
              actorID: true,
              deaths: true,
              dps: true,
              hps: true,
              itemLevel: true,
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
          percent: true,
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
  } as const;
};

const createResponseFromStoredFight = (
  dataset: RawFightWithDungeon
): FightResponse => {
  const dungeon = dungeonMap[dataset.dungeon.id];

  const pulls = dataset.Pull.map((pull) => {
    const npcs = pull.PullNPC.map((pullNPC) => {
      return {
        count: pullNPC.count,
        id: pullNPC.npc.id,
        name: pullNPC.npc.name,
      };
    });

    return {
      startTime: pull.startTime,
      endTime: pull.endTime,
      x: pull.x,
      y: pull.y,
      minX: pull.minX,
      minY: pull.minY,
      maxX: pull.maxX,
      maxY: pull.maxY,
      isWipe: pull.isWipe,
      events: pull.Event.map((event) =>
        Object.fromEntries(
          Object.entries(event).filter(([, value]) => value !== null)
        )
      ),
      percent: pull.percent,
      npcs,
      zones: [...new Set(pull.PullZone.map((pullZone) => pullZone.zone.id))],
    };
  });

  return {
    meta: {
      ...calculateCombatTime(dataset.keystoneTime, dataset.Pull),
      level: dataset.keystoneLevel,
      time: dataset.keystoneTime,
      chests: dataset.chests,
      dps: dataset.dps,
      hps: dataset.hps,
      dtps: dataset.dtps,
      averageItemLevel: dataset.averageItemLevel,
      totalDeaths: dataset.totalDeaths,
      percent: dataset.percent,
    },
    dungeon: {
      id: dataset.dungeon.id,
      name: dungeon.name,
      time: dungeon.timer[0],
      zones: [...dungeon.zones]
        .sort((a, b) => a.order - b.order)
        .map(({ id, name }) => ({ id, name })),
    },
    affixes: [
      dataset.Report.week.affix1,
      dataset.Report.week.affix2,
      dataset.Report.week.affix3,
      dataset.Report.week.season.affix,
    ],
    player: dataset.PlayerFight.map((playerFight) => {
      return {
        id: playerFight.player.id,
        actorID: playerFight.player.actorID,
        deaths: playerFight.player.deaths,
        dps: playerFight.player.dps,
        hps: playerFight.player.hps,
        itemLevel: playerFight.player.itemLevel,
        spec: playerFight.player.spec,
        legendary: playerFight.player.legendary,
        conduits: playerFight.player.PlayerConduit.map((playerConduit) => {
          return {
            itemLevel: playerConduit.itemLevel,
            ...playerConduit.conduit,
          };
        }),
        covenantTraits: playerFight.player.PlayerCovenantTrait.map(
          (playerCovenantTrait) => playerCovenantTrait.covenantTrait
        ),
        talents: playerFight.player.PlayerTalent.map(
          (playerTalent) => playerTalent.talent
        ),
        name: playerFight.player.character.name,
        class: playerFight.player.character.class.name,
        server: playerFight.player.character.server.name,
        region: playerFight.player.character.server.region.slug,
        covenant: playerFight.player.covenant,
        soulbind: playerFight.player.covenant,
      };
    }),
    pulls,
  };
};

const getResponseOrRetrieveAndCreateFight = async (
  maybeStoredFight: NonNullable<RawFight>,
  selector: ReturnType<typeof createFightFindFirst>
): Promise<{ status: number; json: FightResponse }> => {
  if (
    maybeStoredFight.Pull.length > 0 &&
    maybeStoredFight.percent > 0 &&
    fightHasDungeon(maybeStoredFight)
  ) {
    return {
      status: OK,
      json: createResponseFromStoredFight(maybeStoredFight),
    };
  }

  const maybeFightPulls = await getFightPulls({
    reportID: selector.where.Report.report,
    fightIDs: [maybeStoredFight.fightID],
  });

  if (!maybeFightPulls.reportData?.report?.fights?.[0]?.dungeonPulls) {
    return {
      status: BAD_REQUEST,
      json: {
        error: fightHandlerError.BROKEN_LOG_OR_WCL_UNAVAILABLE,
      },
    };
  }

  const dungeonPulls =
    maybeFightPulls.reportData.report.fights[0].dungeonPulls.reduce<
      Omit<PersistedDungeonPull, "id" | "isWipe" | "percent">[]
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
        ): enemyNPC is Omit<PersistedDungeonPull, "id">["enemyNPCs"][number] =>
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
    return {
      status: UNPROCESSABLE_ENTITY,
      json: {
        error: fightHandlerError.MISSING_DUNGEON,
      },
    };
  }

  const params: EventParams = {
    reportID: selector.where.Report.report,
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

  const playerMetaInformation = maybeStoredFight.PlayerFight.map(
    (playerFight) => {
      return {
        actorID: playerFight.player.actorID,
        class: playerFight.player.character.class.name,
      };
    }
  );

  const { allEvents, playerDeathEvents, enemyDeathEvents } = await getEvents(
    params,
    playerMetaInformation
  );
  const hasNoWipes = playerDeathEvents.length < 5;

  // map of { [startTime]: { [targetID]: count } } including every pull
  const pullNPCDeathCountMap = dungeonPulls.reduce<
    Record<number, Record<number, number>>
  >((acc, { startTime, endTime }) => {
    acc[startTime] = enemyDeathEvents
      .filter(({ timestamp }) => timestamp >= startTime && timestamp <= endTime)
      .reduce<Record<number, number>>((acc, { type, targetID, sourceID }) => {
        // differentiate between `BeginCastEvent` and `DeathEvent`
        const key = type === "death" ? targetID : sourceID;
        acc[key] = (acc[key] ?? 0) + 1;

        return acc;
      }, {});

    return acc;
  }, {});

  const dungeon = dungeonMap[dungeonID];

  const pullsWithWipesAndPercent = dungeonPulls
    // ensure this pull isn't effectively empty, e.g. only 1 Spiteful Shade
    .filter((pull) => {
      const npcs = pull.enemyNPCs.filter(
        (npc) => !EXCLUDED_NPCS.has(npc.gameID)
      );

      return npcs.length > 0;
    })
    .map<Omit<PersistedDungeonPull, "id">>((pull) => {
      const isWipe = hasNoWipes ? false : isPullWipe(playerDeathEvents, pull);

      const npcDeathCountMap = pullNPCDeathCountMap[pull.startTime];

      const totalCount = pull.enemyNPCs.reduce((acc, npc) => {
        const deathCount = npcDeathCountMap[npc.id];
        const npcCount = dungeon.unitCountMap[npc.gameID];

        if (deathCount === undefined || npcCount === undefined) {
          return acc;
        }

        return acc + npcCount * deathCount;
      }, 0);

      const percent = (totalCount / dungeon.count) * 100;

      return {
        ...pull,
        isWipe,
        percent,
      };
    });

  const persistedPulls = await persistPulls(
    pullsWithWipesAndPercent,
    maybeStoredFight.id
  );

  const persistableMaps =
    persistedPulls.flatMap<Prisma.PullZoneCreateManyInput>((pull) => {
      return pull.maps.map((map) => {
        return {
          pullID: pull.id,
          zoneID: map,
        };
      });
    });

  const persistableNPCs = persistedPulls.flatMap<Prisma.PullNPCCreateManyInput>(
    (pull) => {
      const npcDeathCountMap = pullNPCDeathCountMap[pull.startTime];

      return pull.enemyNPCs
        .filter((npc) => !EXCLUDED_NPCS.has(npc.gameID))
        .map((npc) => {
          // default to 1 for npcs that appear in the pull and thus are enemy
          // units but didn't die, e.g. for some reason Dealer in DoS,
          // slime minigame in DoS as well as invisible units
          const deathCountOfThisNPC = npcDeathCountMap[npc.id] ?? 1;

          return {
            npcID: npc.gameID,
            count: deathCountOfThisNPC,
            pullID: pull.id,
          };
        });
    }
  );

  const actorPlayerMap = new Map(
    maybeStoredFight.PlayerFight.map((playerFight) => [
      playerFight.player.actorID,
      playerFight.player.id,
    ])
  );

  const everyPullsNPCs = persistedPulls.flatMap((pull) => {
    return pull.enemyNPCs;
  });

  const persistablePullEvents = persistedPulls.flatMap((pull, index) => {
    const lastPull = persistedPulls[index - 1];

    const thisPullsEvents = allEvents.filter(({ timestamp }) => {
      const isDuringThisPull =
        timestamp >= pull.startTime && timestamp <= pull.endTime;
      // some CDs may be used outside of a pull in preparation to set it up
      // e.g. Sigil of Silence/Chains/Imprison right before pulling.
      // Because of that, any event past the last pull and before this will be
      // attached to the next pull.
      const wasAfterLastPull = lastPull
        ? timestamp > lastPull.endTime && timestamp < pull.startTime
        : false;

      return isDuringThisPull || wasAfterLastPull;
    });

    return processEvents(
      pull,
      thisPullsEvents,
      actorPlayerMap,
      everyPullsNPCs
    ).map<Prisma.EventCreateManyInput>((event) => {
      return {
        ...event,
        pullID: pull.id,
      };
    });
  });

  const totalPercent = pullsWithWipesAndPercent.reduce(
    (acc, pull) => acc + pull.percent,
    0
  );

  await prisma.$transaction([
    prisma.fight.update({
      data: {
        percent: totalPercent,
        // since we need to update `totalPercent` anyways, we might aswell
        // always update the dungeonID too, even though it may already have
        // been present
        dungeonID,
      },
      where: {
        fightID_reportID: {
          reportID: maybeStoredFight.Report.id,
          fightID: maybeStoredFight.fightID,
        },
      },
    }),
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

  const rawFight: RawFight = await prisma.fight.findFirst(selector);

  if (!fightHasDungeon(rawFight)) {
    return {
      status: INTERNAL_SERVER_ERROR,
      json: {
        error: fightHandlerError.FATAL_ERROR,
      },
    };
  }

  return {
    status: OK,
    json: createResponseFromStoredFight(rawFight),
  };
};

const handler: RequestHandler<Request, FightResponse> = async (req, res) => {
  const { reportID } = req.query;
  const fightID = Number.parseInt(req.query.fightID);

  const fightFindFirstSelector = createFightFindFirst(reportID, fightID);

  const maybeStoredFight: RawFight = await prisma.fight.findFirst(
    fightFindFirstSelector
  );

  if (!maybeStoredFight) {
    res.status(NOT_FOUND).json({ error: fightHandlerError.UNKNOWN_REPORT });
    return;
  }

  const { status, json } = await getResponseOrRetrieveAndCreateFight(
    maybeStoredFight,
    fightFindFirstSelector
  );

  res.status(status).json(json);
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
  pulls: Omit<PersistedDungeonPull, "id" | "isWipe" | "percent">[]
): DungeonIDs | null => {
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
      percent: pull.percent,
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

const isPullWipe = <T extends { startTime: number; endTime: number }>(
  playerDeathEvents: DeathEvent[],
  { startTime, endTime }: T
) => {
  return (
    new Set(
      playerDeathEvents
        .filter(
          ({ timestamp }) => timestamp >= startTime && timestamp <= endTime
        )
        .map((event) => event.targetID)
    ).size === 5
  );
};

export const fightHandler = nc()
  .get(createValidReportIDMiddleware("reportID"))
  .get(validFightIDMiddleware)
  .get(handler);
