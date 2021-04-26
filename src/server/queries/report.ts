import { gql } from "graphql-request";

import type { Affixes } from "../../utils/affixes";
import type { Dungeons } from "../../utils/dungeons";
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
  id: number;
  averageItemLevel: number;
  keystoneAffixes: (keyof Affixes)[];
  keystoneLevel: number;
  keystoneTime: number;
  keystoneBonus: 0 | 1 | 2 | 3;
  dungeonPulls: DungeonPull[];
  gameZone: { id: keyof Dungeons };
  // only required to query fights table properly
  startTime: number;
  endTime: number;
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

export const loadReportFromSource = async (
  reportId: string
): Promise<Report | null> => {
  try {
    const json = await getInitialReportData(reportId);

    return json.reportData.report;
  } catch {
    return null;
  }
};
