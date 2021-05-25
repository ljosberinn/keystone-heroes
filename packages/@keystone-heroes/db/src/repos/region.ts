import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { Region } from "@prisma/client";

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
