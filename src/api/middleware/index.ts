import {
  init,
  configureScope,
  captureException,
  // startTransaction,
} from "@sentry/node";
// import type { Transaction } from "@sentry/types";

import { isValidReportId } from "../../wcl/utils";
import { BAD_REQUEST } from "../utils/statusCodes";
import type {
  Middleware,
  NextApiRequestWithoutIncomingMessage,
  RequestHandler,
} from "../utils/types";

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

export const withSentry = <
  Req extends Partial<NextApiRequestWithoutIncomingMessage> = Record<
    string,
    unknown
  >,
  Res = undefined
>(
  handler: RequestHandler<Req, Res>
): Middleware<Req, Res> => {
  init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });

  configureScope((scope) => {
    scope.setTag("runtime", "node");

    if (process.env.VERCEL) {
      scope.setTag("vercel", true);
    }

    scope.addEventProcessor((event) =>
      event.type === "transaction" && event.transaction === "/404"
        ? null
        : event
    );
  });

  const middleware: Middleware<Req, Res> = (req, res, next) => {
    try {
      console.log("before handler");
      return handler(req, res, next);
    } catch (error) {
      console.log("in catch");
      console.error(error);
      if (error instanceof Error) {
        captureException(error);
      }

      console.log("after captureEx report");

      throw error;
    }
  };

  return middleware;
};

// export const createTransaction = (
//   name: string,
//   metadata?: Record<string, unknown>
// ): Transaction => {
//   const transaction = startTransaction({
//     op: "transaction",
//     name,
//     data: metadata,
//   });

//   configureScope((scope) => {
//     scope.setSpan(transaction);
//   });

//   return transaction;
// };
