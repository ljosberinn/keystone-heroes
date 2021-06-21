import { PrismaClient } from "@prisma/client";

// add prisma to the NodeJS global type
type CustomNodeJsGlobal = {
  prisma: PrismaClient;
} & NodeJS.Global;

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
