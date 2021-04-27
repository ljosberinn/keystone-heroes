import type { NextApiResponse } from "next";

export const setCacheControl = <Response extends NextApiResponse>(
  res: Response,
  expiration = 24 * 60 * 60
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
