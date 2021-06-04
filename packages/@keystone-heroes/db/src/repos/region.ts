import type { Region } from "@prisma/client";

import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

const upsert = (slug: string): Promise<Region> => {
  return prisma.region.upsert({
    create: {
      slug,
    },
    update: {},
    where: {
      slug,
    },
  });
};

export const RegionRepo = {
  upsert: withPerformanceLogging(upsert, "RegionRepo/upsert"),
};
