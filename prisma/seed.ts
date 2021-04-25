import type { Dungeons, Specs } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import { Roles } from "../src/types/roles";
import { dungeons } from "../src/utils/dungeons";

const prisma = new PrismaClient();

const classes = [
  {
    id: 1,
    name: "Warrior",
    specs: [
      {
        name: "Protection",
        role: Roles.tank,
      },
      {
        name: "Fury",
        role: Roles.dps,
      },
      {
        name: "Arms",
        role: Roles.dps,
      },
    ],
  },
  {
    id: 2,
    name: "Mage",
    specs: [
      {
        name: "Fire",
        role: Roles.dps,
      },
      {
        name: "Frost",
        role: Roles.dps,
      },
      {
        name: "Arcane",
        role: Roles.dps,
      },
    ],
  },
  {
    id: 3,
    name: "Rogue",
    specs: [
      {
        name: "Assassination",
        role: Roles.dps,
      },
      {
        name: "Sublety",
        role: Roles.dps,
      },
      {
        name: "Outlaw",
        role: Roles.dps,
      },
    ],
  },
  {
    id: 4,
    name: "Shaman",
    specs: [
      {
        name: "Restoration",
        role: Roles.healer,
      },
      {
        name: "Elemental",
        role: Roles.dps,
      },
      {
        name: "Enhancement",
        role: Roles.dps,
      },
    ],
  },
  {
    id: 5,
    name: "Priest",
    specs: [
      {
        name: "Shadow",
        role: Roles.dps,
      },
      {
        name: "Holy",
        role: Roles.healer,
      },
      {
        name: "Discipline",
        role: Roles.healer,
      },
    ],
  },
  {
    id: 6,
    name: "Hunter",
    specs: [
      {
        name: "BeastMastery",
        role: Roles.dps,
      },
      {
        name: "Survival",
        role: Roles.dps,
      },
      {
        name: "Marksmanship",
        role: Roles.dps,
      },
    ],
  },
  {
    id: 7,
    name: "Monk",
    specs: [
      {
        name: "Mistweaver",
        role: Roles.healer,
      },
      {
        name: "Brewmaster",
        role: Roles.tank,
      },
      {
        name: "Windwalker",
        role: Roles.dps,
      },
    ],
  },
  {
    id: 8,
    name: "Druid",
    specs: [
      {
        name: "Restoration",
        role: Roles.healer,
      },
      {
        name: "Guardian",
        role: Roles.tank,
      },
      {
        name: "Balance",
        role: Roles.dps,
      },
      {
        name: "Feral",
        role: Roles.dps,
      },
    ],
  },
  {
    id: 9,
    name: "DemonHunter",
    specs: [
      {
        name: "Vengeance",
        role: Roles.tank,
      },
      {
        name: "Havoc",
        role: Roles.dps,
      },
    ],
  },
  {
    id: 10,
    name: "Paladin",
    specs: [
      {
        name: "Protection",
        role: Roles.tank,
      },
      {
        name: "Holy",
        role: Roles.healer,
      },
      {
        name: "Retribution",
        role: Roles.dps,
      },
    ],
  },
  {
    id: 11,
    name: "Warlock",
    specs: [
      {
        name: "Destruction",
        role: Roles.dps,
      },
      {
        name: "Demonology",
        role: Roles.dps,
      },
      {
        name: "Affliction",
        role: Roles.dps,
      },
    ],
  },
  {
    id: 12,
    name: "DeathKnight",
    specs: [
      {
        name: "Blood",
        role: Roles.tank,
      },
      {
        name: "Unholy",
        role: Roles.dps,
      },
      {
        name: "Frost",
        role: Roles.dps,
      },
    ],
  },
];

function seedDungeons() {
  const insertableDungeons: Dungeons[] = Object.entries(dungeons).map(
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
      prisma.dungeons.upsert({
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
  return Promise.all(
    classes.map(({ id, name }) =>
      prisma.classes.upsert({
        create: { id, name },
        where: {
          id,
        },
        update: {},
      })
    )
  );
}

function seedSpecs() {
  const specs = classes
    .flatMap<Omit<Specs, "id">>(({ id: classId, specs }) =>
      specs.map(({ name, role }) => ({
        name,
        classId,
        role,
      }))
    )
    .map<Specs>((spec, id) => ({ ...spec, id: id + 1 }));

  return Promise.all(
    specs.map((spec) =>
      prisma.specs.upsert({
        create: spec,
        where: {
          id: spec.id,
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
