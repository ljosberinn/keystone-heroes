import { classes } from "./classes";

export const remarkableSpellIDs = new Set(
  classes.reduce<number[]>((acc, data) => {
    const allSharedCooldownIds = data.cooldowns.map((cooldown) => cooldown.id);
    const allSpecCooldownIds = data.specs.flatMap((spec) =>
      spec.cooldowns.map((cooldown) => cooldown.id)
    );
    const allCovenantIds = data.covenantAbilities.map((ability) => ability.id);

    return [
      ...acc,
      ...allSharedCooldownIds,
      ...allSpecCooldownIds,
      ...allCovenantIds,
    ];
  }, [])
);
