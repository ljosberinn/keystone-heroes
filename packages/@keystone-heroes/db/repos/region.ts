import { prisma } from "../client";

import type { Region } from "@prisma/client";

export const RegionRepo = {
  upsert: (slug: string): Promise<Region> => {
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
  },
};
