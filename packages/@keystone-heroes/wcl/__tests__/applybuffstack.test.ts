import { SD_LANTERN_BUFF } from "../src/queries/events/dungeons/sd";
import type { ApplyBuffStackEvent } from "../src/queries/events/types";
import { applyBuffStackProcessor } from "../src/transform/events/applybuffstack";
import allEvents from "./fixtures/allEvents.json";

describe("applybuffstack", () => {
  const params = {
    sourcePlayerID: null,
    targetPlayerID: 1,
    sourceNPCID: null,
    targetNPCID: null,
  };

  test("works for SD Lantern Buff", () => {
    const result = allEvents
      .filter(
        (event): event is ApplyBuffStackEvent =>
          event.type === "applybuffstack" &&
          event.abilityGameID === SD_LANTERN_BUFF
      )
      .map((event) => applyBuffStackProcessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("returns null for unknown applybuffstack events", () => {
    expect(
      applyBuffStackProcessor(
        {
          type: "applybuffstack",
          abilityGameID: 1,
          sourceID: 1,
          stack: 0,
          targetID: 0,
          timestamp: 1,
        },
        params
      )
    ).toBeNull();
  });

  test("returns null for applybuffstack events without targetPlayerID", () => {
    expect(
      applyBuffStackProcessor(
        {
          type: "applybuffstack",
          abilityGameID: 1,
          sourceID: 1,
          stack: 0,
          targetID: 0,
          timestamp: 1,
        },
        {
          ...params,
          targetPlayerID: null,
        }
      )
    ).toBeNull();
  });
});
