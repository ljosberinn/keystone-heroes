import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { FightResponse } from "@keystone-heroes/api/handler/fight";
import type {
  Conduit,
  InDepthCharacterInformation,
  Item,
  SoulbindTalent,
  Talent,
} from "@keystone-heroes/wcl/src/queries";
import type {
  Affix,
  Character,
  Class,
  Covenant,
  Dungeon,
  Fight,
  Legendary,
  PlayableClass,
  Server,
  Soulbind,
  Spec,
  SpecName,
} from "@prisma/client";

export const FightRepo = {
  createMany: withPerformanceLogging(
    async (fights: Omit<Fight, "id">[]): Promise<void> => {
      // eslint-disable-next-line no-console
      console.info(`[FightsRepo/createMany]creating ${fights.length} fights`);

      await prisma.fight.createMany({
        data: fights,
        skipDuplicates: true,
      });
    },
    "FightsRepo/createMany"
  ),
  loadFull: withPerformanceLogging(
    async (reportID: string, fightIDs: number[]): Promise<FightResponse[]> => {
      // eslint-disable-next-line no-console
      console.info(
        `[FightsRepo/loadFull] report "${reportID}" - ids "${fightIDs.join(
          ","
        )}"`
      );

      const playerSelect = {
        select: {
          actorId: true,
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
                  abilityIcon: true,
                  name: true,
                  id: true,
                },
              },
              fightId: true,
            },
          },
          PlayerConduit: {
            select: {
              fightId: true,
              itemLevel: true,
              conduit: {
                select: {
                  abilityIcon: true,
                  name: true,
                  id: true,
                },
              },
            },
          },
          PlayerCovenantTrait: {
            select: {
              fightId: true,
              covenantTrait: {
                select: {
                  abilityIcon: true,
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      } as const;

      const response = await prisma.fight.findMany({
        where: {
          report: {
            report: reportID,
          },
          fightId: {
            in: fightIDs,
          },
        },
        select: {
          id: true,
          fightId: true,
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
              affix1: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                },
              },
              affix2: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                },
              },
              affix3: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                },
              },
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
        },
      });

      return response.map((fight) => {
        const player = [
          fight.player1,
          fight.player2,
          fight.player3,
          fight.player4,
          fight.player5,
        ];

        const affixes = [
          fight.week.affix1,
          fight.week.affix2,
          fight.week.affix3,
          fight.week.season.affix,
        ];

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
          fightId: fight.fightId,
          dungeon: {
            id: fight.dungeon.id,
            name: fight.dungeon.name,
            slug: fight.dungeon.slug,
            zones: fight.dungeon.Zone,
            time: fight.dungeon.time,
          },
          affixes,
          pulls: [],
          composition: player.map((dataset) => {
            const talents = dataset.PlayerTalent.filter(
              (dataset) => dataset.fightId === fight.id
            ).map((dataset) => dataset.talent);

            const conduits = dataset.PlayerConduit.filter(
              (dataset) => dataset.fightId === fight.id
            ).map((dataset) => ({
              ...dataset.conduit,
              itemLevel: dataset.itemLevel,
            }));

            const covenantTraits = dataset.PlayerCovenantTrait.filter(
              (dataset) => dataset.fightId === fight.id
            ).map((dataset) => dataset.covenantTrait);

            return {
              actorId: dataset.actorId,
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
          }),
        };
      });
    },
    "FightsRepo/loadFull"
  ),
  loadMany: withPerformanceLogging(
    async (
      reportID: string,
      fightIDs: number[]
    ): Promise<Pick<Fight, "id" | "fightId">[]> => {
      // eslint-disable-next-line no-console
      console.info(
        `[FightsRepo/loadMany] reportID "${reportID}" - ids "${fightIDs.join(
          ","
        )}"`
      );

      return prisma.fight.findMany({
        where: {
          report: {
            report: reportID,
          },
          fightId: {
            in: fightIDs,
          },
        },
        select: {
          id: true,
          fightId: true,
        },
      });
    },
    "FightsRepo/loadMany"
  ),
};

export type RawDBFight = Pick<
  Fight,
  | "fightId"
  | "averageItemLevel"
  | "chests"
  | "keystoneLevel"
  | "keystoneTime"
  | "dps"
  | "hps"
  | "fightId"
  | "dtps"
  | "totalDeaths"
> & {
  dungeon: Dungeon;
  week: {
    firstAffix: Omit<Affix, "seasonal">;
    secondAffix: Omit<Affix, "seasonal"> | null;
    thirdAffix: Omit<Affix, "seasonal"> | null;
    season: {
      affix: Omit<Affix, "seasonal"> | null;
    };
  };
  player1: Pick<XPlayer, "deaths" | "dps" | "hps" | "itemLevel"> & {
    character: Pick<Character, "name" | "id"> & {
      class: Class;
      server: Server;
    };
    spec: Omit<Spec, "role" | "classId">;
    covenant: Covenant | null;
    soulbind: Soulbind | null;
    legendary: Legendary | null;
  };
  // heal: {}
  // dps1: {}
  // dps2: {}
  // dps3: {}
};

export type XPlayer = Pick<
  InDepthCharacterInformation,
  "server" | "name" | "guid"
> & {
  id: number;
  dps: number;
  hps: number;
  deaths: number;
  name: string;
  server: {
    id: number;
    name: string;
  };
  class: {
    id: number;
    name: PlayableClass;
    spec: SpecName;
  };
  itemLevel: number;
  legendary: Pick<Item, "effectID" | "effectIcon" | "effectName"> | null;
  covenant: Covenant & {
    soulbind: Omit<Soulbind, "icon"> & {
      talents: SoulbindTalent[];
      conduits: Conduit[];
    };
  };
  talents: Omit<Talent, "type">[];
};
