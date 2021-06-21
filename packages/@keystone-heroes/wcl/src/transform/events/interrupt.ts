import { EventType } from "@keystone-heroes/db/types";

import { QUAKING } from "../../queries/events/affixes/quaking";
import type { InterruptEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

/**
 * track any interrupts through quaking including the interrupted ability
 */
export const interruptProcessor: Processor<InterruptEvent> = (
  event,
  { sourcePlayerID, targetPlayerID }
) => {
  if (sourcePlayerID && targetPlayerID && event.abilityGameID === QUAKING) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.Interrupt,
      interruptedAbilityID: event.extraAbilityGameID,
      sourcePlayerID,
      targetPlayerID,
      abilityID: QUAKING,
    };
  }

  return null;
};
