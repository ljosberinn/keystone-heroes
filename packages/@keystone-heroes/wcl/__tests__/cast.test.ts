import type { CastEvent } from "@keystone-heroes/wcl/queries/events/types";

import { castProcessor } from "../src/transform/events/cast";
import allEvents from "./fixtures/allEvents.json";

describe("cast", () => {
  const params = {
    sourcePlayerID: 1,
    targetPlayerID: null,
    sourceNPCID: null,
    targetNPCID: null,
  };

  const castEvents = allEvents.filter(
    (event): event is CastEvent => event.type === "cast"
  );

  test("tracks any cast event", () => {
    const result = castEvents.map((event) => castProcessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("returns null if sourcePlayerID is unknown", () => {
    expect(
      castProcessor(
        {
          type: "cast",
          timestamp: 1,
          abilityGameID: 1,
          sourceID: 1,
          targetID: 1,
        },
        { ...params, sourcePlayerID: null }
      )
    ).toBeNull();
  });
});
