import { mockDeep } from "jest-mock-extended";
import type { NextApiRequest, NextApiResponse } from "next";
import { apiResolver } from "next/dist/next-server/server/api-utils";

import type {
  NextApiRequestWithoutIncomingMessage,
  RequestHandler,
} from "../src/utils/types";

type LambdaTestParameters<
  Request extends Partial<NextApiRequestWithoutIncomingMessage>,
  Response
> = {
  handler: RequestHandler<Request, Response>;
  query?: Record<string, string>;
};

type LambdaResponse<Response> = {
  res: NextApiResponse<Response>;
  json?: Response;
};

export async function testLambda<
  Request extends Partial<NextApiRequestWithoutIncomingMessage>,
  Response
>({
  handler,
  query = {},
}: LambdaTestParameters<Request, Response>): Promise<LambdaResponse<Response>> {
  return new Promise((resolve, reject) => {
    const req = mockDeep<NextApiRequest>({
      url: "/",
      method: "get",
      body: {},
      headers: {},
    });

    const resolveWithRes = (json: Response) => {
      resolve({ json, res });
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
