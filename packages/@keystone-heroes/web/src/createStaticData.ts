import { affixes as rawAffixes } from "@keystone-heroes/db/data/affixes";
import { classMap } from "@keystone-heroes/db/data/classes";
import { covenantMap } from "@keystone-heroes/db/data/covenants";
import { dungeons as rawDungeons } from "@keystone-heroes/db/data/dungeons";
import { soulbindMap } from "@keystone-heroes/db/data/soulbinds";
import { specs } from "@keystone-heroes/db/data/specs";
import { writeFileSync } from "fs";

const dungeons = Object.fromEntries(
  rawDungeons.map(({ id, name, timer, slug, zones }) => {
    return [id, { name, timer, slug, zones }];
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
    return [
      key,
      {
        ...value,
        specs: value.specs.map((spec) => {
          const match = specs.find(
            (s) => `${s.classID}` === key && s.name === spec.name
          );

          return match ? { ...spec, id: match.id } : spec;
        }),
      },
    ];
  })
);

const covenants = covenantMap;

const data = {
  dungeons,
  affixes,
  soulbinds,
  classes,
  covenants,
};

const template = `
/* eslint-disable sonarjs/no-duplicate-string */
export const staticData = ${JSON.stringify(data)};

export type StaticData = {
  classes: Record<number, typeof staticData.classes[1]>;
  dungeons: Record<number, typeof staticData.dungeons['2290']>;
  affixes: Record<number, typeof staticData.affixes['0']>;
  soulbinds: Record<number, typeof staticData.soulbinds[1]>;
  covenants: Record<number, typeof staticData.covenants[1]>;
}
`;

writeFileSync("./src/staticData.ts", template);
