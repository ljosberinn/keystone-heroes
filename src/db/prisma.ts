import { PrismaClient } from "@prisma/client";

import { IS_PRODUCTION } from "../web/env";

// add prisma to the NodeJS global type
type CustomNodeJsGlobal = {
  prisma: PrismaClient;
} & typeof globalThis;

declare const global: CustomNodeJsGlobal;

if (typeof window !== "undefined") {
  throw new TypeError("import error - do not bundle prisma to the client");
}

// Prevent multiple instances of Prisma Client in development
export const prisma = global.prisma || new PrismaClient();

if (!IS_PRODUCTION) {
  global.prisma = prisma;
}
