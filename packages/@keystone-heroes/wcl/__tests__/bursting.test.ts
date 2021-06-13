import { graphql } from "msw";
import { setupServer } from "msw/node";

import { getBurstingDamageTakenEvents } from "../src/queries/events/affixes/bursting";
import burstingDamageTakenEvents from "./fixtures/burstingDamageTakenEvents.json";

describe("bursting", () => {
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

  test("getBurstingDamageTakenEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: burstingDamageTakenEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getBurstingDamageTakenEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });
});
