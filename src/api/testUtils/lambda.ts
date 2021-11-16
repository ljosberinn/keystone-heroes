import { mockDeep } from "jest-mock-extended";
import type { NextApiRequest, NextApiResponse } from "next";
import { apiResolver } from "next/dist/server/api-utils";

import type {
  NextApiRequestWithoutIncomingMessage,
  RequestHandler,
} from "../utils/types";

type LambdaTestParameters = {
  query?: Record<string, string>;
  method?: "get" | "post" | "patch" | "delete";
};

type LambdaResponse<Response> = {
  res: NextApiResponse<Response>;
  json?: Response;
};

export async function testLambda<
  Request extends Partial<NextApiRequestWithoutIncomingMessage>,
  Response
>(
  handler: RequestHandler<Request, Response>,
  { query = {}, method = "get" }: LambdaTestParameters
): Promise<LambdaResponse<Response>> {
  return new Promise((resolve, reject) => {
    const req = mockDeep<NextApiRequest>({
      url: "/",
      method,
      body: {},
      headers: {},
    });

    const resolveWithRes = (json?: Response) => {
      resolve({
        json: typeof json === "string" ? JSON.parse(json) : json,
        res,
      });
    };

    const res: NextApiResponse = mockDeep<NextApiResponse>({
      status: (code: number) => {
        res.statusCode = code;

        return res;
      },
      json: resolveWithRes,
      end: (json) => {
        resolveWithRes(json);
      },
      statusCode: 200,
      once: jest.fn(),
      setHeader: jest.fn(),
      getHeader: jest.fn(),
    });

    apiResolver(
      req,
      res,
      query,
      handler,
      {
        previewModeEncryptionKey: "",
        previewModeId: "",
        previewModeSigningKey: "",
      },
      true
      // eslint-disable-next-line promise/prefer-await-to-then
    ).catch(reject);
  });
}
