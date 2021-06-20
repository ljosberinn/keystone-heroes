import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  BeginCastEvent,
  CastEvent,
} from "@keystone-heroes/wcl/queries";

import { filterProfessionEvents } from "../src/queries/events/other";
import dimensionalShifterEvents from "./fixtures/dimensionalShifterEvents.json";
import engineeringSLCastEvents from "./fixtures/engineeringSLCastEvents.json";
import potionOfTheHiddenSpiritEvents from "./fixtures/potionOfTheHiddenSpiritEvents.json";
import spellCastEvents from "./fixtures/spellCastEvents.json";

describe("other", () => {
  test("filterProfessionEvents", () => {
    const invis1 = dimensionalShifterEvents.map<ApplyBuffEvent>((event) => ({
      ...event,
      type: "applybuff",
    }));

    const invis2 = potionOfTheHiddenSpiritEvents.map<ApplyBuffEvent>(
      (event) => ({
        ...event,
        type: "applybuff",
      })
    );

    const rez = engineeringSLCastEvents.map<BeginCastEvent | CastEvent>(
      (event) => ({
        ...event,
        type: event.type === "begincast" ? "begincast" : "cast",
      })
    );

    const casts = spellCastEvents.map<CastEvent>((event) => ({
      ...event,
      type: "cast",
    }));

    const events: AllTrackedEventTypes = [
      ...invis1,
      ...invis2,
      ...rez,
      ...casts,
    ].sort((a, b) => a.timestamp - b.timestamp);

    expect(filterProfessionEvents(events)).toMatchSnapshot();
  });

  // events from https://www.warcraftlogs.com/reports/fxq2w3aAW49dHhjb#fight=3

  // events from https://www.warcraftlogs.com/reports/fxq2w3aAW49dHhjb#fight=3
});
