import { Affixes } from "@keystone-heroes/db/types";
import { getSpitefulEvents } from "@keystone-heroes/wcl/queries/events/affixes/spiteful";

import allEvents from "./fixtures/allEvents.json";

describe("getSpitefulEvents", () => {
  test("works", () => {
    expect(
      getSpitefulEvents(allEvents, new Set([Affixes.Spiteful]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getSpitefulEvents(allEvents, new Set())).toHaveLength(0);
  });
});
