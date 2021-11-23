import { MIN_KEYSTONE_LEVEL } from "../../web/env";

export const reportHandlerError = {
  NO_TIMED_KEYS: `This report does not appear to contain any timed keys above or matching the key level requirement (${MIN_KEYSTONE_LEVEL}).`,
  BROKEN_LOG_OR_WCL_UNAVAILABLE:
    "This report is either broken or the request to Warcraftlogs failed. Please try again at a later time.",
  SECONDARY_REQUEST_FAILED:
    "Warcraftlogs could not be reached or the API request limit has been reached. Please try again at a later time.",
  EMPTY_LOG: "This report does not contain any fights.",
} as const;

export const fightHandlerError = {
  UNKNOWN_REPORT: "Unknown report.",
  BROKEN_LOG_OR_WCL_UNAVAILABLE:
    reportHandlerError.BROKEN_LOG_OR_WCL_UNAVAILABLE,
  MISSING_DUNGEON:
    "This fight appears to be broken and could not successfully be linked to a specific dungeon.",
  BROKEN_FIGHT: "This fight could not be matched to any dungeon.",
  FATAL_ERROR: "Something went wrong.",
} as const;

export type FightHandlerErrorType = keyof typeof fightHandlerError;
export type ReportHandlerErrorType = keyof typeof reportHandlerError;
