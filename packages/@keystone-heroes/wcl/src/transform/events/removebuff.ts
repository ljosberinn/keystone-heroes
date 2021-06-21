import { EventType } from "@keystone-heroes/db/types";

import { SD_LANTERN_BUFF } from "../../queries/events/dungeons/sd";
import type { RemoveBuffEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

/**
 * track SD Lantern usage
 */
export const removeBuffProcessor: Processor<RemoveBuffEvent> = (
  event,
  { targetPlayerID }
) => {
  if (event.abilityGameID === SD_LANTERN_BUFF && targetPlayerID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.RemoveBuff,
      abilityID: event.abilityGameID,
      targetPlayerID,
    };
  }

  return null;
};
