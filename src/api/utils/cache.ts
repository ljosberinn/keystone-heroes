export const cacheControlKey = "Cache-Control";

export const PUBLIC_ONE_YEAR_IMMUTABLE = "public, max-age=31536000, immutable";
export const PUBLIC_TWO_MINUTES = "public, max-age=120";
export const PUBLIC_FIVE_MINUTES = "public, max-age=300";
export const PUBLIC_THIRTY_MINUTES = "public, max-age=1800";

export const STALE_WHILE_REVALIDATE_ONE_MINUTE =
  "max-age=31536000, stale-while-revalidate=60";
