import { getTOPEvents } from "@keystone-heroes/wcl/queries/events/dungeons/top";

import allEvents from "./fixtures/allEvents.json";

describe("getTOPEvents", () => {
  test("works", () => {
    expect(getTOPEvents(allEvents)).toMatchSnapshot();
  });
});
