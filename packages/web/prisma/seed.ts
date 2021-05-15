import type { Class, Zone } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import { affixes } from "./affixes";
import { classes } from "./classes";
import { covenants } from "./covenants";
import { dungeons } from "./dungeons";
import { expansions } from "./expansions";
import { maps } from "./maps";
import { regions } from "./regions";
import { seasons } from "./seasons";
import { soulbinds } from "./soulbinds";
import { specs } from "./specs";
import { weeks } from "./weeks";

const prisma = new PrismaClient();

function seedDungeons() {
  return Promise.all(
    dungeons.map(({ timer, bossIds, expansionId, ...dungeon }) =>
      prisma.dungeon.upsert({
        create: {
          ...dungeon,
          time: timer[0],
        },
        where: {
          id: dungeon.id,
        },
        update: {},
      })
    )
  );
}

function seedZones() {
  const allZones: Zone[] = dungeons.flatMap((dungeon) =>
    dungeon.zones.map((zone) => ({
      dungeonId: dungeon.id,
      id: zone,
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
    expansions.map(({ dungeonIds, ...expansion }) =>
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
          id: region.id,
        },
        update: {},
      })
    )
  );
}

function seedMaps() {
  return Promise.all(
    maps.map((map) =>
      prisma.map.upsert({
        create: map,
        where: {
          id: map.id,
        },
        update: {},
      })
    )
  );
}

async function main() {
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
  await seedMaps();
}

main()
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
