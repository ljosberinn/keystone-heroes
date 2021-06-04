import type { LegendaryItem } from "@keystone-heroes/wcl/src/queries";
import type { Legendary } from "@prisma/client";

import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

const createMany = async (
  data: (Pick<LegendaryItem, "id" | "effectIcon" | "effectName"> & {
    effectID: number;
  })[]
): Promise<void> => {
  const payload = data.map<Legendary>((item) => {
    return {
      id: item.effectID,
      itemID: item.id,
      effectName: item.effectName,
      effectIcon: item.effectIcon,
    };
  });

  await prisma.legendary.createMany({
    data: payload,
    skipDuplicates: true,
  });
};

export const LegendaryRepo = {
  createMany: withPerformanceLogging(createMany, "LegendaryRepo/createMany"),
};
