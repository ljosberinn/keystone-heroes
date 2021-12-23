import { format } from "date-fns";

import { isValidReportId } from "../../wcl/utils";

type TimeDurationOptions = {
  omitMs?: boolean;
  toHours?: boolean;
};

export const timeDurationToString = (
  time: number,
  options?: TimeDurationOptions
): string => {
  const { omitMs = false, toHours = false } = options ?? {};

  const pattern =
    omitMs && toHours
      ? "HH:mm:ss"
      : omitMs
      ? "mm:ss"
      : toHours
      ? "HH:mm:ss:SSS"
      : "mm:ss:SSS";

  if (time < 0) {
    return `-${format(time * -1, pattern)}`;
  }

  return format(time, pattern);
};

type WCLUrlParams = {
  reportID: string;
  fightID?: string;
  type?: "deaths" | "damage-done" | "healing" | "damage-taken" | "interrupts";
  start?: number;
  end?: number;
  source?: number;
  ability?: number;
  hostility?: 1;
  view?: "events";
  pins?: string;
};

export const createWCLUrl = ({
  reportID: report,
  fightID: fight,
  ...rest
}: WCLUrlParams): string => {
  const base = `https://www.warcraftlogs.com/reports/${report}`;

  if (!fight) {
    return base;
  }

  // @ts-expect-error fixing later
  const params = new URLSearchParams({
    ...rest,
    translate: "true",
  }).toString();

  const url = `${base}${fight ? `#fight=${fight}` : ""}`;

  return `${url}&${params}`;
};

type WowheadParams = {
  category: "spell" | "npc" | "affix";
  id: string | number;
};

export const createWowheadUrl = ({ category, id }: WowheadParams): string => {
  return `https://wowhead.com/${category}=${id}`;
};

export enum ReportParseError {
  INVALID_HOST = "INVALID_HOST",
  INVALID_REPORT_ID = "INVALID_REPORT_ID",
  INVALID_URL = "INVALID_URL",
}

export const reportParseErrorMap: Record<ReportParseError, string> = {
  INVALID_HOST: "This doesn't seem to be a WarcraftLogs link.",
  INVALID_REPORT_ID: "The report ID seems to be malformed.",
  INVALID_URL: "This doesn't seem to be a valid URL.",
};

export const reportParseErrorIconMap: Record<ReportParseError, string> = {
  INVALID_HOST: "/static/bear/cry-48.png",
  INVALID_REPORT_ID: "/static/bear/concern-48.png",
  INVALID_URL: "/static/bear/bonk-48.png",
};

export const parseWCLUrl = (
  maybeURL: string
): {
  reportID: null | string;
  fightID: null | string;
  error: null | ReportParseError;
} => {
  if (isValidReportId(maybeURL)) {
    return {
      reportID: maybeURL,
      fightID: null,
      error: null,
    };
  }

  try {
    const { pathname, host, hash } = new URL(maybeURL);

    // not a WCL url
    if (host !== "www.warcraftlogs.com" || !pathname.startsWith("/reports/")) {
      return {
        reportID: null,
        fightID: null,
        error: ReportParseError.INVALID_HOST,
      };
    }

    const maybeReportID = pathname.replace("/reports/", "").replace("/", "");

    // WCL url, but doesnt point to reports
    if (!isValidReportId(maybeReportID)) {
      return {
        reportID: null,
        fightID: null,
        error: ReportParseError.INVALID_REPORT_ID,
      };
    }

    // WCL url, points to reports, but no fight selected
    if (!hash) {
      return {
        reportID: maybeReportID,
        fightID: null,
        error: null,
      };
    }

    const maybeFightID = new URLSearchParams(hash.slice(1)).get("fight");

    // no fightID at all
    if (!maybeFightID) {
      return {
        reportID: maybeReportID,
        fightID: null,
        error: null,
      };
    }

    // fightID may be `last` or numeric
    if (maybeFightID === "last" || Number.parseInt(maybeFightID) > 0) {
      return {
        reportID: maybeReportID,
        fightID: maybeFightID,
        error: null,
      };
    }

    return {
      reportID: maybeReportID,
      fightID: null,
      error: null,
    };
  } catch {
    return {
      reportID: null,
      fightID: null,
      error: ReportParseError.INVALID_URL,
    };
  }
};

export const classTextColorMap: Record<string, string> = {
  demonhunter: "text-demonhunter",
  warlock: "text-warlock",
  rogue: "text-rogue",
  warrior: "text-warrior",
  priest: "text-black dark:text-priest",
  hunter: "text-hunter",
  deathknight: "text-deathknight",
  shaman: "text-shaman",
  paladin: "text-paladin",
  monk: "text-monk",
  druid: "text-druid",
  mage: "text-mage",
};

export const classBorderColorMap: Record<string, string> = {
  demonhunter: "border-demonhunter",
  warlock: "border-warlock",
  rogue: "border-rogue",
  warrior: "border-warrior",
  priest: "border-priest",
  hunter: "border-hunter",
  deathknight: "border-deathknight",
  shaman: "border-shaman",
  paladin: "border-paladin",
  monk: "border-monk",
  druid: "border-druid",
  mage: "border-mage",
};

export const createInternalUrl = (
  url: string,
  defaultQueryParams?: Record<string, string | number>
): string => {
  const urld = new URL(url.includes("http") ? url : `http://${url}`);

  if (defaultQueryParams) {
    Object.entries(defaultQueryParams).forEach(([key, value]) => {
      urld.searchParams.append(key, `${value}`);
    });
  }

  return urld.toString().replace("http://", "");
};
