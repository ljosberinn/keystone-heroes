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
  Player as PrismaPlayer,
} from "@prisma/client";

import type { FooFight } from "../../pages/api/fight";
import { prisma } from "../prismaClient";
import type {
  Conduit,
  InDepthCharacterInformation,
  Item,
  SoulbindTalent,
  Talent,
} from "../queries/table";

type Test = Omit<FooFight, "composition"> & {
  composition: (FooFight["composition"][number] & { characterId: number })[];
};

export type ResponseFight2 = Pick<
  Fight,
  | "averageItemLevel"
  | "chests"
  | "dps"
  | "dtps"
  | "hps"
  | "keystoneLevel"
  | "keystoneTime"
  | "totalDeaths"
  | "fightId"
> & {
  dungeon: Dungeon;
  affixes: Omit<Affix, "seasonal">[];
  composition: (Pick<PrismaPlayer, "dps" | "hps" | "deaths" | "itemLevel"> & {
    legendary: Legendary | null;
    covenant: Pick<Covenant, "icon" | "name">;
    soulbind: Pick<Soulbind, "icon" | "name">;
    character: Pick<Character, "name"> & {
      class: Class;
      spec: Pick<Spec, "id" | "name">;
      server: Omit<Server, "regionId">;
    };
    talents: [];
    covenantTraits: [];
    conduits: [];
  })[];
};

export const FightRepo = {
  createMany: async <T extends Test>(
    reportId: number,
    weekId: number,
    fights: T[],
    playerIdMap: Record<number, number>
  ): Promise<void> => {
    // eslint-disable-next-line no-console
    console.info(
      `[FightsRepo/createMany] reportId ${reportId} - creating ${fights.length} fights`
    );

    await prisma.fight.createMany({
      data: fights.map((fight) => {
        const [tank, heal, dps1, dps2, dps3] = fight.composition;

        return {
          reportId,
          weekId,
          fightId: fight.id,
          chests: fight.chests,
          dungeonId: fight.dungeon,
          dps: fight.dps,
          hps: fight.hps,
          dtps: fight.dtps,
          averageItemLevel: Math.round(fight.averageItemLevel * 100),
          keystoneLevel: fight.keystoneLevel,
          keystoneTime: fight.keystoneTime,
          totalDeaths: fight.totalDeaths,
          player1: playerIdMap[tank.characterId],
          player2: playerIdMap[heal.characterId],
          player3: playerIdMap[dps1.characterId],
          player4: playerIdMap[dps2.characterId],
          player5: playerIdMap[dps3.characterId],
        };
      }),
      skipDuplicates: true,
    });
  },
  loadFull: async (
    report: string,
    ids: number[]
  ): Promise<ResponseFight2[]> => {
    // eslint-disable-next-line no-console
    console.info(
      `[FightsRepo/loadFull] report "${report}" - ids "${ids.join(",")}"`
    );

    const response = await prisma.fight.findMany({
      where: {
        report: {
          report,
        },
        fightId: {
          in: ids,
        },
      },
      select: {
        fightId: true,
        averageItemLevel: true,
        chests: true,
        dps: true,
        dtps: true,
        hps: true,
        keystoneLevel: true,
        keystoneTime: true,
        totalDeaths: true,
        dungeon: true,
        week: {
          select: {
            firstAffix: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
            secondAffix: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
            thirdAffix: {
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
        tank: {
          select: {
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
                    id: true,
                    name: true,
                  },
                },
                class: true,
              },
            },
            legendary: true,
          },
        },
        heal: {
          select: {
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
                    id: true,
                    name: true,
                  },
                },
                class: true,
              },
            },
            legendary: true,
          },
        },
        dps1: {
          select: {
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
                    id: true,
                    name: true,
                  },
                },
                class: true,
              },
            },
            legendary: true,
          },
        },
        dps2: {
          select: {
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
                    id: true,
                    name: true,
                  },
                },
                class: true,
              },
            },
            legendary: true,
          },
        },
        dps3: {
          select: {
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
                    id: true,
                    name: true,
                  },
                },
                class: true,
              },
            },
            legendary: true,
          },
        },
      },
    });

    return response.map((fight) => {
      const player = [
        fight.tank,
        fight.heal,
        fight.dps1,
        fight.dps2,
        fight.dps3,
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
        dungeon: fight.dungeon,
        affixes: [],
        composition: player.map((dataset) => {
          return {
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
            conduits: [],
            covenantTraits: [],
            talents: [],
          };
        }),
      };
    });
  },
  loadMany: async (
    report: string,
    ids: number[]
  ): Promise<Pick<Fight, "id" | "fightId">[]> => {
    // eslint-disable-next-line no-console
    console.info(
      `[FightsRepo/loadMany] report "${report}" - ids "${ids.join(",")}"`
    );

    return prisma.fight.findMany({
      where: {
        report: {
          report,
        },
        fightId: {
          in: ids,
        },
      },
      select: {
        id: true,
        fightId: true,
      },
    });
  },
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
  tank: Pick<Player, "deaths" | "dps" | "hps" | "itemLevel"> & {
    covenant: Covenant;
    spec: Omit<Spec, "role" | "classId">;
    character: Pick<Character, "name" | "id"> & {
      class: Class;
      server: Server;
    };
    soulbind: Soulbind;
    legendary: Legendary | null;
  };
  // heal: {}
  // dps1: {}
  // dps2: {}
  // dps3: {}
};

export type Player = Pick<
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
