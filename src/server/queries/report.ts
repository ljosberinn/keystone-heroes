import { existsSync, readFileSync, writeFileSync } from "fs";
import { gql } from "graphql-request";
import { resolve } from "path";

import { IS_PROD } from "../../constants";
import type { Affix } from "../../utils/affixes";
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
  averageItemlevel: number;
  keystoneAffixes: Affix["id"][];
  keystoneLevel: number;
  id: number;
  startTime: number;
  endTime: number;
  keystoneTime: number;
  encounterID: number;
  friendlyPlayers: number[];
};

const getInitialReportData = (reportId: string) => {
  return getGqlClient().then((client) =>
    client.request<RawReport>(
      gql`
        query ReportData($reportId: String!) {
          reportData {
            report(code: $reportId) {
              fights(translate: true, killType: Kills) {
                averageItemLevel
                keystoneAffixes
                keystoneLevel
                id
                startTime
                endTime
                keystoneTime
                friendlyPlayers
                encounterID
              }
              region {
                slug
              }
              title
              startTime
              endTime
            }
          }
        }
      `,
      { reportId }
    )
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
