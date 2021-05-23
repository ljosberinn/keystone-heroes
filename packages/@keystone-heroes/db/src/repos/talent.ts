import { prisma } from "../client";

import type { Talent } from "@keystone-heroes/wcl/src/queries";
import type { Talent as PrismaTalent } from "@prisma/client";

type TalentInsert = Omit<Talent, "type" | "guid"> &
  Pick<PrismaTalent, "classID" | "specID" | "id">;

export const TalentRepo = {
  createMany: async (talents: TalentInsert[]): Promise<void> => {
    const payload = talents.map<PrismaTalent>((talents) => {
      return {
        id: talents.id,
        abilityIcon: talents.abilityIcon,
        name: talents.name,
        classID: talents.classID,
        specID: talents.specID,
      };
    });

    await prisma.talent.createMany({
      data: payload,
      skipDuplicates: true,
    });
  },
};
