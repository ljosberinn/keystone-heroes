import type { IncomingMessage } from "http";
import type {
  RequestHandler as NextConnectRequestHandler,
  Middleware as NextConnectMiddleware,
} from "next-connect";
import type { NextApiResponse, NextApiRequest } from "next";

type NextApiRequestWithoutIncomingMessage = {
  [Key in keyof NextApiRequest as Key extends keyof IncomingMessage
    ? never
    : Key]: NextApiRequest[Key];
};

export type Middleware<
  ExtendedApiRequest extends Partial<NextApiRequestWithoutIncomingMessage> = NextApiRequest,
  ReturnType = undefined
> = NextConnectMiddleware<
  Omit<NextApiRequest, keyof ExtendedApiRequest> &
    ExtendedApiRequest & {
      [Symbol.asyncIterator]: IncomingMessage[typeof Symbol.asyncIterator];
    },
  NextApiResponse<ReturnType>
>;

export type RequestHandler<
  ExtendedApiRequest extends Partial<NextApiRequestWithoutIncomingMessage> = Record<
    string,
    unknown
  >,
  ReturnType = undefined
> = NextConnectRequestHandler<
  // allows overwriting e.g. query and body
  Omit<NextApiRequest, keyof ExtendedApiRequest> &
    ExtendedApiRequest & {
      [Symbol.asyncIterator]: IncomingMessage[typeof Symbol.asyncIterator];
    },
  NextApiResponse<ReturnType>
>;
