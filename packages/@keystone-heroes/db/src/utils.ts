export const withPerformanceLogging = <Args extends unknown[], ReturnValue>(
  handler: (...args: Args) => Promise<ReturnValue>,
  title: string
) => {
  return async (...args: Args): Promise<ReturnValue> => {
    // eslint-disable-next-line no-console
    console.time(title);

    const result = await handler(...args);
    // eslint-disable-next-line no-console
    console.timeEnd(title);

    return result;
  };
};
