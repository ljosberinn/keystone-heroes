export type BaseEvent<T extends Record<string, unknown>> = T & {
  timestamp: number;
  // pin: "0" but irrelevant
};

type EncounterStartEvent = BaseEvent<{
  type: "encounterstart";
  encounterID: number;
  name: string;
  difficulty: number;
  size: number;
  level: number;
  affixes: number[];
}>;

type CombatantInfoEvent = BaseEvent<{
  type: "combatantinfo";
  sourceID: number;
  gear: [];
  auras: {
    source: number;
    ability: number;
    stacks: number;
    icon: string;
    name?: string;
  }[];
  expansion: string;
  faction: number;
  specID: number;
  covenantID: number;
  soulbindID: number;
  strength: number;
  agility: number;
  stamina: number;
  intellect: number;
  dodge: number;
  parry: number;
  block: number;
  armor: number;
  critMelee: number;
  critRanged: number;
  critSpell: number;
  speed: number;
  leech: number;
  hasteMelee: number;
  hasteRanged: number;
  hasteSpell: number;
  avoidance: number;
  mastery: number;
  versatilityDamageDone: number;
  versatilityHealingDone: number;
  versatilityDamageReduction: number;
  talents: { id: number; icon: string }[];
  pvpTalents: { id: number; icon: string }[];
  artifact: { traitID: number; rank: number; spellID: number; icon: string }[];
  heartOfAzeroth: {
    traitID: number;
    rank: number;
    spellID: number;
    icon: string;
  }[];
}>;

export type ApplyDebuffEvent = BaseEvent<{
  type: "applydebuff";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  targetInstance?: number;
  targetMarker?: number;
}>;

export type ApplyDebuffStackEvent = BaseEvent<{
  type: "applydebuffstack";
  stack: number;
  abilityGameID: number;
}>;

export type ApplyBuffEvent = BaseEvent<{
  type: "applybuff";
  sourceID: number;
  sourceInstance?: number;
  targetID: number;
  targetInstance?: number;
  abilityGameID: number;
}>;

export type RemoveBuffEvent = BaseEvent<{
  type: "removebuff";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  sourceMarker: number;
  targetMarker: number;
}>;

export type CastEvent = BaseEvent<{
  type: "cast";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  sourceMarker?: number;
}>;

export type DamageEvent = BaseEvent<{
  type: "damage";
  sourceID: number;
  targetID: number;
  targetInstance?: number;
  abilityGameID: number;
  hitType: number;
  amount: number;
  mitigated?: number;
  unmitigatedAmount?: number;
  tick?: boolean;
  sourceMarker?: number;
  absorbed?: number;
  overkill?: number;
  buffs?: string;
}>;

export type BeginCastEvent = BaseEvent<{
  type: "begincast";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
}>;

export type RemoveDebuffEvent = BaseEvent<{
  type: "removedebuff";
  sourceID: number;
  targetID: number;
  targetInstance: number;
  abilityGameID: number;
}>;

type SummonEvent = BaseEvent<{
  type: "summon";
  sourceID: number;
  targetID: number;
  targetInstance: number;
  abilityGameID: number;
}>;

type PhaseStartEvent = BaseEvent<{
  type: "phasestart";
  encounterID: number;
  name: string;
  difficulty: number;
  size: number;
}>;

export type HealEvent = BaseEvent<{
  type: "heal";
  sourceID: number;
  targetID: number;
  targetInstance?: number;
  abilityGameID: number;
  hitType: number;
  amount: number;
  sourceMarker?: number;
  targetMarker?: number;
  tick?: boolean;
  overheal?: number;
  absorbed?: number;
}>;

type EnergizeEvent = BaseEvent<{
  type: "energize";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  resourceChange: number;
  resourceChangeType: number;
  otherResourceChange: number;
  waste: number;
  sourceMarker?: number;
  targetMarker?: number;
}>;

export type ApplyBuffStackEvent = BaseEvent<{
  type: "applybuffstack";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  stack: number;
  sourceMarker?: number;
  targetMarker?: number;
}>;

export type InterruptEvent = BaseEvent<{
  type: "interrupt";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  extraAbilityGameID: number;
  sourceMarker?: number;
}>;

export type AbsorbEvent = BaseEvent<{
  type: "absorbed";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  attackerID: number;
  amount: number;
  extraAbilityGameID: number;
  sourceMarker: number;
  targetMarker: number;
}>;

export type RefreshDebuffEvent = BaseEvent<{
  type: "refreshdebuff";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
}>;

type DispelEvent = BaseEvent<{
  type: "dispel";
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  extraAbilityGameID: number;
  isBuff: boolean;
  sourceMarker: number;
  targetMarker: number;
}>;

export type DeathEvent = BaseEvent<{
  type: "death";
  sourceID: number;
  targetID: number;
  targetInstance?: number;
  abilityGameID: number;
  // only present if NPC kills player
  killerID?: number;
  killerInstance?: number;
  killingAbilityGameID?: number;
  targetMarker?: number;
}>;

export type AnyEvent =
  | DeathEvent
  | DispelEvent
  | RefreshDebuffEvent
  | AbsorbEvent
  | InterruptEvent
  | ApplyBuffStackEvent
  | EnergizeEvent
  | HealEvent
  | PhaseStartEvent
  | SummonEvent
  | RemoveDebuffEvent
  | BeginCastEvent
  | DamageEvent
  | CastEvent
  | RemoveBuffEvent
  | ApplyBuffEvent
  | ApplyDebuffStackEvent
  | ApplyDebuffEvent
  | CombatantInfoEvent
  | EncounterStartEvent;

export type AllTrackedEventTypes = (
  | CastEvent
  | DeathEvent
  | AbsorbEvent
  | DamageEvent
  | HealEvent
  | InterruptEvent
  | BeginCastEvent
  | ApplyBuffEvent
  | ApplyDebuffEvent
  | ApplyDebuffStackEvent
  | RemoveBuffEvent
  | ApplyBuffStackEvent
)[];
