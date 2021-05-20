import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { Conduit } from "@keystone-heroes/wcl/src/queries";

type CreateConduit = Omit<Conduit, "total" | "guid"> & {
  id: Conduit["guid"];
  itemLevel: Conduit["total"];
};

export const ConduitRepo = {
  createMany: withPerformanceLogging(
    async (conduits: CreateConduit[]): Promise<void> => {
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
    "ConduitRepo/createMany"
  ),
};
