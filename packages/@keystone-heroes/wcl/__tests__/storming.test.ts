import { graphql } from "msw";
import { setupServer } from "msw/node";

import { getStormingDamageTakenEvents } from "../src/queries/events/affixes/storming";
import stormingDamageTakenEvents from "./fixtures/stormingDamageTakenEvents.json";

describe("storming", () => {
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

  test("getStormingDamageTakenEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: stormingDamageTakenEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getStormingDamageTakenEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });
});
