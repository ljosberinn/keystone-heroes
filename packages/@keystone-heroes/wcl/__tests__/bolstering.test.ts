import type { ApplyBuffEvent } from "@keystone-heroes/wcl/queries";

import { getHighestBolsteringStack } from "../src/queries/events/affixes/bolstering";
import bolsteringApplyBuffEvents from "./fixtures/bolsteringApplyBuffEvents.json";

describe("bolstering", () => {
  test("getHighestBolsteringStack", () => {
    const events = bolsteringApplyBuffEvents.map<ApplyBuffEvent>((event) => ({
      ...event,
      type: "applybuff",
    }));

    expect(getHighestBolsteringStack(events)).toMatchSnapshot();
  });
});
