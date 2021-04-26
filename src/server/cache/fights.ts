import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import { IS_PROD } from "../../constants";
import type { Table } from "../queries/fights";
import type { Fight } from "../queries/report";

export const cacheFightLocally = (reportId: string, fight: Fight): void => {
  if (!IS_PROD) {
    const resolvedCachePath = resolve(
      `cache/${reportId}-fight-${fight.id}.json`
    );

    writeFileSync(resolvedCachePath, JSON.stringify(fight));
  }
};

export const readLocalFightTable = (
  reportId: string,
  fightId: number
): Table | null => {
  const resolvedCachePath = resolve(`cache/${reportId}-fight-${fightId}.json`);

  if (!IS_PROD && existsSync(resolvedCachePath)) {
    // eslint-disable-next-line no-console
    console.info(
      `[reportId/getStaticProps] reading fight "${fightId}" of report "${reportId}" from cache`
    );

    const raw = readFileSync(resolvedCachePath, {
      encoding: "utf-8",
    });

    return JSON.parse(raw).reportData.report.table.data;
  }

  return null;
};
