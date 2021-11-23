import { EventType } from "@prisma/client";

import { QUAKING } from "../../queries/events/affixes/quaking";
import type { InterruptEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

export const interruptProcessor: Processor<InterruptEvent> = (
  event,
  { sourcePlayerID, targetPlayerID, targetNPCID }
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

  if (sourcePlayerID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.Interrupt,
      interruptedAbilityID: event.extraAbilityGameID,
      sourcePlayerID,
      targetNPCID: targetNPCID ? targetNPCID : null,
      abilityID: event.abilityGameID,
    };
  }

  return null;
};
