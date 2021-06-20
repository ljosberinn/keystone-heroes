import { Affixes } from "@keystone-heroes/db/types";
import { getTormentedEvents } from "@keystone-heroes/wcl/queries/events/affixes/tormented";

import allEvents from "./fixtures/allEvents.json";
import earlyPTRTormented from "./fixtures/earlyPTRTormented.json";

describe("getTormentedEvents", () => {
  test("works", () => {
    expect(
      getTormentedEvents(
        [...allEvents, ...earlyPTRTormented],
        new Set([Affixes.Tormented])
      )
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(
      getTormentedEvents([...allEvents, ...earlyPTRTormented], new Set())
    ).toHaveLength(0);
  });
});
