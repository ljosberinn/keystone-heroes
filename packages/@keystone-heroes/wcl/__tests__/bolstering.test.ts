import { graphql } from "msw";
import { setupServer } from "msw/node";

import { getBolsteringEvents } from "../src/queries/events/affixes/bolstering";
import bolsteringApplyBuffEvents from "./fixtures/bolsteringApplyBuffEvents.json";

describe("bolstering", () => {
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

  test("getBolsteringEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: bolsteringApplyBuffEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getBolsteringEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });
});
