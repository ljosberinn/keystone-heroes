import { PlayableClass } from "@keystone-heroes/db/types";
import { getPFEvents } from "@keystone-heroes/wcl/queries/events/dungeons/pf";

import allEvents from "./fixtures/allEvents.json";

describe("getPFEvents", () => {
  test("works", () => {
    expect(
      getPFEvents(allEvents, [
        {
          actorID: 62,
          class: PlayableClass.Priest,
        },
        {
          actorID: 1,
          class: PlayableClass.DemonHunter,
        },
        {
          actorID: 63,
          class: PlayableClass.Rogue,
        },
        {
          actorID: 65,
          class: PlayableClass.Rogue,
        },
        {
          actorID: 64,
          class: PlayableClass.Shaman,
        },
      ])
    ).toMatchSnapshot();
  });
});
