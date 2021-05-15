import { prisma } from "../prismaClient";

import type { FooFight } from "../../pages/api/fight";

export const ConduitRepo = {
  createMany: async (
    conduits: FooFight["composition"][number]["conduits"]
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
