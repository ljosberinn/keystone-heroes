import type {
  Affix,
  Class,
  Covenant,
  Dungeon,
  Expansion,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import { affixes } from "./affixes";
import { classes } from "./classes";
import { covenantMap } from "./covenants";
import { dungeonMap } from "./dungeons";
import { regions } from "./regions";
import { seasons } from "./seasons";
import { soulbindMap } from "./soulbinds";
import { specs } from "./specs";
import { weeks } from "./weeks";

const prisma = new PrismaClient();

function seedDungeons() {
  const insertableDungeons = Object.entries(dungeonMap).map<Dungeon>(
    ([id, { name, slug, timer }]) => {
      return {
        id: Number.parseInt(id),
        name,
        slug,
        time: timer[0],
      };
    }
  );

  return Promise.all(
    insertableDungeons.map((dungeon) =>
      prisma.dungeon.upsert({
        create: dungeon,
        where: {
          id: dungeon.id,
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
  const insertableAffixes = Object.entries(affixes).map<Affix>(
    ([id, { name, icon, seasonal }]) => {
      return {
        id: Number.parseInt(id),
        name,
        icon,
        seasonal,
      };
    }
  );

  return Promise.all(
    insertableAffixes.map((affix) =>
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
  const insertableExpansions: Expansion[] = [
    { id: 6, name: "Legion", slug: "Legion" },
    { id: 7, name: "Battle for Azeroth", slug: "BfA" },
    { id: 8, name: "Shadowlands", slug: "SL" },
  ];

  return Promise.all(
    insertableExpansions.map((expansion) =>
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
  const insertableCovenants: Covenant[] = Object.entries(
    covenantMap
  ).map(([id, dataset]) => ({ ...dataset, id: Number.parseInt(id) }));

  return Promise.all(
    insertableCovenants.map((covenant) =>
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
    Object.entries(soulbindMap).map(([id, soulbind]) =>
      prisma.soulbind.upsert({
        create: {
          icon: soulbind.icon,
          name: soulbind.name,
          covenantId: soulbind.covenantId,
          id: Number.parseInt(id),
        },
        where: {
          id: Number.parseInt(id),
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

async function main() {
  await seedDungeons();
  await seedClasses();
  await seedSpecs();
  await seedAffixes();
  await seedExpansions();
  await seedSeasons();
  await seedWeeks();
  await seedCovenants();
  await seedSoulbinds();
  await seedRegions();
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
