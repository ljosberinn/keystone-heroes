import { getPFEvents } from "../src/queries/events/dungeons/pf";
import allEvents from "./fixtures/allEvents.json";

describe("getPFEvents", () => {
  test("works", () => {
    expect(
      getPFEvents(allEvents, new Set([62, 1, 63, 65, 64]))
    ).toMatchSnapshot();
  });
});
