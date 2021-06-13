import { graphql } from "msw";
import { setupServer } from "msw/node";

import {
  getSanguineDamageTakenEvents,
  getSanguineHealingDoneEvents,
} from "../src/queries/events/affixes/sanguine";
import sanguineDamageTakenEvents from "./fixtures/sanguineDamageTakenEvents.json";
import sanguineHealEvents from "./fixtures/sanguineHealEvents.json";

describe("sanguine", () => {
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

  test("getSanguineDamageTakenEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: sanguineDamageTakenEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getSanguineDamageTakenEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });

  test("getSanguineHealingDoneEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: sanguineHealEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getSanguineHealingDoneEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });
});
