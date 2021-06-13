import { graphql } from "msw";
import { setupServer } from "msw/node";

import {
  getInvisibilityUsage,
  getEngineeringBattleRezCastEvents,
  getRemarkableSpellCastEvents,
} from "../src/queries/events/other";
import dimensionalShifterEvents from "./fixtures/dimensionalShifterEvents.json";
import engineeringSLCastEvents from "./fixtures/engineeringSLCastEvents.json";
import potionOfTheHiddenSpiritEvents from "./fixtures/potionOfTheHiddenSpiritEvents.json";
import spellCastEvents from "./fixtures/spellCastEvents.json";

describe("other", () => {
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

  test("getInvisibilityUsage", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: [
                    ...potionOfTheHiddenSpiritEvents,
                    ...dimensionalShifterEvents,
                  ],
                },
              },
            },
          })
        );
      })
    );

    const result = await getInvisibilityUsage({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });

  // events from https://www.warcraftlogs.com/reports/fxq2w3aAW49dHhjb#fight=3
  test("getEngineeringBattleRezCastEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: engineeringSLCastEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getEngineeringBattleRezCastEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });

  // events from https://www.warcraftlogs.com/reports/fxq2w3aAW49dHhjb#fight=3
  test("getRemarkableSpellCastEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: spellCastEvents,
                },
              },
            },
          })
        );
      })
    );

    const playerActorIDs = new Set(
      spellCastEvents.map((event) => event.sourceID)
    );

    const result = await getRemarkableSpellCastEvents(
      {
        reportID: "",
        startTime: 0,
        endTime: 1,
      },
      playerActorIDs
    );

    expect(result).toMatchSnapshot();
  });
});
