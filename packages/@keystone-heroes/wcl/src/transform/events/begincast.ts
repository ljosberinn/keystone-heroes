import { EventType } from "@keystone-heroes/db/types";

import { SD_LANTERN_OPENING } from "../../queries/events/dungeons/sd";
import type { BeginCastEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

/**
 * track SD Lantern usage
 */
export const beginCastProcessor: Processor<BeginCastEvent> = (
  event,
  { sourcePlayerID }
) => {
  if (sourcePlayerID && event.abilityGameID === SD_LANTERN_OPENING) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.BeginCast,
      abilityID: event.abilityGameID,
      sourcePlayerID,
    };
  }

  return null;
};
