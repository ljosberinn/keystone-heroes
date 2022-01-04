import { parseWCLUrl, timeDurationToString } from "../utils";

describe("parseWCLUrl", () => {
  test("fails given no url", () => {
    expect(parseWCLUrl("")).toMatchInlineSnapshot(`
      {
        "error": "INVALID_URL",
        "fightID": null,
        "reportID": null,
      }
    `);
  });

  test("fails given random url", () => {
    expect(parseWCLUrl("https://keystone-heroes.com")).toMatchInlineSnapshot(`
      {
        "error": "INVALID_HOST",
        "fightID": null,
        "reportID": null,
      }
    `);
  });

  test("fails given incomplete url", () => {
    expect(parseWCLUrl("https://keystone-heroes")).toMatchInlineSnapshot(`
      {
        "error": "INVALID_HOST",
        "fightID": null,
        "reportID": null,
      }
    `);
  });

  test("fails given invalid fight id", () => {
    expect(
      parseWCLUrl(
        "https://www.warcraftlogs.com/reports/aZ9y3jMctCqRvhKA#fight=kekw&type=damage-done"
      )
    ).toMatchInlineSnapshot(`
      {
        "error": null,
        "fightID": null,
        "reportID": "aZ9y3jMctCqRvhKA",
      }
    `);
  });

  test("passes given general report url", () => {
    expect(parseWCLUrl("https://www.warcraftlogs.com/reports/aZ9y3jMctCqRvhKA"))
      .toMatchInlineSnapshot(`
        {
          "error": null,
          "fightID": null,
          "reportID": "aZ9y3jMctCqRvhKA",
        }
      `);
  });

  test("passes given report url with fight id hash", () => {
    expect(
      parseWCLUrl(
        "https://www.warcraftlogs.com/reports/aZ9y3jMctCqRvhKA#fight=3"
      )
    ).toMatchInlineSnapshot(`
      {
        "error": null,
        "fightID": "3",
        "reportID": "aZ9y3jMctCqRvhKA",
      }
    `);
  });

  test("passes given report url with fight id === last", () => {
    expect(
      parseWCLUrl(
        "https://www.warcraftlogs.com/reports/aZ9y3jMctCqRvhKA#fight=last"
      )
    ).toMatchInlineSnapshot(`
      {
        "error": null,
        "fightID": "last",
        "reportID": "aZ9y3jMctCqRvhKA",
      }
    `);
  });

  test("passes given report url with trailing slash", () => {
    expect(
      parseWCLUrl(
        "https://www.warcraftlogs.com/reports/aZ9y3jMctCqRvhKA/#fight=last"
      )
    ).toMatchInlineSnapshot(`
      {
        "error": null,
        "fightID": "last",
        "reportID": "aZ9y3jMctCqRvhKA",
      }
    `);
  });
});

describe("timeDurationToString", () => {
  const numbers = [
    1, 10, 100, 1000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000,
    1_000_000_000, 10_000_000_000,
  ];

  test.each(numbers)("%d positive", (number) => {
    expect(timeDurationToString(number)).toMatchSnapshot();
  });

  test.each(numbers)("%d positive omitMs", (number) => {
    expect(
      timeDurationToString(number, {
        omitMs: true,
      })
    ).toMatchSnapshot();
  });

  test.each(numbers)("%d positive toHours", (number) => {
    expect(
      timeDurationToString(number, {
        toHours: true,
      })
    ).toMatchSnapshot();
  });

  test.each(numbers)("%d positive toHours & omitMs", (number) => {
    expect(
      timeDurationToString(number, {
        toHours: true,
        omitMs: true,
      })
    ).toMatchSnapshot();
  });

  test.each(numbers)("%d negative", (number) => {
    expect(timeDurationToString(number * -1)).toMatchSnapshot();
  });

  test.each(numbers)("%d negative omitMs", (number) => {
    expect(
      timeDurationToString(number * -1, {
        omitMs: true,
      })
    ).toMatchSnapshot();
  });

  test.each(numbers)("%d negative toHours", (number) => {
    expect(
      timeDurationToString(number * -1, {
        toHours: true,
      })
    ).toMatchSnapshot();
  });

  test.each(numbers)("%d negative toHours & omitMs", (number) => {
    expect(
      timeDurationToString(number * -1, {
        toHours: true,
        omitMs: true,
      })
    ).toMatchSnapshot();
  });
});
