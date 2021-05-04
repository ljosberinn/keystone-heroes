import { gql } from "graphql-request";

import { getGqlClient } from "../gqlClient";

type InitialRawReport = {
  reportData: {
    report: {
      fights: RawFightBase[];
      region: { slug: string };
      title: string;
      startTime: number;
      endTime: number;
    };
  };
};

export type RawReport = InitialRawReport["reportData"]["report"];

type RawFightBase = {
  id: number;
  keystoneBonus: number;
};

export type RawFight = RawFightBase & {
  averageItemLevel: number;
  keystoneAffixes: number[];
  keystoneLevel: number;
  keystoneTime: number;
  dungeonPulls: DungeonPull[];
  // gameZone is null on broken logs
  gameZone: { id: number } | null;
  // only required to query fights table properly
  startTime: number;
  endTime: number;
};

export type ValidRawFight = Omit<RawFight, "gameZone"> & {
  gameZone: { id: number };
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

  return client.request<InitialRawReport>(
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
              keystoneBonus
            }
          }
        }
      }
    `,
    { reportId }
  );
};

type FightsReport = {
  reportData: {
    report: {
      fights: RawFight[];
    };
  };
};

const getExtendedFightData = async (reportId: string, fightIds: number[]) => {
  const client = await getGqlClient();

  return client.request<FightsReport>(
    gql`
      query ReportData($reportId: String!, $fightIds: [Int]!) {
        reportData {
          report(code: $reportId) {
            fights(translate: true, killType: Kills, fightIDs: $fightIds) {
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
    { reportId, fightIds }
  );
};

export const loadReportFromSource = async (
  reportId: string
): Promise<RawReport | null> => {
  try {
    const json = await getInitialReportData(reportId);

    return json.reportData.report;
  } catch (error) {
    console.trace(error);
    return null;
  }
};

export const loadFightsFromSource = async (
  reportId: string,
  fightIds: number[]
): Promise<RawFight[] | null> => {
  try {
    const json = await getExtendedFightData(reportId, fightIds);

    return json.reportData.report.fights;
  } catch (error) {
    console.trace(error);
    return null;
  }
};
