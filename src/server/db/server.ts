import type { Region } from "@prisma/client";

import { prisma } from "../prismaClient";

export const ServerRepo = {
  createMany: async (
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
};
