import { graphql } from "msw";
import { setupServer } from "msw/node";

import {
  getNecroticDamageTakenEvents,
  getHighestNecroticStackAmount,
} from "../src/queries/events/affixes/necrotic";
import necroticApplyDebuffEvents from "./fixtures/necroticApplyDebuffEvents.json";
import necroticDamageTakenEvents from "./fixtures/necroticDamageTakenEvents.json";

describe("necrotic", () => {
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

  test("getNecroticDamageTakenEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: necroticDamageTakenEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getNecroticDamageTakenEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });

  test("getHighestNecroticStackAmount", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: necroticApplyDebuffEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getHighestNecroticStackAmount({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });
});
