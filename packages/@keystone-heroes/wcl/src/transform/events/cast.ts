import { EventType } from "@keystone-heroes/db/types";

import type { CastEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

export const castProcessor: Processor<CastEvent> = (
  event,
  { sourcePlayerID, targetNPCID, targetPlayerID }
) => {
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

  return null;
};
