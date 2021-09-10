import { affixes as rawAffixes } from "@keystone-heroes/db/data/affixes";
import { classMap } from "@keystone-heroes/db/data/classes";
import { covenantMap } from "@keystone-heroes/db/data/covenants";
import { dungeons as rawDungeons } from "@keystone-heroes/db/data/dungeons";
import { soulbindMap } from "@keystone-heroes/db/data/soulbinds";
import { specs } from "@keystone-heroes/db/data/specs";
import { writeFileSync } from "fs";

const dungeons = Object.fromEntries(
  rawDungeons.map(({ id, name, timer, slug, zones }) => {
    return [
      id,
      {
        name,
        timer,
        slug,
        zones: zones
          .sort((a, b) => a.order - b.order)
          .map((zone) => {
            return {
              id: zone.id,
              name: zone.name,
            };
          }),
      },
    ];
  })
);

const affixes = Object.fromEntries(
  Object.entries(rawAffixes).map(([key, { name, icon }]) => {
    return [key, { name, icon }];
  })
);

const soulbinds = soulbindMap;
const classes = Object.fromEntries(
  Object.entries(classMap).map(([key, value]) => {
    const cooldowns = value.cooldowns.map((cd) => cd.id);
    const covenantAbilities = value.covenantAbilities.map((cd) => cd.id);

    return [
      key,
      {
        ...value,
        cooldowns,
        covenantAbilities,
        specs: value.specs.map((spec) => {
          const match = specs.find(
            (s) => `${s.classID}` === key && s.name === spec.name
          );
          if (!match) {
            throw new Error(
              `[createStaticData] found no matching spec for ${spec.name}-${value.name} in specs`
            );
          }

          const cooldowns = spec.cooldowns.map((cd) => cd.id);

          return { ...spec, cooldowns, id: match.id };
        }),
      },
    ];
  })
);

const covenants = covenantMap;

const spells = Object.fromEntries(
  Object.entries(classMap).flatMap(([, value]) => {
    return [
      ...new Set([
        ...value.cooldowns,
        ...value.covenantAbilities,
        ...value.specs.flatMap((spec) => spec.cooldowns),
      ]),
    ].map((ability) => [
      ability.id,
      {
        icon: ability.icon,
        name: ability.name,
        cd: ability.cd,
      },
    ]);
  })
);

const data = {
  dungeons,
  affixes,
  soulbinds,
  classes,
  covenants,
  spells,
};

const template = `
export const staticData = ${JSON.stringify(data)};

export type StaticData = {
  classes: Record<number, typeof staticData.classes[1]>;
  dungeons: Record<number, typeof staticData.dungeons['2290']>;
  affixes: Record<number, typeof staticData.affixes['0']>;
  soulbinds: Record<number, typeof staticData.soulbinds[1]>;
  covenants: Record<number, typeof staticData.covenants[1]>;
  spells: Record<string, { icon: string; name: string; cd: number }>
}
`;

writeFileSync("./src/staticData.ts", template);
