import type { Dungeon } from "../utils/dungeons";
import { dungeons } from "../utils/dungeons";
import { formatKeystoneTime, formatTimeLeft } from "../utils/format";

describe("formatKeystoneTime", () => {
  test.each([1, 10, 100, 1000, 10_000, 100_000, 1_000_000])(
    "matches snapshot",
    (completionTime) => {
      expect(formatKeystoneTime(completionTime)).toMatchSnapshot();
    }
  );

  test("does not crash on invalid values", () => {
    expect(formatKeystoneTime(0)).toMatchInlineSnapshot(`"00:00.000"`);
  });
});

describe("formatTimeLeft", () => {
  test.each(
    Object.values(dungeons).flatMap((dungeon) =>
      dungeon.timer.map<[Dungeon, number]>((timer) => [
        dungeon,
        timer - 10 * 1000,
      ])
    )
  )("matches snapshot", (dungeon, completionTime) => {
    expect(formatTimeLeft(dungeon, completionTime)).toMatchSnapshot();
  });
});
