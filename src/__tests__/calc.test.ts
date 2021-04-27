import type { DamageDone } from "../server/queries/table";
import { calcMetricAverage } from "../utils/calc";

describe("calcMetricAverage", () => {
  test.each([
    0,
    10,
    100,
    1000,
    10_000,
    100_000,
    1_000_000,
    200 * 1000,
    25 * 1000 * 20,
    28 * 60 * 1000,
  ])("matches snapshot", (runDuration) => {
    const total = runDuration > 1 * 60 * 1000 ? 200 * 1000 : 200;

    const damageDone: DamageDone[] = [
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
    ];

    expect(calcMetricAverage(runDuration, damageDone)).toMatchSnapshot();
  });

  test("allows optionally filtering via guid", () => {
    const total = 28 * 60 * 1000;

    const damageDone: DamageDone[] = [
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 123, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
    ];

    expect(calcMetricAverage(total, damageDone, 123)).toMatchInlineSnapshot(
      `1000`
    );
  });
});
