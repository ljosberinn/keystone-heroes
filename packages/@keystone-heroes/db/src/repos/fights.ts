import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { FightResponse } from "@keystone-heroes/api/handler/fight";
import type { Fight } from "@prisma/client";

const createMany = async (fights: Omit<Fight, "id">[]): Promise<void> => {
  await prisma.fight.createMany({
    data: fights,
    skipDuplicates: true,
  });
};

const loadFull = async (
  reportID: string,
  fightIDs: number[]
): Promise<FightResponse[]> => {
  const playerSelect = {
    select: {
      actorID: true,
      id: true,
      covenant: {
        select: {
          name: true,
          icon: true,
        },
      },
      dps: true,
      hps: true,
      deaths: true,
      itemLevel: true,
      spec: {
        select: {
          id: true,
          name: true,
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
          id: true,
          name: true,
          server: {
            select: {
              name: true,
            },
          },
          class: true,
        },
      },
      legendary: true,
      PlayerTalent: {
        select: {
          talent: {
            select: {
              icon: true,
              name: true,
              id: true,
            },
          },
          fightID: true,
        },
      },
      PlayerConduit: {
        select: {
          fightID: true,
          itemLevel: true,
          conduit: {
            select: {
              icon: true,
              name: true,
              id: true,
            },
          },
        },
      },
      PlayerCovenantTrait: {
        select: {
          fightID: true,
          covenantTrait: {
            select: {
              icon: true,
              id: true,
              name: true,
            },
          },
        },
      },
    },
  } as const;

  const affixSelect = {
    select: {
      id: true,
      name: true,
      icon: true,
    },
  } as const;

  const response = await prisma.fight.findMany({
    where: {
      report: {
        report: reportID,
      },
      fightID: {
        in: fightIDs,
      },
    },
    select: {
      id: true,
      fightID: true,
      averageItemLevel: true,
      chests: true,
      dps: true,
      dtps: true,
      hps: true,
      keystoneLevel: true,
      keystoneTime: true,
      totalDeaths: true,
      dungeon: {
        select: {
          Zone: {
            select: {
              id: true,
              name: true,
            },
            orderBy: {
              order: "asc",
            },
          },
          id: true,
          name: true,
          time: true,
          slug: true,
        },
      },
      week: {
        select: {
          affix1: affixSelect,
          affix2: affixSelect,
          affix3: affixSelect,
          season: {
            select: {
              affix: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                },
              },
            },
          },
        },
      },
      player1: playerSelect,
      player2: playerSelect,
      player3: playerSelect,
      player4: playerSelect,
      player5: playerSelect,
      Pull: {
        select: {
          maxX: true,
          minX: true,
          maxY: true,
          minY: true,
          x: true,
          y: true,
          startTime: true,
          endTime: true,
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
        },
        orderBy: {
          startTime: "asc",
        },
      },
    },
  });

  return response.map((fight) => {
    const composition = [
      fight.player1,
      fight.player2,
      fight.player3,
      fight.player4,
      fight.player5,
    ].map<FightResponse["composition"][number]>((dataset) => {
      const talents = dataset.PlayerTalent.filter(
        (dataset) => dataset.fightID === fight.id
      ).map((dataset) => dataset.talent);

      const conduits = dataset.PlayerConduit.filter(
        (dataset) => dataset.fightID === fight.id
      ).map((dataset) => ({
        ...dataset.conduit,
        itemLevel: dataset.itemLevel,
      }));

      const covenantTraits = dataset.PlayerCovenantTrait.filter(
        (dataset) => dataset.fightID === fight.id
      ).map((dataset) => dataset.covenantTrait);

      return {
        playerID: dataset.id,
        actorID: dataset.actorID,
        legendary: dataset.legendary,
        dps: dataset.dps,
        hps: dataset.hps,
        deaths: dataset.deaths,
        itemLevel: dataset.itemLevel,
        character: {
          class: dataset.character.class,
          spec: dataset.spec,
          server: dataset.character.server,
          name: dataset.character.name,
        },
        soulbind: dataset.soulbind,
        covenant: dataset.covenant,
        conduits,
        covenantTraits,
        talents,
      };
    });

    const affixes = [
      fight.week.affix1,
      fight.week.affix2,
      fight.week.affix3,
      fight.week.season.affix,
    ];

    const pulls = fight.Pull.map<FightResponse["pulls"][number]>((pull) => {
      return {
        x: pull.x,
        y: pull.y,
        boundingBox: {
          minX: pull.minX,
          minY: pull.minY,
          maxX: pull.maxX,
          maxY: pull.maxY,
        },
        startTime: pull.startTime,
        endTime: pull.endTime,
        zones: pull.PullZone.map((pullZone) => pullZone.zone.id),
        events: pull.Event,
      };
    });

    const dungeon: FightResponse["dungeon"] = {
      id: fight.dungeon.id,
      name: fight.dungeon.name,
      slug: fight.dungeon.slug,
      zones: fight.dungeon.Zone,
      time: fight.dungeon.time,
    };

    return {
      averageItemLevel: Number.parseFloat(
        (fight.averageItemLevel / 100).toFixed(2)
      ),
      chests: fight.chests,
      dps: fight.dps,
      dtps: fight.dtps,
      hps: fight.hps,
      keystoneLevel: fight.keystoneLevel,
      keystoneTime: fight.keystoneTime,
      totalDeaths: fight.totalDeaths,
      fightID: fight.fightID,
      dungeon,
      affixes,
      pulls,
      composition,
    };
  });
};

const loadMany = async (
  reportID: string,
  fightIDs: number[]
): Promise<Pick<Fight, "id" | "fightID">[]> => {
  return prisma.fight.findMany({
    where: {
      report: {
        report: reportID,
      },
      fightID: {
        in: fightIDs,
      },
    },
    select: {
      id: true,
      fightID: true,
    },
  });
};

export const FightRepo = {
  createMany: withPerformanceLogging(createMany, "FightsRepo/createMany"),
  loadFull: withPerformanceLogging(loadFull, "FightsRepo/loadFull"),
  loadMany: withPerformanceLogging(loadMany, "FightsRepo/loadMany"),
};
