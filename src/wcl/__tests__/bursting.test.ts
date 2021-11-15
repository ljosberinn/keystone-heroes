import { Affixes } from "@prisma/client";

import { getBurstingEvents } from "../queries/events/affixes/bursting";
import allEvents from "./fixtures/allEvents.json";

describe("getBurstingEvents", () => {
  test("works", () => {
    expect(
      getBurstingEvents(allEvents, new Set([Affixes.Bursting]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getBurstingEvents(allEvents, new Set())).toHaveLength(0);
  });
});
