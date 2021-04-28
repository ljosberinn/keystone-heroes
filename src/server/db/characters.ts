import type { Player } from "../../pages/api/report";
import { prisma } from "../prismaClient";

export const CharacterRepo = {
  createMany: async (characters: Player[]): Promise<void> => {
    await Promise.all(
      characters.map((character) =>
        prisma.character.create({
          data: {
            id: character.id,
            name: character.name,
            server: character.server,
            // cannot connect in createMany
            class: {
              connect: {
                name: character.className,
              },
            },
          },
        })
      )
    );
  },
};
