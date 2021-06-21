import { DungeonIDs } from "@keystone-heroes/db/data";
import { Affixes, PlayableClass } from "@keystone-heroes/db/types";
import { graphql } from "msw";
import { setupServer } from "msw/node";

import { getEvents } from "../src/queries/events";
import allEvents from "./fixtures/allEvents.json";

describe("getEvents", () => {
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

  test("works", async () => {
    const startTime = 0;
    const endTime = 1;
    const reportID = "reportID";

    let filterExpression = "";

    server.use(
      graphql.query("EventData", (req, res, ctx) => {
        expect(req.body?.variables.startTime).toBe(startTime);
        expect(req.body?.variables.endTime).toBe(endTime);
        expect(req.body?.variables.reportID).toBe(reportID);
        expect(req.body?.variables.limit).toBe(10_000);

        filterExpression = req.body?.variables.filterExpression;

        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: allEvents,
                  nextPageTimestamp: null,
                },
              },
            },
          })
        );
      })
    );

    const result = await getEvents(
      {
        affixes: [
          Affixes.Tormented,
          Affixes.Sanguine,
          Affixes.Volcanic,
          Affixes.Fortified,
        ],
        dungeonID: DungeonIDs.DE_OTHER_SIDE,
        startTime,
        endTime,
        reportID,
        fightID: 1,
      },
      [
        {
          actorID: 1,
          class: PlayableClass.DemonHunter,
        },
        {
          actorID: 2,
          class: PlayableClass.DemonHunter,
        },
        {
          actorID: 3,
          class: PlayableClass.DemonHunter,
        },
        {
          actorID: 5,
          class: PlayableClass.DemonHunter,
        },
        {
          actorID: 60,
          class: PlayableClass.DemonHunter,
        },
      ]
    );

    expect(result).toMatchSnapshot();
    expect(filterExpression).toMatchSnapshot();
  });
});
