import { Role, PlayableClass, SpecName } from "@prisma/client";

export const classes = [
  {
    id: 1,
    name: PlayableClass.Warrior,
    specs: [
      {
        name: SpecName.Protection,
        role: Role.tank,
      },
      {
        name: SpecName.Fury,
        role: Role.dps,
      },
      {
        name: SpecName.Arms,
        role: Role.dps,
      },
    ],
  },
  {
    id: 2,
    name: PlayableClass.Mage,
    specs: [
      {
        name: SpecName.Fire,
        role: Role.dps,
      },
      {
        name: SpecName.Frost,
        role: Role.dps,
      },
      {
        name: SpecName.Arcane,
        role: Role.dps,
      },
    ],
  },
  {
    id: 3,
    name: PlayableClass.Rogue,
    specs: [
      {
        name: SpecName.Assassination,
        role: Role.dps,
      },
      {
        name: SpecName.Sublety,
        role: Role.dps,
      },
      {
        name: SpecName.Outlaw,
        role: Role.dps,
      },
    ],
  },
  {
    id: 4,
    name: PlayableClass.Shaman,
    specs: [
      {
        name: SpecName.Restoration,
        role: Role.healer,
      },
      {
        name: SpecName.Elemental,
        role: Role.dps,
      },
      {
        name: SpecName.Enhancement,
        role: Role.dps,
      },
    ],
  },
  {
    id: 5,
    name: PlayableClass.Priest,
    specs: [
      {
        name: SpecName.Shadow,
        role: Role.dps,
      },
      {
        name: SpecName.Holy,
        role: Role.healer,
      },
      {
        name: SpecName.Discipline,
        role: Role.healer,
      },
    ],
  },
  {
    id: 6,
    name: PlayableClass.Hunter,
    specs: [
      {
        // eslint-disable-next-line inclusive-language/use-inclusive-words
        name: SpecName.BeastMastery,
        role: Role.dps,
      },
      {
        name: SpecName.Survival,
        role: Role.dps,
      },
      {
        name: SpecName.Marksmanship,
        role: Role.dps,
      },
    ],
  },
  {
    id: 7,
    name: PlayableClass.Monk,
    specs: [
      {
        name: SpecName.Mistweaver,
        role: Role.healer,
      },
      {
        // eslint-disable-next-line inclusive-language/use-inclusive-words
        name: SpecName.Brewmaster,
        role: Role.tank,
      },
      {
        name: SpecName.Windwalker,
        role: Role.dps,
      },
    ],
  },
  {
    id: 8,
    name: PlayableClass.Druid,
    specs: [
      {
        name: SpecName.Restoration,
        role: Role.healer,
      },
      {
        name: SpecName.Guardian,
        role: Role.tank,
      },
      {
        name: SpecName.Balance,
        role: Role.dps,
      },
      {
        name: SpecName.Feral,
        role: Role.dps,
      },
    ],
  },
  {
    id: 9,
    name: PlayableClass.DemonHunter,
    specs: [
      {
        name: SpecName.Vengeance,
        role: Role.tank,
      },
      {
        name: SpecName.Havoc,
        role: Role.dps,
      },
    ],
  },
  {
    id: 10,
    name: PlayableClass.Paladin,
    specs: [
      {
        name: SpecName.Protection,
        role: Role.tank,
      },
      {
        name: SpecName.Holy,
        role: Role.healer,
      },
      {
        name: SpecName.Retribution,
        role: Role.dps,
      },
    ],
  },
  {
    id: 11,
    name: PlayableClass.Warlock,
    specs: [
      {
        name: SpecName.Destruction,
        role: Role.dps,
      },
      {
        name: SpecName.Demonology,
        role: Role.dps,
      },
      {
        name: SpecName.Affliction,
        role: Role.dps,
      },
    ],
  },
  {
    id: 12,
    name: PlayableClass.DeathKnight,
    specs: [
      {
        name: SpecName.Blood,
        role: Role.tank,
      },
      {
        name: SpecName.Unholy,
        role: Role.dps,
      },
      {
        name: SpecName.Frost,
        role: Role.dps,
      },
    ],
  },
];

export const classMapById = Object.fromEntries(
  classes.map((classData) => [classData.id, classData.name])
);

export const classMapByName = Object.fromEntries(
  classes.map((classData) => [classData.name, classData.id])
);
