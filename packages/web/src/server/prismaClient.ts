import { PrismaClient } from "@prisma/client";

import { IS_PROD } from "../constants";

// add prisma to the NodeJS global type
type CustomNodeJsGlobal = {
  prisma: PrismaClient;
} & NodeJS.Global;

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

export const prisma = global.prisma || new PrismaClient();

if (!IS_PROD) {
  global.prisma = prisma;
}
