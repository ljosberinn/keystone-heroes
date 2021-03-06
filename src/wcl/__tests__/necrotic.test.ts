import { Affixes } from "@prisma/client";

import { getNecroticEvents } from "../queries/events/affixes/necrotic";
import allEvents from "./fixtures/allEvents.json";

describe("getNecroticEvents", () => {
  test("works", () => {
    expect(
      getNecroticEvents(allEvents, new Set([Affixes.Necrotic]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getNecroticEvents(allEvents, new Set())).toHaveLength(0);
  });
});
