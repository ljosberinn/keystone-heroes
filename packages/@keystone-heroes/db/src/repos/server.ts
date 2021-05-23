import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { Region, Server } from "@prisma/client";

export const ServerRepo = {
  createMany: withPerformanceLogging(
    async (
      region: Region,
      server: string[]
    ): Promise<Record<string, number>> => {
      const payload = server.map<Omit<Server, "id">>((name) => ({
        name,
        regionID: region.id,
      }));

      await prisma.server.createMany({
        data: payload,
        skipDuplicates: true,
      });

      const datasets = await prisma.server.findMany({
        where: {
          regionID: region.id,
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
