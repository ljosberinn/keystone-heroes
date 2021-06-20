import { Affixes } from "@keystone-heroes/db/types";
import type { ApplyBuffEvent } from "@keystone-heroes/wcl/queries";

import { getBolsteringEvents } from "../src/queries/events/affixes/bolstering";
import bolsteringApplyBuffEvents from "./fixtures/bolsteringApplyBuffEvents.json";

describe("bolstering", () => {
  test("getHighestBolsteringStack", () => {
    const events = bolsteringApplyBuffEvents.map<ApplyBuffEvent>((event) => ({
      ...event,
      type: "applybuff",
    }));

    expect(
      getBolsteringEvents(events, new Set([Affixes.Bolstering]))
    ).toMatchSnapshot();
  });
});
