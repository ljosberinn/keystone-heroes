import type { IncomingMessage } from "http";
import type { NextApiResponse, NextApiRequest } from "next";
import type {
  RequestHandler as NextConnectRequestHandler,
  Middleware as NextConnectMiddleware,
} from "next-connect";

export type Middleware<
  ExtendedApiRequest extends Partial<NextApiRequest> = NextApiRequest,
  ReturnType = undefined
> = NextConnectMiddleware<
  Omit<NextApiRequest, keyof ExtendedApiRequest> &
    ExtendedApiRequest & {
      [Symbol.asyncIterator]: IncomingMessage[typeof Symbol.asyncIterator];
    },
  NextApiResponse<ReturnType>
>;

export type RequestHandler<
  ExtendedApiRequest extends Partial<NextApiRequest> = Record<string, unknown>,
  ReturnType = undefined
> = NextConnectRequestHandler<
  // allows overwriting e.g. query and body
  Omit<NextApiRequest, keyof ExtendedApiRequest> &
    ExtendedApiRequest & {
      [Symbol.asyncIterator]: IncomingMessage[typeof Symbol.asyncIterator];
    },
  NextApiResponse<ReturnType>
>;
