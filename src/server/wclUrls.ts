import { WARCRAFTLOGS_API_KEY } from "../constants";

const baseUrl = "https://www.warcraftlogs.com/v1";

export const getFightsUrl = (code: string): string => {
  const requestUri = `${baseUrl}/report/fights/${code}`;

  const searchParams = new URLSearchParams({
    translate: "true",
    api_key: WARCRAFTLOGS_API_KEY,
  }).toString();

  return `${requestUri}?${searchParams}`;
};
