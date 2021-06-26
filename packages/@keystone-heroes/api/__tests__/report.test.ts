import type {
  InitialReportDataQuery,
  InitialReportDataQueryVariables,
  TableQuery,
  TableQueryVariables,
} from "@keystone-heroes/wcl/types";
import { ONGOING_REPORT_THRESHOLD } from "@keystone-heroes/wcl/utils";
import { graphql } from "msw";
import { setupServer } from "msw/node";

import { prisma } from "../jest/prisma";
import {
  createFightIsUnknownFilter,
  fightFulfillsKeystoneLevelRequirement,
  fightHasFivePlayers,
  fightIsFight,
  fightIsTimedKeystone,
  reportHandler,
} from "../src/functions/report";
import {
  BAD_REQUEST,
  OK,
  SERVICE_UNAVAILABLE,
  UNPROCESSABLE_ENTITY,
} from "../src/utils/statusCodes";
import { testLambda } from "../testUtils/lambda";
import storedReportFixture from "./fixtures/storedReport.json";
import tableFixture from "./fixtures/table.json";
import wclResponseFixture from "./fixtures/wclResponse.json";

const validReportID = "6WBVqjaxg2HKGm4k";

const createInitialReportDataHandler = (data: InitialReportDataQuery) => {
  return graphql.query<InitialReportDataQuery, InitialReportDataQueryVariables>(
    "InitialReportData",
    (_req, res, ctx) => res(ctx.data(data))
  );
};

describe("/api/report", () => {
  const server = setupServer();

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  test("ignores invalid reportIDs", async () => {
    const { res } = await testLambda(reportHandler, {
      query: { reportID: "123" },
    });

    expect(res.statusCode).toBe(BAD_REQUEST);
  });

  describe("warcraftlogs failure", () => {
    test("entirely empty response", async () => {
      server.use(createInitialReportDataHandler({}));

      prisma.report.findFirst.mockResolvedValue(null);

      const { res, json } = await testLambda(reportHandler, {
        query: { reportID: validReportID },
      });

      expect(res.statusCode).toBe(SERVICE_UNAVAILABLE);
      expect(json).toMatchSnapshot();
    });

    test("empty fights", async () => {
      server.use(
        createInitialReportDataHandler({
          reportData: {
            report: {
              fights: [],
              startTime: 0,
              endTime: 10,
              title: "dummy",
            },
          },
        })
      );

      prisma.report.findFirst.mockResolvedValue(null);

      const { res, json } = await testLambda(reportHandler, {
        query: { reportID: validReportID },
      });

      expect(res.statusCode).toBe(SERVICE_UNAVAILABLE);
      expect(json).toMatchSnapshot();
    });

    test("report endTime identical to startTime", async () => {
      server.use(
        createInitialReportDataHandler({
          reportData: {
            report: {
              fights: [
                {
                  id: 1,
                  startTime: 1,
                  endTime: 10,
                },
              ],
              startTime: 0,
              endTime: 0,
              title: "dummy",
              region: {
                slug: "eu",
              },
            },
          },
        })
      );

      prisma.report.findFirst.mockResolvedValue(null);

      const { res, json } = await testLambda(reportHandler, {
        query: { reportID: validReportID },
      });

      expect(res.statusCode).toBe(UNPROCESSABLE_ENTITY);
      expect(json).toMatchSnapshot();
    });
  });

  describe("existing report", () => {
    const storedReport = {
      ...storedReportFixture,
      startTime: new Date(storedReportFixture.startTime),
      endTime: new Date(storedReportFixture.endTime),
    };

    const ongoingReport = {
      ...storedReport,
      endTime: new Date(Date.now() - ONGOING_REPORT_THRESHOLD + 1000),
    };

    test("finished report", async () => {
      // @ts-expect-error since `select` is used, partials are fine
      prisma.report.findFirst.mockResolvedValue(storedReport);

      const { res, json } = await testLambda(reportHandler, {
        query: { reportID: validReportID },
      });

      expect(res.statusCode).toBe(OK);
      expect(json).toMatchSnapshot();
    });

    test("ongoing report - no new fights", async () => {
      // @ts-expect-error since `select` is used, partials are fine
      prisma.report.findFirst.mockResolvedValue(ongoingReport);

      server.use(createInitialReportDataHandler(wclResponseFixture));

      const { res, json } = await testLambda(reportHandler, {
        query: { reportID: validReportID },
      });

      expect(res.statusCode).toBe(OK);

      if (!json || "error" in json) {
        throw new Error("invalid response");
      }

      expect(ongoingReport.Fight).toHaveLength(json.fights.length);
    });

    test("ongoing report - new fights - table request failing for new report", async () => {
      // @ts-expect-error since `select` is used, partials are fine
      prisma.report.findFirst.mockResolvedValue(ongoingReport);

      server.use(
        createInitialReportDataHandler({
          reportData: {
            report: {
              ...wclResponseFixture.reportData.report,
              fights: [
                ...wclResponseFixture.reportData.report.fights,
                {
                  ...wclResponseFixture.reportData.report.fights[
                    wclResponseFixture.reportData.report.fights.length - 1
                  ],
                  id: 99,
                },
              ],
            },
          },
        })
      );

      server.use(
        graphql.query<TableQuery, TableQueryVariables>(
          "Table",
          (req, res, ctx) => {
            expect(req.variables).toMatchSnapshot();

            return res(ctx.data({}));
          }
        )
      );

      const { res, json } = await testLambda(reportHandler, {
        query: { reportID: validReportID },
      });

      expect(res.statusCode).toBe(SERVICE_UNAVAILABLE);
      expect(json).toMatchSnapshot();
    });

    test("ongoing report - new fights", async () => {
      // @ts-expect-error since `select` is used, partials are fine
      prisma.report.findFirst.mockResolvedValue(ongoingReport);

      server.use(
        createInitialReportDataHandler({
          reportData: {
            report: {
              ...wclResponseFixture.reportData.report,
              fights: [
                ...wclResponseFixture.reportData.report.fights,
                {
                  ...wclResponseFixture.reportData.report.fights[
                    wclResponseFixture.reportData.report.fights.length - 1
                  ],
                  id: 99,
                },
              ],
            },
          },
        })
      );

      server.use(
        graphql.query<TableQuery, TableQueryVariables>(
          "Table",
          (req, res, ctx) => {
            expect(req.variables).toMatchSnapshot();

            return res(ctx.data(tableFixture));
          }
        )
      );

      const serverFindManyResponse = [
        { id: 1, name: "Blackmoore" },
        { id: 2, name: "Nemesis" },
        { id: 3, name: "TarrenMill" },
        { id: 4, name: "TwistingNether" },
        { id: 5, name: "Ysondre" },
      ];

      const characterFindManyResponse = [
        { id: 1, name: "Xepheris", serverID: 1 },
        { id: 2, name: "Lisayne", serverID: 2 },
        { id: 3, name: "Kittix", serverID: 3 },
        { id: 4, name: "Ayazky", serverID: 4 },
        { id: 5, name: "Afkdin", serverID: 5 },
      ];

      const playerFindManyResponse = [
        { characterID: 1, id: 1 },
        { characterID: 2, id: 2 },
        { characterID: 3, id: 3 },
        { characterID: 4, id: 4 },
        { characterID: 5, id: 5 },
      ];

      // all these expect full datasets
      // @ts-expect-error since `select` is used, partials are fine
      prisma.region.upsert.mockResolvedValue({ id: 1 });
      // @ts-expect-error since `select` is used, partials are fine
      prisma.report.create.mockResolvedValue({ id: 1 });
      // @ts-expect-error since `select` is used, partials are fine
      prisma.server.findMany.mockResolvedValue(serverFindManyResponse);
      // @ts-expect-error since `select` is used, partials are fine
      prisma.character.findMany.mockResolvedValue(characterFindManyResponse);
      // @ts-expect-error since `select` is used, partials are fine
      prisma.player.findMany.mockResolvedValue(playerFindManyResponse);

      const { res, json } = await testLambda(reportHandler, {
        query: { reportID: validReportID },
      });

      expect(prisma.region.upsert.mock.calls).toMatchSnapshot();
      expect(prisma.conduit.createMany.mock.calls).toMatchSnapshot();
      expect(prisma.talent.createMany.mock.calls).toMatchSnapshot();
      expect(prisma.covenantTrait.createMany.mock.calls).toMatchSnapshot();
      expect(prisma.legendary.createMany.mock.calls).toMatchSnapshot();
      expect(prisma.report.create.mock.calls).toMatchSnapshot();
      expect(prisma.server.findMany.mock.calls).toMatchSnapshot();
      expect(prisma.character.findMany.mock.calls).toMatchSnapshot();
      expect(prisma.player.findMany.mock.calls).toMatchSnapshot();
      // only one fight was added, ensure we have only 1 call
      expect(prisma.fight.create.mock.calls).toHaveLength(1);
      expect(prisma.fight.create.mock.calls).toMatchSnapshot();

      expect(res.statusCode).toBe(OK);
      expect(json).toMatchSnapshot();
    });
  });

  describe("fight filter", () => {
    const fight = {
      averageItemLevel: 220,
      endTime: 1,
      startTime: 0,
      friendlyPlayers: [],
      gameZone: null,
      id: 1,
      keystoneAffixes: [1, 2, 3, 4],
      keystoneBonus: 1,
      keystoneLevel: 15,
      keystoneTime: 1,
      maps: [],
    };

    test("fightHasFivePlayers", () => {
      expect(fightHasFivePlayers(fight)).toBe(false);

      expect(
        fightHasFivePlayers({
          ...fight,
          friendlyPlayers: [1, 2, 3, 4, 5],
        })
      ).toBe(true);
    });

    test("fightIsFight", () => {
      expect(fightIsFight({ ...fight, keystoneTime: null })).toBe(false);
      expect(fightIsFight(fight)).toBe(true);
    });

    test("fightFulfillsKeystoneLevelRequirement", () => {
      expect(
        fightFulfillsKeystoneLevelRequirement({
          ...fight,
          keystoneLevel: 7,
        })
      ).toBe(false);

      expect(
        fightFulfillsKeystoneLevelRequirement({
          ...fight,
          keystoneLevel: 15,
        })
      ).toBe(true);
    });

    test("fightIsTimedKeystone", () => {
      expect(
        fightIsTimedKeystone({
          ...fight,
          keystoneBonus: 0,
        })
      ).toBe(false);

      expect(fightIsTimedKeystone(fight)).toBe(true);
    });

    test("createFightIsUnknownFilter", () => {
      const withIDsFilter = createFightIsUnknownFilter([fight.id, 2]);

      expect(withIDsFilter(fight)).toBe(false);
      expect(withIDsFilter({ ...fight, id: 12 })).toBe(true);

      const withoutIDsFilter = createFightIsUnknownFilter([]);

      expect(withoutIDsFilter(fight)).toBe(true);
      expect(withoutIDsFilter({ ...fight, id: 12 })).toBe(true);
    });
  });
});
