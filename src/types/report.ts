import type { PlayableClass } from "./classes";

export type WCLReport = {
  fights: WCLFight[];
  lang: string;
  friendlies: Friendly[];
  enemies: Enemy[];
  friendlyPets: FriendlyPet[];
  enemyPets: FriendlyPet[];
  phases: Phase[];
  logVersion: number;
  gameVersion: number;
  title: string;
  owner: string;
  start: number;
  end: number;
  zone: number;
  exportedCharacters: ExportedCharacter[];
};

export type WCLFight = {
  id: number;
  boss: number;
  start_time: number;
  end_time: number;
  name: string;
  zoneID: number;
  zoneName: string;
  zoneDifficulty: number;
  size?: number;
  difficulty?: number;
  kill?: boolean;
  partial?: number;
  medal?: number;
  completionTime?: number;
  keystoneLevel?: number;
  affixes?: number[];
  bossPercentage?: number;
  fightPercentage?: number;
  lastPhaseForPercentageDisplay?: number;
  maps?: number[];
  dungeonPulls?: DungeonPull[];
};

export type Unit = "NPC" | "Pet" | PlayableClass;

export type Friendly = {
  name: string;
  id: number;
  guid: number;
  type: Unit;
  server?: string;
  icon: string;
  fights: FightReference[];
};

type ExportedCharacter = {
  id: number;
  name: string;
  server: string;
  region: string;
};

type Phase = {
  boss: number;
  phases: string[];
};

type FriendlyPet = {
  name: string;
  id: number;
  guid: number;
  type: string;
  icon: string;
  petOwner: number;
  fights: FightReference[];
};

type Enemy = {
  name: string;
  id: number;
  guid: number;
  type: string;
  icon: string;
  fights: FightReference[];
};

type FightReference = {
  id: number;
  instances?: number;
  groups?: number;
};

type DungeonPull = {
  id: number;
  boss: number;
  start_time: number;
  end_time: number;
  name: string;
  kill: boolean;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  x: number;
  y: number;
  maps: number[];
  enemies: number[][];
};