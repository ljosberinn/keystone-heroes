import { writeFileSync } from "fs";
import { resolve } from "path";

import { prisma } from "./prisma";

async function create() {
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

  const targetPath = resolve("../web/src/staticData.ts");

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
  classes: Record<number, typeof staticData.classes[keyof typeof staticData.classes]>;
  dungeons: Record<number, typeof staticData.dungeons[keyof typeof staticData.dungeons]>;
  affixes: Record<number, typeof staticData.affixes[keyof typeof staticData.affixes]>;
  soulbinds: Record<number, typeof staticData.soulbinds[keyof typeof staticData.soulbinds]>;
  covenants: Record<number, typeof staticData.covenants[keyof typeof staticData.covenants]>;
  spells: Record<string, { icon: string; name: string; cd: number }>
}`;

  writeFileSync(targetPath, template);
}

// eslint-disable-next-line unicorn/prefer-top-level-await, no-console
create().catch(console.error);
