import type {
  InitialReportDataQuery,
  InitialReportDataQueryVariables,
} from "@keystone-heroes/wcl/types";
import { graphql } from "msw";
import { setupServer } from "msw/node";

import { prisma } from "../jest/prisma";
import { reportHandler } from "../src/functions/report";
import { BAD_REQUEST, SERVICE_UNAVAILABLE } from "../src/utils/statusCodes";
import { testLambda } from "../testUtils/lambda";

const validReportID = "6WBVqjaxg2HKGm4k";

describe("/api/report", () => {
  const server = setupServer();

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  test("is protected with isValidReportID-middleware", async () => {
    const { res } = await testLambda({
      handler: reportHandler,
      query: {
        reportID: "123",
      },
    });

    expect(res.statusCode).toBe(BAD_REQUEST);
  });

  test("warcraftlogs failure - empty response", async () => {
    server.use(
      graphql.query<InitialReportDataQuery, InitialReportDataQueryVariables>(
        "InitialReportData",
        (_req, res, ctx) => {
          return res(ctx.data({}));
        }
      )
    );

    prisma.report.findFirst.mockResolvedValue(null);

    const { res, json } = await testLambda({
      handler: reportHandler,
      query: {
        reportID: validReportID,
      },
    });

    expect(res.statusCode).toBe(SERVICE_UNAVAILABLE);
    expect(json).toMatchSnapshot();
  });
});
