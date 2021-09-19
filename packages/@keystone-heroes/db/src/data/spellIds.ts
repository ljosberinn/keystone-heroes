import { classes } from "./classes";

export const spells = Object.fromEntries(
  classes.flatMap((data) => {
    return [
      ...data.cooldowns,
      ...data.specs.flatMap((spec) => spec.cooldowns),
      ...data.covenantAbilities,
    ].map((cd) => [
      cd.id,
      {
        icon: cd.icon,
        name: cd.name,
        cd: cd.cd,
      },
    ]);
  })
);

export const remarkableSpellIDs = new Set(
  Object.keys(spells).map((id) => Number.parseInt(id))
);
