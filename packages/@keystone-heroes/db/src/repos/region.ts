import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { Region } from "@prisma/client";

export const RegionRepo = {
  upsert: withPerformanceLogging((slug: string): Promise<Region> => {
    // eslint-disable-next-line no-console
    console.info(`[RegionRepo/upsert] region ${slug}`);

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
