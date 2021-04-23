import type { PlayableClass } from "./classes";

export type WCLFightSummary = {
  totalTime: number;
  itemLevel: number;
  logVersion: number;
  gameVersion: number;
  composition: Composition[];
  damageDone: DamageDone[];
  healingDone: HealinggDone[];
  damageTaken: DamageTaken[];
  deathEvents: DeathEvent[];
  playerDetails: PlayerDetails[];
};

type Composition = {
  name: string;
  id: number;
  guid: number;
  type: PlayableClass;
  specs: Spec[];
};

type Spec = {
  spec: string;
  role: "dps" | "healer" | "tank";
};

export type DamageDone = Pick<Composition, "name" | "id" | "guid" | "type"> & {
  total: number;
  icon: string;
};

type HealinggDone = DamageDone;

type DamageTaken = Pick<DamageDone, "name" | "guid" | "total"> & {
  abilityIcon: string;
  type: number;
};

type DeathEvent = Pick<DamageDone, "name" | "id" | "guid" | "type" | "icon"> & {
  deathTime: number;
  ability: Omit<DamageTaken, "total">;
};

type PlayerDetails = {
  tanks: InDepthCharacterInformation[];
  dps: InDepthCharacterInformation[];
  healers: InDepthCharacterInformation[];
};

type InDepthCharacterInformation = {
  name: string;
  id: number;
  guid: number;
  type: PlayableClass;
  server: string;
  icon: string;
  specs: string[];
  minItemLevel: number;
  maxItemLevel: number;
  compatantInfo: CombatantInfo;
};

type CombatantInfo = {
  stats: Stats;
  talents: Talent[];
  artifact: Artifact[];
  gear: Gear[];
  heartOfAzeroth: HeartOfAzeroth[];
  specIDs: number[];
  factionID: number;
  covenantID: number;
  soulbindID: number;
};

type Stats = {
  Speed: Stat;
  Dodge: Stat;
  // eslint-disable-next-line inclusive-language/use-inclusive-words
  Mastery: Stat;
  Stamina: Stat;
  Haste: Stat;
  Leech: Stat;
  Armor: Stat;
  Agility: Stat;
  Crit: Stat;
  "Item Level": Stat;
  Parry: Stat;
  Avoidance: Stat;
  Versatility: Stat;
  Intellect: Stat;
};

type Stat = {
  min: number;
  max: number;
};

type Talent = {
  name: string;
  guid: number;
  type: number;
  abilityIcon: string;
};

type Artifact = {
  name: string;
  guid: number;
  type: number;
  abilityIcon: string;
  total: number;
};

type Gear = {
  id: number;
  slot: number;
  quality: number;
  icon: string;
  name?: string;
  itemLevel: number;
  bonusIDs?: number[];
  gems?: Gem[];
  permanentEnchant?: number;
  permanentEnchantName?: string;
  onUseEnchant?: number;
  onUseEnchantName?: string;
  effectID?: number;
  effectIcon?: string;
  effectName?: string;
  temporaryEnchant?: number;
  temporaryEnchantName?: string;
};

type Gem = {
  id: number;
  itemLevel: number;
  icon: string;
};

type HeartOfAzeroth = {
  name: string;
  guid: number;
  type: number;
  abilityIcon: string;
  total: number;
};
