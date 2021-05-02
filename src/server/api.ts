import type { NextApiResponse } from "next";

export enum CacheControl {
  ONE_HOUR = 3600,
  ONE_DAY = 86_400,
  ONE_WEEK = 604_800,
  ONE_MONTH = 2_419_200,
}

export const setCacheControl = <Response extends NextApiResponse>(
  res: Response,
  expiration = CacheControl.ONE_DAY
): void => {
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${expiration}, stale-while-revalidate=${Math.round(
      expiration / 2
    )}`
  );
};

export const isValidReportId = (id?: string | string[]): id is string =>
  id?.length === 16 && !id.includes(".");

/**
 * assume a report may still be ongoing if its less than one day old
 */
export const maybeOngoingReport = (endTime: number): boolean =>
  24 * 60 * 60 * 1000 > Date.now() - endTime;
