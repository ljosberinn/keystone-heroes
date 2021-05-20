import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { SoulbindTalent } from "@keystone-heroes/wcl/src/queries";

type CreateTrait = Omit<SoulbindTalent, "guid"> & {
  id: SoulbindTalent["guid"];
  covenantId: number;
};

export const CovenantTraitRepo = {
  createMany: withPerformanceLogging(async (traits: CreateTrait[]) => {
    // eslint-disable-next-line no-console
    console.info(`creating ${traits.length} covenantTraits`);

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
  }, "CovenantTraitRepo/createMany"),
};
