import { isValidReportId } from "@keystone-heroes/wcl/src/utils";

import { BAD_REQUEST } from "../utils/statusCodes";
import type { Middleware } from "../utils/types";

export const createValidReportIDMiddleware =
  (key: string): Middleware =>
  (req, res, next) => {
    if (!isValidReportId(req.query[key])) {
      res.status(BAD_REQUEST).end();
      return;
    }

    next();
  };

export const validFightIDMiddleware: Middleware = (req, res, next) => {
  if (
    !req.query.fightID ||
    Array.isArray(req.query.fightID) ||
    !/^[0-9]*$/giu.test(req.query.fightID)
  ) {
    res.status(BAD_REQUEST).end();
    return;
  }

  next();
};
