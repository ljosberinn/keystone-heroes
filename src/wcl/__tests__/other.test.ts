import {
  filterProfessionEvents,
  filterPlayerDeathEvents,
} from "../queries/events/other";
import allEvents from "./fixtures/allEvents.json";

describe("other", () => {
  test("filterProfessionEvents", () => {
    expect(filterProfessionEvents(allEvents)).toMatchSnapshot();
  });

  test("filterPlayerDeathEvents", () => {
    // PTR log https://www.warcraftlogs.com/reports/J3WKacdjpntmLT7C#fight=3&type=damage-done
    const actorPlayerSet: Parameters<typeof filterPlayerDeathEvents>[1] =
      new Set([1, 2, 3, 5, 60]);

    const result = filterPlayerDeathEvents(allEvents, actorPlayerSet);

    expect(result).toHaveLength(23);
    expect(result).toMatchSnapshot();
  });
});
