import { Affixes } from "@keystone-heroes/db/types";

import { getStormingEvents } from "../src/queries/events/affixes/storming";
import allEvents from "./fixtures/allEvents.json";

describe("getStormingEvents", () => {
  test("works", () => {
    expect(
      getStormingEvents(allEvents, new Set([Affixes.Storming]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getStormingEvents(allEvents, new Set())).toHaveLength(0);
  });
});
