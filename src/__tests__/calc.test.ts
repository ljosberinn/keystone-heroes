import type { DamageDone } from "../types/fightSummary";
import { calcChests, calcGroupDps, calcRunDuration } from "../utils/calc";
import type { Dungeon } from "../utils/dungeons";
import { dungeons } from "../utils/dungeons";

describe("calcGroupDps", () => {
  test("return 0 if no damageDone array is present", () => {
    expect(calcGroupDps(10)).toBe(0);
  });

  test.each([
    [0, 0],
    [10 * 1000, 100],
    [100 * 1000, 10_000],
    [25 * 1000, 40],
    [37 * 1000, 27],
    [28 * 60 * 1000, 595],
  ])("given a runDuration of %d, returns %d", (runDuration, expected) => {
    const total = runDuration > 1 * 60 * 1000 ? 200 * 1000 : 200;

    const damageDone: DamageDone[] = [
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
      { guid: 1, icon: "", id: 1, name: "", total, type: "DemonHunter" },
    ];

    expect(calcGroupDps(runDuration, damageDone)).toBe(expected);
  });
});

describe("calcChests", () => {
  test("returns 0 if completionTime is 0", () => {
    expect(calcChests(dungeons[0], 0)).toBe(0);
  });

  test.each(
    dungeons.flatMap((dungeon) =>
      dungeon.timer.map<[string, string, number, number, Dungeon]>(
        (timer, index) => [
          dungeon.slug,
          calcRunDuration(timer - 5000, 0, 0),
          index + 1,
          timer - 5000,
          dungeon,
        ]
      )
    )
  )(
    "completing dungeon '%s' in %s, returns %d chests",
    (_, __, chests, completionTime, dungeon) => {
      expect(calcChests(dungeon, completionTime)).toBe(chests);
    }
  );

  test.each(
    dungeons.flatMap((dungeon) =>
      dungeon.timer.map<[string, string, number, number, Dungeon]>(
        (timer, index) => [
          dungeon.slug,
          calcRunDuration(timer + 5000, 0, 0),
          index,
          timer + 5000,
          dungeon,
        ]
      )
    )
  )(
    "completing dungeon '%s' in %s, returns %d chests",
    (_, __, chests, completionTime, dungeon) => {
      expect(calcChests(dungeon, completionTime)).toBe(chests);
    }
  );
});

describe("calcRunDuration", () => {
  test("formats completionTime if larger than 0", () => {
    expect(calcRunDuration(1, 0, 0)).toMatchInlineSnapshot(`"00:00.001"`);
  });

  test.each([
    [1, "00:00.001"],
    [10, "00:00.010"],
    [100, "00:00.100"],
    [1000, "00:01.000"],
    [10_000, "00:10.000"],
    [100_000, "01:40.000"],
    [1_000_000, "16:40.000"],
  ])("formats completionTime of %d properly", (completionTime, expected) => {
    expect(calcRunDuration(completionTime, 0, 0)).toBe(expected);
  });

  test.each([
    [1, 10, "00:00.009"],
    [10, 100, "00:00.090"],
    [100, 1000, "00:00.900"],
    [1000, 10_000, "00:09.000"],
    [10_000, 100_000, "01:30.000"],
    [100_000, 1_000_000, "15:00.000"],
  ])(
    "formats end_time-start_time if completionTime is 0",
    (start, end, expected) => {
      expect(calcRunDuration(0, start, end)).toBe(expected);
    }
  );

  test("does not crash on invalid values", () => {
    expect(calcRunDuration(0, 0, 0)).toMatchInlineSnapshot(`"00:00.000"`);
  });
});
