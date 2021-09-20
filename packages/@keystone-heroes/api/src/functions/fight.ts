import {
  dungeonMap,
  dungeons,
  EXCLUDED_NPCS,
  allBossIDs,
  DungeonIDs,
  SOA_FINAL_BOSS_ANGELS,
  Boss,
} from "@keystone-heroes/db/data/dungeons";
import { spells } from "@keystone-heroes/db/data/spellIds";
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
import {
  tormentedAbilityGameIDSet,
  tormentedLieutenantIDSet,
  tormentedLieutenants,
} from "@keystone-heroes/wcl/queries/events/affixes/tormented";
import type {
  DeathEvent,
  BeginCastEvent,
} from "@keystone-heroes/wcl/queries/events/types";
import { processEvents } from "@keystone-heroes/wcl/transform";
import type { PersistedDungeonPull } from "@keystone-heroes/wcl/transform/utils";
import nc from "next-connect";

import {
  createValidReportIDMiddleware,
  validFightIDMiddleware,
} from "../middleware";
import { sortByRole } from "../utils";
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

export type FightErrorResponse = {
  error: typeof fightHandlerError[keyof typeof fightHandlerError];
};

export type FightSuccessResponse = {
  meta: Pick<
    Fight,
    | "dps"
    | "hps"
    | "totalDeaths"
    | "averageItemLevel"
    | "percent"
    | "chests"
    | "rating"
  > & {
    chests: Fight["chests"];
    time: Fight["keystoneTime"];
    level: Fight["keystoneLevel"];
    inCombatTime: number;
    outOfCombatTime: number;
    startTime: number;
  };
  dungeon: DungeonIDs;
  affixes: Affix["id"][];
  player: (Pick<
    Player,
    "id" | "actorID" | "deaths" | "dps" | "hps" | "itemLevel"
  > & {
    class: Class["id"];
    spec: Spec["id"];
    legendary: Pick<
      Legendary,
      "effectIcon" | "effectName" | "id" | "itemID"
    > | null;
    conduits: (Pick<Conduit, "icon" | "name"> & {
      itemLevel: PlayerConduit["itemLevel"];
    })[];
    covenantTraits: Pick<CovenantTrait, "icon" | "name">[];
    talents: Pick<Talent, "icon" | "name">[];
    covenant: Covenant["id"] | null;
    soulbind: Soulbind["id"] | null;
    name: Character["name"];
    server: Server["name"];
    region: Region["slug"];
    tormented: Ability["id"][];
  })[];
  pulls: (Pick<Pull, "startTime" | "endTime" | "x" | "y" | "isWipe"> & {
    events: (Pick<
      Event,
      | "timestamp"
      | "sourcePlayerID"
      | "targetPlayerID"
      | "sourceNPCInstance"
      | "targetNPCInstance"
      | "damage"
      | "healingDone"
      | "stacks"
    > & {
      type: Event["eventType"] | "AbilityReady";
      sourceNPC: NPC | null;
      targetNPC: NPC | null;
      ability:
        | (Pick<Ability, "id"> & {
            lastUse: null | number;
            nextUse: null | number;
            wasted: boolean;
          })
        | null;
      /**
       * timestamp of the event relative to its pull
       */
      relTimestamp: number;
      category: EventCategory;
      interruptedAbility: Ability["id"] | null;
    })[];
    zone: Zone["id"];
    percent: number;
    npcs: (Pick<PullNPC, "count"> & Pick<NPC, "id" | "name">)[];
    id: number;
    hasBoss: boolean;
  })[];
};

export type FightResponse = FightErrorResponse | FightSuccessResponse;

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
      | "hps"
      | "totalDeaths"
      | "averageItemLevel"
      | "percent"
      | "rating"
    > & {
      dungeon: Pick<Dungeon, "id"> | null;
      PlayerFight: {
        player: Pick<
          Player,
          "id" | "actorID" | "deaths" | "dps" | "hps" | "itemLevel"
        > & {
          spec: Pick<Spec, "id" | "role">;
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
            talent: Pick<Talent, "id" | "icon" | "name">;
          }[];
          covenant: Pick<Covenant, "id"> | null;
          soulbind: Pick<Soulbind, "id"> | null;
          character: Pick<Character, "name"> & {
            class: Pick<Class, "id">;
            // TODO: re-evaluate whether we need ids here; maybe for x-linking?
            server: Pick<Server, "id" | "name"> & {
              region: Pick<Region, "id" | "slug">;
            };
          };
        };
      }[];
      Pull: (Pick<
        Pull,
        "startTime" | "endTime" | "x" | "y" | "isWipe" | "percent"
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
          ability: Pick<Ability, "id" | "name" | "icon"> | null;
          interruptedAbility: Pick<Ability, "id"> | null;
        })[];
      })[];
      Report: Pick<Report, "id"> & {
        week: {
          season: {
            affix: Pick<Affix, "id" | "name">;
          };
          affix1: Pick<Affix, "id" | "name">;
          affix2: Pick<Affix, "id" | "name">;
          affix3: Pick<Affix, "id" | "name">;
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
      hps: true,
      totalDeaths: true,
      averageItemLevel: true,
      chests: true,
      keystoneLevel: true,
      keystoneTime: true,
      percent: true,
      rating: true,
      dungeon: {
        select: {
          id: true,
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
                  id: true,
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
                      id: true,
                      icon: true,
                      name: true,
                    },
                  },
                },
              },
              covenant: {
                select: {
                  id: true,
                },
              },
              soulbind: {
                select: {
                  id: true,
                },
              },
              character: {
                select: {
                  name: true,
                  class: {
                    select: {
                      id: true,
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
              ability: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                },
              },
              interruptedAbility: {
                select: {
                  id: true,
                },
              },
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
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              affix1: {
                select: {
                  id: true,
                  name: true,
                },
              },
              affix2: {
                select: {
                  id: true,
                  name: true,
                },
              },
              affix3: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  } as const;
};

const omitNullValues = <T extends Record<string, unknown>>(dataset: T): T =>
  Object.fromEntries(
    Object.entries(dataset).filter(([, value]) => value !== null)
  ) as T;

const detectTormentedPowers = (
  allEvents: Omit<
    FightSuccessResponse["pulls"][number]["events"][number],
    "category" | "relTimestamp"
  >[],
  playerID: number
) => {
  return allEvents.reduce<FightSuccessResponse["player"][number]["tormented"]>(
    (acc, event) => {
      if (
        !event.ability ||
        !tormentedAbilityGameIDSet.has(event.ability.id) ||
        event.targetPlayerID !== playerID ||
        (event.type !== "ApplyBuff" && event.type !== "ApplyBuffStack")
      ) {
        return acc;
      }

      return [...acc, event.ability.id];
    },
    []
  );
};

type EventWithAbilityAndSourcePlayerID = Omit<
  FightSuccessResponse["pulls"][number]["events"][number],
  "ability" | "sourcePlayerID" | "category" | "relTimestamp"
> & {
  ability: NonNullable<
    FightSuccessResponse["pulls"][number]["events"][number]["ability"]
  >;
  sourcePlayerID: number;
};

const eventHasRelevantAbilityAndSourcePlayerID = (
  event: Omit<
    FightSuccessResponse["pulls"][number]["events"][number],
    "category" | "relTimestamp"
  >
): event is EventWithAbilityAndSourcePlayerID => {
  return (
    "ability" in event &&
    event.ability !== null &&
    event.ability.id in spells &&
    event.sourcePlayerID !== null
  );
};

const abilitiesWithCDR = new Set([
  324_386, 306_830, 204_021, 1719, 212_084, 207_684, 79_206, 325_886, 12_472,
  84_714, 1122, 20_707, 202_137, 307_865, 307_443, 20_484, 137_639, 325_216,
  265_187, 308_491, 198_589,
]);

const calculateAbilityReadyEvents = (
  allEvents: Omit<
    FightSuccessResponse["pulls"][number]["events"][number],
    "category" | "relTimestamp"
  >[]
): Omit<
  FightSuccessResponse["pulls"][number]["events"][number],
  "category" | "relTimestamp"
>[] => {
  return allEvents.reduce<
    Omit<
      FightSuccessResponse["pulls"][number]["events"][number],
      "category" | "relTimestamp"
    >[]
  >((acc, event) => {
    if (!eventHasRelevantAbilityAndSourcePlayerID(event)) {
      return acc;
    }

    const { cd } = spells[event.ability.id];

    const nextCast = allEvents.find(
      (dataset) =>
        dataset.timestamp > event.timestamp &&
        eventHasRelevantAbilityAndSourcePlayerID(dataset) &&
        dataset.sourcePlayerID === event.sourcePlayerID &&
        dataset.ability.id === event.ability.id
    );

    if (nextCast) {
      const diff = (nextCast.timestamp - event.timestamp) / 1000;

      if (diff >= cd) {
        const wasted = diff >= 2 * cd;

        return [
          ...acc,
          {
            type: "AbilityReady",
            timestamp: event.timestamp + cd * 1000,
            sourcePlayerID: event.sourcePlayerID,
            ability: {
              id: event.ability.id,
              lastUse: event.timestamp,
              nextUse: nextCast.timestamp,
              wasted,
            },
            damage: null,
            healingDone: null,
            stacks: null,
            interruptedAbility: null,
            sourceNPC: null,
            sourceNPCInstance: null,
            targetNPC: null,
            targetNPCInstance: null,
            targetPlayerID: null,
          },
        ];
      }

      // ability used before technically ready
      // hints on any kind of cooldown reduction or a wrong stored cd
      if (diff < cd) {
        if (!abilitiesWithCDR.has(event.ability.id)) {
          console.log(
            event.timestamp,
            nextCast.timestamp,
            `detected cdr on ${event.ability.id} - expected cd of ${cd}, saw ${diff}`
          );
          abilitiesWithCDR.add(event.ability.id);
        }

        return acc;
      }
    }

    return [
      ...acc,
      {
        type: "AbilityReady",
        timestamp: event.timestamp + cd * 1000,
        sourcePlayerID: event.sourcePlayerID,
        ability: {
          id: event.ability.id,
          lastUse: event.timestamp,
          nextUse: null,
          wasted: false,
        },
        damage: null,
        healingDone: null,
        stacks: null,
        interruptedAbility: null,
        sourceNPC: null,
        sourceNPCInstance: null,
        targetNPC: null,
        targetNPCInstance: null,
        targetPlayerID: null,
      },
    ];
  }, []);
};

const calculateEventsBeforeDuringAfterPull = ({
  allEvents,
  lastPullEnd,
  nextPullStart,
  pullStart,
  pullEnd,
}: {
  allEvents: Omit<
    FightSuccessResponse["pulls"][number]["events"][number],
    "category" | "relTimestamp"
  >[];
  lastPullEnd: number;
  nextPullStart: number;
  pullStart: number;
  pullEnd: number;
}) => {
  // events that occured later than 50% of the time between two pulls count
  // towards this pull
  const middleAfterLastPull = lastPullEnd
    ? lastPullEnd + (pullStart - lastPullEnd) / 2
    : null;

  // events that occured earlier than 50% of the time between two pulls count
  // towards this pull
  const middleAfterThisPull = nextPullStart
    ? pullEnd + (nextPullStart - pullEnd) / 2
    : null;

  const before =
    lastPullEnd && middleAfterLastPull
      ? allEvents
          .filter((event) => {
            return (
              event.timestamp >= middleAfterLastPull &&
              event.timestamp < pullStart
            );
          })
          .map((event) => ({
            ...event,
            category: EventCategory.BEFORE,
            relTimestamp: event.timestamp - pullStart,
          }))
      : [];

  const during = allEvents
    .filter((event) => {
      return event.timestamp >= pullStart && event.timestamp <= pullEnd;
    })
    .map((event) => ({
      ...event,
      category: EventCategory.DURING,
    }));

  const after =
    nextPullStart && middleAfterThisPull
      ? allEvents
          .filter(
            (event) =>
              event.timestamp > pullEnd && event.timestamp < middleAfterThisPull
          )
          .map((event) => ({
            ...event,
            category: EventCategory.AFTER,
          }))
      : [];

  return {
    before,
    during,
    after,
    middleAfterLastPull,
    middleAfterThisPull,
  };
};

enum EventCategory {
  BEFORE = "BEFORE",
  DURING = "DURING",
  AFTER = "AFTER",
}

const findThisPullsAbilityReadyEvents = (
  abilityReadyEvents: ReturnType<typeof calculateAbilityReadyEvents>,
  {
    middleAfterLastPull,
    middleAfterThisPull,
    pullEnd,
    pullStart,
  }: {
    middleAfterLastPull: number;
    middleAfterThisPull: number;
    pullStart: number;
    pullEnd: number;
  }
) => {
  return abilityReadyEvents
    .filter(
      (event) =>
        event.timestamp >= middleAfterLastPull &&
        event.timestamp <= middleAfterThisPull
    )
    .map((event) => ({
      ...event,
      category:
        event.timestamp < pullStart
          ? EventCategory.BEFORE
          : event.timestamp > pullEnd
          ? EventCategory.AFTER
          : EventCategory.DURING,
    }));
};

const createResponseFromStoredFight = (
  dataset: RawFightWithDungeon
): FightSuccessResponse => {
  const lastAbilityUsageMap: Record<number, number> = {};

  const allEvents = dataset.Pull.flatMap((pull) =>
    pull.Event.map<
      Omit<
        FightSuccessResponse["pulls"][number]["events"][number],
        "category" | "relTimestamp"
      >
    >(({ eventType, ability, timestamp, ...rest }) => {
      const interruptedAbility = rest.interruptedAbility
        ? rest.interruptedAbility.id
        : null;

      if (ability) {
        const lastUse = lastAbilityUsageMap[ability.id] ?? null;
        lastAbilityUsageMap[ability.id] = timestamp;

        return {
          ...rest,
          timestamp,
          interruptedAbility,
          type: eventType,
          ability: {
            id: ability.id,
            lastUse,
            nextUse: null,
            wasted: false,
          },
        };
      }

      return {
        ...rest,
        timestamp,
        interruptedAbility,
        type: eventType,
        ability: null,
      };
    })
  );

  const abilityReadyEvents = calculateAbilityReadyEvents(allEvents);

  const pulls = dataset.Pull.map<FightSuccessResponse["pulls"][number]>(
    (pull, index) => {
      const npcs = pull.PullNPC.map<
        FightSuccessResponse["pulls"][number]["npcs"][number]
      >((pullNPC) => {
        return {
          count: pullNPC.count,
          id: pullNPC.npc.id,
          name: pullNPC.npc.name,
        };
      });

      const hasBoss = npcs.some((npc) => allBossIDs.has(npc.id));

      const {
        before,
        during,
        after,
        middleAfterLastPull,
        middleAfterThisPull,
      } = calculateEventsBeforeDuringAfterPull({
        allEvents,
        lastPullEnd: dataset.Pull[index - 1]?.endTime ?? 0,
        nextPullStart: dataset.Pull[index + 1]?.startTime ?? 0,
        pullStart: pull.startTime,
        pullEnd: pull.endTime,
      });

      const thisPullAbilityReadyEvents = findThisPullsAbilityReadyEvents(
        abilityReadyEvents,
        {
          middleAfterLastPull: middleAfterLastPull ?? pull.startTime,
          middleAfterThisPull: middleAfterThisPull ?? pull.endTime,
          pullStart: pull.startTime,
          pullEnd: pull.endTime,
        }
      );

      const events: FightSuccessResponse["pulls"][number]["events"] = [
        ...before,
        ...during,
        ...after,
        ...thisPullAbilityReadyEvents,
      ]
        .map((event) => ({
          ...event,
          relTimestamp: event.timestamp - pull.startTime,
        }))
        .map(omitNullValues)
        .sort((a, b) => a.timestamp - b.timestamp);

      return {
        startTime: pull.startTime,
        endTime: pull.endTime,
        x: pull.x,
        y: pull.y,
        isWipe: pull.isWipe,
        events,
        percent: pull.percent,
        npcs,
        zone: pull.PullZone[0].zone.id,
        id: index + 1,
        hasBoss,
      };
    }
  );

  const { inCombatTime, outOfCombatTime } = calculateCombatTime(
    dataset.keystoneTime,
    dataset.Pull
  );

  const dps = Math.round((dataset.dps * dataset.keystoneTime) / inCombatTime);
  const hps = Math.round((dataset.hps * dataset.keystoneTime) / inCombatTime);

  return {
    meta: {
      inCombatTime,
      outOfCombatTime,
      level: dataset.keystoneLevel,
      time: dataset.keystoneTime,
      chests: dataset.chests,
      averageItemLevel: dataset.averageItemLevel,
      totalDeaths: dataset.totalDeaths,
      percent: dataset.percent,
      rating: dataset.rating,
      startTime: dataset.startTime,
      dps,
      hps,
    },
    dungeon: dataset.dungeon.id,
    affixes: [
      dataset.Report.week.affix1.id,
      dataset.Report.week.affix2.id,
      dataset.Report.week.affix3.id,
      dataset.Report.week.season.affix.id,
    ],
    player: [...dataset.PlayerFight]
      .sort((a, b) => sortByRole(a.player.spec.role, b.player.spec.role))
      .map((playerFight) => {
        const dps = Math.round(
          (playerFight.player.dps * dataset.keystoneTime) / inCombatTime
        );
        const hps = Math.round(
          (playerFight.player.hps * dataset.keystoneTime) / inCombatTime
        );

        return {
          id: playerFight.player.id,
          actorID: playerFight.player.actorID,
          deaths: playerFight.player.deaths,

          itemLevel: playerFight.player.itemLevel,
          spec: playerFight.player.spec.id,
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
          class: playerFight.player.character.class.id,
          server: playerFight.player.character.server.name,
          region: playerFight.player.character.server.region.slug,
          covenant: playerFight.player.covenant
            ? playerFight.player.covenant.id
            : null,
          soulbind: playerFight.player.soulbind
            ? playerFight.player.soulbind.id
            : null,
          tormented: detectTormentedPowers(allEvents, playerFight.player.id),
          dps,
          hps,
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
      if (!pull || !pull.maps || !pull.enemyNPCs) {
        return acc;
      }

      const maps = [
        ...new Set(
          pull.maps.reduce<number[]>((acc, map) => {
            if (!map) {
              return acc;
            }

            return [...acc, map.id];
          }, [])
        ),
      ];

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
        class: playerFight.player.character.class.id,
      };
    }
  );

  const { allEvents, playerDeathEvents, enemyDeathEvents } = await getEvents(
    params,
    playerMetaInformation
  );

  const pullNPCDeathEventMap = createPullNPCDeathEventMap(
    dungeonPulls,
    enemyDeathEvents
  );
  const pullNPCDeathCountMap = createPullNPCDeathCountMap(pullNPCDeathEventMap);

  const pullsWithWipesAndPercent = calculatePullsWithWipesAndPercent(
    dungeonPulls,
    {
      dungeonID,
      playerDeathEvents,
      deathCountMap: pullNPCDeathCountMap,
      deathEventMap: pullNPCDeathEventMap,
    }
  );

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

      return pull.enemyNPCs.map((npc) => {
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

  const everyPullsNPCs = persistedPulls.flatMap((pull) => pull.enemyNPCs);

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
  storedDungeon: { id: number } | null,
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
      fightID,
      startTime: pull.startTime,
      endTime: pull.endTime,
      x: pull.x,
      y: pull.y,
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

  return dungeonPulls.reduce<PersistedDungeonPull[]>((acc, pull) => {
    const match = storedPulls.find(
      (storedPull) =>
        storedPull.startTime === pull.startTime &&
        storedPull.endTime === pull.endTime
    );

    if (!match) {
      return acc;
    }

    return [
      ...acc,
      {
        ...pull,
        id: match.id,
      },
    ];
  }, []);
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
): boolean => {
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

const createTotalCountReducer = (
  npcDeathCountMap: Record<number, number>,
  { unitCountMap }: typeof dungeonMap[number]
) => {
  return (acc: number, npc: { id: number; gameID: number }) => {
    const deathCount = npcDeathCountMap[npc.id];
    const npcCount = unitCountMap[npc.gameID];

    if (deathCount === undefined || npcCount === undefined) {
      return acc;
    }

    return acc + npcCount * deathCount;
  };
};

const calculatePullCoordinates = (
  { x, y, enemyNPCs }: Omit<PersistedDungeonPull, "id" | "percent" | "isWipe">,
  { maxX, minX, minY, maxY, id }: Omit<Zone, "dungeonID">,
  dungeonID: DungeonIDs,
  npcs: { gameID: number }[]
): { x: number; y: number } => {
  // pulling the 3rd Lieutenant through the gate on 1st boss results in out of
  // bounds coordinates
  if (
    dungeonID === DungeonIDs.MISTS_OF_TIRNA_SCITHE &&
    x === -2_147_483_648 &&
    y === -2_147_483_648 &&
    // length check of pull is valid here because if the lt would have been
    // added late in a prior pull, x and y wouldn't be out of bounds
    npcs.length === 1 &&
    tormentedLieutenantIDSet.has(npcs[0].gameID)
  ) {
    return {
      x: 0.702_702_702_702_702_7,
      y: 0.248_366_013_071_895_43,
    };
  }

  if (dungeonID === DungeonIDs.THE_NECROTIC_WAKE) {
    if (id === 1667) {
      if (enemyNPCs.some((npc) => npc.gameID === Boss.SURGEON_STITCHFLESH)) {
        return {
          x: 0.509_844_559_585_492_2,
          y: 0.434_782_608_695_652_16,
        };
      }

      // gauntlet start
      if (
        enemyNPCs.some(
          (npc) => npc.gameID === 167_731 || npc.gameID === 173_044
        )
      ) {
        return {
          x: 0.373_056_994_818_652_84,
          y: 0.372_670_807_453_416_13,
        };
      }

      // gauntlet left
      if (enemyNPCs.some((npc) => npc.gameID === 163_621)) {
        return {
          x: 0.373_056_994_818_652_84,
          y: 0.372_670_807_453_416_13,
        };
      }

      // gauntlet right
      if (enemyNPCs.some((npc) => npc.gameID === 163_620)) {
        return {
          x: 0.632_124_352_331_606_2,
          y: 0.372_670_807_453_416_13,
        };
      }

      const possibleLieutenants = new Set(
        tormentedLieutenants
          .filter(
            (lt) => lt.name.includes("Soggodon") || lt.name.includes("Oros")
          )
          .map((lt) => lt.id)
      );

      if (enemyNPCs.some((npc) => possibleLieutenants.has(npc.gameID))) {
        return {
          x: 0.621_761_658_031_088_1,
          y: 0.559_006_211_180_124_2,
        };
      }

      const enemyNPCIDs = new Set(enemyNPCs.map((npc) => npc.gameID));

      const strongPatrolIDs = [172_981, 173_016, 162_729, 166_264];

      if (strongPatrolIDs.every((id) => enemyNPCIDs.has(id))) {
        return {
          x: 0.435_233_160_621_761_65,
          y: 0.481_366_459_627_329_2,
        };
      }

      const weakPatrolIDs = [166_266, 166_264];

      if (weakPatrolIDs.every((id) => enemyNPCIDs.has(id))) {
        return {
          x: 0.373_056_994_818_652_84,
          y: 0.566_770_186_335_403_8,
        };
      }

      // back right, now uniquely identifyable via presence of Kyrian Stitchwerk
      if (enemyNPCIDs.has(172_981)) {
        return {
          x: 0.632_124_352_331_606_2,
          y: 0.434_782_608_695_652_16,
        };
      }

      // front right, now uniquely identifyable via lack of presence of
      // Patchwerk Soilders
      if (!enemyNPCIDs.has(162_729)) {
        return {
          x: 0.621_761_658_031_088_1,
          y: 0.714_285_714_285_714_3,
        };
      }

      // back left, now uniquely identifyable via presence of Loyal Creation
      if (enemyNPCIDs.has(165_911)) {
        return {
          x: 0.373_056_994_818_652_84,
          y: 0.434_782_608_695_652_16,
        };
      }

      // only front left remaining
      return {
        x: 0.388_601_036_269_430_04,
        y: 0.714_285_714_285_714_3,
      };
    }

    if (id === 1668) {
      return {
        x: 0.497_409_326_424_870_46,
        y: 0.434_782_608_695_652_16,
      };
    }
  }

  const percentX = (x - minX) / (maxX - minX);
  const percentY = (y - maxY) / (minY - maxY);

  return {
    x: percentX,
    y: percentY,
  };
};

type PullWipePercentMeta = {
  dungeonID: DungeonIDs;
  playerDeathEvents: DeathEvent[];
  deathEventMap: Record<number, (DeathEvent | BeginCastEvent)[]>;
  deathCountMap: Record<number, Record<number, number>>;
};

const calculatePullsWithWipesAndPercent = (
  pulls: Omit<PersistedDungeonPull, "id" | "percent" | "isWipe">[],
  {
    dungeonID,
    playerDeathEvents,
    deathEventMap,
    deathCountMap,
  }: PullWipePercentMeta
): Omit<PersistedDungeonPull, "id">[] => {
  const dungeon = dungeonMap[dungeonID];
  const hasNoWipes = playerDeathEvents.length < 5;

  let skipNextPull = false;

  const soaAngelDeathMap =
    dungeonID === DungeonIDs.SPIRES_OF_ASCENSION
      ? Object.fromEntries([...SOA_FINAL_BOSS_ANGELS].map((id) => [id, false]))
      : {};

  return pulls.reduce<Omit<PersistedDungeonPull, "id">[]>(
    (acc, pull, index) => {
      if (skipNextPull) {
        skipNextPull = false;
        return acc;
      }

      // TODO: ensure that in deathEventMap pets are not included
      const killedNPCTargetIDsOfThisPull = new Set(
        deathEventMap[pull.startTime].map((event) => event.targetID)
      );

      // ensure this pull isn't effectively empty, e.g. only 1 Spiteful Shade
      const enemyNPCs = pull.enemyNPCs.filter((npc) => {
        // ignore generally excluded NPCs to reduce noise
        if (EXCLUDED_NPCS.has(npc.gameID)) {
          return false;
        }

        // each angel before Devos sends two DeathEvents - one on actual death,
        // one when their ability is transferred to the next, around 6 seconds later
        // which may show up in logs while already fighting the next
        // search here for `Lakesis` for example
        // https://www.warcraftlogs.com/reports/BafFCwYDkrX2KTpv#fight=3&type=summary&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22death%22&view=events
        if (SOA_FINAL_BOSS_ANGELS.has(npc.gameID)) {
          const diedPrior = soaAngelDeathMap[npc.gameID];

          if (diedPrior) {
            return false;
          }

          soaAngelDeathMap[npc.gameID] = true;
        }

        // skip adding units that somehow appear in multiple pulls, e.g.
        // Ickor Bileflesh in PF
        const wasKilledDuringThisPull = killedNPCTargetIDsOfThisPull.has(
          npc.id
        );

        // check whether the next pull kills this unit. if so, merge the pulls
        // this occurs e.g. in report /BjF97Nm1faLkCnwT/17 for Ickor Bileflesh
        if (!wasKilledDuringThisPull) {
          const nextPull = pulls[index + 1];

          if (!nextPull) {
            return true;
          }

          const killedNPCTargetIDsOfNextPull = new Set(
            deathEventMap[nextPull.startTime].map((event) => event.targetID)
          );
          const getsKilledDuringNextPull = killedNPCTargetIDsOfNextPull.has(
            npc.id
          );

          if (nextPull.enemyNPCs.length === 1 && getsKilledDuringNextPull) {
            // merge fight duration
            pull.endTime = nextPull.endTime;
            skipNextPull = true;
            return true;
          }
        }

        // some bosses, e.g. Globgrog don't have death events, but phaseend
        // some bosses die shortly after a pull ended e.g. Margrave Stradama
        const isBoss = allBossIDs.has(npc.gameID);

        return wasKilledDuringThisPull || isBoss;
      });

      if (enemyNPCs.length === 0) {
        return acc;
      }

      const totalCount = enemyNPCs.reduce(
        createTotalCountReducer(
          {
            ...deathCountMap[pull.startTime],
            // merge deaths from next pull into this one
            ...(skipNextPull
              ? deathCountMap[pulls[index + 1].startTime]
              : null),
          },
          dungeon
        ),
        0
      );

      const percent = (totalCount / dungeon.count) * 100;
      const isWipe = hasNoWipes ? false : isPullWipe(playerDeathEvents, pull);

      // skip pulls that
      if (
        // gave no percent
        percent === 0 &&
        // - are not a wipe
        !isWipe &&
        // - are not a boss fight
        !enemyNPCs.some((npc) => allBossIDs.has(npc.gameID)) &&
        // - are not a Tormented lieutenant (high change of being a 0% pull)
        !enemyNPCs.some((npc) => tormentedLieutenantIDSet.has(npc.gameID))
      ) {
        return acc;
      }

      const zone = dungeon.zones.find((zone) => pull.maps[0] === zone.id);

      if (!zone) {
        return acc;
      }

      const { x, y } = calculatePullCoordinates(
        pull,
        zone,
        dungeonID,
        enemyNPCs
      );

      return [
        ...acc,
        {
          ...pull,
          isWipe,
          percent,
          enemyNPCs,
          x,
          y,
        },
      ];
    },
    []
  );
};

// map of { [startTime]: enemyDeathEvents }
const createPullNPCDeathEventMap = (
  pulls: Omit<PersistedDungeonPull, "id" | "percent" | "isWipe">[],
  enemyDeathEvents: (BeginCastEvent | DeathEvent)[]
): Record<number, (BeginCastEvent | DeathEvent)[]> => {
  return Object.fromEntries<(DeathEvent | BeginCastEvent)[]>(
    pulls.map(({ startTime, endTime }) => {
      return [
        startTime,
        enemyDeathEvents.filter(
          ({ timestamp }) => timestamp >= startTime && timestamp <= endTime
        ),
      ];
    })
  );
};

// map of { [startTime]: { [targetID]: count } } including every pull
const createPullNPCDeathCountMap = (
  deathEventMap: ReturnType<typeof createPullNPCDeathEventMap>
): Record<number, Record<number, number>> => {
  return Object.fromEntries<Record<number, number>>(
    Object.entries(deathEventMap).map(([startTimeStr, events]) => {
      const startTime = Number.parseInt(startTimeStr);

      return [
        startTime,
        // eslint-disable-next-line unicorn/prefer-object-from-entries
        events.reduce<Record<number, number>>(
          (acc, { type, targetID, sourceID }) => {
            // differentiate between `BeginCastEvent` and `DeathEvent`
            const key = type === "death" ? targetID : sourceID;
            acc[key] = (acc[key] ?? 0) + 1;

            return acc;
          },
          {}
        ),
      ];
    })
  );
};

export const fightHandler = nc()
  .get(createValidReportIDMiddleware("reportID"))
  .get(validFightIDMiddleware)
  .get(handler);
