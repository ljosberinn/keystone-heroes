import type { Talent } from "@keystone-heroes/wcl/src/queries";
import type { Talent as PrismaTalent } from "@prisma/client";

import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

type TalentInsert = Omit<Talent, "type" | "guid"> &
  Pick<PrismaTalent, "classID" | "specID" | "id">;

const createMany = async (talents: TalentInsert[]): Promise<void> => {
  const payload = talents.map<PrismaTalent>((talents) => {
    return {
      id: talents.id,
      icon: talents.abilityIcon,
      name: talents.name,
      classID: talents.classID,
      specID: talents.specID,
    };
  });

  await prisma.talent.createMany({
    data: payload,
    skipDuplicates: true,
  });
};

export const TalentRepo = {
  createMany: withPerformanceLogging(createMany, "TalentRepo/createMany"),
};
