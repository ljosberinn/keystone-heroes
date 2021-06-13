import { graphql } from "msw";
import { setupServer } from "msw/node";

import { getSpitefulDamageTakenEvents } from "../src/queries/events/affixes/spiteful";
import spitefulDamageTaken from "./fixtures/spitefulDamageTaken.json";
import spitefulPridefulEnemyNPCIDs from "./fixtures/spitefulPridefulEnemyNPCIDs.json";

describe("spiteful", () => {
  const server = setupServer();

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test("getSpitefulDamageTakenEvents", async () => {
    server.use(
      graphql.query("EnemyNPCIds", (_req, res, ctx) => {
        return res(ctx.data(spitefulPridefulEnemyNPCIDs));
      }),
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: spitefulDamageTaken.map((event) => ({
                    ...event,
                    targetID: 106,
                  })),
                },
              },
            },
          })
        );
      })
    );

    const result = await getSpitefulDamageTakenEvents({
      reportID: "",
      fightID: 1,
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });
});
