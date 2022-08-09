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
} from "@prisma/client";
import nc from "next-connect";

import type { DungeonMeta } from "../../db/data/dungeons";
import {
  dungeons,
  EXCLUDED_NPCS,
  allBossIDs,
  DungeonIDs,
  SOA_FINAL_BOSS_ANGELS,
  Boss,
  isMultiTargetBossFight,
  findDungeonByIDAndMaps,
} from "../../db/data/dungeons";
import { spells } from "../../db/data/spellIds";
import { prisma } from "../../db/prisma";
import { getFightPulls } from "../../wcl/queries";
import type { EventParams } from "../../wcl/queries/events";
import { getEvents } from "../../wcl/queries/events";
import { EXPLOSIVE } from "../../wcl/queries/events/affixes/explosive";
import {
  defaultBrokerRestorationID,
  shroudedNathrezimInfiltratorID,
  shroudedZulgamuxID,
  zulgamuxBrokerRestorationID,
} from "../../wcl/queries/events/affixes/shrouded";
import {
  tormentedAbilityGameIDSet,
  tormentedLieutenantIDSet,
  tormentedLieutenants,
} from "../../wcl/queries/events/affixes/tormented";
import { racialAbilityIDCooldownMap } from "../../wcl/queries/events/racials";
import { trinketAbilityIDCooldownMap } from "../../wcl/queries/events/trinkets";
import type {
  DeathEvent,
  BeginCastEvent,
  DamageEvent,
  AllTrackedEventTypes,
  CastEvent,
} from "../../wcl/queries/events/types";
import { processEvents } from "../../wcl/transform";
import type {
  PersistableDungeonPull,
  PersistedDungeonPull,
} from "../../wcl/transform/utils";
import {
  configureScope,
  createValidReportIDMiddleware,
  validFightIDMiddleware,
  withSentry,
} from "../middleware";
import { sortByRole } from "../utils";
import {
  cacheControlKey,
  STALE_WHILE_REVALIDATE_SEVEN_DAYS,
  NO_CACHE,
  STALE_WHILE_REVALIDATE_FIVE_MINUTES,
} from "../utils/cache";
import type { FightHandlerErrorType } from "../utils/errors";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
  OK,
  SERVICE_UNAVAILABLE,
} from "../utils/statusCodes";
import type { RequestHandler } from "../utils/types";

type Request = {
  query: {
    reportID: string;
    fightID: string;
  };
};

export type FightErrorResponse = {
  error: FightHandlerErrorType;
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
    legendaries: Legendary["id"][];
    conduits: (Pick<Conduit, "id"> & {
      itemLevel: PlayerConduit["itemLevel"];
    })[];
    covenantTraits: CovenantTrait["id"][];
    talents: Talent["id"][];
    covenant: Covenant["id"] | null;
    soulbind: Soulbind["id"] | null;
    name: Character["name"];
    server: Server["name"];
    region: Region["slug"];
    tormented: Ability["id"][];
  })[];
  pulls: (Pick<Pull, "x" | "y" | "isWipe"> & {
    startTime: number;
    endTime: number;
    events: (Pick<
      Event,
      | "sourcePlayerID"
      | "targetPlayerID"
      | "sourceNPCInstance"
      | "targetNPCInstance"
      | "damage"
      | "healingDone"
      | "stacks"
    > & {
      timestamp: number;
      type: Event["eventType"] | "AbilityReady" | "MissedInterrupt";
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
    npcs: (Pick<NPC, "id"> & Pick<PullNPC, "count">)[];
    id: number;
    hasBoss: boolean;
  })[];
};

export type FightResponse = FightErrorResponse | FightSuccessResponse;

export const fightHasDungeon = (
  fight: RawFight
): fight is RawFightWithDungeon => {
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
      startTime: number;
      endTime: number;
      dungeon: Pick<Dungeon, "id"> | null;
      PlayerFight: {
        player: Pick<
          Player,
          "id" | "actorID" | "deaths" | "dps" | "hps" | "itemLevel"
        > & {
          spec: Pick<Spec, "id" | "role">;
          PlayerLegendary: {
            legendary: {
              id: number;
            } | null;
          }[];
          PlayerConduit: ({
            conduit: Pick<Conduit, "id">;
          } & Pick<PlayerConduit, "itemLevel">)[];
          PlayerCovenantTrait: {
            covenantTrait: Pick<CovenantTrait, "id">;
          }[];
          PlayerTalent: {
            talent: Pick<Talent, "id">;
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
      Pull: (Pick<Pull, "x" | "y" | "isWipe" | "percent"> & {
        startTime: number;
        endTime: number;
        PullZone: { zone: Pick<Zone, "id"> }[];
        PullNPC: (Pick<PullNPC, "count"> & { npc: Pick<NPC, "id"> })[];
        Event: (Pick<
          Event,
          | "eventType"
          | "sourcePlayerID"
          | "targetPlayerID"
          | "sourceNPCInstance"
          | "targetNPCInstance"
          | "damage"
          | "healingDone"
          | "stacks"
          | "id"
        > & {
          timestamp: number;
          sourceNPC: NPC | null;
          targetNPC: NPC | null;
          ability: Ability | null;
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

export const loadExistingFight = async (
  reportID: string,
  fightID: number
): Promise<RawFight> => {
  const rawFight = await prisma.fight.findFirst({
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
              PlayerLegendary: {
                select: {
                  legendary: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
              PlayerConduit: {
                select: {
                  itemLevel: true,
                  conduit: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
              PlayerCovenantTrait: {
                select: {
                  covenantTrait: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
              PlayerTalent: {
                select: {
                  talent: {
                    select: {
                      id: true,
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
              id: true,
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
  });

  // BigInt.toJSON is polyfilled
  return JSON.parse(JSON.stringify(rawFight));
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

const eventHasRelevantAbilityAndSourcePlayerIDAndIsNotInterruptEvent = (
  event: Omit<
    FightSuccessResponse["pulls"][number]["events"][number],
    "category" | "relTimestamp"
  >
): event is EventWithAbilityAndSourcePlayerID => {
  if (
    event.type !== "Cast" ||
    !("ability" in event) ||
    event.sourcePlayerID === null ||
    event.ability === null
  ) {
    return false;
  }

  if (
    event.ability.id in spells ||
    event.ability.id in trinketAbilityIDCooldownMap ||
    event.ability.id in racialAbilityIDCooldownMap
  ) {
    return true;
  }

  return false;
};

const findCD = (id: number) => {
  if (id in spells) {
    return spells[id].cd;
  }

  if (id in racialAbilityIDCooldownMap) {
    return racialAbilityIDCooldownMap[id];
  }

  return trinketAbilityIDCooldownMap[id];
};

type CalcAbilityReadyEventsReturn = Omit<
  FightSuccessResponse["pulls"][number]["events"][number],
  "category" | "relTimestamp"
>[];

const calculateAbilityReadyEvents = (
  allEvents: Omit<
    FightSuccessResponse["pulls"][number]["events"][number],
    "category" | "relTimestamp"
  >[],
  keyEnd: number
): CalcAbilityReadyEventsReturn => {
  const response: CalcAbilityReadyEventsReturn = [];

  const generallyRelevantEvents = allEvents.filter(
    eventHasRelevantAbilityAndSourcePlayerIDAndIsNotInterruptEvent
  );

  // for const ... is around 2x faster than a reduce here
  for (const event of generallyRelevantEvents) {
    const index = generallyRelevantEvents.indexOf(event);

    const cd = findCD(event.ability.id);

    const nextCast = generallyRelevantEvents
      .slice(index)
      .find(
        (dataset) =>
          dataset.timestamp > event.timestamp &&
          dataset.sourcePlayerID === event.sourcePlayerID &&
          dataset.ability.id === event.ability.id
      );

    if (nextCast) {
      const diff = (nextCast.timestamp - event.timestamp) / 1000;

      if (diff >= cd) {
        const wasted = diff >= 2 * cd;
        const nextTimestamp = event.timestamp + cd * 1000;

        if (nextTimestamp <= keyEnd) {
          response.push({
            type: "AbilityReady",
            timestamp: nextTimestamp,
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
          });
        }
      }
    } else {
      const nextTimestamp = event.timestamp + cd * 1000;

      if (nextTimestamp <= keyEnd) {
        response.push({
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
        });
      }
    }
  }

  return response;
};

const notNecessarilyMissingInterruptingAbilities = new Set([
  31_935, // Avenger's Shield
]);

type CalcMissedInterruptEventsReturn = CalcAbilityReadyEventsReturn;

const calculateMissedInterruptEvents = (
  allEvents: Omit<
    FightSuccessResponse["pulls"][number]["events"][number],
    "category" | "relTimestamp"
  >[]
): CalcMissedInterruptEventsReturn => {
  return allEvents.reduce<CalcMissedInterruptEventsReturn>(
    (acc, event, index) => {
      if (
        event.type !== "Cast" ||
        event.interruptedAbility ||
        !event.sourcePlayerID ||
        !event.ability ||
        // ignore e.g. cast events of NW weapons
        !(event.ability.id in spells) ||
        // ignore abilities that _may_ interrupt but don't necessarily
        notNecessarilyMissingInterruptingAbilities.has(event.ability.id)
      ) {
        return acc;
      }

      const { type, cd } = spells[event.ability.id];

      if (!type || !type.includes("interrupt")) {
        return acc;
      }

      const threshold = event.timestamp + cd * 1000;

      let isMissed = true;

      // check the next following 10 events as it's not necesarily the directly
      // following event that indicates the actual interrupt event
      for (let i = 1; i <= 10; i++) {
        const nextEvent = allEvents[index + i];

        if (
          !nextEvent ||
          !nextEvent.ability ||
          // interrupt must follow before its off cd again
          nextEvent.timestamp >= threshold
        ) {
          continue;
        }

        if (
          nextEvent.type === "Interrupt" &&
          // must be the same player
          nextEvent.sourcePlayerID === event.sourcePlayerID &&
          // casting the same ability
          nextEvent.ability.id === event.ability.id
          // otherwise, e.g. Sigil of Silence may hit the same second
          // a Disrupt kicked the same ability
        ) {
          isMissed = false;
          break;
        }
      }

      if (!isMissed) {
        return acc;
      }

      return [
        ...acc,
        {
          type: "MissedInterrupt",
          timestamp: event.timestamp,
          sourcePlayerID: event.sourcePlayerID,
          ability: {
            id: event.ability.id,
            lastUse: event.timestamp,
            nextUse: null,
            wasted: true,
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
    },
    []
  );
};

type CalcEventsBeforeDuringAfterPullReturn = {
  before: Omit<
    FightSuccessResponse["pulls"][number]["events"][number],
    "relTimestamp"
  >[];
  during: Omit<
    FightSuccessResponse["pulls"][number]["events"][number],
    "relTimestamp"
  >[];
  after: Omit<
    FightSuccessResponse["pulls"][number]["events"][number],
    "relTimestamp"
  >[];
  middleAfterLastPull: number | null;
  middleAfterThisPull: number | null;
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
  lastPullEnd: number | null;
  nextPullStart: number | null;
  pullStart: number;
  pullEnd: number;
}): CalcEventsBeforeDuringAfterPullReturn => {
  // events that occured later than 50% of the time between two pulls count
  // towards this pull
  const middleAfterLastPull = lastPullEnd
    ? lastPullEnd + (pullStart - lastPullEnd) / 2
    : 0;

  // events that occured earlier than 50% of the time between two pulls count
  // towards this pull
  const middleAfterThisPull = nextPullStart
    ? pullEnd + (nextPullStart - pullEnd) / 2
    : Infinity;

  const { after, during, before } = allEvents.reduce<{
    after: CalcEventsBeforeDuringAfterPullReturn["after"];
    before: CalcEventsBeforeDuringAfterPullReturn["before"];
    during: CalcEventsBeforeDuringAfterPullReturn["during"];
  }>(
    (acc, event) => {
      if (
        // must be past pull end
        event.timestamp > pullEnd &&
        // and before half way to next pull / eternity
        event.timestamp < middleAfterThisPull
      ) {
        acc.after.push({ ...event, category: EventCategory.AFTER });
        return acc;
      }

      if (event.timestamp >= pullStart && event.timestamp <= pullEnd) {
        acc.during.push({ ...event, category: EventCategory.DURING });
        return acc;
      }

      if (
        // must be before pull start
        event.timestamp < pullStart &&
        // and either everything before first pull OR closer to this pull
        (lastPullEnd === null || event.timestamp >= middleAfterLastPull)
      ) {
        acc.before.push({ ...event, category: EventCategory.BEFORE });
        return acc;
      }

      return acc;
    },
    {
      before: [],
      during: [],
      after: [],
    }
  );

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

const findThisPullsMissedInterruptEvents = (
  events: ReturnType<typeof calculateMissedInterruptEvents>,
  {
    pullEnd,
    pullStart,
  }: {
    pullStart: number;
    pullEnd: number;
  }
) => {
  return events
    .filter(
      (event) => event.timestamp >= pullStart && event.timestamp <= pullEnd
    )
    .map((event) => ({
      ...event,
      category: EventCategory.DURING,
    }));
};

export const createResponseFromStoredFight = (
  dataset: RawFightWithDungeon
): FightSuccessResponse => {
  const lastAbilityUsageMap = new Map<string, number>();

  const flatEvents = dataset.Pull.flatMap((pull) => pull.Event);

  const allEvents = flatEvents.map<
    Omit<
      FightSuccessResponse["pulls"][number]["events"][number],
      "category" | "relTimestamp"
    >
  >(
    ({
      eventType,
      ability,
      timestamp,
      sourcePlayerID,
      damage,
      healingDone,
      interruptedAbility,
      sourceNPC,
      sourceNPCInstance,
      stacks,
      targetNPC,
      targetNPCInstance,
      targetPlayerID,
    }) => {
      const maybeInterruptedAbility = interruptedAbility
        ? interruptedAbility.id
        : null;

      const defaults = {
        sourceNPC,
        sourceNPCInstance,
        stacks,
        targetNPC,
        targetNPCInstance,
        targetPlayerID,
        damage,
        healingDone,
        interruptedAbility: maybeInterruptedAbility,
      };

      if (!ability) {
        return {
          ...defaults,
          sourcePlayerID,
          timestamp,
          type: eventType,
          ability: null,
        };
      }

      if (!sourcePlayerID) {
        // other actors, e.g. environment or npcs
        return {
          ...defaults,
          sourcePlayerID,
          timestamp,
          type: eventType,
          ability: {
            id: ability.id,
            lastUse: null,
            nextUse: null,
            wasted: false,
          },
        };
      }

      // player actor
      const key = `${sourcePlayerID}-${ability.id}-${eventType}`;
      const lastUse = lastAbilityUsageMap.get(key) ?? null;
      lastAbilityUsageMap.set(key, timestamp);

      const nextUsageEvent = flatEvents.find(
        (event) =>
          event.timestamp > timestamp &&
          event.ability &&
          event.ability.id === ability.id &&
          event.sourcePlayerID &&
          event.sourcePlayerID === sourcePlayerID
      );

      const nextUse = nextUsageEvent ? nextUsageEvent.timestamp : null;

      return {
        ...defaults,
        sourcePlayerID,
        timestamp,
        type: eventType,
        ability: {
          id: ability.id,
          lastUse,
          nextUse,
          wasted: false,
        },
      };
    }
  );

  const abilityReadyEvents = calculateAbilityReadyEvents(
    allEvents,
    dataset.endTime
  );
  const missedInterruptEvents = calculateMissedInterruptEvents(allEvents);

  const pulls = dataset.Pull.map<FightSuccessResponse["pulls"][number]>(
    (pull, index) => {
      const npcs = pull.PullNPC.map<
        FightSuccessResponse["pulls"][number]["npcs"][number]
      >((pullNPC) => {
        return {
          count: pullNPC.count,
          id: pullNPC.npc.id,
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
        lastPullEnd: dataset.Pull[index - 1]?.endTime ?? null,
        nextPullStart: dataset.Pull[index + 1]?.startTime ?? null,
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

      const thisPullMissedInterruptEvents = findThisPullsMissedInterruptEvents(
        missedInterruptEvents,
        {
          pullStart: pull.startTime,
          pullEnd: pull.endTime,
        }
      );

      const events: FightSuccessResponse["pulls"][number]["events"] = [
        ...before,
        ...during,
        ...after,
        ...thisPullAbilityReadyEvents,
        ...thisPullMissedInterruptEvents,
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

        const conduits: FightSuccessResponse["player"][number]["conduits"] =
          playerFight.player.PlayerConduit.map((playerConduit) => {
            return {
              itemLevel: playerConduit.itemLevel,
              id: playerConduit.conduit.id,
            };
          });

        const legendaries = playerFight.player.PlayerLegendary.reduce<
          FightSuccessResponse["player"][number]["legendaries"]
        >((acc, playerLegendary) => {
          return playerLegendary.legendary
            ? [...acc, playerLegendary.legendary.id]
            : acc;
        }, []);

        const covenantTraits: FightSuccessResponse["player"][number]["covenantTraits"] =
          playerFight.player.PlayerCovenantTrait.map(
            (playerCovenantTrait) => playerCovenantTrait.covenantTrait.id
          );

        const talents: FightSuccessResponse["player"][number]["talents"] =
          playerFight.player.PlayerTalent.map(
            (playerTalent) => playerTalent.talent.id
          );

        return {
          id: playerFight.player.id,
          actorID: playerFight.player.actorID,
          deaths: playerFight.player.deaths,

          itemLevel: playerFight.player.itemLevel,
          spec: playerFight.player.spec.id,
          legendaries,
          conduits,
          covenantTraits,
          talents,
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

const loadAndTransformPulls = async ({
  reportID,
  fightID,
}: {
  reportID: string;
  fightID: number;
}): Promise<Omit<PersistableDungeonPull, "isWipe" | "percent" | "count">[]> => {
  const maybeFightPulls = await getFightPulls({
    reportID,
    fightIDs: [fightID],
  });

  if (!maybeFightPulls.reportData?.report?.fights?.[0]?.dungeonPulls) {
    return [];
  }

  return maybeFightPulls.reportData.report.fights[0].dungeonPulls.reduce<
    Omit<PersistableDungeonPull, "isWipe" | "percent" | "count">[]
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
};

const loadEvents = async (
  fight: NonNullable<RawFight>,
  reportID: string,
  dungeonID: number
) => {
  const params: EventParams = {
    reportID,
    startTime: fight.startTime,
    endTime: fight.endTime,
    fightID: fight.fightID,
    dungeonID,
    affixes: [
      fight.Report.week.affix1.name,
      fight.Report.week.affix2.name,
      fight.Report.week.affix3.name,
      fight.Report.week.season.affix.name,
    ],
  };

  const playerMetaInformation = fight.PlayerFight.map((playerFight) => {
    return {
      actorID: playerFight.player.actorID,
      class: playerFight.player.character.class.id,
    };
  });

  return getEvents(params, playerMetaInformation);
};

const getResponseOrRetrieveAndCreateFight = async (
  maybeStoredFight: NonNullable<RawFight>,
  reportID: string,
  fightID: number
): Promise<{
  status:
    | typeof OK
    | typeof BAD_REQUEST
    | typeof INTERNAL_SERVER_ERROR
    | typeof UNPROCESSABLE_ENTITY;
  json: FightResponse;
  cache: boolean;
}> => {
  console.time("loadAndTransformPulls");
  const dungeonPulls = await loadAndTransformPulls({
    reportID,
    fightID: maybeStoredFight.fightID,
  });
  console.timeEnd("loadAndTransformPulls");

  if (dungeonPulls.length === 0) {
    return {
      status: BAD_REQUEST,
      cache: false,
      json: {
        error: "BROKEN_LOG_OR_WCL_UNAVAILABLE",
      },
    };
  }

  const dungeonID = ensureCorrectDungeonID(
    maybeStoredFight.dungeon,
    dungeonPulls
  );

  if (!dungeonID) {
    return {
      status: UNPROCESSABLE_ENTITY,
      cache: false,
      json: {
        error: "MISSING_DUNGEON",
      },
    };
  }

  const dungeon = findDungeonByIDAndMaps(
    new Set(dungeonPulls.flatMap((pull) => pull.maps)),
    { id: dungeonID }
  );

  if (!dungeon) {
    return {
      status: UNPROCESSABLE_ENTITY,
      cache: false,
      json: {
        error: "MISSING_DUNGEON",
      },
    };
  }

  console.time("loadEvents");
  const { allEvents, playerDeathEvents, enemyDeathEvents, explosiveTargetID } =
    await loadEvents(maybeStoredFight, reportID, dungeonID);
  console.timeEnd("loadEvents");

  const pullNPCDeathEventMap = createPullNPCDeathEventMap(
    dungeonPulls,
    enemyDeathEvents
  );

  const pullNPCDeathCountMap = createPullNPCDeathCountMap(pullNPCDeathEventMap);

  const pullsWithWipesAndPercent = calculatePullsWithWipesAndPercent(
    dungeonPulls,
    {
      dungeon,
      dungeonID,
      playerDeathEvents,
      deathCountMap: pullNPCDeathCountMap,
      deathEventMap: pullNPCDeathEventMap,
    },
    allEvents
  );

  console.time("persistPulls");
  const persistedPulls = await persistPulls(
    pullsWithWipesAndPercent,
    maybeStoredFight.id
  );
  console.timeEnd("persistPulls");

  const persistableMaps =
    persistedPulls.flatMap<Prisma.PullZoneCreateManyInput>((pull) => {
      return pull.maps.map((map) => {
        return {
          pullID: pull.id,
          zoneID: map,
        };
      });
    });

  const actorPlayerMap = new Map(
    maybeStoredFight.PlayerFight.map((playerFight) => [
      playerFight.player.actorID,
      playerFight.player.id,
    ])
  );

  const allPulledNPCsMap = {
    ...Object.fromEntries(
      persistedPulls.flatMap((pull) =>
        pull.enemyNPCs.map((npc) => [npc.id, npc.gameID])
      )
    ),
    /**
     * Explosives are notoriously hard to detect and only sometimes naturally
     * appear in pulled npcs. Once we've determined their unit id and thus their
     * presence in a fight, we just merge them in additionally
     */
    ...(explosiveTargetID ? { [explosiveTargetID]: EXPLOSIVE.unit } : null),
  };

  const persistablePullEvents = persistedPulls.flatMap((pull, index) => {
    const lastPull = persistedPulls[index - 1];

    const isFirstPull = index === 0;
    const isLastPull = index + 1 === persistedPulls.length;

    const thisPullsEvents = allEvents.filter(({ timestamp }) => {
      // very first pull - include events that happened before this pull
      if (isFirstPull && timestamp < pull.startTime) {
        return true;
      }

      // very last pull - include events that happened after this pull
      if (isLastPull && timestamp > pull.endTime) {
        return true;
      }

      if (timestamp >= pull.startTime && timestamp <= pull.endTime) {
        return true;
      }

      if (lastPull) {
        // some CDs may be used outside of a pull in preparation to set it up
        // e.g. Sigil of Silence/Chains/Imprison right before pulling.
        // Because of that, any event past the last pull and before this will be
        // attached to the next pull.
        return timestamp > lastPull.endTime && timestamp < pull.startTime;
      }

      return false;
    });

    return processEvents(
      pull,
      thisPullsEvents,
      actorPlayerMap,
      allPulledNPCsMap
    ).map<Prisma.EventCreateManyInput>((event) => {
      return {
        ...event,
        pullID: pull.id,
      };
    });
  });

  const isFirstRetrieval =
    maybeStoredFight.Pull.length === 0 ||
    maybeStoredFight.percent === 0 ||
    !fightHasDungeon(maybeStoredFight);

  const abilityIDs = persistablePullEvents
    .map((event) => {
      if (event.eventType === "Interrupt" && event.interruptedAbilityID) {
        return event.interruptedAbilityID;
      }
      return null;
    })
    .filter((id): id is number => id !== null);

  await prisma.ability.createMany({
    skipDuplicates: true,
    data: abilityIDs.map((id) => {
      return {
        id,
        name: `${id}`,
      };
    }),
  });

  console.time("transaction");

  await prisma.$transaction([
    // only persist this data if it wasnt previously
    ...(isFirstRetrieval
      ? [
          prisma.fight.update({
            data: {
              percent: calculateTotalPercent(
                pullsWithWipesAndPercent,
                dungeonID,
                new Set(persistableMaps.map((map) => map.zoneID))
              ),
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
            data: persistedPulls.flatMap<Prisma.PullNPCCreateManyInput>(
              (pull) => {
                const npcDeathCountMap = pullNPCDeathCountMap[pull.startTime];

                return pull.enemyNPCs.map((npc) => {
                  // default to 1 for npcs that appear in the pull and thus are enemy
                  // units but didn't die, e.g. for some reason Dealer in DoS,
                  // slime minigame in DoS as well as invisible units

                  const deathCountOfThisNPC = isMultiTargetBossFight(npc.gameID)
                    ? 1
                    : npcDeathCountMap[npc.id] ?? 1;

                  return {
                    npcID: npc.gameID,
                    count: deathCountOfThisNPC,
                    pullID: pull.id,
                  };
                });
              }
            ),
          }),
        ]
      : []),
    // always persist events in order to format them
    prisma.event.createMany({
      skipDuplicates: true,
      data: persistablePullEvents,
    }),
  ]);
  console.timeEnd("transaction");

  console.time("loadExistingFight");
  const rawFight = await loadExistingFight(reportID, fightID);
  console.timeEnd("loadExistingFight");

  if (!fightHasDungeon(rawFight)) {
    return {
      status: INTERNAL_SERVER_ERROR,
      cache: false,
      json: {
        error: "FATAL_ERROR",
      },
    };
  }

  // this looks odd but its solely here to reduce storage.
  // at ~1500 reports, the Events table is ~300MB of the 500MB free tier on
  // supabase. cleaning these up and retrieving them only on demand
  // with a proper caching strategy reduces strain on both ends.
  await prisma.event.deleteMany({
    where: {
      id: {
        in: rawFight.Pull.flatMap((pull) =>
          pull.Event.map((event) => event.id)
        ),
      },
    },
  });

  return {
    status: OK,
    cache: true,
    json: createResponseFromStoredFight(rawFight),
  };
};

const handler: RequestHandler<Request, FightResponse> = async (req, res) => {
  try {
    const { reportID } = req.query;
    const fightID = Number.parseInt(req.query.fightID);

    configureScope((scope) => {
      scope.setTag("reportID", reportID);
      scope.setTag("fightID", fightID);
    });

    console.time("loadExistingFight");
    const maybeStoredFight = await loadExistingFight(reportID, fightID);
    console.timeEnd("loadExistingFight");

    if (!maybeStoredFight) {
      res.setHeader(cacheControlKey, NO_CACHE);
      res.status(NOT_FOUND).json({ error: "UNKNOWN_REPORT" });
      return;
    }

    console.time("getResponseOrRetrieveAndCreateFight");
    const { status, json, cache } = await getResponseOrRetrieveAndCreateFight(
      maybeStoredFight,
      reportID,
      fightID
    );
    console.timeEnd("getResponseOrRetrieveAndCreateFight");

    if (cache) {
      res.setHeader(cacheControlKey, STALE_WHILE_REVALIDATE_SEVEN_DAYS);
    }

    res.status(status).json(json);
  } catch (error) {
    res.setHeader(cacheControlKey, STALE_WHILE_REVALIDATE_FIVE_MINUTES);

    // gql status is 200, but throws an error regardless
    if (JSON.stringify(error).includes("permission")) {
      res.status(BAD_REQUEST).json({
        error: "PRIVATE_REPORT",
      });

      return;
    }

    // eslint-disable-next-line no-console
    console.log(error);

    res.status(SERVICE_UNAVAILABLE).json({
      error: "BROKEN_LOG_OR_WCL_UNAVAILABLE",
    });
  }
};

const ensureCorrectDungeonID = (
  storedDungeon: { id: number } | null,
  pulls: Omit<PersistedDungeonPull, "id" | "isWipe" | "percent" | "count">[]
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
  dungeonPulls: PersistableDungeonPull[],
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

  const rawStoredPulls = await prisma.pull.findMany({
    where: {
      OR: pulls,
    },
    select: {
      startTime: true,
      endTime: true,
      id: true,
    },
  });

  const storedPulls = JSON.parse(JSON.stringify(rawStoredPulls)) as {
    id: number;
    startTime: number;
    endTime: number;
  }[];

  return dungeonPulls.reduce<PersistedDungeonPull[]>((acc, pull) => {
    const match = storedPulls.find(
      (storedPull) =>
        // coming from the DB, these are bigints
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
  { unitCountMap }: DungeonMeta
) => {
  return (acc: number, npc: { id: number; gameID: number }) => {
    const deathCount = npcDeathCountMap[npc.id] ?? 0;
    const npcCount = unitCountMap[npc.gameID] ?? 0;

    return acc + npcCount * deathCount;
  };
};

const calculatePullCoordinates = (
  {
    x,
    y,
    enemyNPCs,
  }: Omit<PersistedDungeonPull, "id" | "percent" | "isWipe" | "count">,
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
      x: 0.676_229_508_196_721_3,
      y: 0.261_273_168_782_467_04,
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
  dungeon: DungeonMeta;
  playerDeathEvents: DeathEvent[];
  deathEventMap: ReturnType<typeof createPullNPCDeathEventMap>;
  deathCountMap: Record<number, Record<number, number>>;
};

const findShroudedRestorationCasts = (
  casts: CastEvent[],
  pull: Omit<PersistableDungeonPull, "percent" | "isWipe" | "count">,
  allPulls: Omit<PersistableDungeonPull, "percent" | "isWipe" | "count">[]
) => {
  const restorationCastsDuringThisPull = casts.filter(
    (event) =>
      event.timestamp >= pull.startTime && event.timestamp <= pull.endTime
  );

  const nextPull = allPulls[allPulls.indexOf(pull) + 1];

  const restorationCastsBeforeNextPull = nextPull
    ? casts.filter(
        (event) =>
          event.timestamp >= pull.endTime &&
          event.timestamp <= nextPull.startTime
      )
    : [];

  return [...restorationCastsDuringThisPull, ...restorationCastsBeforeNextPull];
};

const calculatePullsWithWipesAndPercent = (
  pulls: Omit<PersistableDungeonPull, "percent" | "isWipe" | "count">[],
  {
    dungeonID,
    dungeon,
    playerDeathEvents,
    deathEventMap,
    deathCountMap,
  }: PullWipePercentMeta,
  allEvents: AllTrackedEventTypes[]
): PersistableDungeonPull[] => {
  const hasNoWipes = playerDeathEvents.length < 5;

  let skipNextPull = false;

  const soaAngelDeathMap =
    dungeonID === DungeonIDs.SPIRES_OF_ASCENSION
      ? Object.fromEntries([...SOA_FINAL_BOSS_ANGELS].map((id) => [id, false]))
      : {};

  const { infiltratorTargetID, zulgamuxTargetID } = pulls.reduce<{
    infiltratorTargetID: number | null;
    zulgamuxTargetID: number | null;
  }>(
    (acc, pull) => {
      if (acc.infiltratorTargetID && acc.zulgamuxTargetID) {
        return acc;
      }

      if (!acc.infiltratorTargetID) {
        const match = pull.enemyNPCs.find(
          (npc) => npc.gameID === shroudedNathrezimInfiltratorID
        );

        if (match) {
          acc.infiltratorTargetID = match.id;
        }
      }

      if (!acc.zulgamuxTargetID) {
        const match = pull.enemyNPCs.find(
          (npc) => npc.gameID === shroudedZulgamuxID
        );

        if (match) {
          acc.zulgamuxTargetID = match.id;
        }
      }

      return acc;
    },
    { infiltratorTargetID: null, zulgamuxTargetID: null }
  );

  const shroudedRestorationCastEvents =
    infiltratorTargetID || zulgamuxTargetID
      ? allEvents.filter(
          (event): event is CastEvent =>
            event.type === "cast" &&
            (event.abilityGameID === defaultBrokerRestorationID ||
              event.abilityGameID === zulgamuxBrokerRestorationID)
        )
      : [];

  return pulls.reduce<PersistableDungeonPull[]>((acc, pull, index) => {
    if (skipNextPull) {
      skipNextPull = false;
      return acc;
    }

    const isLastPull = pulls.length === index + 1;
    const isWipe = hasNoWipes ? false : isPullWipe(playerDeathEvents, pull);

    // TODO: ensure that in deathEventMap pets are not included
    const killedNPCTargetIDsOfThisPull = new Set([
      ...deathEventMap[pull.startTime].map((event) =>
        event.type === "begincast" ? event.sourceID : event.targetID
      ),
      // in 648wL1X7D9fNATMv648wL1X7D9fNATMv/#fight=2 Kaal as last boss does
      // not appear as death event
      ...(isLastPull ? pull.enemyNPCs.map((npc) => npc.id) : []),
    ]);

    if (zulgamuxTargetID || infiltratorTargetID) {
      const allEvents = findShroudedRestorationCasts(
        shroudedRestorationCastEvents,
        pull,
        pulls
      );

      if (allEvents.length > 0) {
        if (!(pull.startTime in deathCountMap)) {
          deathCountMap[pull.startTime] = {};
        }

        allEvents.forEach((cast) => {
          const targetIDToAdd =
            cast.abilityGameID === defaultBrokerRestorationID
              ? infiltratorTargetID
              : zulgamuxTargetID;

          if (targetIDToAdd) {
            if (deathCountMap[pull.startTime][targetIDToAdd]) {
              deathCountMap[pull.startTime][targetIDToAdd] += 1;
            } else {
              deathCountMap[pull.startTime][targetIDToAdd] = 1;
            }

            killedNPCTargetIDsOfThisPull.add(targetIDToAdd);
          }
        });
      }
    }

    /**
     * EXPERIMENTAL
     * - in q7KrbYV1hmTWMyw fight 4 pull 2, Blightbone was pulled to reset
     * - he's instead killed 2 pulls further in, so 0 npcs die in this pull
     */
    if (killedNPCTargetIDsOfThisPull.size === 0) {
      return acc;
    }

    // ensure this pull isn't effectively empty, e.g. only 1 Spiteful Shade
    const enemyNPCs = pull.enemyNPCs.filter((npc) => {
      // ignore generally excluded NPCs to reduce noise
      if (EXCLUDED_NPCS.has(npc.gameID)) {
        return false;
      }

      // skip adding units that somehow appear in multiple pulls, e.g.
      // Ickor Bileflesh in PF
      const wasKilledDuringThisPull = killedNPCTargetIDsOfThisPull.has(npc.id);

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

        // only mark as killed if actually dies during this pull
        if (wasKilledDuringThisPull) {
          soaAngelDeathMap[npc.gameID] = true;

          // override whatever the death count map says about the death amount
          deathCountMap[pull.startTime][npc.id] = 1;
        }
      }

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
        const isKilledDuringNextPull = killedNPCTargetIDsOfNextPull.has(npc.id);

        // e.g. in case of connecting tormented LT with amarth in NW through spear
        // without filtering the boss adds would be included
        // see /KLqfvBh9CHz2dMpm#fight=3
        const relevantNPCsOfNextPull = nextPull.enemyNPCs.filter(
          (npc) => !EXCLUDED_NPCS.has(npc.gameID)
        );

        if (
          /**
           * only merge if its a not wipe, see e.g.
           * https://www.warcraftlogs.com/reports/1MGH6BRTCwNdprkf#fight=3
           * where 2 attempts are made on 3rd boss, the first being a wipe
           * which merges both pulls unintentionally
           */
          !isWipe &&
          relevantNPCsOfNextPull.length === 1 &&
          isKilledDuringNextPull
        ) {
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

    // kinda cursed. move over non death events of shrouded mobs to this pull
    if (skipNextPull) {
      const nextPull = pulls[index + 1];

      if (nextPull) {
        const allEvents = findShroudedRestorationCasts(
          shroudedRestorationCastEvents,
          nextPull,
          pulls
        );

        const amountAndTypesToAdd = allEvents.reduce(
          (acc, event) => {
            if (event.abilityGameID === defaultBrokerRestorationID) {
              acc.infiltrator += 1;
            }

            if (event.abilityGameID === zulgamuxBrokerRestorationID) {
              acc.zulgamux = 1;
            }

            return acc;
          },
          {
            infiltrator: 0,
            zulgamux: 0,
          }
        );

        if (infiltratorTargetID && amountAndTypesToAdd.infiltrator > 0) {
          if (infiltratorTargetID in deathCountMap[pull.startTime]) {
            deathCountMap[pull.startTime][infiltratorTargetID] +=
              amountAndTypesToAdd.infiltrator;
          } else {
            deathCountMap[pull.startTime][infiltratorTargetID] =
              amountAndTypesToAdd.infiltrator;
          }

          if (!enemyNPCs.some((npc) => npc.id === infiltratorTargetID)) {
            enemyNPCs.push({
              id: infiltratorTargetID,
              gameID: shroudedNathrezimInfiltratorID,
            });
          }
        }

        if (zulgamuxTargetID && amountAndTypesToAdd.zulgamux > 0) {
          deathCountMap[pull.startTime][zulgamuxTargetID] = 1;

          if (!enemyNPCs.some((npc) => npc.id === zulgamuxTargetID)) {
            enemyNPCs.push({
              id: zulgamuxTargetID,
              gameID: shroudedZulgamuxID,
            });
          }
        }
      }
    }

    if (enemyNPCs.length === 0) {
      return acc;
    }

    const totalCount = enemyNPCs.reduce(
      createTotalCountReducer(
        {
          ...deathCountMap[pull.startTime],
          // merge deaths from next pull into this one
          ...(skipNextPull ? deathCountMap[pulls[index + 1].startTime] : null),
        },
        dungeon
      ),
      0
    );

    const percent = (totalCount / dungeon.count) * 100;

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

    const { x, y } = calculatePullCoordinates(pull, zone, dungeonID, enemyNPCs);

    return [
      ...acc,
      {
        ...pull,
        isWipe,
        percent,
        enemyNPCs,
        count: totalCount,
        x,
        y,
      },
    ];
  }, []);
};

//
/**
 * map of { [startTime]: enemyDeathEvents }
 *
 * @todo for bosses: should migrate to dungeonencounterend but this requires
 * a mapping of encounterid (currently unused in KSH) to log internal unit id
 * so we can ideally fake a death event based on dungeonencounterend
 */
const createPullNPCDeathEventMap = (
  pulls: Omit<PersistedDungeonPull, "id" | "percent" | "isWipe" | "count">[],
  enemyDeathEvents: (BeginCastEvent | DeathEvent | DamageEvent)[]
): Record<number, (BeginCastEvent | DeathEvent | DamageEvent)[]> => {
  return Object.fromEntries<(DeathEvent | BeginCastEvent | DamageEvent)[]>(
    pulls.map(({ startTime, endTime }) => {
      return [
        startTime,
        enemyDeathEvents.filter(({ timestamp }) => {
          // allow a threshold of a 100ms for the game to send the death event
          // although the pull logically ends with the death of a unit, the
          // death event itself usually is delayed by some ms
          return timestamp >= startTime && timestamp <= endTime + 100;
        }),
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

export const calculateTotalPercent = (
  pulls: PersistableDungeonPull[],
  dungeonID: number,
  maps: Set<number>
): number => {
  const dungeon = findDungeonByIDAndMaps(maps, { id: dungeonID });

  if (!dungeon) {
    return 0;
  }

  const clearedCount = pulls.reduce((acc, pull) => {
    return acc + pull.count;
  }, 0);

  if (dungeon.count === clearedCount) {
    return 100;
  }

  return (clearedCount / dungeon.count) * 100;
};

export const fightHandler = nc()
  .get(createValidReportIDMiddleware("reportID"))
  .get(validFightIDMiddleware)
  // @ts-expect-error type incompatibility with next-connect, irrelevant
  .get(withSentry(handler));
