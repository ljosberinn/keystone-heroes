import { graphql } from "msw";
import { setupServer } from "msw/node";

import {
  getManifestationOfPrideSourceID,
  getManifestationOfPrideDeathEvents,
  getDamageDoneToManifestationOfPrideEvents,
  getDamageTakenByManifestationOfPrideEvents,
} from "../src/queries/events/affixes/prideful";
import manifestationOfPrideAllDamageDoneEvents from "./fixtures/manifestationOfPrideAllDamageDoneEvents.json";
import manifestationOfPrideAllDamageTakenEvents from "./fixtures/manifestationOfPrideAllDamageTakenEvents.json";
import manifestationOfPrideDeathEvents from "./fixtures/manifestationOfPrideDeathEvents.json";
import spitefulPridefulEnemyNPCIDs from "./fixtures/spitefulPridefulEnemyNPCIDs.json";

describe("prideful", () => {
  const server = setupServer();

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test("getManifestationOfPrideSourceID", async () => {
    server.use(
      graphql.query("EnemyNPCIds", (_req, res, ctx) => {
        return res(ctx.data(spitefulPridefulEnemyNPCIDs));
      })
    );

    const result = await getManifestationOfPrideSourceID({
      reportID: "",
      fightID: 1,
    });

    expect(result).toMatchSnapshot();
  });

  test("getManifestationOfPrideDeathEvents", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: manifestationOfPrideDeathEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getManifestationOfPrideDeathEvents({
      reportID: "",
      fightID: 1,
      sourceID: 33,
      startTime: 0,
      endTime: 1,
    });

    expect(result).toMatchSnapshot();
  });

  // see https://github.com/ljosberinn/keystone-heroes/issues/31
  // technically the snapshot is invalid:
  // 8 entries instead of 5 due to 3 pets being active
  test("getDamageDoneToManifestationOfPrideEvents (all events)", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: manifestationOfPrideAllDamageDoneEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getDamageDoneToManifestationOfPrideEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
      targetID: 1,
    });

    expect(result).toMatchSnapshot();
  });

  test("getDamageDoneToManifestationOfPrideEvents (first event only)", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: manifestationOfPrideAllDamageDoneEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getDamageDoneToManifestationOfPrideEvents(
      {
        reportID: "",
        startTime: 0,
        endTime: 1,
        targetID: 1,
      },
      true
    );

    expect(result).toMatchSnapshot();
  });

  test("getDamageTakenByManifestationOfPrideEvents (all events)", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: manifestationOfPrideAllDamageTakenEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getDamageTakenByManifestationOfPrideEvents({
      reportID: "",
      startTime: 0,
      endTime: 1,
      targetID: 1,
    });

    expect(result).toMatchSnapshot();
  });

  test("getDamageTakenByManifestationOfPrideEvents (first event only)", async () => {
    server.use(
      graphql.query("EventData", (_req, res, ctx) => {
        return res(
          ctx.data({
            reportData: {
              report: {
                events: {
                  data: manifestationOfPrideAllDamageTakenEvents,
                },
              },
            },
          })
        );
      })
    );

    const result = await getDamageTakenByManifestationOfPrideEvents(
      {
        reportID: "",
        startTime: 0,
        endTime: 1,
        targetID: 1,
      },
      true
    );

    expect(result).toMatchSnapshot();
  });
});
