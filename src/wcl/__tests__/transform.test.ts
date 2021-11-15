import { processEvents } from "../transform";
import allEvents from "./fixtures/allEvents.json";

describe("processEvents", () => {
  test("snapshot", () => {
    const pull: Parameters<typeof processEvents>[0] = {
      startTime: 0,
      endTime: 1,
      id: 1,
      isWipe: false,
      enemyNPCs: [],
      maps: [],
      x: 0,
      y: 0,
      percent: 0,
    };

    const result = processEvents(pull, allEvents, new Map(), []);

    expect(result).toMatchSnapshot();
  });
});
