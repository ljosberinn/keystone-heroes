import { isValidReportId } from "@keystone-heroes/wcl/utils";

export const fightTimeToString = (time: number, omitMs = false): string => {
  const inSeconds = time / 1000;
  const minutes = Math.floor(inSeconds / 60);
  const seconds = Math.floor(inSeconds - minutes * 60);

  if (omitMs) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const ms = time - minutes * 60 * 1000 - seconds * 1000;

  return `${minutes}:${seconds.toString().padStart(2, "0")}.${ms
    .toString()
    .padStart(3, "0")}`;
};

type WCLUrlParams = {
  reportID: string;
  fightID: string;
  type?: "deaths";
  start?: number;
  end?: number;
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
  const isReportID = isValidReportId(maybeURL);

  if (isReportID) {
    return {
      reportID: maybeURL,
      fightID: null,
    };
  }
  try {
    const { pathname, host, hash } = new URL(maybeURL);

    if (host === "www.warcraftlogs.com" && pathname.startsWith("/reports/")) {
      const maybeReportID = pathname.replace("/reports/", "").replace("/", "");

      if (!isValidReportId(maybeReportID)) {
        return {
          reportID: null,
          fightID: null,
        };
      }

      if (hash) {
        const maybeFightID = new URLSearchParams(hash.slice(1)).get("fight");

        if (
          maybeFightID &&
          (maybeFightID === "last" || Number.parseInt(maybeFightID) > 0)
        ) {
          return {
            reportID: maybeReportID,
            fightID: maybeFightID,
          };
        }
      }

      return {
        reportID: maybeReportID,
        fightID: null,
      };
    }

    return {
      reportID: null,
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
