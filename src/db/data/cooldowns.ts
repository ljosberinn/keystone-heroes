import type { Cooldown } from "@prisma/client";

import { classes } from "./classes";
import { specs } from "./specs";

export const cooldowns = classes
  .flatMap<Omit<Cooldown, "id">>((classData) => {
    const baseCDs = [
      ...classData.cooldowns,
      ...classData.covenantAbilities,
    ].map<Omit<Cooldown, "id">>((cd) => {
      return {
        cd: cd.cd,
        abilityID: cd.id,
        classID: classData.id,
        specID: null,
      };
    });

    const specCDs = classData.specs.flatMap((spec) => {
      const specData = specs.find(
        (s) => s.classID === classData.id && s.name === spec.name
      );

      if (!specData) {
        throw new Error(
          `spec ${spec.name} not found in data of class ${classData.name}`
        );
      }

      return spec.cooldowns.map<Omit<Cooldown, "id">>((cd) => {
        return {
          cd: cd.cd,
          abilityID: cd.id,
          classID: classData.id,
          specID: specData.id,
        };
      });
    });

    return [...baseCDs, ...specCDs];
  })
  .map<Cooldown>((cd, index) => {
    return { ...cd, id: index + 1 };
  });
