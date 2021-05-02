export const toUniqueArray = <Dataset>(array: Dataset[]): Dataset[] => [
  ...new Set(array),
];
