import { IS_PROD } from "@keystone-heroes/env/src";
import { PrismaClient } from "@prisma/client";

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
