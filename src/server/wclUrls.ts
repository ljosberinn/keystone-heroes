import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import { IS_PROD, WARCRAFTLOGS_API_KEY } from "../constants";
import type { WCLFightSummary } from "../types/fightSummary";
import type {
  CompletedKeystoneFight,
  FailedKeystoneFight,
} from "../types/keystone";
import type { WCLFight, WCLReport } from "../types/report";

const baseUrl = "https://www.warcraftlogs.com/v1";

export const getFightsUrl = (reportId: string): string => {
  const requestUri = `${baseUrl}/report/fights/${reportId}`;

  const searchParams = new URLSearchParams({
    translate: "true",
    api_key: WARCRAFTLOGS_API_KEY,
  }).toString();

  return `${requestUri}?${searchParams}`;
};

export const getFightSummaryUrl = (
  reportId: string,
  { start_time, end_time }: Pick<WCLFight, "start_time" | "end_time">
): string => {
  const requestUri = `${baseUrl}/report/tables/summary/${reportId}`;

  const searchParams = new URLSearchParams({
    translate: "true",
    api_key: WARCRAFTLOGS_API_KEY,
    start: start_time.toString(),
    end: end_time.toString(),
  }).toString();

  return `${requestUri}?${searchParams}`;
};

export const retrieveReportCacheOrSource = async (
  reportId: string
): Promise<WCLReport | null> => {
  const resolvedCachePath = resolve(`cache/${reportId}-report.json`);

  if (!IS_PROD && existsSync(resolvedCachePath)) {
    // eslint-disable-next-line no-console
    console.info(
      `[report/getStaticProps] reading report "${reportId}" from cache`
    );
    const raw = readFileSync(resolvedCachePath, {
      encoding: "utf-8",
    });

    return JSON.parse(raw);
  }

  const url = getFightsUrl(reportId);

  try {
    // eslint-disable-next-line no-console
    console.info(
      `[report/getStaticProps] fetching report "${reportId}" from WCL`
    );

    const response = await fetch(url);

    if (response.ok) {
      const json = await response.json();

      if (!IS_PROD) {
        writeFileSync(resolvedCachePath, JSON.stringify(json));
      }

      return json;
    }
  } catch {
    return null;
  }

  return null;
};

export const retrieveFightSummaryCacheOrSource = async (
  reportId: string,
  fight: CompletedKeystoneFight | FailedKeystoneFight
): Promise<WCLFightSummary | null> => {
  const resolvedCachePath = resolve(`cache/${reportId}-${fight.id}-fight.json`);

  if (!IS_PROD && existsSync(resolvedCachePath)) {
    // eslint-disable-next-line no-console
    console.info(
      `[reportId/getStaticProps] reading fight "${reportId}/${fight.id}" from cache`
    );
    const raw = readFileSync(resolvedCachePath, {
      encoding: "utf-8",
    });

    return JSON.parse(raw);
  }

  const url = getFightSummaryUrl(reportId, fight);

  try {
    // eslint-disable-next-line no-console
    console.info(
      `[reportId/getStaticProps] fetching fight "${reportId}/${fight.id}" from WCL`
    );

    const response = await fetch(url);

    if (response.ok) {
      const json = await response.json();

      if (!IS_PROD) {
        writeFileSync(resolvedCachePath, JSON.stringify(json));
      }

      return json;
    }
  } catch {
    return null;
  }

  return null;
};
