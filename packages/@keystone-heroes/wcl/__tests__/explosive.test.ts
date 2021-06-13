import { graphql } from "msw";
import { setupServer } from "msw/node";

import {
  getExplosiveDamageTakenEvents,
  getExplosiveKillEvents,
} from "../src/queries/events/affixes/explosive";
import explosiveDamageDoneToEvents from "./fixtures/explosiveDamageDoneToEvents.json";
import explosiveDamageTakenEvents from "./fixtures/explosiveDamageTakenEvents.json";

describe("explosive", () => {
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

  test("getExplosiveDamageTakenEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: explosiveDamageTakenEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getExplosiveDamageTakenEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });

  test("getExplosiveKillEvents", async () => {
    server.use(
      graphql.query("EnemyNPCIds", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                fights: [
                  {
                    enemyNPCs: [
                      {
                        id: 42,
                        gameID: 165_410,
                      },
                      {
                        id: 33,
                        gameID: 165_408,
                      },
                      {
                        id: 27,
                        gameID: 173_729,
                      },
                      {
                        id: 36,
                        gameID: 166_497,
                      },
                      {
                        id: 13,
                        gameID: 165_414,
                      },
                      {
                        id: 21,
                        gameID: 165_415,
                      },
                      {
                        id: 47,
                        gameID: 167_876,
                      },
                      {
                        id: 9,
                        gameID: 165_515,
                      },
                      {
                        id: 38,
                        gameID: 164_363,
                      },
                      {
                        id: 19,
                        gameID: 120_651,
                      },
                      {
                        id: 50,
                        gameID: 165_737,
                      },
                      {
                        id: 5,
                        gameID: 164_557,
                      },
                      {
                        id: 12,
                        gameID: 164_562,
                      },
                      {
                        id: 45,
                        gameID: 166_034,
                      },
                      {
                        id: 11,
                        gameID: 164_563,
                      },
                      {
                        id: 10,
                        gameID: 167_607,
                      },
                      {
                        id: 46,
                        gameID: 167_892,
                      },
                      {
                        id: 48,
                        gameID: 167_898,
                      },
                      {
                        id: 49,
                        gameID: 164_218,
                      },
                      {
                        id: 29,
                        gameID: 165_529,
                      },
                      {
                        id: 37,
                        gameID: 164_185,
                      },
                      {
                        id: 44,
                        gameID: 165_913,
                      },
                      {
                        id: 41,
                        gameID: 167_615,
                      },
                      {
                        id: 8,
                        gameID: 174_175,
                      },
                      {
                        id: 43,
                        gameID: 167_806,
                      },
                    ],
                  },
                ],
              },
            },
          })
        );
      }),
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: explosiveDamageDoneToEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getExplosiveKillEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
      fightID: 1,
    });

    expect(result).toMatchSnapshot();
  });
});
