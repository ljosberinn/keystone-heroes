import type { Player } from "../../pages/api/report";
import { prisma } from "../prismaClient";

export const CharacterRepo = {
  upsertMany: async (characters: Player[]): Promise<void> => {
    await Promise.all(
      characters.map((character) =>
        prisma.character.upsert({
          create: {
            id: character.guid,
            name: character.name,
            server: character.server,
            // cannot connect in createMany
            class: {
              connect: {
                name: character.className,
              },
            },
          },
          update: {},
          where: {
            id: character.guid,
          },
        })
      )
    );
  },
};
