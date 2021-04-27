import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import { IS_PROD } from "../../constants";
import type { Report } from "../queries/report";

export const createReportCache = (reportId: string, data: unknown): void => {
  if (IS_PROD) {
    return;
  }

  const resolvedCachePath = resolve(`cache/${reportId}-report.json`);

  if (existsSync(resolvedCachePath)) {
    return;
  }

  // eslint-disable-next-line no-console
  console.info(`[reportId/gSP] writing report "${reportId}" to cache`);

  writeFileSync(resolvedCachePath, JSON.stringify(data));
};

export const readLocalReportCache = (reportId: string): Report | null => {
  if (IS_PROD) {
    return null;
  }

  const resolvedCachePath = resolve(`cache/${reportId}-report.json`);

  if (!existsSync(resolvedCachePath)) {
    return null;
  }

  // eslint-disable-next-line no-console
  console.info(`[reportId/gSP] reading report "${reportId}" from cache`);

  const raw = readFileSync(resolvedCachePath, {
    encoding: "utf-8",
  });

  return JSON.parse(raw);
};
