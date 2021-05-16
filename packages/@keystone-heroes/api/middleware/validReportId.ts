import { isValidReportId } from "@keystone-heroes/wcl/utils";

import { BAD_REQUEST } from "../utils/statusCodes";
import { Middleware } from "../utils/types";

export const createValidReportIdMiddleware =
  (key: string): Middleware =>
  (req, res, next) => {
    if (!isValidReportId(req.query[key])) {
      res.status(BAD_REQUEST).end();
      return;
    }

    next();
  };
