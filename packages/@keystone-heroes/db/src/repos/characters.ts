import type { Character } from "@prisma/client";

import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

const createMany = async <
  T extends { server: string; classID: number; name: string }
>(
  characters: T[],
  serverMap: Record<string, number>
): Promise<Character[]> => {
  const payload = characters.map<Omit<Character, "id">>((character) => {
    const serverID = serverMap[character.server];

    return {
      name: character.name,
      serverID,
      classID: character.classID,
    };
  });

  await prisma.character.createMany({
    data: payload,
    skipDuplicates: true,
  });

  return await prisma.character.findMany({
    where: {
      OR: characters.map((character) => ({
        name: character.name,
        serverID: serverMap[character.server],
      })),
    },
  });
};

export const CharacterRepo = {
  createMany: withPerformanceLogging(createMany, "CharacterRepo/createMany"),
};
