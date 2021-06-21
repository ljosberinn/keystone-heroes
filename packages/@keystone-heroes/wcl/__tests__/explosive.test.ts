import { Affixes } from "@keystone-heroes/db/types";
import { getExplosiveEvents } from "@keystone-heroes/wcl/queries/events/affixes/explosive";

import allEvents from "./fixtures/allEvents.json";

describe("getExplosiveEvents", () => {
  test("works", () => {
    expect(
      getExplosiveEvents(allEvents, new Set([Affixes.Explosive]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getExplosiveEvents(allEvents, new Set())).toHaveLength(0);
  });
});
