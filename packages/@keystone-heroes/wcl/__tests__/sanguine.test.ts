import type { HealEvent } from "@keystone-heroes/wcl/queries";

import { reduceHealingDoneBySanguine } from "../src/queries/events/affixes/sanguine";
import sanguineHealEvents from "./fixtures/sanguineHealEvents.json";

describe("sanguine", () => {
  test("reduceHealingDoneBySanguine", () => {
    const events = sanguineHealEvents.map<HealEvent>((event) => ({
      ...event,
      type: "heal",
    }));

    expect(reduceHealingDoneBySanguine(events)).toMatchSnapshot();
  });
});
