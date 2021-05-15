import { createDungeonTimer } from "../../prisma/dungeons";
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
    [10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map<
      [number, [number, number, number]]
    >((value, index) => [
      value * 60 * 1000 - (value + index + 1) * (1000 + index + 1),
      createDungeonTimer(value),
    ])
  )("matches snapshot", (completionTime, timer) => {
    expect(formatTimeLeft(timer, completionTime)).toMatchSnapshot();
  });
});
