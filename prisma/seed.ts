import type {
  Affixes,
  Dungeons,
  Specs,
  Classes,
  Weeks,
  Expansions,
  Seasons,
  Covenants,
} from "@prisma/client";
import { PrismaClient, Roles, PlayableClass, Spec } from "@prisma/client";

import type { Affix } from "../src/utils/affixes";
import { affixes } from "../src/utils/affixes";
import { covenantMap } from "../src/utils/covenants";
import { dungeons } from "../src/utils/dungeons";

const prisma = new PrismaClient();

const classes = [
  {
    id: 1,
    name: PlayableClass.Warrior,
    specs: [
      {
        name: Spec.Warrior_Protection,
        role: Roles.tank,
      },
      {
        name: Spec.Warrior_Fury,
        role: Roles.dps,
      },
      {
        name: Spec.Warrior_Arms,
        role: Roles.dps,
      },
    ],
  },
  {
    id: 2,
    name: PlayableClass.Mage,
    specs: [
      {
        name: Spec.Mage_Fire,
        role: Roles.dps,
      },
      {
        name: Spec.Mage_Frost,
        role: Roles.dps,
      },
      {
        name: Spec.Mage_Arcane,
        role: Roles.dps,
      },
    ],
  },
  {
    id: 3,
    name: PlayableClass.Rogue,
    specs: [
      {
        name: Spec.Rogue_Assassination,
        role: Roles.dps,
      },
      {
        name: Spec.Rogue_Sublety,
        role: Roles.dps,
      },
      {
        name: Spec.Rogue_Outlaw,
        role: Roles.dps,
      },
    ],
  },
  {
    id: 4,
    name: PlayableClass.Shaman,
    specs: [
      {
        name: Spec.Shaman_Restoration,
        role: Roles.healer,
      },
      {
        name: Spec.Shaman_Elemental,
        role: Roles.dps,
      },
      {
        name: Spec.Shaman_Enhancement,
        role: Roles.dps,
      },
    ],
  },
  {
    id: 5,
    name: PlayableClass.Priest,
    specs: [
      {
        name: Spec.Priest_Shadow,
        role: Roles.dps,
      },
      {
        name: Spec.Priest_Holy,
        role: Roles.healer,
      },
      {
        name: Spec.Priest_Discipline,
        role: Roles.healer,
      },
    ],
  },
  {
    id: 6,
    name: PlayableClass.Hunter,
    specs: [
      {
        // eslint-disable-next-line inclusive-language/use-inclusive-words
        name: Spec.Hunter_BeastMastery,
        role: Roles.dps,
      },
      {
        name: Spec.Hunter_Survival,
        role: Roles.dps,
      },
      {
        name: Spec.Hunter_Marksmanship,
        role: Roles.dps,
      },
    ],
  },
  {
    id: 7,
    name: PlayableClass.Monk,
    specs: [
      {
        name: Spec.Monk_Mistweaver,
        role: Roles.healer,
      },
      {
        // eslint-disable-next-line inclusive-language/use-inclusive-words
        name: Spec.Monk_Brewmaster,
        role: Roles.tank,
      },
      {
        name: Spec.Monk_Windwalker,
        role: Roles.dps,
      },
    ],
  },
  {
    id: 8,
    name: PlayableClass.Druid,
    specs: [
      {
        name: Spec.Druid_Restoration,
        role: Roles.healer,
      },
      {
        name: Spec.Druid_Guardian,
        role: Roles.tank,
      },
      {
        name: Spec.Druid_Balance,
        role: Roles.dps,
      },
      {
        name: Spec.Druid_Feral,
        role: Roles.dps,
      },
    ],
  },
  {
    id: 9,
    name: PlayableClass.DemonHunter,
    specs: [
      {
        name: Spec.DemonHunter_Vengeance,
        role: Roles.tank,
      },
      {
        name: Spec.DemonHunter_Havoc,
        role: Roles.dps,
      },
    ],
  },
  {
    id: 10,
    name: PlayableClass.Paladin,
    specs: [
      {
        name: Spec.Paladin_Protection,
        role: Roles.tank,
      },
      {
        name: Spec.Paladin_Holy,
        role: Roles.healer,
      },
      {
        name: Spec.Paladin_Retribution,
        role: Roles.dps,
      },
    ],
  },
  {
    id: 11,
    name: PlayableClass.Warlock,
    specs: [
      {
        name: Spec.Warlock_Destruction,
        role: Roles.dps,
      },
      {
        name: Spec.Warlock_Demonology,
        role: Roles.dps,
      },
      {
        name: Spec.Warlock_Affliction,
        role: Roles.dps,
      },
    ],
  },
  {
    id: 12,
    name: PlayableClass.DeathKnight,
    specs: [
      {
        name: Spec.DeathKnight_Blood,
        role: Roles.tank,
      },
      {
        name: Spec.DeathKnight_Unholy,
        role: Roles.dps,
      },
      {
        name: Spec.DeathKnight_Frost,
        role: Roles.dps,
      },
    ],
  },
];

function seedDungeons() {
  const insertableDungeons = Object.entries(dungeons).map<Dungeons>(
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
  const insertableClasses = classes.map<Classes>(({ id, name }) => ({
    id,
    name,
  }));

  return Promise.all(
    insertableClasses.map((classData) =>
      prisma.classes.upsert({
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

function seedAffixes() {
  const insertableAffixes = Object.entries(affixes).map<Affixes>(
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
      prisma.affixes.upsert({
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
  const insertableExpansions: Expansions[] = [
    { id: 6, name: "Legion", slug: "Legion" },
    { id: 7, name: "Battle for Azeroth", slug: "BfA" },
    { id: 8, name: "Shadowlands", slug: "SL" },
  ];

  return Promise.all(
    insertableExpansions.map((expansion) =>
      prisma.expansions.upsert({
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
  // via https://raider.io/api#/mythic_plus/getApiV1MythicplusStaticdata
  const insertableSeasons: Seasons[] = [
    // Legion
    {
      slug: "season-7.2.0",
      name: "Season 7.2",
      expansionId: 6,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: null,
    },
    {
      slug: "season-7.2.5",
      name: "Season 7.2.5",
      expansionId: 6,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: null,
    },
    {
      slug: "season-7.3.0",
      name: "Season 7.3",
      expansionId: 6,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: null,
    },
    {
      slug: "season-7.3.2",
      name: "Season 7.3.2",
      expansionId: 6,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: null,
    },
    {
      slug: "season-post-legion",
      name: "Legion Post-Season",
      expansionId: 6,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: null,
    },
    {
      slug: "season-pre-bfa",
      name: "BFA Pre-Season",
      expansionId: 6,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: null,
    },
    // BFA
    {
      slug: "season-bfa-1",
      name: "BFA Season 1",
      expansionId: 7,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: getAffix("Infested"),
    },
    {
      slug: "season-bfa-2",
      name: "BFA Season 2",
      expansionId: 7,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: getAffix("Reaping"),
    },
    {
      slug: "season-bfa-2-post",
      name: "BFA Post-Season 2",
      expansionId: 7,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: getAffix("Reaping"),
    },
    {
      slug: "season-bfa-3",
      name: "BFA Season 3",
      expansionId: 7,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: getAffix("Beguiling"),
    },
    {
      slug: "season-bfa-3-post",
      name: "BFA Post-Season 3",
      expansionId: 7,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: getAffix("Beguiling"),
    },
    {
      slug: "season-bfa-4",
      name: "BFA Season 4",
      expansionId: 7,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: getAffix("Awakened"),
    },
    {
      slug: "season-bfa-4-post",
      name: "BFA Post-Season 4",
      expansionId: 7,
      startTime: new Date(0),
      endTime: new Date(1),
      affixId: getAffix("Awakened"),
    },
    // SL
    {
      slug: "season-sl-1",
      name: "SL Season 1",
      expansionId: 8,
      startTime: new Date(1_607_385_600 * 1000),
      endTime: null,
      affixId: getAffix("Prideful"),
    },
  ].map((dataset, index) => ({ ...dataset, id: index }));

  return Promise.all(
    insertableSeasons.map((season) =>
      prisma.seasons.upsert({
        create: season,
        where: {
          id: season.id,
        },
        update: {},
      })
    )
  );
}

const getAffix = (name: Affix["name"]) => {
  const match = Object.entries(affixes).find(
    ([, affix]) => affix.name === name
  );

  if (match) {
    return Number.parseInt(match[0]);
  }

  throw new Error("impossible");
};

function seedWeeks() {
  const insertableWeeks: Weeks[] = [
    // SL
    {
      seasonId: 13,
      seasonWeekId: 1,
      affix1Id: getAffix("Fortified"),
      affix2Id: getAffix("Bursting"),
      affix3Id: getAffix("Volcanic"),
    },
    {
      seasonId: 13,
      seasonWeekId: 2,
      affix1Id: getAffix("Tyrannical"),
      affix2Id: getAffix("Bolstering"),
      affix3Id: getAffix("Storming"),
    },
    {
      seasonId: 13,
      seasonWeekId: 3,
      affix1Id: getAffix("Fortified"),
      affix2Id: getAffix("Spiteful"),
      affix3Id: getAffix("Grievous"),
    },
    {
      seasonId: 13,
      seasonWeekId: 4,
      affix1Id: getAffix("Tyrannical"),
      affix2Id: getAffix("Inspiring"),
      affix3Id: getAffix("Necrotic"),
    },
    {
      seasonId: 13,
      seasonWeekId: 5,
      affix1Id: getAffix("Fortified"),
      affix2Id: getAffix("Sanguine"),
      affix3Id: getAffix("Quaking"),
    },
    {
      seasonId: 13,
      seasonWeekId: 6,
      affix1Id: getAffix("Tyrannical"),
      affix2Id: getAffix("Raging"),
      affix3Id: getAffix("Explosive"),
    },
    {
      seasonId: 13,
      seasonWeekId: 7,
      affix1Id: getAffix("Fortified"),
      affix2Id: getAffix("Spiteful"),
      affix3Id: getAffix("Volcanic"),
    },
    {
      seasonId: 13,
      seasonWeekId: 8,
      affix1Id: getAffix("Tyrannical"),
      affix2Id: getAffix("Bolstering"),
      affix3Id: getAffix("Necrotic"),
    },
    {
      seasonId: 13,
      seasonWeekId: 9,
      affix1Id: getAffix("Fortified"),
      affix2Id: getAffix("Inspiring"),
      affix3Id: getAffix("Storming"),
    },
    {
      seasonId: 13,
      seasonWeekId: 10,
      affix1Id: getAffix("Tyrannical"),
      affix2Id: getAffix("Bursting"),
      affix3Id: getAffix("Explosive"),
    },
    {
      seasonId: 13,
      seasonWeekId: 11,
      affix1Id: getAffix("Fortified"),
      affix2Id: getAffix("Sanguine"),
      affix3Id: getAffix("Grievous"),
    },
    {
      seasonId: 13,
      seasonWeekId: 12,
      affix1Id: getAffix("Tyrannical"),
      affix2Id: getAffix("Raging"),
      affix3Id: getAffix("Quaking"),
    },
  ].map((dataset, index) => ({ ...dataset, id: index }));

  return Promise.all(
    insertableWeeks.map((week) =>
      prisma.weeks.upsert({
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
  const insertableCovenants: Covenants[] = Object.entries(
    covenantMap
  ).map(([id, dataset]) => ({ ...dataset, id: Number.parseInt(id) }));

  return Promise.all(
    insertableCovenants.map((covenant) =>
      prisma.covenants.upsert({
        create: covenant,
        where: {
          id: covenant.id,
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
