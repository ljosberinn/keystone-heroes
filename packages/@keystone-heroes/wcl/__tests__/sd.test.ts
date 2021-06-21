import { getSDEvents } from "@keystone-heroes/wcl/queries/events/dungeons/sd";

import allEvents from "./fixtures/allEvents.json";

describe("getSDEvents", () => {
  test("works", () => {
    expect(getSDEvents(allEvents)).toMatchSnapshot();
  });
});
