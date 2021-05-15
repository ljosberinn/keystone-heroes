import { prisma } from "../prismaClient";

import type { FooFight } from "../../pages/api/fight";

export const TalentRepo = {
  createMany: async (
    talents: FooFight["composition"][number]["talents"]
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
