import { graphql } from "msw";
import { setupServer } from "msw/node";

import type { DamageEvent, HealEvent } from "../src/queries/events/types";
import {
  createChunkByThresholdReducer,
  createEventFetcher,
  getEvents,
  reduceEventsByPlayer,
} from "../src/queries/events/utils";
import { EventDataType, HostilityType } from "../src/types";
import NPCDamagesPlayerEvents from "./fixtures/NPCDamagesPlayerEvents.json";
import kyrianOrbHealEvents from "./fixtures/kyrianOrbHealEvents.json";
import playerDamagesNPCEvents from "./fixtures/playerDamagesNPCEvents.json";

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

  test("recursively requests events until nextPageTimestamp is absent", async () => {
    let requestNumber = 0;

    server.use(
      graphql.query("EventData", (req, res, ctx) => {
        expect(req.variables.startTime).toBe(
          // eslint-disable-next-line jest/no-if
          requestNumber === 0 ? 0 : requestNumber * 1000
        );

        requestNumber++;

        // eslint-disable-next-line jest/no-if
        if (requestNumber === 3) {
          return res(
            ctx.data({
              reportData: {
                report: {
                  events: {
                    data: [requestNumber],
                  },
                },
              },
            })
          );
        }

        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: [requestNumber],
                  nextPageTimestamp: requestNumber * 1000,
                },
              },
            },
          })
        );
      })
    );

    const response = await getEvents({
      dataType: EventDataType.DamageDone,
      hostilityType: HostilityType.Enemies,
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(response).toStrictEqual([1, 2, 3]);
    expect(requestNumber).toBe(3);
  });

  test("requests only once if nextPageTimestamp is absent initially", async () => {
    const requestNumber = 1;
    const dummy = jest.fn();

    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        if (requestNumber !== 1) {
          dummy();

          return res(
            ctx.data({
              reportData: {
                report: {
                  events: {
                    data: [requestNumber],
                  },
                },
              },
            })
          );
        }

        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: [requestNumber],
                },
              },
            },
          })
        );
      })
    );

    const response = await getEvents({
      dataType: EventDataType.DamageDone,
      hostilityType: HostilityType.Enemies,
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(response).toStrictEqual([1]);
    expect(requestNumber).toBe(1);
    expect(dummy).not.toHaveBeenCalled();
  });

  test("fails gracefully given no response", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(ctx.data({}));
      })
    );

    const response = await getEvents({
      dataType: EventDataType.DamageDone,
      hostilityType: HostilityType.Enemies,
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(response).toStrictEqual([]);
  });

  test("fails gracefully given an invalid response", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(ctx.data({ foo: "bar" }));
      })
    );

    const response = await getEvents({
      dataType: EventDataType.DamageDone,
      hostilityType: HostilityType.Enemies,
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(response).toStrictEqual([]);
  });
});

describe("createEventFetcher", () => {
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

  test("forwards params to returned function", async () => {
    const initialParams: Parameters<typeof createEventFetcher>[0] = {
      dataType: EventDataType.DamageDone,
      hostilityType: HostilityType.Enemies,
    };

    const distinguishedParams: Parameters<
      ReturnType<typeof createEventFetcher>
    >[0] = {
      reportID: "",
      startTime: 0,
      endTime: 1,
    };

    server.use(
      graphql.query("EventData", (req, res, ctx) => {
        expect(req.variables).toMatchObject({
          ...initialParams,
          ...distinguishedParams,
        });

        return res(ctx.data({}));
      })
    );

    await createEventFetcher(initialParams)(distinguishedParams);
  });
});

describe("reduceEventsByPlayer", () => {
  describe("DamageEvents", () => {
    test("targetID === damageTaken by player", () => {
      const events: DamageEvent[] = NPCDamagesPlayerEvents.map((event) => ({
        ...event,
        type: "damage",
      }));

      expect(reduceEventsByPlayer(events, "targetID")).toMatchSnapshot();
    });

    test("sourceID === damageDone by player", () => {
      const events: DamageEvent[] = playerDamagesNPCEvents.map((event) => ({
        ...event,
        type: "damage",
      }));

      expect(reduceEventsByPlayer(events, "sourceID")).toMatchSnapshot();
    });
  });

  describe("HealEvents", () => {
    test("targetID === healing received by target", () => {
      const events: HealEvent[] = kyrianOrbHealEvents.map((event) => ({
        ...event,
        type: "heal",
      }));

      expect(reduceEventsByPlayer(events, "targetID")).toMatchSnapshot();
    });

    test("sourceID === healingDone by source", () => {
      const events: HealEvent[] = kyrianOrbHealEvents.map((event) => ({
        ...event,
        type: "heal",
      }));

      expect(reduceEventsByPlayer(events, "sourceID")).toMatchSnapshot();
    });
  });
});

describe("createChunkByThresholdReducer", () => {
  test("groups events into chunks by given threshold", () => {
    const reducer = createChunkByThresholdReducer(5 * 1000);

    const timestampMap = {
      firstChunk: 0,
      secondChunk: 6000,
      thirdChunk: 12_000,
      fourthChunk: 18_000,
    };

    const events: DamageEvent[] = Array.from({ length: 20 }, (_, index) => {
      const chunk =
        index < 5
          ? timestampMap.firstChunk
          : index < 10
          ? timestampMap.secondChunk
          : index < 15
          ? timestampMap.thirdChunk
          : timestampMap.fourthChunk;

      return {
        timestamp: chunk,
        targetID: 1,
        amount: 1,
        hitType: 1,
        sourceID: 100,
        type: "damage",
        abilityGameID: 0,
      };
    });

    const result = events.reduce<DamageEvent[][]>(reducer, []);

    expect(result).toHaveLength(4);
    expect(result.every((chunk) => chunk.length === 5)).toBe(true);

    expect(
      result[0].every((event) => event.timestamp === timestampMap.firstChunk)
    ).toBe(true);

    expect(
      result[1].every((event) => event.timestamp === timestampMap.secondChunk)
    ).toBe(true);

    expect(
      result[2].every((event) => event.timestamp === timestampMap.thirdChunk)
    ).toBe(true);

    expect(
      result[3].every((event) => event.timestamp === timestampMap.fourthChunk)
    ).toBe(true);
  });
});
