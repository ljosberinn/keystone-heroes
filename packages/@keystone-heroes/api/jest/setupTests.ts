import type { PrismaClient } from "@keystone-heroes/db/types";
import { mockDeep } from "jest-mock-extended";
import fetch, { Headers } from "node-fetch";

// @ts-expect-error known
global.fetch = fetch;
// @ts-expect-error known
global.Headers = Headers;

jest.mock("@keystone-heroes/db/prisma", () => {
  return {
    __esModule: true,
    prisma: mockDeep<PrismaClient>(),
  };
});
