export const classnames = (...classes: unknown[]): string =>
  classes
    .filter((value) => typeof value !== "object" && Boolean(value))
    .join(" ");
