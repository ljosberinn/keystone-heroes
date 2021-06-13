import { graphql } from "msw";
import { setupServer } from "msw/node";

import { getGrievousDamageTakenEvents } from "../src/queries/events/affixes/grievous";
import grievousDamageTakenEvents from "./fixtures/grievousDamageTakenEvents.json";

describe("grievous", () => {
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

  test("getGrievousDamageTakenEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: grievousDamageTakenEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getGrievousDamageTakenEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });
});
