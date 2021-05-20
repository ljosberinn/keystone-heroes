import { prisma } from "../client";

import type { LegendaryItem } from "@keystone-heroes/wcl/src/queries";

export const LegendaryRepo = {
  createMany: async (
    items: (Pick<LegendaryItem, "id" | "effectIcon" | "effectName"> & {
      effectId: number;
    })[]
  ): Promise<void> => {
    // eslint-disable-next-line no-console
    console.info(
      `[LegendaryRepo/createMany] creating ${items.length} legendaries`
    );

    await prisma.legendary.createMany({
      data: items.map((item) => {
        return {
          id: item.effectId,
          itemId: item.id,
          effectName: item.effectName,
          effectIcon: item.effectIcon,
        };
      }),
      skipDuplicates: true,
    });
  },
};
