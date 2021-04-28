import type { Prisma } from "@prisma/client";

import { prisma } from "../prismaClient";

export type UpsertableCharacter = Prisma.CharacterCreateManyInput;

export const CharacterRepo = {
  createMany: async (characters: UpsertableCharacter[]): Promise<void> => {
    await prisma.character.createMany({
      data: characters,
      skipDuplicates: true,
    });
  },
};
