import { Affixes } from "@prisma/client";

import { getTormentedEvents } from "../queries/events/affixes/tormented";
import allEvents from "./fixtures/allEvents.json";

describe("getTormentedEvents", () => {
  test("works", () => {
    expect(
      getTormentedEvents(allEvents, new Set([Affixes.Tormented]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getTormentedEvents(allEvents, new Set())).toHaveLength(0);
  });
});
