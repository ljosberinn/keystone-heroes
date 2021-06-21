import { getHOAEvents } from "@keystone-heroes/wcl/queries/events/dungeons/hoa";

import allEvents from "./fixtures/allEvents.json";

describe("getHOAEvents", () => {
  test("works", () => {
    expect(getHOAEvents(allEvents)).toMatchSnapshot();
  });
});
