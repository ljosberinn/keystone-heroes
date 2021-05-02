import type { Region, Report } from "@prisma/client";

import { createDungeonTimer } from "../../../prisma/dungeons";
import type { UIFightsResponse } from "../../pages/report/[id]";
import { prisma } from "../prismaClient";
import type { RawReport } from "../queries/report";

export const ReportRepo = {
  searchReportId: async (report: string): Promise<number | null> => {
    const dataset = await prisma.report.findUnique({
      where: {
        report,
      },
      select: {
        id: true,
      },
    });

    return dataset ? dataset.id : null;
  },
  createReport: async (
    report: string,
    { endTime, startTime, title, region }: RawReport
  ): Promise<number> => {
    const { id } = await prisma.report.upsert({
      where: {
        report,
      },
      create: {
        endTime: new Date(endTime),
        startTime: new Date(startTime),
        region: {
          connectOrCreate: {
            create: {
              slug: region.slug,
            },
            where: {
              slug: region.slug,
            },
          },
        },
        title,
        report,
      },
      update: {},
      select: {
        id: true,
      },
    });

    return id;
  },
  loadReport: async (report: string): Promise<UIFightsResponse | null> => {
    try {
      // eslint-disable-next-line no-console
      console.info(`[ReportRepo/loadReport] reading "${report}" from db`);

      const rawReport = await prisma.report.findFirst({
        where: {
          report,
        },
        select: {
          endTime: true,
          region: true,
          title: true,
          startTime: true,
          id: true,
          Fight: {
            select: {
              averageItemLevel: true,
              chests: true,
              dps: true,
              dtps: true,
              hps: true,
              keystoneLevel: true,
              keystoneTime: true,
              totalDeaths: true,
              fightId: true,
              dungeon: {
                select: {
                  id: true,
                  time: true,
                  name: true,
                  slug: true,
                },
              },
              week: {
                select: {
                  affix1Id: true,
                  affix2Id: true,
                  affix3Id: true,
                  season: {
                    select: {
                      affixId: true,
                    },
                  },
                },
              },
              tank: {
                select: {
                  dps: true,
                  hps: true,
                  itemLevel: true,
                  deaths: true,
                  id: true,
                  covenant: true,
                  soulbind: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  spec: {
                    select: {
                      name: true,
                    },
                  },
                  character: {
                    select: {
                      name: true,
                      server: true,
                      id: true,
                      class: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
              heal: {
                select: {
                  dps: true,
                  hps: true,
                  itemLevel: true,
                  deaths: true,
                  id: true,
                  covenant: true,
                  soulbind: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  spec: {
                    select: {
                      name: true,
                    },
                  },
                  character: {
                    select: {
                      name: true,
                      server: true,
                      id: true,
                      class: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
              dps1: {
                select: {
                  dps: true,
                  hps: true,
                  itemLevel: true,
                  deaths: true,
                  id: true,
                  covenant: true,
                  soulbind: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  spec: {
                    select: {
                      name: true,
                    },
                  },
                  character: {
                    select: {
                      name: true,
                      server: true,
                      id: true,
                      class: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
              dps2: {
                select: {
                  dps: true,
                  hps: true,
                  itemLevel: true,
                  deaths: true,
                  id: true,
                  covenant: true,
                  soulbind: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  spec: {
                    select: {
                      name: true,
                    },
                  },
                  character: {
                    select: {
                      name: true,
                      server: true,
                      id: true,
                      class: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
              dps3: {
                select: {
                  dps: true,
                  hps: true,
                  itemLevel: true,
                  deaths: true,
                  id: true,
                  covenant: true,
                  soulbind: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  spec: {
                    select: {
                      name: true,
                    },
                  },
                  character: {
                    select: {
                      name: true,
                      server: true,
                      id: true,
                      class: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (rawReport) {
        return {
          endTime: rawReport.endTime.getTime(),
          id: report,
          region: rawReport.region.slug,
          startTime: rawReport.startTime.getTime(),
          title: rawReport.title,
          fights: rawReport.Fight.map((fight) => {
            return {
              chests: fight.chests,
              id: fight.fightId,
              dungeon: {
                id: fight.dungeon.id,
                name: fight.dungeon.name,
                timer: createDungeonTimer(fight.dungeon.time),
                slug: fight.dungeon.slug,
              },
              totalDeaths: fight.totalDeaths,
              keystoneLevel: fight.keystoneLevel,
              keystoneTime: fight.keystoneTime,
              affixes: [
                fight.week.affix1Id,
                fight.week.affix2Id,
                fight.week.affix3Id,
                fight.week.season.affixId ?? -1,
              ],
              dps: fight.dps,
              hps: fight.hps,
              dtps: fight.dtps,
              averageItemLevel: Number.parseFloat(
                (fight.averageItemLevel / 100).toFixed(2)
              ),
              composition: [
                {
                  dps: fight.tank.dps,
                  hps: fight.tank.hps,
                  deaths: fight.tank.deaths,
                  guid: fight.tank.character.id,
                  id: fight.tank.id,
                  name: fight.tank.character.name,
                  server: fight.tank.character.server,
                  talents: [],
                  legendary: {},
                  spec: fight.tank.spec.name,
                  itemLevel: fight.tank.itemLevel,
                  covenant: {
                    ...fight.tank.covenant,
                    soulbind: {
                      id: fight.tank.soulbind.id,
                      name: fight.tank.soulbind.name,
                      talents: [],
                      conduits: [],
                    },
                  },
                  className: fight.tank.character.class.name,
                },
                {
                  dps: fight.heal.dps,
                  hps: fight.heal.hps,
                  deaths: fight.heal.deaths,
                  guid: fight.heal.character.id,
                  id: fight.heal.id,
                  name: fight.heal.character.name,
                  server: fight.heal.character.server,
                  talents: [],
                  legendary: {},
                  spec: fight.heal.spec.name,
                  itemLevel: fight.heal.itemLevel,
                  covenant: {
                    ...fight.heal.covenant,
                    soulbind: {
                      id: fight.heal.soulbind.id,
                      name: fight.heal.soulbind.name,
                      talents: [],
                      conduits: [],
                    },
                  },
                  className: fight.heal.character.class.name,
                },
                {
                  dps: fight.dps1.dps,
                  hps: fight.dps1.hps,
                  deaths: fight.dps1.deaths,
                  guid: fight.dps1.character.id,
                  id: fight.dps1.id,
                  name: fight.dps1.character.name,
                  server: fight.dps1.character.server,
                  talents: [],
                  legendary: {},
                  spec: fight.dps1.spec.name,
                  itemLevel: fight.dps1.itemLevel,
                  covenant: {
                    ...fight.dps1.covenant,
                    soulbind: {
                      id: fight.dps1.soulbind.id,
                      name: fight.dps1.soulbind.name,
                      talents: [],
                      conduits: [],
                    },
                  },
                  className: fight.dps1.character.class.name,
                },
                {
                  dps: fight.dps2.dps,
                  hps: fight.dps2.hps,
                  deaths: fight.dps2.deaths,
                  guid: fight.dps2.character.id,
                  id: fight.dps2.id,
                  name: fight.dps2.character.name,
                  server: fight.dps2.character.server,
                  talents: [],
                  legendary: {},
                  spec: fight.dps2.spec.name,
                  itemLevel: fight.dps2.itemLevel,
                  covenant: {
                    ...fight.dps2.covenant,
                    soulbind: {
                      id: fight.dps2.soulbind.id,
                      name: fight.dps2.soulbind.name,
                      talents: [],
                      conduits: [],
                    },
                  },
                  className: fight.dps2.character.class.name,
                },
                {
                  dps: fight.dps3.dps,
                  hps: fight.dps3.hps,
                  deaths: fight.dps3.deaths,
                  guid: fight.dps3.character.id,
                  id: fight.dps3.id,
                  name: fight.dps3.character.name,
                  server: fight.dps3.character.server,
                  talents: [],
                  legendary: {},
                  spec: fight.dps3.spec.name,
                  itemLevel: fight.dps3.itemLevel,
                  covenant: {
                    ...fight.dps3.covenant,
                    soulbind: {
                      id: fight.dps3.soulbind.id,
                      name: fight.dps3.soulbind.name,
                      talents: [],
                      conduits: [],
                    },
                  },
                  className: fight.dps3.character.class.name,
                },
              ],
            };
          }),
        };
      }

      return null;
    } catch {
      return null;
    }
  },
  load: async (
    report: string
  ): Promise<
    | (Omit<Report, "startTime" | "endTime" | "regionId"> & {
        fights: number[];
        startTime: number;
        endTime: number;
        region: Region;
      })
    | null
  > => {
    try {
      // eslint-disable-next-line no-console
      console.info(`[ReportRepo/load] reading "${report}" from db`);

      const data = await prisma.report.findUnique({
        where: {
          report,
        },
        select: {
          id: true,
          endTime: true,
          startTime: true,
          title: true,
          region: true,
          report: true,
          Fight: {
            select: {
              fightId: true,
            },
          },
        },
      });

      if (!data) {
        return null;
      }

      const { Fight, ...rest } = data;

      return {
        ...rest,
        startTime: data.startTime.getTime(),
        endTime: data.endTime.getTime(),
        fights: Fight.map((fight) => fight.fightId),
      };
    } catch {
      return null;
    }
  },
};
