import { getMOTSEvents } from "../src/queries/events/dungeons/mots";
import allEvents from "./fixtures/allEvents.json";

describe("getMOTSEvents", () => {
  test("works", () => {
    expect(getMOTSEvents(allEvents)).toMatchSnapshot();
  });
});
