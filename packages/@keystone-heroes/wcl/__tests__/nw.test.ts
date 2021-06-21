import { getNWEvents } from "../src/queries/events/dungeons/nw";
import allEvents from "./fixtures/allEvents.json";

describe("getNWEvents", () => {
  test("works", () => {
    expect(getNWEvents(allEvents)).toMatchSnapshot();
  });
});
