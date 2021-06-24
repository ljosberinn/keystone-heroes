import { prisma as _prisma } from "@keystone-heroes/db/prisma";
import type { PrismaClient } from "@keystone-heroes/db/types";
import type { MockProxy } from "jest-mock-extended";

export const prisma = _prisma as MockProxy<PrismaClient>;
