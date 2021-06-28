import { PrismaClient } from "@prisma/client";
import type { Class, Zone } from "@prisma/client";

import allNPCs from "../raw/all-npcs.json";
import allAbilities from "../raw/all-spells.json";
import { affixes } from "../src/data/affixes";
import { classes } from "../src/data/classes";
import { covenants } from "../src/data/covenants";
import { dungeons } from "../src/data/dungeons";
import { expansions } from "../src/data/expansions";
import { regions } from "../src/data/regions";
import { seasons } from "../src/data/seasons";
import { soulbinds } from "../src/data/soulbinds";
import { specs } from "../src/data/specs";
import { weeks } from "../src/data/weeks";

import "@keystone-heroes/env/src/loader";

const prisma = new PrismaClient();

function seedDungeons() {
  return Promise.all(
    dungeons.map(({ timer, id, name, slug }) =>
      prisma.dungeon.upsert({
        create: {
          id,
          name,
          slug,
          time: timer[0],
        },
        where: {
          id,
        },
        update: {},
      })
    )
  );
}

function seedZones() {
  const allZones: Zone[] = dungeons.flatMap((dungeon) =>
    dungeon.zones.map((zone) => ({
      name: zone.name,
      dungeonID: dungeon.id,
      id: zone.id,
      order: zone.order,
    }))
  );

  return Promise.all(
    allZones.map((zone) =>
      prisma.zone.upsert({
        create: zone,
        where: {
          id: zone.id,
        },
        update: {},
      })
    )
  );
}

function seedClasses() {
  const insertableClasses = classes.map<Class>(({ id, name }) => ({
    id,
    name,
  }));

  return Promise.all(
    insertableClasses.map((classData) =>
      prisma.class.upsert({
        create: classData,
        where: {
          id: classData.id,
        },
        update: {},
      })
    )
  );
}

function seedSpecs() {
  return Promise.all(
    specs.map((spec) =>
      prisma.spec.upsert({
        create: spec,
        where: {
          id: spec.id,
        },
        update: {},
      })
    )
  );
}

function seedAffixes() {
  return Promise.all(
    affixes.map((affix) =>
      prisma.affix.upsert({
        create: affix,
        where: {
          id: affix.id,
        },
        update: {},
      })
    )
  );
}

function seedExpansions() {
  return Promise.all(
    expansions.map(({ dungeonIDs, ...expansion }) =>
      prisma.expansion.upsert({
        create: expansion,
        where: {
          id: expansion.id,
        },
        update: {},
      })
    )
  );
}

function seedSeasons() {
  return Promise.all(
    seasons.map((season) =>
      prisma.season.upsert({
        create: season,
        where: {
          id: season.id,
        },
        update: {},
      })
    )
  );
}

function seedWeeks() {
  return Promise.all(
    weeks.map((week) =>
      prisma.week.upsert({
        create: week,
        where: {
          id: week.id,
        },
        update: {},
      })
    )
  );
}

function seedCovenants() {
  return Promise.all(
    covenants.map((covenant) =>
      prisma.covenant.upsert({
        create: covenant,
        where: {
          id: covenant.id,
        },
        update: {},
      })
    )
  );
}

function seedSoulbinds() {
  return Promise.all(
    soulbinds.map((soulbind) =>
      prisma.soulbind.upsert({
        create: soulbind,
        where: {
          id: soulbind.id,
        },
        update: {},
      })
    )
  );
}

function seedRegions() {
  return Promise.all(
    regions.map((region) =>
      prisma.region.upsert({
        create: {
          slug: region.slug,
        },
        where: {
          slug: region.slug,
        },
        update: {},
      })
    )
  );
}

function seedNPCs() {
  return prisma.nPC.createMany({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore ts-expect-error fails in yarn seed for whichever reason
    data: allNPCs,
    skipDuplicates: true,
  });
}

async function seedAbilities() {
  const chunkSize = 10_000;

  if (!Array.isArray(allAbilities)) {
    throw new TypeError("ts must be satisfied");
  }

  const iterations = Math.ceil(allAbilities.length / chunkSize);

  for (let i = 0; i < iterations; i++) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore ts-expect-error fails in yarn seed for whichever reason
    const start = chunkSize * i;
    const end = chunkSize * (i + 1);

    const key = `abilities-${start}-${end}`;

    // eslint-disable-next-line no-console
    console.time(key);

    const data = allAbilities
      .slice(start, end)
      .filter((ability) => ability.name !== null)
      .map(({ id, name, icon }) => ({ id, name, icon }));

    // eslint-disable-next-line no-await-in-loop
    await prisma.ability.createMany({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore ts-expect-error fails in yarn seed for whichever reason
      data,
      skipDuplicates: true,
    });

    // eslint-disable-next-line no-console
    console.timeEnd(key);
  }
}

async function seed(): Promise<void> {
  await seedDungeons();
  await seedZones();
  await seedClasses();
  await seedSpecs();
  await seedAffixes();
  await seedExpansions();
  await seedSeasons();
  await seedWeeks();
  await seedCovenants();
  await seedSoulbinds();
  await seedRegions();
  await seedNPCs();
  await seedAbilities();

  await prisma.$disconnect();

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
seed();
