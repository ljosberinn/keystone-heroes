import { prisma } from "../client";

import type { SoulbindTalent } from "@keystone-heroes/wcl/queries";

export const CovenantTraitRepo = {
  createMany: async (
    traits: (Omit<SoulbindTalent, "guid"> & {
      id: SoulbindTalent["guid"];
      covenantId: number;
    })[]
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
