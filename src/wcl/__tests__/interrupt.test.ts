import { QUAKING } from "../queries/events/affixes/quaking";
import type { InterruptEvent } from "../queries/events/types";
import { interruptProcessor } from "../transform/events/interrupt";
import allEvents from "./fixtures/allEvents.json";

describe("interrupt", () => {
  const params = {
    sourcePlayerID: 1,
    targetPlayerID: 1,
    sourceNPCID: null,
    targetNPCID: null,
  };

  const interruptEvents = allEvents.filter(
    (event): event is InterruptEvent => event.type === "interrupt"
  );

  test("tracks interrupts by quaking", () => {
    const result = interruptEvents
      .filter((event) => event.abilityGameID === QUAKING)
      .map((event) => interruptProcessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("ignores unknown interrupt events", () => {
    expect(
      interruptProcessor(
        {
          type: "interrupt",
          timestamp: 1,
          abilityGameID: 1,
          extraAbilityGameID: 2,
          sourceID: 1,
          targetID: 1,
        },
        { ...params, sourcePlayerID: null, targetPlayerID: null }
      )
    ).toBeNull();
  });
});
