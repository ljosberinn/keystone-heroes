/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import type { Class, Zone } from "@prisma/client";
import { config } from "dotenv";

import { affixes } from "../src/db/data/affixes";
import { classes } from "../src/db/data/classes";
import { cooldowns } from "../src/db/data/cooldowns";
import { covenants } from "../src/db/data/covenants";
import { dungeons } from "../src/db/data/dungeons";
import { expansions } from "../src/db/data/expansions";
import { regions } from "../src/db/data/regions";
import { seasons } from "../src/db/data/seasons";
import { soulbinds } from "../src/db/data/soulbinds";
import { specs } from "../src/db/data/specs";
import { weeks } from "../src/db/data/weeks";
import allNPCs from "../src/db/raw/all-npcs.json";
import allAbilities from "../src/db/raw/all-spells.json";

config();

let prisma: PrismaClient;

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
      minX: zone.minX,
      minY: zone.minY,
      maxX: zone.maxX,
      maxY: zone.maxY,
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

    console.timeEnd(key);
  }
}

async function seedCooldowns() {
  await Promise.all(
    cooldowns.map((cd) => {
      return prisma.cooldown.upsert({
        create: {
          cd: cd.cd,
          abilityID: cd.abilityID,
          classID: cd.classID,
          specID: cd.specID,
          id: cd.id,
        },
        where: {
          id: cd.id,
        },
        update: {
          cd: cd.cd,
        },
      });
    })
  );
}

async function seed1(): Promise<void> {
  console.log("seed1 begin");
  console.time("seed1");

  try {
    prisma = new PrismaClient();

    console.time("seedDungeons");
    await seedDungeons();
    console.timeEnd("seedDungeons");

    console.time("seedZones");
    await seedZones();
    console.timeEnd("seedZones");

    console.time("seedClasses");
    await seedClasses();
    console.timeEnd("seedClasses");

    console.time("seedSpecs");
    await seedSpecs();
    console.timeEnd("seedSpecs");

    console.time("seedAffixes");
    await seedAffixes();
    console.timeEnd("seedAffixes");

    console.time("seedExpansions");
    await seedExpansions();
    console.timeEnd("seedExpansions");

    console.time("seedSeasons");
    await seedSeasons();
    console.timeEnd("seedSeasons");

    console.time("seedWeeks");
    await seedWeeks();
    console.timeEnd("seedWeeks");

    console.time("seedCovenants");
    await seedCovenants();
    console.timeEnd("seedCovenants");

    console.time("seedSoulbinds");
    await seedSoulbinds();
    console.timeEnd("seedSoulbinds");

    console.time("seedRegions");
    await seedRegions();
    console.timeEnd("seedRegions");

    console.time("seedNPCs");
    await seedNPCs();
    console.timeEnd("seedNPCs");
  } catch (error) {
    console.log(error);
  } finally {
    console.log("seed1 done; disconnecting");
    await prisma.$disconnect();
    console.log("disconnected");
  }

  console.timeEnd("seed1");
}

async function seed2(): Promise<void> {
  console.log("seed2 begin");
  console.time("seed2");

  try {
    prisma = new PrismaClient();

    console.time("seedAbilities");
    await seedAbilities();
    console.timeEnd("seedAbilities");
  } catch (error) {
    console.log(error);
  } finally {
    console.log("seed2 done; disconnecting");
    await prisma.$disconnect();
    console.log("disconnected");
  }

  console.timeEnd("seed2");
}

async function seed3(): Promise<void> {
  console.log("seed3 begin");
  console.time("seed3");

  try {
    prisma = new PrismaClient();

    console.time("seedCooldowns");
    await seedCooldowns();
    console.timeEnd("seedCooldowns");
  } catch (error) {
    console.log(error);
  } finally {
    console.log("seed2 done; disconnecting");
    await prisma.$disconnect();
    console.log("disconnected");
  }

  console.timeEnd("seed3");
}

seed1()
  .then(() => seed2())
  .then(() => seed3())
  .catch(console.log)
  .finally(() => {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  });
