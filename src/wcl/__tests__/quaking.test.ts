import { Affixes } from "@prisma/client";

import { getQuakingEvents } from "../queries/events/affixes/quaking";
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
