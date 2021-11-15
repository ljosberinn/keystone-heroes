import { getDOSEvents } from "../queries/events/dungeons/dos";
import allEvents from "./fixtures/allEvents.json";

describe("getDOSEvents", () => {
  test("works", () => {
    expect(getDOSEvents(allEvents)).toMatchSnapshot();
  });
});
