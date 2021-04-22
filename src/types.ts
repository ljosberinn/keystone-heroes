export type WCLFightResponse = {
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

export type PlayableClass =
  | "DemonHunter"
  | "Mage"
  | "Shaman"
  | "Rogue"
  | "Priest"
  | "Warrior"
  | "Druid"
  | "DeathKnight"
  | "Monk"
  | "Paladin"
  | "Warlock"
  | "Hunter";

export type Unit = "NPC" | "Pet" | PlayableClass;

type Friendly = {
  name: string;
  id: number;
  guid: number;
  type: Unit;
  server?: string;
  icon: string;
  fights: FightReference[];
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

export type UIFightsResponse = Pick<
  WCLFightResponse,
  "start" | "end" | "title"
> & {
  code: string;
  fights: InitialFightInformation[];
};

type KeystoneFight = Required<
  Pick<
    WCLFight,
    | "id"
    | "start_time"
    | "end_time"
    | "dungeonPulls"
    | "affixes"
    | "keystoneLevel"
    | "boss"
  >
>;

export type CompletedKeystoneFight = KeystoneFight & {
  kill: true;
  completionTime: number;
};
export type FailedKeystoneFight = KeystoneFight & {
  kill: false;
  completionTime: never;
};

export type InitialFightInformation = Omit<
  CompletedKeystoneFight | FailedKeystoneFight,
  "dungeonPulls"
> & {
  composition: Friendly["icon"][];
};
