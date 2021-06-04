import type { SoulbindTalent } from "@keystone-heroes/wcl/src/queries";

import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

type CreateTrait = Omit<SoulbindTalent, "guid"> & {
  id: SoulbindTalent["guid"];
  covenantID: number;
};

const createMany = async (traits: CreateTrait[]) => {
  await prisma.covenantTrait.createMany({
    data: traits.map((trait) => {
      return {
        id: trait.id,
        icon: trait.abilityIcon,
        name: trait.name,
        covenantID: trait.covenantID,
      };
    }),
    skipDuplicates: true,
  });
};

export const CovenantTraitRepo = {
  createMany: withPerformanceLogging(
    createMany,
    "CovenantTraitRepo/createMany"
  ),
};
