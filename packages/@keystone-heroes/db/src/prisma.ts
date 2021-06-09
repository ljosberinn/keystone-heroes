import { IS_PROD } from "@keystone-heroes/env/src";
import { PrismaClient } from "@prisma/client";

export {
  Affixes,
  Covenants,
  EventType,
  PlayableClass,
  Prisma,
  Role,
  SpecName,
} from "@prisma/client";
export type {
  Ability,
  Affix,
  Character,
  Class,
  Conduit,
  Covenant,
  CovenantTrait,
  Dungeon,
  Event,
  Expansion,
  Fight,
  Legendary,
  NPC,
  Player,
  PlayerConduit,
  PlayerCovenantTrait,
  PlayerFight,
  PlayerTalent,
  Pull,
  PullNPC,
  PullZone,
  Region,
  Report,
  Season,
  Server,
  Soulbind,
  Spec,
  Talent,
  WCLAuth,
  Week,
  Zone,
} from "@prisma/client";

// add prisma to the NodeJS global type
type CustomNodeJsGlobal = {
  prisma: PrismaClient;
} & NodeJS.Global;

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

export const prisma = global.prisma || new PrismaClient();

if (!IS_PROD) {
  global.prisma = prisma;
}
