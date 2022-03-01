import { graphql } from "msw";
import { setupServer } from "msw/node";

import type { DamageEvent } from "../queries/events/types";
import {
  createChunkByThresholdReducer,
  recursiveGetEvents,
} from "../queries/events/utils";
import { EventDataType, HostilityType } from "../types";
import { isValidReportId, maybeOngoingReport } from "../utils";

describe("recursiveGetEvents", () => {
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
      graphql.query("getEvents", (req, res, ctx) => {
        expect(req.variables.startTime).toBe(
          // eslint-disable-next-line jest/no-conditional-in-test
          requestNumber === 0 ? 0 : requestNumber * 1000
        );

        requestNumber++;

        // eslint-disable-next-line jest/no-conditional-in-test
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

    const response = await recursiveGetEvents({
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
      graphql.query("getEvents", (_req, res, ctx) => {
        // eslint-disable-next-line jest/no-conditional-in-test
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

    const response = await recursiveGetEvents({
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
      graphql.query("getEvents", (_req, res, ctx) => {
        return res(ctx.data({}));
      })
    );

    const response = await recursiveGetEvents({
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
      graphql.query("getEvents", (_req, res, ctx) => {
        return res(ctx.data({ foo: "bar" }));
      })
    );

    const response = await recursiveGetEvents({
      dataType: EventDataType.DamageDone,
      hostilityType: HostilityType.Enemies,
      reportID: "",
      startTime: 0,
      endTime: 1,
    });

    expect(response).toStrictEqual([]);
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
        // eslint-disable-next-line jest/no-conditional-in-test
        index < 5
          ? timestampMap.firstChunk
          : // eslint-disable-next-line jest/no-conditional-in-test
          index < 10
          ? timestampMap.secondChunk
          : // eslint-disable-next-line jest/no-conditional-in-test
          index < 15
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

describe("isValidReportId", () => {
  test("pass", () => {
    expect(isValidReportId("aT8ZhP1HRfJANKCj")).toBe(true);
  });

  test("fail", () => {
    expect(isValidReportId("aT8ZhP1HRfJANKC")).toBe(false);
  });
});

describe("maybeOngoingReport", () => {
  const now = Date.now();

  test("pass", () => {
    const twoHours = now - 2 * 60 * 60 * 1000;

    expect(maybeOngoingReport(twoHours)).toBe(true);
  });

  test("fail", () => {
    const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;

    expect(maybeOngoingReport(twoDaysAgo)).toBe(false);
  });
});
