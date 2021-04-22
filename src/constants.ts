/** ********************
 * utilities
 *********************/
export const IS_BROWSER = typeof window !== "undefined";
export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_TEST = process.env.NODE_ENV === "test";

export const WARCRAFTLOGS_API_KEY = (() => {
  if (!process.env.WARCRAFTLOGS_API_KEY) {
    throw new Error('missing environment variable: "WARCRAFTLOGS_API_KEY"');
  }

  return process.env.WARCRAFTLOGS_API_KEY;
})();

/** ********************
 * meta
 *********************/
export const BUILD_TIME = new Date().toString();
export const BUILD_TIMESTAMP = Date.now();
