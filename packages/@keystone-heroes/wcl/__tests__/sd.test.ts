import { getSDEvents } from "../src/queries/events/dungeons/sd";
import allEvents from "./fixtures/allEvents.json";

describe("getSDEvents", () => {
  test("works", () => {
    expect(getSDEvents(allEvents)).toMatchSnapshot();
  });
});
