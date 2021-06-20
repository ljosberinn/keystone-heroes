import type { ApplyDebuffStackEvent } from "@keystone-heroes/wcl/queries";

import { getHighestNecroticStack } from "../src/queries/events/affixes/necrotic";
import necroticApplyDebuffEvents from "./fixtures/necroticApplyDebuffEvents.json";

describe("necrotic", () => {
  test("getHighestNecroticStack", () => {
    const events = necroticApplyDebuffEvents
      .filter((event) => event.type === "applydebuffstack")
      .map<ApplyDebuffStackEvent>((event) => ({
        ...event,
        type: "applydebuffstack",
        stack: event.stack ?? 0,
      }));

    expect(getHighestNecroticStack(events)).toMatchSnapshot();
  });
});
