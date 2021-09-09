import { affixes as rawAffixes } from "@keystone-heroes/db/data/affixes";
import { classMap } from "@keystone-heroes/db/data/classes";
import { covenantMap } from "@keystone-heroes/db/data/covenants";
import { dungeons as rawDungeons } from "@keystone-heroes/db/data/dungeons";
import { soulbindMap } from "@keystone-heroes/db/data/soulbinds";
import { writeFileSync } from "fs";

const dungeons = Object.fromEntries(
  rawDungeons.map(({ id, name, timer, slug, zones }) => {
    return [id, { name, timer, slug, zones }];
  })
);

// todo:
// - change fight.player[number].class to class id
// - change fight.player[number].spec to { id: 999, ...}

const affixes = Object.fromEntries(
  Object.entries(rawAffixes).map(([key, { name, icon }]) => {
    return [key, { name, icon }];
  })
);

const soulbinds = soulbindMap;
const classes = classMap;
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
`;

writeFileSync("./src/staticData.ts", template);
