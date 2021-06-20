import { Affixes } from "@keystone-heroes/db/types";
import type { ApplyDebuffStackEvent } from "@keystone-heroes/wcl/queries";

import { getNecroticEvents } from "../src/queries/events/affixes/necrotic";
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

    expect(
      getNecroticEvents(events, new Set([Affixes.Necrotic]))
    ).toMatchSnapshot();
  });
});
