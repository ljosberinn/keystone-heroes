import { SD_LANTERN_BUFF } from "../src/queries/events/dungeons/sd";
import type { RemoveBuffEvent } from "../src/queries/events/types";
import { removeBuffProcessor } from "../src/transform/events/removebuff";
import allEvents from "./fixtures/allEvents.json";

describe("removebuff", () => {
  const params = {
    sourcePlayerID: null,
    targetPlayerID: 1,
    sourceNPCID: null,
    targetNPCID: null,
  };

  const removebuffEvents = allEvents.filter(
    (event): event is RemoveBuffEvent => event.type === "removebuff"
  );

  test("tracks SD Lantern Buff events", () => {
    const result = removebuffEvents
      .filter((event) => event.abilityGameID === SD_LANTERN_BUFF)
      .map((event) => removeBuffProcessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("ignores unknown removebuff events", () => {
    expect(
      removeBuffProcessor(
        {
          type: "removebuff",
          timestamp: 1,
          abilityGameID: 1,
          sourceID: 1,
          targetID: 1,
        },
        { ...params, targetPlayerID: null }
      )
    ).toBeNull();
  });
});
