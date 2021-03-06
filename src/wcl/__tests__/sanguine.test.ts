import { Affixes } from "@prisma/client";

import { getSanguineEvents } from "../queries/events/affixes/sanguine";
import allEvents from "./fixtures/allEvents.json";

describe("getSanguineEvents", () => {
  test("works", () => {
    expect(
      getSanguineEvents(allEvents, new Set([Affixes.Sanguine]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getSanguineEvents(allEvents, new Set())).toHaveLength(0);
  });
});
