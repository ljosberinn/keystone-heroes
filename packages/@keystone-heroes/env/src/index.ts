/* eslint-disable @typescript-eslint/no-non-null-assertion */
/** ********************
 * utilities
 *********************/
export const IS_BROWSER = typeof window !== "undefined";

/** *********************
 * meta
 *********************/
export const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA;
export const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME!;
export const BUILD_TIMESTAMP = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP!;

/** *********************
 * WCL
 *********************/
export const WCL_OAUTH_ENDPOINT = "https://www.warcraftlogs.com/oauth/token";
export const WCL_GQL_ENDPOINT = "https://www.warcraftlogs.com/api/v2/client";
export const WCL_CLIENT_ID = process.env.WCL_CLIENT_ID!;
export const WCL_CLIENT_SECRET = process.env.WCL_CLIENT_SECRET!;

/** *********************
 * general
 *********************/
export const MIN_KEYSTONE_LEVEL = 15;
