import type { Character, PlayableClass, Region } from "@prisma/client";

import { classMapByName } from "../../../prisma/classes";
import { prisma } from "../prismaClient";

export const CharacterRepo = {
  createMany: async <
    T extends { server: string; className: PlayableClass; name: string }
  >(
    characters: T[],
    region: Region,
    serverMap: Record<string, number>
  ): Promise<Character[]> => {
    // eslint-disable-next-line no-console
    console.info(
      `[CharacterRepo/createMany] creating ${characters.length} characters in ${region.slug}`
    );

    await prisma.character.createMany({
      data: characters.map((character) => {
        const serverId = serverMap[character.server];
        const classId = classMapByName[character.className];

        return {
          name: character.name,
          serverId,
          classId,
        };
      }),
      skipDuplicates: true,
    });

    return await prisma.character.findMany({
      where: {
        OR: characters.map((character) => ({
          name: character.name,
          serverId: serverMap[character.server],
        })),
      },
    });
  },
};
