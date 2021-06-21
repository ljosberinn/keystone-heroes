import { EventType } from "@keystone-heroes/db/types";

import { SD_LANTERN_BUFF } from "../../queries/events/dungeons/sd";
import type { ApplyBuffStackEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

/**
 * track SD Lantern usage
 */
export const applyBuffStackProcessor: Processor<ApplyBuffStackEvent> = (
  event,
  { targetPlayerID }
) => {
  if (targetPlayerID && event.abilityGameID === SD_LANTERN_BUFF) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.ApplyBuffStack,
      abilityID: event.abilityGameID,
      targetPlayerID,
      stacks: event.stack,
    };
  }

  return null;
};
