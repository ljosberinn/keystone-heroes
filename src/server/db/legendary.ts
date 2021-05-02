import type { FooFight } from "../../pages/api/fight";
import { prisma } from "../prismaClient";

export const LegendaryRepo = {
  createMany: async (
    items: NonNullable<FooFight["composition"][number]["legendary"]>[]
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
