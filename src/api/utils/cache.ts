export const cacheControlKey = "Cache-Control";

export const STALE_WHILE_REVALIDATE_SEVEN_DAYS =
  "max-age=604800, stale-while-revalidate=86400";
export const STALE_WHILE_REVALIDATE_TWO_MINUTES =
  "max-age=120, stale-while-revalidate=300";
export const STALE_WHILE_REVALIDATE_FIVE_MINUTES =
  "max-age=300, stale-while-revalidate=600";
export const STALE_WHILE_REVALIDATE_THIRTY_MINUTES =
  "max-age=1800, stale-while-revalidate=3600";
export const STALE_WHILE_REVALIDATE_TWO_HOURS =
  "max-age=7200, stale-while-revalidate=14400";

export const NO_CACHE = "no-cache";

if (!("toJSON" in BigInt.prototype)) {
  // @ts-expect-error required to parse BigInts to numbers
  // eslint-disable-next-line no-extend-native
  BigInt.prototype.toJSON = function toJSON() {
    return Number(this);
  };
}
