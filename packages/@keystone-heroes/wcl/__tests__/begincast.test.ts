import { SD_LANTERN_OPENING } from "@keystone-heroes/wcl/queries/events/dungeons/sd";
import type { BeginCastEvent } from "@keystone-heroes/wcl/queries/events/types";

import { beginCastProcessor } from "../src/transform/events/begincast";
import allEvents from "./fixtures/allEvents.json";

describe("begincast", () => {
  const params = {
    sourcePlayerID: 1,
    targetPlayerID: null,
    sourceNPCID: null,
    targetNPCID: null,
  };

  const beginCastEvents = allEvents.filter(
    (event): event is BeginCastEvent => event.type === "begincast"
  );

  test("tracks SD Lantern Opening", () => {
    const result = beginCastEvents
      .filter((event) => event.abilityGameID === SD_LANTERN_OPENING)
      .map((event) => beginCastProcessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("returns null on unknown begincast events", () => {
    expect(
      beginCastProcessor(
        {
          type: "begincast",
          timestamp: 1,
          abilityGameID: 1,
          sourceID: 1,
          targetID: 1,
        },
        params
      )
    ).toBeNull();
  });
});
