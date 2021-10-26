import {
  tormentedSpells,
  tormentedLieutenants,
} from "@keystone-heroes/wcl/queries/events/affixes/tormented";
import { config } from "dotenv";
import { writeFileSync, existsSync, createWriteStream, unlinkSync } from "fs";
import { get } from "https";
import { resolve } from "path";

import { allBossIDs, dungeons as rawDungeons } from "./data/dungeons";
import { spells } from "./data/spellIds";
import { prisma } from "./prisma";

config();

const log = (str: string) => {
  // eslint-disable-next-line no-console
  console.info(`[@keystone-heroes/db] ${str}`);
};

async function create() {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  log("loading static data");

  const rawCovenants = await prisma.covenant.findMany({
    select: {
      name: true,
      id: true,
      icon: true,
    },
  });
  const covenants = Object.fromEntries(
    rawCovenants.map((covenant) => {
      return [covenant.id, { name: covenant.name, icon: covenant.icon }];
    })
  );

  const rawSoulbinds = await prisma.soulbind.findMany({
    select: {
      name: true,
      id: true,
      covenantID: true,
    },
  });

  const soulbinds = Object.fromEntries(
    rawSoulbinds.map((soulbind) => {
      return [
        soulbind.id,
        { name: soulbind.name, covenantID: soulbind.covenantID },
      ];
    })
  );

  const dungeons = Object.fromEntries(
    rawDungeons.map((dungeon) => {
      return [
        dungeon.id,
        {
          name: dungeon.name,
          slug: dungeon.slug,
          time: dungeon.timer[0],
          zones: dungeon.zones.map((zone) => ({
            id: zone.id,
            name: zone.name,
          })),
          unitCountMap: dungeon.unitCountMap,
          count: dungeon.count,
        },
      ];
    })
  );

  const rawAffixes = await prisma.affix.findMany({
    select: {
      name: true,
      id: true,
      icon: true,
    },
  });

  const affixes = Object.fromEntries(
    rawAffixes.map((affix) => {
      return [
        affix.id,
        {
          name: affix.name,
          icon: affix.icon,
        },
      ];
    })
  );

  const rawClasses = await prisma.class.findMany({
    select: {
      id: true,
      name: true,
      Cooldown: {
        select: {
          ability: {
            select: {
              id: true,
              icon: true,
              name: true,
            },
          },
          cd: true,
        },
      },
      Spec: {
        select: {
          id: true,
          name: true,
          role: true,
          Cooldown: {
            select: {
              ability: {
                select: {
                  id: true,
                  icon: true,
                  name: true,
                },
              },
              cd: true,
            },
          },
        },
      },
    },
  });

  const rawLegendaries = await prisma.legendary.findMany({
    select: {
      id: true,
      effectName: true,
      effectIcon: true,
    },
  });

  log(`found ${rawLegendaries.length} legendaries`);

  const legendaries = Object.fromEntries(
    rawLegendaries.map((legendary) => [
      legendary.id,
      {
        effectName: legendary.effectName,
        icon: legendary.effectIcon,
      },
    ])
  );

  const rawTalents = await prisma.talent.findMany({
    select: {
      id: true,
      icon: true,
      name: true,
    },
  });

  log(`found ${rawTalents.length} talents`);

  const talents = Object.fromEntries(
    rawTalents.map((talent) => [
      talent.id,
      {
        name: talent.name,
        icon: talent.icon,
      },
    ])
  );

  const rawConduits = await prisma.conduit.findMany({
    select: {
      id: true,
      icon: true,
      name: true,
    },
  });

  const conduits = Object.fromEntries(
    rawConduits.map((conduit) => [
      conduit.id,
      {
        name: conduit.name,
        icon: conduit.icon,
      },
    ])
  );

  log(`found ${rawConduits.length} conduits`);

  await prisma.$disconnect();
  log(`db disconnected`);

  const classes = Object.fromEntries(
    rawClasses.map((classData) => {
      return [
        classData.id,
        {
          name: classData.name,
          cooldowns: classData.Cooldown.map((cooldown) => cooldown.ability.id),
          specs: classData.Spec.map((spec) => {
            return {
              id: spec.id,
              name: spec.name,
              cooldowns: spec.Cooldown.map((cooldown) => cooldown.ability.id),
            };
          }),
        },
      ];
    })
  );

  const tormentedLieutenantMap = Object.fromEntries(
    tormentedLieutenants.map((lt) => {
      return [
        lt.id,
        {
          name: lt.name,
          icon: lt.icon,
        },
      ];
    })
  );

  const tormentedPowerMap = Object.fromEntries(
    tormentedSpells.map((spell) => {
      return [
        spell.id,
        {
          name: spell.name,
          icon: spell.icon,
          sourceTormentorID: spell.sourceTormentorID,
        },
      ];
    })
  );

  const targetPath = resolve("../web/src/staticData.ts");

  const template = `
/* eslint-disable sonarjs/no-duplicate-string */
const tormentedLieutenantIDs = new Set<number>(${JSON.stringify(
    tormentedLieutenants.map((lt) => lt.id)
  )});  
const allBossIDs = new Set<number>(${JSON.stringify([...allBossIDs])});
export const isBoss = (id: number): boolean => allBossIDs.has(id);
export const isTormentedLieutenant = (id: number): boolean => tormentedLieutenantIDs.has(id);
export const classes: Record<number, { name: string; cooldowns: number[]; specs: { id: number; name: string; cooldowns: number[]; }[]}> = ${JSON.stringify(
    classes
  )};
export const dungeons: Record<number, { name: string; slug: string; time: number; zones: {id: number; name: string; }[]; unitCountMap: Record<number, number>; count: number; }> = ${JSON.stringify(
    dungeons
  )};
export const affixes: Record<number, { name: string; icon: string;}>= ${JSON.stringify(
    affixes
  )};
export const soulbinds: Record<number, { name: string; covenantID: number}> = ${JSON.stringify(
    soulbinds
  )};
export const covenants: Record<number, { name: string; icon: string;}> = ${JSON.stringify(
    covenants
  )};
export const spells: Record<number, { icon: string; name: string; cd: number; }>= ${JSON.stringify(
    spells
  )};
export const tormentedLieutenants: Record<number, { name: string; icon: string; }> = ${JSON.stringify(
    tormentedLieutenantMap
  )};
export const tormentedPowers: Record<number, { name: string; icon: string; sourceTormentorID: number[]; }> = ${JSON.stringify(
    tormentedPowerMap
  )};
export const legendaries: Record<number, { effectName: string; icon: string; }> = ${JSON.stringify(
    legendaries
  )};
export const talents: Record<number, { name: string; icon: string; }> = ${JSON.stringify(
    talents
  )};
export const conduits: Record<number, { name: string; icon: string }> = ${JSON.stringify(
    conduits
  )};
`;

  log(`writing template`);

  writeFileSync(targetPath, template);

  const spellIconBasePath = resolve("../web/public/static/icons");

  const allLoadableIcons = [
    ...Object.values(spells).map((spell) => spell.icon),
    ...tormentedLieutenants.map((lt) => lt.icon),
    ...tormentedSpells.map((spell) => spell.icon),
    ...rawAffixes.map((affix) => affix.icon),
    ...rawLegendaries.map((legendary) => legendary.effectIcon),
    ...rawTalents.map((talent) => talent.icon),
    ...rawConduits.map((conduit) => conduit.icon),
    "inv_alchemy_80_potion02orange",
    "inv_misc_questionmark",
    "inv_misc_spyglass_03",
  ].filter((path): path is string => !!path);

  log(`verifying presence of ${allLoadableIcons.length} icons`);

  const origin = "https://wow.zamimg.com/images/wow/icons/medium/";

  await Promise.all(
    allLoadableIcons.map(async (icon) => {
      const path = resolve(spellIconBasePath, `${icon}.jpg`);
      const exists = existsSync(path);

      if (exists) {
        return Promise.resolve(true);
      }

      log(`loading ${icon}.jpg`);

      const sourcePath = `${origin}${icon}.jpg`;

      return new Promise((resolve, reject) => {
        const file = createWriteStream(path);

        get(sourcePath, (response) => {
          response.pipe(file);

          file.on("finish", () => {
            resolve(true);
            file.close();
          });

          file.on("error", (error) => {
            unlinkSync(path);
            // eslint-disable-next-line no-console
            console.error(error);
            reject(error);
          });
        });
      });
    })
  );

  log(`done creating static data`);
}

// eslint-disable-next-line no-console
create().catch(console.error);
