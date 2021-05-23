import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { SoulbindTalent } from "@keystone-heroes/wcl/src/queries";

type CreateTrait = Omit<SoulbindTalent, "guid"> & {
  id: SoulbindTalent["guid"];
  covenantID: number;
};

export const CovenantTraitRepo = {
  createMany: withPerformanceLogging(async (traits: CreateTrait[]) => {
    await prisma.covenantTrait.createMany({
      data: traits.map((trait) => {
        return {
          id: trait.id,
          abilityIcon: trait.abilityIcon,
          name: trait.name,
          covenantID: trait.covenantID,
        };
      }),
      skipDuplicates: true,
    });
  }, "CovenantTraitRepo/createMany"),
};
