import { prisma } from "../client";

import type { Conduit } from "@keystone-heroes/wcl/queries";

export const ConduitRepo = {
  createMany: async (
    conduits: (Omit<Conduit, "total" | "guid"> & {
      id: Conduit["guid"];
      itemLevel: Conduit["total"];
    })[]
  ): Promise<void> => {
    // eslint-disable-next-line no-console
    console.info(
      `[ConduitRepo/createMany] creating ${conduits.length} conduits`
    );

    await prisma.conduit.createMany({
      data: conduits.map((conduit) => {
        return {
          id: conduit.id,
          abilityIcon: conduit.abilityIcon,
          name: conduit.name,
        };
      }),
      skipDuplicates: true,
    });
  },
};
