/* eslint-disable no-console */
import {
  tormentedSpells,
  tormentedLieutenants,
} from "@keystone-heroes/wcl/queries/events/affixes/tormented";
import { writeFileSync, existsSync, createWriteStream, unlinkSync } from "fs";
import { get } from "https";
import { resolve } from "path";

import { allBossIDs } from "./data/dungeons";
import { prisma } from "./prisma";

const log = (str: string) => {
  console.info(`[@keystone-heroes/db] ${str}`);
};

async function create() {
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

  const rawDungeons = await prisma.dungeon.findMany({
    select: {
      name: true,
      slug: true,
      id: true,
      time: true,
      Zone: {
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  const dungeons = Object.fromEntries(
    rawDungeons.map((dungeon) => {
      return [
        dungeon.id,
        {
          name: dungeon.name,
          slug: dungeon.slug,
          time: dungeon.time,
          zones: dungeon.Zone,
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

  const spells = Object.fromEntries(
    rawClasses.flatMap((classData) => {
      return [
        ...classData.Cooldown,
        ...classData.Spec.flatMap((spec) => spec.Cooldown),
      ].map((cd) => [
        cd.ability.id,
        {
          icon: cd.ability.icon,
          name: cd.ability.name,
          cd: cd.cd,
        },
      ]);
    })
  );

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

  const data = {
    dungeons,
    affixes,
    soulbinds,
    classes,
    covenants,
    spells,
    isBoss: (id: number) => allBossIDs.has(id),
    tormentedLieutenants: tormentedLieutenantMap,
    tormentedPowers: tormentedPowerMap,
    legendaries,
    talents,
    conduits,
  };

  const template = `
const tormentedLieutenantIDs = new Set<number>(${JSON.stringify(
    tormentedLieutenants.map((lt) => lt.id)
  )});  
const allBossIDs = new Set<number>(${JSON.stringify([...allBossIDs])});
export const staticData = {
  ...${JSON.stringify(data)},
  isBoss: (id: number): boolean => allBossIDs.has(id),
  isTormentedLieutenant: (id: number): boolean => tormentedLieutenantIDs.has(id),
};

export type StaticData = {
  classes: Record<number, typeof staticData.classes[keyof typeof staticData.classes]>;
  dungeons: Record<number, typeof staticData.dungeons[keyof typeof staticData.dungeons]>;
  affixes: Record<number, typeof staticData.affixes[keyof typeof staticData.affixes]>;
  soulbinds: Record<number, typeof staticData.soulbinds[keyof typeof staticData.soulbinds]>;
  covenants: Record<number, typeof staticData.covenants[keyof typeof staticData.covenants]>;
  spells: Record<number, { icon: string; name: string; cd: number }>;
  tormentedLieutenants: Record<number, typeof staticData.tormentedLieutenants[keyof typeof staticData.tormentedLieutenants]>;
  tormentedPowers: Record<number, typeof staticData.tormentedPowers[keyof typeof staticData.tormentedPowers]>;
  isBoss: (id: number) => boolean;
  isTormentedLieutenant: (id: number) => boolean;
  legendaries: Record<number, typeof staticData.legendaries[keyof typeof staticData.legendaries]>;
  talents: Record<number, typeof staticData.talents[keyof typeof staticData.talents]>;
  conduits: Record<number, typeof staticData.conduits[keyof typeof staticData.conduits]>;
}`;

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
            console.error(error);
            reject(error);
          });
        });
      });
    })
  );

  log(`done creating static data`);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
create().catch(console.error);
