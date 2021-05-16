import { prisma } from "../client";

import type { Talent } from "@keystone-heroes/wcl/queries";

export const TalentRepo = {
  createMany: async (
    talents: (Omit<Talent, "type" | "guid"> & {
      id: Talent["guid"];
      classId: number;
      specId: number;
    })[]
  ): Promise<void> => {
    // eslint-disable-next-line no-console
    console.info(`[TalentRepo/createMany] creating ${talents.length} talents`);

    await prisma.talent.createMany({
      data: talents.map((talents) => {
        return {
          id: talents.id,
          abilityIcon: talents.abilityIcon,
          name: talents.name,
          classId: talents.classId,
          specId: talents.specId,
        };
      }),
      skipDuplicates: true,
    });
  },
};
