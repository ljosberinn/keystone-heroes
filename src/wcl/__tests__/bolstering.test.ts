import { Affixes } from "@prisma/client";

import { getBolsteringEvents } from "../queries/events/affixes/bolstering";
import allEvents from "./fixtures/allEvents.json";

describe("getHighestBolsteringStack", () => {
  test("works", () => {
    expect(
      getBolsteringEvents(allEvents, new Set([Affixes.Bolstering]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getBolsteringEvents(allEvents, new Set())).toHaveLength(0);
  });
});
