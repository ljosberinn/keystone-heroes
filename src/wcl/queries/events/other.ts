import { remarkableSpellIDs } from "../../../db/data/spellIds";
import { EXPLOSIVE_HEALTH } from "./affixes/explosive";
import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  BeginCastEvent,
  CastEvent,
  DamageEvent,
  DeathEvent,
  InterruptEvent,
  ApplyDebuffEvent,
  RemoveBuffEvent,
} from "./types";
import { createIsSpecificEvent } from "./utils";

export const SHARED_COVENANT_ABILITIES = {
  FLESHCRAFT: 324_631,
  SOULSHAPE: 310_143,
  SUMMON_STEWARD: 324_739,
  DOOR_OF_SHADOWS: 300_728,
} as const;

export const CHEAT_DEATHS = {
  PODTENDER: {
    name: "Podtender",
    type: ["applybuff", "removebuff"],
    id: 320_224,
    cd: 360,
    icon: "inv_farm_herbseed",
  },
  CHEATING_DEATH: {
    name: "Cheating Death",
    id: 45_182,
    cd: 600,
    icon: "ability_rogue_cheatdeath",
    type: ["applybuff", "removebuff"],
  },
  CHEAT_DEATH: {
    name: "Cheated Death",
    id: 45_181,
    cd: 600,
    icon: "ability_rogue_cheatdeath",
    type: ["applydebuff", "removedebuff"],
  },
  DEPLETED_SHELL: {
    name: "DepletedShell",
    type: ["applydebuff", "removedebuff"],
    cd: 600,
    id: 320_227,
    icon: "inv_farm_herbseed",
  },
  // cauterize
  UNCONTAINED_FEL: {
    name: "Uncontained Fel",
    type: ["applydebuff", "removedebuff"],
    cd: 480,
    id: 209_261,
    icon: "inv_glaive_1h_artifactaldorchi_d_06",
  },
};

export const INVISIBILITY = {
  DIMENSIONAL_SHIFTER: 321_422,
  POTION_OF_THE_HIDDEN_SPIRIT: 307_195,
} as const;

export const ENGINEERING_BATTLE_REZ = {
  // Disposable Spectrophasic Reanimator
  SHADOWLANDS: 345_130,
} as const;

export const LEATHERWORKING_DRUMS = {
  // Drums of Deathly Ferocity
  SHADOWLANDS: 309_658,
} as const;

const isLeatherworkingDrumsEvent = createIsSpecificEvent<ApplyBuffEvent>({
  abilityGameID: LEATHERWORKING_DRUMS.SHADOWLANDS,
  type: "applybuff",
});

const isInvisibilityEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: [
    INVISIBILITY.DIMENSIONAL_SHIFTER,
    INVISIBILITY.POTION_OF_THE_HIDDEN_SPIRIT,
  ],
});

const isEngineeringBattleRezEvent = createIsSpecificEvent<CastEvent>({
  type: "cast",
  abilityGameID: ENGINEERING_BATTLE_REZ.SHADOWLANDS,
});

export const cheatDeathFilterExpression = `type in ("applydebuff", "applybuff", "removebuff", "removedebuff") and ability.id in (${Object.values(
  CHEAT_DEATHS
)
  .map((ability) => ability.id)
  .join(", ")})`;

const isCheatDeathEvent = (() => {
  const abilities = Object.values(CHEAT_DEATHS);

  return (
    event: AllTrackedEventTypes
  ): event is ApplyDebuffEvent | ApplyBuffEvent => {
    return abilities.some(
      (ability) =>
        ability.type.includes(event.type) && ability.id === event.abilityGameID
    );
  };
})();

export const filterCheatDeathEvents = (
  allEvents: AllTrackedEventTypes[]
): (ApplyDebuffEvent | ApplyBuffEvent)[] => {
  return allEvents.filter(isCheatDeathEvent);
};
/**
 * @see https://www.warcraftlogs.com/reports/LafTw4CxyAjkVHv6#fight=8&type=auras&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22applybuff%22%20and%20ability.id%20in%20(321422,%20307195)&view=events
 */
export const invisibilityFilterExpression = `type = "applybuff" and ability.id in (${INVISIBILITY.DIMENSIONAL_SHIFTER}, ${INVISIBILITY.POTION_OF_THE_HIDDEN_SPIRIT})`;

/**
 * @see https://www.warcraftlogs.com/reports/fxq2w3aAW49dHhjb#fight=3&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22cast%22%20and%20ability.id%20%3D%20345130&view=events
 */
export const engineeringBattleRezExpression = `type = "cast" and ability.id = ${ENGINEERING_BATTLE_REZ.SHADOWLANDS}`;

/**
 * @see https://www.warcraftlogs.com/reports/Rt7FqrJkhdmvV4j3#fight=3&type=casts&view=events&pins=2%24Off%24%23244F4B%24expression%24ability.id%20%3D%20309658
 */
export const leatherworkingDrumsExpression = `type = "cast" and ability.id = ${LEATHERWORKING_DRUMS.SHADOWLANDS}`;

export const generalCovenantExpression = `type in ("cast", "applydebuff") and ability.id in (${Object.values(
  SHARED_COVENANT_ABILITIES
).join(", ")})`;

const isSharedCovenantAbility = createIsSpecificEvent<CastEvent>({
  abilityGameID: Object.values(SHARED_COVENANT_ABILITIES),
  type: "cast",
});

export const filterCovenantCastEvents = (
  allEvents: AllTrackedEventTypes[]
): CastEvent[] => {
  return allEvents.filter(isSharedCovenantAbility);
};

const RENEWING_MIST = 300_155;
/**
 * @description filters for
 * - _any_ death event
 * - the `Renewing Mist` cast Tirnenn Villagers do upon their "death"
 */
export const deathFilterExpression = `(type = "death" and target.type != "pet") or (ability.id = ${RENEWING_MIST} and type = "begincast")`;
// TODO: feign false doesnt work?
// export const friendliesDeathFilterExpression =
//   'target.type = "player" and type = "death"'; //  and feign = false
export const remarkableSpellFilterExpression = `source.type = "player" and type = "cast" and ability.id in (${[
  ...remarkableSpellIDs,
].join(", ")})`;

export const interruptFilterExpression = `type = "interrupt" and source.type = "player"`;

export const filterProfessionEvents = (
  allEvents: AllTrackedEventTypes[]
): (CastEvent | ApplyBuffEvent)[] => {
  return [
    ...allEvents.filter(isLeatherworkingDrumsEvent),
    ...allEvents.filter(isInvisibilityEvent),
    ...allEvents.filter(isEngineeringBattleRezEvent),
  ];
};

const isPlayerInterruptingNPCEvent = (
  event: AllTrackedEventTypes
): event is InterruptEvent =>
  event.type === "interrupt" &&
  event.sourceID !== event.targetID &&
  // ignore arcane torrent as it doesn't interrupt anymore
  event.abilityGameID !== 32_747;

export const filterPlayerInterruptEvents = (
  allEvents: AllTrackedEventTypes[]
): InterruptEvent[] => {
  return allEvents.filter(isPlayerInterruptingNPCEvent);
};

export const filterEnemyDeathEvents = (
  allEvents: AllTrackedEventTypes[],
  actorIDSet: Set<number>,
  explosiveTargetID: number | null
): (DeathEvent | BeginCastEvent | DamageEvent)[] => {
  return allEvents.filter(
    (event): event is DeathEvent | BeginCastEvent | DamageEvent => {
      if (event.type === "death") {
        return !actorIDSet.has(event.targetID) && event.sourceID === -1;
      }

      if (event.type === "begincast") {
        return event.abilityGameID === RENEWING_MIST;
      }

      if (explosiveTargetID && event.type === "damage") {
        // explosives do not send death events
        // however, `overkill` is set given non melee hits
        // on melee hits, there's no `overkill` but the amount must be higher than 224
        return (
          event.targetID === explosiveTargetID &&
          (event.overkill !== undefined || event.amount >= EXPLOSIVE_HEALTH)
        );
      }

      return false;
    }
  );
};

export const filterPlayerDeathEvents = (
  allEvents: AllTrackedEventTypes[],
  actorIDSet: Set<number>
  // remarkableSpellEvents: CastEvent[]
): DeathEvent[] => {
  // const actorIDSet = new Set(
  // playerMetaInformation.map((dataset) => dataset.actorID)
  // );

  // const hunter = playerMetaInformation.find(
  //   (player) => player.class === PlayableClass.Hunter
  // );

  return allEvents.filter((event): event is DeathEvent => {
    return (
      event.type === "death" &&
      actorIDSet.has(event.targetID) &&
      event.sourceID === -1
    );
  });

  // if (!hunter) {
  //   return deathEvents;
  // }

  // const hunterDeaths = deathEvents.filter(
  //   (event) => event.targetID === hunter.actorID
  // );

  // if (hunterDeaths.length === 0) {
  //   return deathEvents;
  // }

  // return deathEvents.filter((event) => {
  //   const isHunterDeath = hunterDeaths.includes(event);

  //   if (!isHunterDeath) {
  //     return true;
  //   }

  //   const nextHunterCD = remarkableSpellEvents.find((e) => {
  //     return e.sourceID === event.targetID && e.timestamp > event.timestamp;
  //   });

  //   if (!nextHunterCD) {
  //     return true;
  //   }

  //   // assume a hunter feigned if he used a cd within the next 2 seconds
  //   // could alternatively be solved by querying
  //   // hostilityType: Friendlies, dataType: Deaths
  //   // once separately...
  //   return nextHunterCD.timestamp - event.timestamp >= 2000;
  // });
};

export const filterRemarkableSpellEvents = (
  allEvents: AllTrackedEventTypes[]
): CastEvent[] => {
  return allEvents.filter(
    (event): event is CastEvent =>
      event.type === "cast" && remarkableSpellIDs.has(event.abilityGameID)
  );
};

export const TRINKETS = {
  ANNHYLDES_AEGIS: {
    id: 358_712,
    cd: 90,
    name: "Annhylde's Aegis",
    icon: "inv_shield_1h_bastionquest_b_01",
    type: ["cast", "applybuff", "removebuff"],
  },
  BLOOD_SPLATTERED_SCALE_BUFF: {
    id: 329_849,
    cd: 120,
    name: "Blood Barrier",
    icon: "inv_misc_scales_stonyorange",
    type: ["applybuff", "removebuff"],
  },
  BLOOD_SPLATTERED_SCALE_CAST: {
    id: 329_840,
    cd: 120,
    name: "Blood Barrier",
    icon: "inv_misc_scales_stonyorange",
    type: ["cast"],
  },
};

export const trinketsFilterExpression = `type in ("cast", "applybuff", "removebuff") and ability.id in (${Object.values(
  TRINKETS
)
  .map((trinket) => trinket.id)
  .join(", ")})`;

export const isTrinketEvent = (() => {
  const abilities = Object.values(TRINKETS);

  return (
    event: AllTrackedEventTypes
    // eslint-disable-next-line sonarjs/no-identical-functions
  ): event is CastEvent | ApplyBuffEvent | RemoveBuffEvent => {
    return abilities.some(
      (ability) =>
        ability.type.includes(event.type) && ability.id === event.abilityGameID
    );
  };
})();

export const filterTrinkets = (
  allEvents: AllTrackedEventTypes[]
): (CastEvent | ApplyBuffEvent | RemoveBuffEvent)[] => {
  return allEvents.filter(isTrinketEvent);
};
