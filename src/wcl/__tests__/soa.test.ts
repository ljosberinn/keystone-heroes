import { getSOAEvents } from "../queries/events/dungeons/soa";
import allEvents from "./fixtures/allEvents.json";

describe("getSOAEvents", () => {
  test("works", () => {
    expect(getSOAEvents(allEvents)).toMatchSnapshot();
  });
});
