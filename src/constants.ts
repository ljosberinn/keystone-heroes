/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
export const WCL_CLIENT_ID = process.env.WCL_CLIENT_ID!;
export const WCL_CLIENT_SECRET = process.env.WCL_CLIENT_SECRET!;

export const WCL_ASSETS_STATIC_URL =
  "//assets.rpglogs.com/img/warcraft/abilities/";
