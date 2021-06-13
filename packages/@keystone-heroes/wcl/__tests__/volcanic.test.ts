import { graphql } from "msw";
import { setupServer } from "msw/node";

import { getVolcanicDamageTakenEvents } from "../src/queries/events/affixes/volcanic";
import volcanicDamageTakenEvents from "./fixtures/volcanicDamageTakenEvents.json";

describe("volcanic", () => {
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

  test("getVolcanicDamageTakenEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: volcanicDamageTakenEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getVolcanicDamageTakenEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });
});
