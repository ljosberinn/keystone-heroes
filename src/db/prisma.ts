import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";

// add prisma to the NodeJS global type
type CustomNodeJsGlobal = {
  prisma: PrismaClient;
} & typeof globalThis;

declare const global: CustomNodeJsGlobal;

// Prevent multiple instances of Prisma Client in development
// type casted to allow importing this file in the browser while also not
// bundling prisma at all through treeshaking
export const prisma =
  typeof window === "undefined" && process.env.NODE_ENV !== "test"
    ? global.prisma || new PrismaClient()
    : (null as unknown as PrismaClient<
        Prisma.PrismaClientOptions,
        never,
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >);

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
