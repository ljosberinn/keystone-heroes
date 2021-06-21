import { getNWEvents } from "@keystone-heroes/wcl/queries/events/dungeons/nw";

import allEvents from "./fixtures/allEvents.json";

describe("getNWEvents", () => {
  test("works", () => {
    expect(getNWEvents(allEvents)).toMatchSnapshot();
  });
});
