import nc from "next-connect";

import { cacheControlKey } from "../utils/cache";
import type { RequestHandler } from "../utils/types";

const handler: RequestHandler = (_, res) => {
  res.setHeader(cacheControlKey, "max-age=20").end();
};

export const healthCheck = nc().get(handler);
