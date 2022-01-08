import { EventType } from "@prisma/client";

import { BURSTING } from "../../queries/events/affixes/bursting";
import { EXPLOSIVE } from "../../queries/events/affixes/explosive";
import { GRIEVOUS_WOUND } from "../../queries/events/affixes/grievous";
import { NECROTIC } from "../../queries/events/affixes/necrotic";
import { QUAKING } from "../../queries/events/affixes/quaking";
import { SANGUINE_ICHOR_DAMAGE } from "../../queries/events/affixes/sanguine";
import { SPITEFUL } from "../../queries/events/affixes/spiteful";
import { STORMING } from "../../queries/events/affixes/storming";
import { VOLCANIC } from "../../queries/events/affixes/volcanic";
import { NW, THROW_CLEAVER_CASTER_IDS } from "../../queries/events/dungeons/nw";
import { PF } from "../../queries/events/dungeons/pf";
import type { DamageEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

const environmentalDamageAffixAbilities = new Set([
  BURSTING.damage,
  VOLCANIC,
  STORMING,
  EXPLOSIVE.ability,
  GRIEVOUS_WOUND,
  SANGUINE_ICHOR_DAMAGE,
  QUAKING,
  NECROTIC,
]);

export const damageProcessor: Processor<DamageEvent> = (
  event,
  { targetPlayerID, sourcePlayerID, sourceNPCID, targetNPCID }
) => {
  const {
    amount,
    absorbed = 0,
    overkill = 0,
    timestamp,
    abilityGameID: abilityID,
  } = event;

  const damage = amount + absorbed + overkill;

  if (damage === 0) {
    return null;
  }

  // player taking damage
  if (targetPlayerID) {
    if (environmentalDamageAffixAbilities.has(abilityID)) {
      return {
        timestamp,
        abilityID,
        eventType: EventType.DamageTaken,
        targetPlayerID,
        sourcePlayerID,
        damage,
      };
    }

    // NPC damaging player
    if (sourceNPCID) {
      return {
        timestamp,
        eventType: EventType.DamageTaken,
        damage,
        targetPlayerID,
        sourceNPCID,
        // only relevant on plagueborer or throw cleaver
        abilityID,
      };
    }

    // Spiteful Shades do not necessarily have a resolvable sourceNPCID
    if (abilityID === SPITEFUL.ability) {
      return {
        timestamp,
        eventType: EventType.DamageTaken,
        targetPlayerID,
        sourceNPCID: SPITEFUL.unit,
        abilityID: SPITEFUL.ability,
        damage,
      };
    }
  }

  // Player damaging NPC
  if (sourcePlayerID && targetNPCID) {
    const ignoreTargetNPCID = abilityID === NW.KYRIAN_ORB_DAMAGE;

    return {
      timestamp,
      eventType: EventType.DamageDone,
      damage,
      targetNPCID: ignoreTargetNPCID ? null : targetNPCID,
      sourcePlayerID,
      abilityID,
    };
  }

  if (
    sourceNPCID &&
    (sourceNPCID === PF.RIGGED_PLAGUEBORER ||
      THROW_CLEAVER_CASTER_IDS.has(sourceNPCID))
  ) {
    return {
      timestamp,
      eventType: EventType.DamageDone,
      sourceNPCID,
      damage,
      abilityID,
      targetNPCID,
    };
  }

  // canisters overkill themselves, adding +1 damage...
  if (
    abilityID === PF.CANISTER_VIOLENT_DETONATION &&
    sourceNPCID !== targetNPCID
  ) {
    return {
      timestamp,
      eventType: EventType.DamageDone,
      damage,
      abilityID,
      targetNPCID,
    };
  }

  return null;
};
