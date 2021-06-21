import { EventType } from "@keystone-heroes/db/types";

import { SANGUINE_ICHOR_HEALING } from "../../queries/events/affixes/sanguine";
import { NW } from "../../queries/events/dungeons/nw";
import type { HealEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

/**
 * track any heal:
 * - sanguine
 * - kyrian orb
 */
export const healProcessor: Processor<HealEvent> = (
  event,
  { targetNPCID, targetPlayerID, sourcePlayerID }
) => {
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

  return null;
};
