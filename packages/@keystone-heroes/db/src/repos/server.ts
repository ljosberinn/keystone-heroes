import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { Region } from "@prisma/client";

export const ServerRepo = {
  createMany: withPerformanceLogging(
    async (
      region: Region,
      server: string[]
    ): Promise<Record<string, number>> => {
      // eslint-disable-next-line no-console
      console.info(
        `[ServerRepo/createMany] creating ${server.length} servers in ${region.slug}`
      );

      await prisma.server.createMany({
        data: server.map((name) => ({ name, regionId: region.id })),
        skipDuplicates: true,
      });

      const datasets = await prisma.server.findMany({
        where: {
          regionId: region.id,
          AND: {
            name: {
              in: server,
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return Object.fromEntries(
        datasets.map((dataset) => [dataset.name, dataset.id])
      );
    },
    "ServerRepo/createMany"
  ),
};
