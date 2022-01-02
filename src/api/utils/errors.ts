import { MIN_KEYSTONE_LEVEL } from "../../web/env";

export const reportHandlerError = {
  NO_ELIGIBLE_KEYS: `This report does not appear to contain any keys matching the minimum key level requirement (${MIN_KEYSTONE_LEVEL}), does not contain any finished key (timed or untimed) or includes unsupported dungeons/affixes.`,
  BROKEN_LOG_OR_WCL_UNAVAILABLE:
    "This report is either broken or the request to Warcraftlogs failed. Please try again at a later time.",
  SECONDARY_REQUEST_FAILED:
    "Warcraftlogs could not be reached or the API request limit has been reached. Please try again at a later time.",
  EMPTY_LOG: "This report does not contain any fights.",
  PRIVATE_REPORT:
    "This report is private and cannot be retrieved via API. Please set it to public or ask the owner to do so.",
} as const;

export const fightHandlerError = {
  UNKNOWN_REPORT: "Unknown report. Consider importing it before, maybe?",
  BROKEN_LOG_OR_WCL_UNAVAILABLE:
    reportHandlerError.BROKEN_LOG_OR_WCL_UNAVAILABLE,
  MISSING_DUNGEON:
    "This fight appears to be broken and could not successfully be linked to a specific dungeon.",
  FATAL_ERROR: "Something went wrong.",
} as const;

export type FightHandlerErrorType = keyof typeof fightHandlerError;
export type ReportHandlerErrorType = keyof typeof reportHandlerError;
