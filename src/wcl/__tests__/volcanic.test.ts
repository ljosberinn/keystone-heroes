import { Affixes } from "@prisma/client";

import { getVolcanicEvents } from "../queries/events/affixes/volcanic";
import allEvents from "./fixtures/allEvents.json";

describe("getVolcanicEvents", () => {
  test("works", () => {
    expect(
      getVolcanicEvents(allEvents, new Set([Affixes.Volcanic]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getVolcanicEvents(allEvents, new Set())).toHaveLength(0);
  });
});
