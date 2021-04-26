import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import { IS_PROD } from "../../constants";
import type { Report } from "../queries/report";

export const cacheReportLocally = (reportId: string, data: unknown): void => {
  if (!IS_PROD) {
    const resolvedCachePath = resolve(`cache/${reportId}-report.json`);

    writeFileSync(resolvedCachePath, JSON.stringify(data));
  }
};

export const readLocalReportCache = (reportId: string): Report | null => {
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

  return null;
};
