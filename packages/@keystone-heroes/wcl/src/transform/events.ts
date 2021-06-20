import { EventType } from "@keystone-heroes/db/types";
import type { Prisma, Pull, PullZone } from "@keystone-heroes/db/types";
import type { DeepNonNullable } from "ts-essentials";

import { INVISIBILITY } from "../queries";
import { BOLSTERING } from "../queries/events/affixes/bolstering";
import { BURSTING } from "../queries/events/affixes/bursting";
import { EXPLOSIVE } from "../queries/events/affixes/explosive";
import { GRIEVOUS_WOUND } from "../queries/events/affixes/grievous";
import { NECROTIC } from "../queries/events/affixes/necrotic";
import { QUAKING } from "../queries/events/affixes/quaking";
import {
  SANGUINE_ICHOR_DAMAGE,
  SANGUINE_ICHOR_HEALING,
} from "../queries/events/affixes/sanguine";
import { SPITEFUL } from "../queries/events/affixes/spiteful";
import { STORMING } from "../queries/events/affixes/storming";
import { VOLCANIC } from "../queries/events/affixes/volcanic";
import { DOS_URN } from "../queries/events/dungeons/dos";
import { NW } from "../queries/events/dungeons/nw";
import { PF } from "../queries/events/dungeons/pf";
import {
  SD_LANTERN_BUFF,
  SD_LANTERN_OPENING,
} from "../queries/events/dungeons/sd";
import { SOA_SPEAR } from "../queries/events/dungeons/soa";
import { TOP_BANNER_AURA } from "../queries/events/dungeons/top";
import type {
  AllTrackedEventTypes,
  AnyEvent,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  ApplyDebuffEvent,
  ApplyDebuffStackEvent,
  BeginCastEvent,
  CastEvent,
  DamageEvent,
  DeathEvent,
  HealEvent,
  InterruptEvent,
  RemoveBuffEvent,
} from "../queries/events/types";
import type { ReportMapBoundingBox, ReportDungeonPullNpc } from "../types";

type Processor<T extends AnyEvent, AdditionalParams = Record<string, null>> = (
  event: T,
  params: {
    sourcePlayerID: number | null;
    targetPlayerID: number | null;
    sourceNPCID: number | null;
    targetNPCID: number | null;
  } & AdditionalParams
) => Prisma.EventCreateManyPullInput | null;

const applyDebuffStackprocessor: Processor<ApplyDebuffStackEvent> = (
  event,
  { targetPlayerID }
): Prisma.EventCreateManyPullInput | null => {
  if (targetPlayerID && event.abilityGameID === NECROTIC) {
    return {
      timestamp: event.timestamp,
      abilityID: NECROTIC,
      stacks: event.stack,
      eventType: EventType.ApplyDebuffStack,
    };
  }

  console.error(event, `unknown "applydebuff" event`);

  return null;
};

/**
 * track invis potion, bolstering, ToP and PF buffs
 */
const applyBuffProcessor: Processor<ApplyBuffEvent & { stacks?: number }> = (
  event,
  { sourcePlayerID, targetPlayerID, targetNPCID }
): Prisma.EventCreateManyPullInput | null => {
  if (sourcePlayerID && targetPlayerID) {
    if (
      sourcePlayerID === targetPlayerID &&
      (event.abilityGameID === INVISIBILITY.POTION_OF_THE_HIDDEN_SPIRIT ||
        event.abilityGameID === INVISIBILITY.DIMENSIONAL_SHIFTER)
    ) {
      return {
        timestamp: event.timestamp,
        sourcePlayerID,
        abilityID: event.abilityGameID,
        eventType: EventType.ApplyBuff,
      };
    }

    if (
      event.abilityGameID === TOP_BANNER_AURA ||
      event.abilityGameID === PF.GREEN_BUFF.aura ||
      event.abilityGameID === PF.RED_BUFF.aura ||
      event.abilityGameID === PF.PURPLE_BUFF.aura
    ) {
      return {
        timestamp: event.timestamp,
        eventType: EventType.ApplyBuff,
        abilityID: event.abilityGameID,
        sourcePlayerID,
        targetPlayerID,
      };
    }
  }

  if (event.abilityGameID === BOLSTERING && targetNPCID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.ApplyBuff,
      stacks: event.stacks ?? null,
      abilityID: BOLSTERING,
      targetNPCID,
      targetNPCInstance: event.targetInstance ?? null,
    };
  }

  if (event.abilityGameID === SD_LANTERN_BUFF && targetPlayerID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.ApplyBuff,
      targetPlayerID,
      abilityID: event.abilityGameID,
    };
  }

  console.error(event, `unknown "applybuff" event`);

  return null;
};

/**
 * track SD Lantern usage
 */
const applyBuffStackProcessor: Processor<ApplyBuffStackEvent> = (
  event,
  { targetPlayerID }
): Prisma.EventCreateManyPullInput | null => {
  if (targetPlayerID && event.abilityGameID === SD_LANTERN_BUFF) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.ApplyBuffStack,
      abilityID: event.abilityGameID,
      targetPlayerID,
      stacks: event.stack,
    };
  }

  console.error(event, `unknown "applybuffstack" event`);

  return null;
};

/**
 * track SoA Spear & DOS Urn
 */
const applyDebuffProcessor: Processor<ApplyDebuffEvent> = (
  event
): Prisma.EventCreateManyPullInput | null => {
  if (event.abilityGameID === SOA_SPEAR || event.abilityGameID === DOS_URN) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.ApplyDebuff,
      abilityID: event.abilityGameID,
    };
  }

  console.error(event, `unknown "applydebuff" event`);

  return null;
};

/**
 * track SD Lantern usage
 */
const beginCastProcessor: Processor<BeginCastEvent> = (
  event,
  { sourcePlayerID }
): Prisma.EventCreateManyPullInput | null => {
  if (sourcePlayerID && event.abilityGameID === SD_LANTERN_OPENING) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.BeginCast,
      abilityID: event.abilityGameID,
      sourcePlayerID,
    };
  }

  console.error(event, `unknown "begincast" event`);

  return null;
};

/**
 * track any cast from players
 * - pre-filtered to only contain 1min+ cooldowns
 * - dungeon-specific abilities (HoA Gargoyles)
 */
const castProcessor: Processor<CastEvent> = (
  event,
  { sourcePlayerID, targetNPCID, targetPlayerID }
): Prisma.EventCreateManyPullInput | null => {
  if (sourcePlayerID) {
    return {
      timestamp: event.timestamp,
      abilityID: event.abilityGameID,
      eventType: EventType.Cast,
      targetNPCID,
      targetPlayerID,
      sourcePlayerID,
    };
  }

  console.error(event, `unknown "cast" event`);

  return null;
};

const isEnvironmentalDamageAffixAbilityID = (id: number) =>
  id === VOLCANIC ||
  id === STORMING ||
  id === EXPLOSIVE.ability ||
  id === GRIEVOUS_WOUND ||
  id === SANGUINE_ICHOR_DAMAGE ||
  id === BURSTING ||
  id === QUAKING ||
  id === NECROTIC;

/**
 * track any damage taken from
 * - affixes
 *
 * track any player damage done to
 * - explosives (pre-filtered to only contain lasthits)
 */
const damageProcessor: Processor<DamageEvent> = (
  event,
  { targetPlayerID, sourcePlayerID, sourceNPCID, targetNPCID }
): Prisma.EventCreateManyPullInput | null => {
  if (event.amount === 0) {
    return null;
  }

  // player taking damage
  if (targetPlayerID) {
    if (isEnvironmentalDamageAffixAbilityID(event.abilityGameID)) {
      return {
        timestamp: event.timestamp,
        abilityID: event.abilityGameID,
        eventType: EventType.DamageTaken,
        damage: event.amount,
        targetPlayerID,
        sourcePlayerID,
      };
    }

    // NPC damaging player
    if (sourceNPCID) {
      return {
        timestamp: event.timestamp,
        eventType: EventType.DamageTaken,
        damage: event.amount,
        targetPlayerID,
        sourceNPCID,
        // only relevant on plagueborer
        abilityID: event.abilityGameID,
      };
    }

    // Spiteful Shades do not necessarily have a resolvable sourceNPCID
    if (event.abilityGameID === SPITEFUL.ability) {
      return {
        timestamp: event.timestamp,
        eventType: EventType.DamageTaken,
        targetPlayerID,
        sourceNPCID: SPITEFUL.unit,
        abilityID: SPITEFUL.ability,
        damage: event.amount,
      };
    }
  }

  // Player damaging NPC
  if (sourcePlayerID && targetNPCID) {
    const ignoreTargetNPCID = event.abilityGameID === NW.KYRIAN_ORB_DAMAGE;

    return {
      timestamp: event.timestamp,
      eventType: EventType.DamageDone,
      // damage vs Explosives is irrelevant
      damage: targetNPCID === EXPLOSIVE.unit ? null : event.amount,
      targetNPCID: ignoreTargetNPCID ? null : targetNPCID,
      sourcePlayerID,
      abilityID: event.abilityGameID,
    };
  }

  if (sourceNPCID === PF.RIGGED_PLAGUEBORER) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.DamageDone,
      sourceNPCID,
      damage: event.amount,
      abilityID: event.abilityGameID,
    };
  }

  console.error(event, `unknown "damage" event`, {
    targetPlayerID,
    sourcePlayerID,
    sourceNPCID,
    targetNPCID,
  });

  return null;
};

/**
 * track deaths:
 * - all player deaths
 * - PF slimes
 */
const deathProcessor: Processor<DeathEvent, { pull: PersistedDungeonPull }> = (
  event,
  { targetNPCID, targetPlayerID, pull }
): Prisma.EventCreateManyPullInput | null => {
  const sourceNPCID = event.killerID
    ? pull.enemyNPCs.find((npc) => npc.id === event.killerID)?.gameID ?? null
    : null;

  // player death
  if (targetPlayerID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.Death,
      sourceNPCInstance: event.killerInstance ?? null,
      targetPlayerID,
      sourceNPCID,
    };
  }

  // PF slimes
  return {
    timestamp: event.timestamp,
    eventType: EventType.Death,
    targetNPCInstance: event.targetInstance ?? null,
    targetNPCID,
  };
};

/**
 * track any heal:
 * - sanguine
 * - kyrian orb
 */
const healProcessor: Processor<HealEvent> = (
  event,
  { targetNPCID, targetPlayerID, sourcePlayerID }
): Prisma.EventCreateManyPullInput | null => {
  if (event.amount === 0) {
    return null;
  }

  if (
    event.abilityGameID === NW.KYRIAN_ORB_HEAL &&
    sourcePlayerID &&
    targetPlayerID
  ) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.HealingDone,
      abilityID: NW.KYRIAN_ORB_HEAL,
      healingDone: event.amount,
      sourcePlayerID,
      targetPlayerID,
    };
  }

  if (event.abilityGameID === SANGUINE_ICHOR_HEALING && targetNPCID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.HealingDone,
      abilityID: SANGUINE_ICHOR_HEALING,
      healingDone: event.amount,
      targetNPCID,
    };
  }

  console.error(event, `unknown "heal" event`);

  return null;
};

/**
 * track any interrupts through quaking including the interrupted ability
 */
const interruptProcessor: Processor<InterruptEvent> = (
  event,
  { sourcePlayerID, targetPlayerID }
): Prisma.EventCreateManyPullInput | null => {
  if (sourcePlayerID && targetPlayerID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.Interrupt,
      interruptedAbilityID: event.extraAbilityGameID,
      sourcePlayerID,
      targetPlayerID,
      abilityID: QUAKING,
    };
  }

  console.error(event, `unknown "interrupt" event`);

  return null;
};

/**
 * track SD Lantern usage
 */
const removeBuffProcessor: Processor<RemoveBuffEvent> = (
  event,
  { targetPlayerID }
): Prisma.EventCreateManyPullInput | null => {
  if (event.abilityGameID === SD_LANTERN_BUFF && targetPlayerID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.RemoveBuff,
      abilityID: event.abilityGameID,
      targetPlayerID,
    };
  }

  console.error(event, `unknown "removebuff" event`);

  return null;
};

export type PersistedDungeonPull = Pick<
  Pull,
  "id" | "x" | "y" | "startTime" | "endTime" | "isWipe"
> & {
  maps: PullZone["zoneID"][];
  boundingBox: ReportMapBoundingBox;
  enemyNPCs: Pick<
    Required<DeepNonNullable<ReportDungeonPullNpc>>,
    "gameID" | "minimumInstanceID" | "maximumInstanceID" | "id"
  >[];
};

const getProcessorParams = (
  event: AllTrackedEventTypes[number],
  pull: PersistedDungeonPull,
  actorPlayerMap: Map<number, number>,
  allEnemyNPCs: PersistedDungeonPull["enemyNPCs"]
): Parameters<Processor<AnyEvent>>[1] => {
  const params: Parameters<Processor<AllTrackedEventTypes[number]>>[1] = {
    sourceNPCID: null,
    sourcePlayerID: null,
    targetNPCID: null,
    targetPlayerID: null,
  };

  if ("sourceID" in event) {
    params.sourcePlayerID = actorPlayerMap.get(event.sourceID) ?? null;
    params.sourceNPCID =
      pull.enemyNPCs.find((npc) => npc.id === event.sourceID)?.gameID ?? null;
  }

  if ("targetID" in event) {
    params.targetPlayerID = actorPlayerMap.get(event.targetID) ?? null;
    params.targetNPCID =
      allEnemyNPCs.find((npc) => npc.id === event.targetID)?.gameID ?? null;
  }

  return params;
};

export const processEvents = (
  pull: PersistedDungeonPull,
  events: AllTrackedEventTypes,
  actorPlayerMap: Map<number, number>,
  allEnemyNPCs: PersistedDungeonPull["enemyNPCs"]
): Omit<Prisma.EventCreateManyInput, "pullID">[] => {
  return events
    .map<Omit<Prisma.EventCreateManyInput, "pullID"> | null>((event) => {
      const params = getProcessorParams(
        event,
        pull,
        actorPlayerMap,
        allEnemyNPCs
      );

      switch (event.type) {
        case "applybuff":
          return applyBuffProcessor(event, params);
        case "applydebuffstack":
          return applyDebuffStackprocessor(event, params);
        case "applybuffstack":
          return applyBuffStackProcessor(event, params);
        case "applydebuff":
          return applyDebuffProcessor(event, params);
        case "begincast":
          return beginCastProcessor(event, params);
        case "cast":
          return castProcessor(event, params);
        case "damage":
          return damageProcessor(event, params);
        case "death":
          return deathProcessor(event, { ...params, pull });
        case "heal":
          return healProcessor(event, params);
        case "interrupt":
          return interruptProcessor(event, params);
        case "removebuff":
          return removeBuffProcessor(event, params);
        default:
          return null;
      }
    })
    .filter(
      (dataset): dataset is Omit<Prisma.EventCreateManyInput, "pullID"> =>
        dataset !== null
    );
};
