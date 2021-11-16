import { Affixes } from "@prisma/client";

import { getGrievousEvents } from "../queries/events/affixes/grievous";
import allEvents from "./fixtures/allEvents.json";

describe("getGrievousEvents", () => {
  test("works", () => {
    expect(
      getGrievousEvents(allEvents, new Set([Affixes.Grievous]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getGrievousEvents(allEvents, new Set())).toHaveLength(0);
  });
});
