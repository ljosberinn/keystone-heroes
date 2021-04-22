export const classnames = (...classes: unknown[]): string =>
  classes.filter(Boolean).join(" ");
