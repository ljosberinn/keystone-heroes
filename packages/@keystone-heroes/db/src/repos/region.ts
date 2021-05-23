import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { Region } from "@prisma/client";

export const RegionRepo = {
  upsert: withPerformanceLogging((slug: string): Promise<Region> => {
    return prisma.region.upsert({
      create: {
        slug,
      },
      update: {},
      where: {
        slug,
      },
    });
  }, "RegionRepo/upsert"),
};
