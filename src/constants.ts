/** ********************
 * utilities
 *********************/
export const IS_BROWSER = typeof window !== "undefined";
export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_TEST = process.env.NODE_ENV === "test";

/** ********************
 * meta
 *********************/
export const BUILD_TIME = new Date().toString();
export const BUILD_TIMESTAMP = Date.now();

export const WCL_OAUTH_ENDPOINT = "https://www.warcraftlogs.com/oauth/token";
export const WCL_GQL_ENDPOINT = "https://www.warcraftlogs.com/api/v2/client";
export const WCL_CLIENT_ID = (() => {
  if (!process.env.WCL_CLIENT_ID) {
    throw new Error('missing environment variable: "WCL_CLIENT_ID"');
  }

  return process.env.WCL_CLIENT_ID;
})();

export const WCL_CLIENT_SECRET = (() => {
  if (!process.env.WCL_CLIENT_SECRET) {
    throw new Error('missing environment variable: "WCL_CLIENT_SECRET"');
  }

  return process.env.WCL_CLIENT_SECRET;
})();
