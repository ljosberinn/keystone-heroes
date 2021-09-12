import { DungeonIDs } from "@keystone-heroes/db/data/dungeons";
import { Affixes } from "@keystone-heroes/db/types";
import { graphql } from "msw";
import { setupServer } from "msw/node";

import { getEvents } from "../src/queries/events";
import type { EventDataQuery, EventDataQueryVariables } from "../src/types";
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

    const filterExpressions: string[] = [];

    server.use(
      graphql.query<EventDataQuery, EventDataQueryVariables>(
        "EventData",
        (req, res, ctx) => {
          expect(req.variables.startTime).toBe(startTime);
          expect(req.variables.endTime).toBe(endTime);
          expect(req.variables.reportID).toBe(reportID);
          expect(req.variables.limit).toBe(10_000);
          expect(req.variables.filterExpression).not.toBeUndefined();
          expect(req.variables.filterExpression).not.toBeNull();

          if (req.variables.filterExpression) {
            filterExpressions.push(req.variables.filterExpression);
          }

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
        }
      )
    );

    const dungeonIds = Object.values(DungeonIDs).filter(
      (id): id is DungeonIDs => typeof id === "number"
    );

    const result = await Promise.all(
      dungeonIds.map((dungeonID) => {
        return getEvents(
          {
            affixes: [
              Affixes.Tormented,
              Affixes.Sanguine,
              Affixes.Volcanic,
              Affixes.Fortified,
            ],
            dungeonID,
            startTime,
            endTime,
            reportID,
            fightID: 1,
          },
          [
            {
              actorID: 1,
              class: 9,
            },
            {
              actorID: 2,
              class: 9,
            },
            {
              actorID: 3,
              class: 9,
            },
            {
              actorID: 5,
              class: 9,
            },
            {
              actorID: 60,
              class: 9,
            },
          ]
        );
      })
    );

    expect(result).toMatchSnapshot();

    const individualExpressions = filterExpressions.flatMap((expr) =>
      expr.split(" or ")
    );

    individualExpressions.forEach((expr) => {
      expect(expr).toMatchSnapshot();
    });
  });
});
