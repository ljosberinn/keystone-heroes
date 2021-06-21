import { Affixes } from "@keystone-heroes/db/types";

import { getBolsteringEvents } from "../src/queries/events/affixes/bolstering";
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
