import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import { IS_PROD } from "../../constants";
import type { Table } from "../queries/table";

export const createTableCache = (
  reportId: string,
  fightId: number,
  table: Table | null
): void => {
  if (IS_PROD || !table) {
    return;
  }

  const resolvedCachePath = resolve(`cache/${reportId}-table-${fightId}.json`);

  if (!existsSync(resolvedCachePath)) {
    // eslint-disable-next-line no-console
    console.info(
      `[reportId/gSP] writing table "${reportId}/${fightId}" to cache`
    );

    writeFileSync(resolvedCachePath, JSON.stringify(table));
  }
};

export const readTableCache = (
  reportId: string,
  fightId: number
): Table | null => {
  if (IS_PROD) {
    return null;
  }

  const resolvedCachePath = resolve(`cache/${reportId}-table-${fightId}.json`);

  if (!existsSync(resolvedCachePath)) {
    return null;
  }

  // eslint-disable-next-line no-console
  console.info(
    `[reportId/gSP] reading table "${reportId}/${fightId}" from cache`
  );

  const raw = readFileSync(resolvedCachePath, {
    encoding: "utf-8",
  });

  return JSON.parse(raw);
};
