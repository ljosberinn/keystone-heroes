import { existsSync, readFileSync, writeFileSync } from "fs";
import { gql } from "graphql-request";
import { resolve } from "path";

import { IS_PROD } from "../../constants";
import type { Affix } from "../../utils/affixes";
import type { Dungeon } from "../../utils/dungeons";
import { getGqlClient } from "../gqlClient";

type RawReport = {
  reportData: {
    report: {
      fights: Fight[];
      region: { slug: string };
      title: string;
      startTime: number;
      endTime: number;
    };
  };
};

export type Report = RawReport["reportData"]["report"];

export type Fight = {
  averageItemLevel: number;
  keystoneAffixes: Affix["id"][];
  keystoneLevel: number;
  id: number;
  startTime: number;
  endTime: number;
  keystoneTime: number;
  keystoneBonus: 0 | 1 | 2 | 3;
  dungeonPulls: DungeonPull[];
  gameZone: { id: Dungeon["id"] };
};

export type DungeonPull = {
  boundingBox: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  enemyNPCs: { gameId: number }[];
  x: number;
  y: number;
};

const getInitialReportData = async (reportId: string) => {
  const client = await getGqlClient();

  return client.request<RawReport>(
    gql`
      query ReportData($reportId: String!) {
        reportData {
          report(code: $reportId) {
            title
            startTime
            endTime
            region {
              slug
            }
            fights(translate: true, killType: Kills) {
              id
              gameZone {
                id
              }
              averageItemLevel
              keystoneAffixes
              keystoneLevel
              keystoneBonus
              keystoneTime
              startTime
              endTime
              dungeonPulls {
                x
                y
                boundingBox {
                  minX
                  maxX
                  minY
                  maxY
                }
                enemyNPCs {
                  gameID
                }
              }
            }
          }
        }
      }
    `,
    { reportId }
  );
};

export const retrieveReportCacheOrSource = async (
  reportId: string
): Promise<Report | null> => {
  const resolvedCachePath = resolve(`cache/${reportId}-report.json`);

  if (!IS_PROD && existsSync(resolvedCachePath)) {
    // eslint-disable-next-line no-console
    console.info(
      `[reportId/getStaticProps] reading report "${reportId}" from cache`
    );
    const raw = readFileSync(resolvedCachePath, {
      encoding: "utf-8",
    });

    return JSON.parse(raw).reportData.report;
  }

  try {
    // eslint-disable-next-line no-console
    console.info(
      `[reportId/getStaticProps] fetching report "${reportId}" from WCL`
    );

    const json = await getInitialReportData(reportId);

    if (!IS_PROD) {
      writeFileSync(resolvedCachePath, JSON.stringify(json));
    }

    return json.reportData.report;
  } catch {
    return null;
  }
};
