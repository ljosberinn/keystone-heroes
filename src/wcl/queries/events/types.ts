export type BaseEvent<T extends Record<string, unknown>> = T & {
  timestamp: number;
  sourceID: number;
  targetID: number;
  sourceInstance?: number;
  targetInstance?: number;
  sourceMarker?: number;
  targetMarker?: number;
  abilityGameID: number;
  // pin: "0" but irrelevant
};

type EncounterStartEvent = Omit<
  BaseEvent<{
    type: "encounterstart";
    encounterID: number;
    name: string;
    difficulty: number;
    size: number;
    level: number;
    affixes: number[];
  }>,
  | "sourceID"
  | "targetID"
  | "sourceInstance"
  | "targetInstance"
  | "abilityGameID"
>;

type CombatantInfoEvent = Omit<
  BaseEvent<{
    type: "combatantinfo";
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
    artifact: {
      traitID: number;
      rank: number;
      spellID: number;
      icon: string;
    }[];
    heartOfAzeroth: {
      traitID: number;
      rank: number;
      spellID: number;
      icon: string;
    }[];
  }>,
  "targetID" | "sourceInstance" | "targetInstance" | "abilityGameID"
>;

export type ApplyDebuffEvent = BaseEvent<{
  type: "applydebuff";
}>;

export type ApplyDebuffStackEvent = BaseEvent<{
  type: "applydebuffstack";
  stack: number;
}>;

export type ApplyBuffEvent = BaseEvent<{
  type: "applybuff";
}>;

export type RemoveBuffEvent = BaseEvent<{
  type: "removebuff";
}>;

export type CastEvent = BaseEvent<{
  type: "cast";
}>;

export type DungeonEncounterEnd = {
  timestamp: number;
  type: "dungeonencounterend";
  kill: boolean;
  encounterID: number;
  size: number;
  difficulty: number;
  name: string;
};

export type DungeonEnd = {
  /**
   * time
   */
  completion: number;
  difficulty: number;
  /**
   * dungeonID prefixed with 1
   */
  encounterID: number;
  kill: boolean;
  loggerTotalRating: number;
  /**
   * key level
   */
  medal: number;
  name: "";
  rating: number;
  size: number;
  timestamp: number;
  type: "dungeonend";
};

export type DamageEvent = BaseEvent<{
  type: "damage";
  hitType: number;
  amount: number;
  mitigated?: number;
  unmitigatedAmount?: number;
  tick?: boolean;
  absorbed?: number;
  overkill?: number;
  buffs?: string;
}>;

export type BeginCastEvent = BaseEvent<{
  type: "begincast";
}>;

export type RemoveDebuffEvent = BaseEvent<{
  type: "removedebuff";
}>;

type SummonEvent = BaseEvent<{
  type: "summon";
}>;

type PhaseStartEvent = Omit<
  BaseEvent<{
    type: "phasestart";
    encounterID: number;
    name: string;
    difficulty: number;
    size: number;
  }>,
  | "sourceID"
  | "targetID"
  | "targetInstance"
  | "sourceInstance"
  | "abilityGameID"
>;

export type HealEvent = BaseEvent<{
  type: "heal";
  hitType: number;
  amount: number;
  tick?: boolean;
  overheal?: number;
  absorbed?: number;
}>;

type ResourceChangeEvent = BaseEvent<{
  type: "resourcechange";
  resourceChange: number;
  resourceChangeType: number;
  otherResourceChange: number;
  waste: number;
}>;

export type ApplyBuffStackEvent = BaseEvent<{
  type: "applybuffstack";
  stack: number;
}>;

export type InterruptEvent = BaseEvent<{
  type: "interrupt";
  extraAbilityGameID: number;
}>;

export type AbsorbEvent = BaseEvent<{
  type: "absorbed";
  attackerID: number;
  amount: number;
  extraAbilityGameID: number;
}>;

export type RefreshDebuffEvent = BaseEvent<{
  type: "refreshdebuff";
}>;

type DispelEvent = BaseEvent<{
  type: "dispel";
  extraAbilityGameID: number;
  isBuff: boolean;
}>;

export type DeathEvent = BaseEvent<{
  type: "death";
  // only present if NPC kills player
  killerID?: number;
  killerInstance?: number;
  killingAbilityGameID?: number;
}>;

export type AnyEvent =
  | DeathEvent
  | DispelEvent
  | RefreshDebuffEvent
  | AbsorbEvent
  | InterruptEvent
  | ApplyBuffStackEvent
  | ResourceChangeEvent
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
  | EncounterStartEvent
  | DungeonEncounterEnd
  | DungeonEnd;
export type AllTrackedEventTypes =
  | CastEvent
  | ApplyDebuffStackEvent
  | ApplyDebuffEvent
  | ApplyBuffEvent
  | RemoveBuffEvent
  | DamageEvent
  | BeginCastEvent
  | HealEvent
  | ApplyBuffStackEvent
  | InterruptEvent
  | DeathEvent
  | RemoveDebuffEvent;
