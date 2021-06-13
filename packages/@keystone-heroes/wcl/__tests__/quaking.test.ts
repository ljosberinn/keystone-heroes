import { graphql } from "msw";
import { setupServer } from "msw/node";

import {
  getQuakingDamageTakenEvents,
  getQuakingInterruptEvents,
} from "../src/queries/events/affixes/quaking";
import quakingDamageTakenEvents from "./fixtures/quakingDamageTakenEvents.json";
import quakingInterruptEvents from "./fixtures/quakingInterruptEvents.json";

describe("quaking", () => {
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

  test("getQuakingDamageTakenEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: quakingDamageTakenEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getQuakingDamageTakenEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });

  test("getQuakingInterruptEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: quakingInterruptEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getQuakingInterruptEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });
});
