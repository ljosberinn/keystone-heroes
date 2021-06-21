import { Affixes } from "@keystone-heroes/db/types";
import { getQuakingEvents } from "@keystone-heroes/wcl/queries/events/affixes/quaking";

import allEvents from "./fixtures/allEvents.json";

describe("getQuakingEvents", () => {
  test("works", () => {
    expect(
      getQuakingEvents(allEvents, new Set([Affixes.Quaking]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getQuakingEvents(allEvents, new Set())).toHaveLength(0);
  });
});
