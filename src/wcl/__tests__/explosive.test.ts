import { Affixes } from "@prisma/client";

import { getExplosiveEvents } from "../queries/events/affixes/explosive";
import allEvents from "./fixtures/allEvents.json";

describe("getExplosiveEvents", () => {
  test("works", () => {
    expect(
      getExplosiveEvents(allEvents, new Set([Affixes.Explosive]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    const { events, explosiveTargetID } = getExplosiveEvents(
      allEvents,
      new Set()
    );

    expect(events).toHaveLength(0);
    expect(explosiveTargetID).toBeNull();
  });
});
