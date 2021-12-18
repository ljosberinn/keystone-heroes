import { EventType } from "@prisma/client";

import { QUAKING } from "../../queries/events/affixes/quaking";
import type { InterruptEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

export const interruptProcessor: Processor<InterruptEvent> = (
  event,
  { sourcePlayerID, targetPlayerID, targetNPCID }
) => {
  const {
    timestamp,
    extraAbilityGameID: interruptedAbilityID,
    abilityGameID,
  } = event;

  if (sourcePlayerID && targetPlayerID && abilityGameID === QUAKING) {
    return {
      timestamp,
      eventType: EventType.Interrupt,
      interruptedAbilityID,
      sourcePlayerID,
      targetPlayerID,
      abilityID: QUAKING,
    };
  }

  if (sourcePlayerID) {
    return {
      timestamp,
      eventType: EventType.Interrupt,
      interruptedAbilityID,
      sourcePlayerID,
      targetNPCID: targetNPCID ? targetNPCID : null,
      abilityID: abilityGameID,
    };
  }

  return null;
};
