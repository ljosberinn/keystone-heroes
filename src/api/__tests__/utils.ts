import { mockDeep } from "jest-mock-extended";
import type { NextApiResponse } from "next";

import { sendJSON } from "../utils/api";

test("sets content type to json", () => {
  const mockNextApiResponse = mockDeep<NextApiResponse>({
    setHeader: jest.fn(),
  });

  sendJSON(mockNextApiResponse, []);

  expect(mockNextApiResponse.setHeader).toHaveBeenCalledTimes(1);
  expect(mockNextApiResponse.setHeader).toHaveBeenCalledWith(
    "Content-Type",
    "application/json; charset=utf-8"
  );
});

test('"serializes" bigint to number', () => {
  const mockNextApiResponse = mockDeep<NextApiResponse>({
    send: jest.fn(),
  });

  sendJSON(mockNextApiResponse, [BigInt(10)]);

  expect(mockNextApiResponse.send.mock.calls[0][0]).toMatchInlineSnapshot(
    `"[10]"`
  );
});
