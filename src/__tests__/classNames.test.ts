import { classnames } from "../utils/classNames";

// eslint-disable-next-line jest/require-top-level-describe
test.each([
  [["", null, undefined, 1, "abc"], "1 abc"],
  [["x", {}, [], "a"], "x a"],
  [[-1, 0, 1], "-1 1"],
])("given different args, works as expected", (input, expected) => {
  expect(classnames(...input)).toBe(expected);
});
