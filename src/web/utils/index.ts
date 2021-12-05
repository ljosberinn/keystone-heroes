import { isValidReportId } from "../../wcl/utils";

export const timeDurationToString = (time: number, omitMs = false): string => {
  const isNegative = time < 0;

  const inSeconds = time / 1000;
  const minutes = isNegative
    ? Math.ceil(inSeconds / 60)
    : Math.floor(inSeconds / 60);
  const seconds = isNegative
    ? Math.ceil(inSeconds - minutes * 60) * -1
    : Math.floor(inSeconds - minutes * 60);

  const prefix = inSeconds < 0 ? "-" : "";

  if (omitMs) {
    return `${prefix}${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const ms =
    (time - minutes * 60 * 1000 - seconds * 1000) * (isNegative ? -1 : 1);

  return `${prefix}${minutes}:${seconds.toString().padStart(2, "0")}.${ms
    .toString()
    .slice(0, 3)
    .padStart(3, "0")}`;
};

type WCLUrlParams = {
  reportID: string;
  fightID: string;
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
  // @ts-expect-error fixing later
  const params = new URLSearchParams({
    ...rest,
    translate: "true",
  }).toString();

  const url = `https://www.warcraftlogs.com/reports/${report}#fight=${fight}`;

  return `${url}&${params}`;
};

type WowheadParams = {
  category: "spell" | "npc" | "affix";
  id: string | number;
};

export const createWowheadUrl = ({ category, id }: WowheadParams): string => {
  return `https://wowhead.com/${category}=${id}`;
};

export const parseWCLUrl = (
  maybeURL: string
): { reportID: null | string; fightID: null | string } => {
  if (isValidReportId(maybeURL)) {
    return {
      reportID: maybeURL,
      fightID: null,
    };
  }

  try {
    const { pathname, host, hash } = new URL(maybeURL);

    // not a WCL url
    if (host !== "www.warcraftlogs.com" || !pathname.startsWith("/reports/")) {
      return {
        reportID: null,
        fightID: null,
      };
    }

    const maybeReportID = pathname.replace("/reports/", "").replace("/", "");

    // WCL url, but doesnt point to reports
    if (!isValidReportId(maybeReportID)) {
      return {
        reportID: null,
        fightID: null,
      };
    }

    // WCL url, points to reports, but no fight selected
    if (!hash) {
      return {
        reportID: maybeReportID,
        fightID: null,
      };
    }

    const maybeFightID = new URLSearchParams(hash.slice(1)).get("fight");

    // no fightID at all
    if (!maybeFightID) {
      return {
        reportID: maybeReportID,
        fightID: null,
      };
    }

    // fightID may be `last` or numeric
    if (maybeFightID === "last" || Number.parseInt(maybeFightID) > 0) {
      return {
        reportID: maybeReportID,
        fightID: maybeFightID,
      };
    }

    return {
      reportID: maybeReportID,
      fightID: null,
    };
  } catch {
    return {
      reportID: null,
      fightID: null,
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
