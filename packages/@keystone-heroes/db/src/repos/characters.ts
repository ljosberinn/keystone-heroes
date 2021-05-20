import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type { Character, Region } from "@prisma/client";

export const CharacterRepo = {
  createMany: withPerformanceLogging(
    async <T extends { server: string; classId: number; name: string }>(
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

          return {
            name: character.name,
            serverId,
            classId: character.classId,
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
    "CharacterRepo/createMany"
  ),
};
