import { PlayableClass } from "@keystone-heroes/db/types";

import {
  filterProfessionEvents,
  filterPlayerDeathEvents,
} from "../src/queries/events/other";
import allEvents from "./fixtures/allEvents.json";

describe("other", () => {
  test("filterProfessionEvents", () => {
    expect(filterProfessionEvents(allEvents)).toMatchSnapshot();
  });

  test("filterPlayerDeathEvents", () => {
    // PTR log https://www.warcraftlogs.com/reports/J3WKacdjpntmLT7C#fight=3&type=damage-done
    const metaInfo: Parameters<typeof filterPlayerDeathEvents>[1] = [
      { actorID: 1, class: PlayableClass.Rogue },
      { actorID: 2, class: PlayableClass.Rogue },
      { actorID: 3, class: PlayableClass.Mage },
      { actorID: 5, class: PlayableClass.DemonHunter },
      { actorID: 60, class: PlayableClass.Shaman },
    ];

    const result = filterPlayerDeathEvents(allEvents, metaInfo, []);

    expect(result).toHaveLength(23);
    expect(result).toMatchSnapshot();
  });
});
