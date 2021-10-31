import { EventType } from "@keystone-heroes/db/types";

import { BURSTING } from "../../queries/events/affixes/bursting";
import { EXPLOSIVE } from "../../queries/events/affixes/explosive";
import { GRIEVOUS_WOUND } from "../../queries/events/affixes/grievous";
import { NECROTIC } from "../../queries/events/affixes/necrotic";
import { QUAKING } from "../../queries/events/affixes/quaking";
import { SANGUINE_ICHOR_DAMAGE } from "../../queries/events/affixes/sanguine";
import { SPITEFUL } from "../../queries/events/affixes/spiteful";
import { STORMING } from "../../queries/events/affixes/storming";
import { VOLCANIC } from "../../queries/events/affixes/volcanic";
import { NW } from "../../queries/events/dungeons/nw";
import { PF } from "../../queries/events/dungeons/pf";
import type { DamageEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

const environmentalDamageAffixAbilities = new Set([
  BURSTING,
  VOLCANIC,
  STORMING,
  EXPLOSIVE.ability,
  GRIEVOUS_WOUND,
  SANGUINE_ICHOR_DAMAGE,
  QUAKING,
  NECROTIC,
]);

/**
 * track any damage taken from
 * - affixes
 *
 * track any player damage done to
 * - explosives (pre-filtered to only contain lasthits)
 */
export const damageProcessor: Processor<DamageEvent> = (
  event,
  { targetPlayerID, sourcePlayerID, sourceNPCID, targetNPCID }
) => {
  if (event.amount === 0) {
    return null;
  }

  // player taking damage
  if (targetPlayerID) {
    if (
      environmentalDamageAffixAbilities.has(event.abilityGameID) &&
      event.unmitigatedAmount &&
      event.mitigated
    ) {
      return {
        timestamp: event.timestamp,
        abilityID: event.abilityGameID,
        eventType: EventType.DamageTaken,
        targetPlayerID,
        sourcePlayerID,
        damage: event.unmitigatedAmount - event.mitigated,
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
    if (
      event.abilityGameID === SPITEFUL.ability &&
      event.unmitigatedAmount &&
      event.mitigated
    ) {
      return {
        timestamp: event.timestamp,
        eventType: EventType.DamageTaken,
        targetPlayerID,
        sourceNPCID: SPITEFUL.unit,
        abilityID: SPITEFUL.ability,
        damage: event.unmitigatedAmount - event.mitigated,
      };
    }
  }

  // Player damaging NPC
  if (sourcePlayerID && targetNPCID) {
    const ignoreTargetNPCID = event.abilityGameID === NW.KYRIAN_ORB_DAMAGE;

    return {
      timestamp: event.timestamp,
      eventType: EventType.DamageDone,
      damage: event.amount,
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
      targetNPCID,
    };
  }

  // canisters overkill themselves, adding +1 damage...
  if (
    event.abilityGameID === PF.CANISTER_VIOLENT_DETONATION &&
    sourceNPCID !== targetNPCID
  ) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.DamageDone,
      damage: event.amount,
      abilityID: event.abilityGameID,
      targetNPCID,
    };
  }

  return null;
};
