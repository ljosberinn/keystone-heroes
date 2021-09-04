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
