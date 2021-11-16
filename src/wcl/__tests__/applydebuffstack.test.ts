import { NECROTIC } from "../queries/events/affixes/necrotic";
import type { ApplyDebuffStackEvent } from "../queries/events/types";
import { applyDebuffStackprocessor } from "../transform/events/applydebuffstack";
import allEvents from "./fixtures/allEvents.json";

describe("applydebuffstack", () => {
  const params = {
    targetPlayerID: 1,
    targetNPCID: null,
    sourcePlayerID: null,
    sourceNPCID: null,
  };

  const applydebuffstackEvents = allEvents.filter(
    (event): event is ApplyDebuffStackEvent => event.type === "applydebuffstack"
  );

  test("tracks Necrotic stacks", () => {
    const result = applydebuffstackEvents
      .filter((event) => event.abilityGameID === NECROTIC)
      .map((event) => applyDebuffStackprocessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("returns null on unknown applydebuffstack events", () => {
    expect(
      applyDebuffStackprocessor(
        {
          type: "applydebuffstack",
          abilityGameID: 1,
          sourceID: 1,
          stack: 1,
          targetID: 1,
          timestamp: 1,
        },
        params
      )
    ).toBeNull();
  });
});
