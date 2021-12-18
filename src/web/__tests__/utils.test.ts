import { parseWCLUrl } from "../utils";

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
