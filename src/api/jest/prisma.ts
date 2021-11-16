import type { PrismaClient } from "@prisma/client";
import type { MockProxy } from "jest-mock-extended";

import { prisma as _prisma } from "../../db/prisma";

export const prisma = _prisma as MockProxy<PrismaClient>;
