import { Affixes } from "@keystone-heroes/db/types";
import type { HealEvent } from "@keystone-heroes/wcl/queries";

import { getSanguineEvents } from "../src/queries/events/affixes/sanguine";
import sanguineHealEvents from "./fixtures/sanguineHealEvents.json";

describe("sanguine", () => {
  test("reduceHealingDoneBySanguine", () => {
    const events = sanguineHealEvents.map<HealEvent>((event) => ({
      ...event,
      type: "heal",
    }));

    expect(
      getSanguineEvents(events, new Set([Affixes.Sanguine]))
    ).toMatchSnapshot();
  });
});
