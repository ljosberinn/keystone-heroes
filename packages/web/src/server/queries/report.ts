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
  keystoneLevel: number;
};

export type RawFight = RawFightBase & {
  averageItemLevel: number;
  keystoneAffixes: number[];
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
  enemyNPCs: {
    gameID: number;
    minimumInstanceID: number;
    maximumInstanceID: number;
  }[];
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
              keystoneLevel
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
                  minimumInstanceID
                  maximumInstanceID
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

type EnemyNPC = { id: number; gameID: number };

type EnemyNpcIdResponse = {
  reportData: {
    report: {
      fights: [{ enemyNPCs: EnemyNPC[] }];
    };
  };
};

export const getEnemyNpcIds = async (
  reportId: string,
  fightIds: number | number[],
  gameIdOrIds: number | number[]
): Promise<Record<number, number>> => {
  const client = await getGqlClient();

  const response = await client.request<EnemyNpcIdResponse>(
    gql`
      query ReportData($reportId: String!, $fightIds: [Int]!) {
        reportData {
          report(code: $reportId) {
            fights(translate: true, killType: Kills, fightIDs: $fightIds) {
              enemyNPCs {
                id
                gameID
              }
            }
          }
        }
      }
    `,
    { reportId, fightIds: Array.isArray(fightIds) ? fightIds : [fightIds] }
  );

  const ids = new Set(Array.isArray(gameIdOrIds) ? gameIdOrIds : [gameIdOrIds]);

  return response.reportData.report.fights[0].enemyNPCs
    .filter((npc) => ids.has(npc.gameID))
    .reduce<Record<number, number>>(
      (acc, npc) => ({
        ...acc,
        [npc.gameID]: npc.id,
      }),
      {}
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
