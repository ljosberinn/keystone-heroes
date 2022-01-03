import type { NextApiResponse } from "next";

export const sendJSON = <Data>(
  res: NextApiResponse<Data>,
  data: Data
): void => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(
    // @ts-expect-error since we don't use `.json` and manually setting the header, this is fine
    JSON.stringify(data, (_, value) => {
      if (typeof value === "bigint") {
        // casting BigInt to number is fine since db timestamps are still way
        // below Number.MAX_SAFE_INTEGER threshold
        return Number(value);
      }

      return value;
    })
  );
};
