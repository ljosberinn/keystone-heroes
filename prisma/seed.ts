import type { Dungeons, Specs } from "@prisma/client";
import { PrismaClient, Roles } from "@prisma/client";

import { dungeons } from "../src/utils/dungeons";

const prisma = new PrismaClient();

const classes = [
  {
    id: 1,
    name: "Warrior",
    specs: [
      {
        name: "Protection",
        role: Roles.Tank,
      },
      {
        name: "Fury",
        role: Roles.DPS,
      },
      {
        name: "Arms",
        role: Roles.DPS,
      },
    ],
  },
  {
    id: 2,
    name: "Mage",
    specs: [
      {
        name: "Fire",
        role: Roles.DPS,
      },
      {
        name: "Frost",
        role: Roles.DPS,
      },
      {
        name: "Arcane",
        role: Roles.DPS,
      },
    ],
  },
  {
    id: 3,
    name: "Rogue",
    specs: [
      {
        name: "Assassination",
        role: Roles.DPS,
      },
      {
        name: "Sublety",
        role: Roles.DPS,
      },
      {
        name: "Outlaw",
        role: Roles.DPS,
      },
    ],
  },
  {
    id: 4,
    name: "Shaman",
    specs: [
      {
        name: "Restoration",
        role: Roles.Heal,
      },
      {
        name: "Elemental",
        role: Roles.DPS,
      },
      {
        name: "Enhancement",
        role: Roles.DPS,
      },
    ],
  },
  {
    id: 5,
    name: "Priest",
    specs: [
      {
        name: "Shadow",
        role: Roles.DPS,
      },
      {
        name: "Holy",
        role: Roles.Heal,
      },
      {
        name: "Discipline",
        role: Roles.Heal,
      },
    ],
  },
  {
    id: 6,
    name: "Hunter",
    specs: [
      {
        name: "BeastMastery",
        role: Roles.DPS,
      },
      {
        name: "Survival",
        role: Roles.DPS,
      },
      {
        name: "Marksmanship",
        role: Roles.DPS,
      },
    ],
  },
  {
    id: 7,
    name: "Monk",
    specs: [
      {
        name: "Mistweaver",
        role: Roles.Heal,
      },
      {
        name: "Brewmaster",
        role: Roles.Tank,
      },
      {
        name: "Windwalker",
        role: Roles.DPS,
      },
    ],
  },
  {
    id: 8,
    name: "Druid",
    specs: [
      {
        name: "Restoration",
        role: Roles.Heal,
      },
      {
        name: "Guardian",
        role: Roles.Tank,
      },
      {
        name: "Balance",
        role: Roles.DPS,
      },
      {
        name: "Feral",
        role: Roles.DPS,
      },
    ],
  },
  {
    id: 9,
    name: "DemonHunter",
    specs: [
      {
        name: "Vengeance",
        role: Roles.Tank,
      },
      {
        name: "Havoc",
        role: Roles.DPS,
      },
    ],
  },
  {
    id: 10,
    name: "Paladin",
    specs: [
      {
        name: "Protection",
        role: Roles.Tank,
      },
      {
        name: "Holy",
        role: Roles.Heal,
      },
      {
        name: "Retribution",
        role: Roles.DPS,
      },
    ],
  },
  {
    id: 11,
    name: "Warlock",
    specs: [
      {
        name: "Destruction",
        role: Roles.DPS,
      },
      {
        name: "Demonology",
        role: Roles.DPS,
      },
      {
        name: "Affliction",
        role: Roles.DPS,
      },
    ],
  },
  {
    id: 12,
    name: "DeathKnight",
    specs: [
      {
        name: "Blood",
        role: Roles.Tank,
      },
      {
        name: "Unholy",
        role: Roles.DPS,
      },
      {
        name: "Frost",
        role: Roles.DPS,
      },
    ],
  },
];

function seedDungeons() {
  const insertableDungeons: Dungeons[] = dungeons.map(
    ({ id, name, slug, timer }) => {
      return {
        id,
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
