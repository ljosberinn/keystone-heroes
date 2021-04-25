import { classnames } from "../utils/classNames";

// eslint-disable-next-line jest/require-top-level-describe
test.each([[["", null, undefined, 1, "abc"]], [["x", {}, []]], [[-1, 0, 1]]])(
  "given different args, works as expected",
  (input) => {
    expect(classnames(...input)).toMatchSnapshot();
  }
);
