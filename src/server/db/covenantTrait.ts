import { prisma } from "../prismaClient";

import type { FooFight } from "../../pages/api/fight";

export const CovenantTraitRepo = {
  createMany: async (
    traits: FooFight["composition"][number]["covenantTraits"]
  ): Promise<void> => {
    // eslint-disable-next-line no-console
    console.info(
      `[CovenantTraitRepo/createMany] creating ${traits.length} covenantTraits`
    );

    await prisma.covenantTrait.createMany({
      data: traits.map((trait) => {
        return {
          id: trait.id,
          abilityIcon: trait.abilityIcon,
          name: trait.name,
          covenantId: trait.covenantId,
        };
      }),
      skipDuplicates: true,
    });
  },
};
