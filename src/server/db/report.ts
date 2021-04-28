import { DEV_USE_DB, IS_PROD, IS_TEST } from "../../constants";
import type { UIFightsResponse } from "../../pages/report/[id]";
import type { covenantMap } from "../../utils/covenants";
import type { Dungeons } from "../../utils/dungeons";
import { prisma } from "../prismaClient";
import type { Fight, Report } from "../queries/report";

export const ReportsRepo = {
  searchReportId: async (report: string): Promise<number | null> => {
    const dataset = await prisma.reports.findUnique({
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
    { endTime, startTime, title, region: { slug: region } }: Report
  ): Promise<number> => {
    if (!IS_PROD && !DEV_USE_DB) {
      // eslint-disable-next-line no-console
      console.info(`[reportId/gSP] skipping db - create report`);
      return -1;
    }

    const { id } = await prisma.reports.upsert({
      where: {
        report,
      },
      create: {
        endTime: new Date(endTime),
        startTime: new Date(startTime),
        region,
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
    if (!IS_PROD && !IS_TEST && !DEV_USE_DB) {
      // eslint-disable-next-line no-console
      console.info(`[reportId/gSP] skipping db - read report`);
      return null;
    }

    try {
      // eslint-disable-next-line no-console
      console.info(`[reportId/gSP] reading report "${report}" from db`);

      const rawReport = await prisma.reports.findFirst({
        where: {
          report,
        },
        select: {
          endTime: true,
          region: true,
          title: true,
          startTime: true,
          id: true,
          Fights: {
            select: {
              averageItemLevel: true,
              chests: true,
              dps: true,
              dtps: true,
              dungeonId: true,
              hps: true,
              keystoneLevel: true,
              keystoneTime: true,
              totalDeaths: true,
              fightId: true,
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
                  covenantId: true,
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
                  covenantId: true,
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
                  covenantId: true,
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
                  covenantId: true,
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
                  covenantId: true,
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
          region: rawReport.region,
          startTime: rawReport.startTime.getTime(),
          title: rawReport.title,
          fights: rawReport.Fights.map((fight) => {
            return {
              chests: fight.chests as Fight["keystoneBonus"],
              id: fight.fightId,
              dungeonId: fight.dungeonId as keyof Dungeons,
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
                    id: fight.tank.covenantId as keyof typeof covenantMap,
                    soulbind: { id: 1, talents: [], conduits: [] },
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
                    id: fight.heal.covenantId as keyof typeof covenantMap,
                    soulbind: { id: 1, talents: [], conduits: [] },
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
                    id: fight.dps1.covenantId as keyof typeof covenantMap,
                    soulbind: { id: 1, talents: [], conduits: [] },
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
                    id: fight.dps2.covenantId as keyof typeof covenantMap,
                    soulbind: { id: 1, talents: [], conduits: [] },
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
                    id: fight.dps3.covenantId as keyof typeof covenantMap,
                    soulbind: { id: 1, talents: [], conduits: [] },
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
};
