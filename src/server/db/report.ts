import { DEV_USE_DB, IS_PROD, IS_TEST } from "../../constants";
import type { UIFightsResponse } from "../../pages/report/[id]";
import type { AffixIds } from "../../utils/affixes";
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
              tank: {
                select: {
                  dps: true,
                  hps: true,
                  itemLevel: true,
                  deaths: true,
                  character: {
                    select: {
                      name: true,
                      server: true,
                      id: true,
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
                  character: {
                    select: {
                      name: true,
                      server: true,
                      id: true,
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
                  character: {
                    select: {
                      name: true,
                      server: true,
                      id: true,
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
                  character: {
                    select: {
                      name: true,
                      server: true,
                      id: true,
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
                  character: {
                    select: {
                      name: true,
                      server: true,
                      id: true,
                    },
                  },
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
                fight.week.season.affixId,
              ] as AffixIds[],
              dps: fight.dps,
              hps: fight.hps,
              dtps: fight.dtps,
              averageItemLevel: fight.averageItemLevel / 100,
              composition: [
                {
                  dps: fight.tank.dps,
                  hps: fight.tank.hps,
                  deaths: fight.tank.deaths,
                  guid: fight.tank.character.id,
                  name: fight.tank.character.name,
                  server: fight.tank.character.server,
                  talents: [],
                  legendary: {},
                  spec: "Vengeance",
                  covenant: {
                    id: 1,
                    soulbind: { id: 1, talents: [], conduits: [] },
                  },
                  className: "DemonHunter",
                },
                {
                  dps: fight.heal.dps,
                  hps: fight.heal.hps,
                  deaths: fight.heal.deaths,
                  guid: fight.heal.character.id,
                  name: fight.heal.character.name,
                  server: fight.heal.character.server,
                  talents: [],
                  legendary: {},
                  spec: "Vengeance",
                  covenant: {
                    id: 1,
                    soulbind: { id: 1, talents: [], conduits: [] },
                  },
                  className: "DemonHunter",
                },
                {
                  dps: fight.dps1.dps,
                  hps: fight.dps1.hps,
                  deaths: fight.dps1.deaths,
                  guid: fight.dps1.character.id,
                  name: fight.dps1.character.name,
                  server: fight.dps1.character.server,
                  talents: [],
                  legendary: {},
                  spec: "Vengeance",
                  covenant: {
                    id: 1,
                    soulbind: { id: 1, talents: [], conduits: [] },
                  },
                  className: "DemonHunter",
                },
                {
                  dps: fight.dps2.dps,
                  hps: fight.dps2.hps,
                  deaths: fight.dps2.deaths,
                  guid: fight.dps2.character.id,
                  name: fight.dps2.character.name,
                  server: fight.dps2.character.server,
                  talents: [],
                  legendary: {},
                  spec: "Vengeance",
                  covenant: {
                    id: 1,
                    soulbind: { id: 1, talents: [], conduits: [] },
                  },
                  className: "DemonHunter",
                },
                {
                  dps: fight.dps3.dps,
                  hps: fight.dps3.hps,
                  deaths: fight.dps3.deaths,
                  guid: fight.dps3.character.id,
                  name: fight.dps3.character.name,
                  server: fight.dps3.character.server,
                  talents: [],
                  legendary: {},
                  spec: "Vengeance",
                  covenant: {
                    id: 1,
                    soulbind: { id: 1, talents: [], conduits: [] },
                  },
                  className: "DemonHunter",
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
