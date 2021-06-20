import type { AnyEvent } from "@keystone-heroes/wcl/queries";

import { filterProfessionEvents } from "../src/queries/events/other";
import dimensionalShifterEvents from "./fixtures/dimensionalShifterEvents.json";
import engineeringSLCastEvents from "./fixtures/engineeringSLCastEvents.json";
import potionOfTheHiddenSpiritEvents from "./fixtures/potionOfTheHiddenSpiritEvents.json";
import spellCastEvents from "./fixtures/spellCastEvents.json";

describe("other", () => {
  test("filterProfessionEvents", () => {
    const events: AnyEvent[] = [
      ...dimensionalShifterEvents,
      ...engineeringSLCastEvents,
      ...potionOfTheHiddenSpiritEvents,
      ...spellCastEvents,
    ].sort((a, b) => a.timestamp - b.timestamp);

    expect(filterProfessionEvents(events)).toMatchSnapshot();
  });

  // events from https://www.warcraftlogs.com/reports/fxq2w3aAW49dHhjb#fight=3

  // events from https://www.warcraftlogs.com/reports/fxq2w3aAW49dHhjb#fight=3
});
