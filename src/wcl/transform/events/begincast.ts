import { EventType } from "@prisma/client";

import { NW } from "../../queries/events/dungeons/nw";
import { SD_LANTERN_OPENING } from "../../queries/events/dungeons/sd";
import type { BeginCastEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

const relevantBeginCastIDs = new Set<number>([
  SD_LANTERN_OPENING,
  NW.HAMMER,
  NW.SPEAR,
]);

export const beginCastProcessor: Processor<BeginCastEvent> = (
  event,
  { sourcePlayerID }
) => {
  if (sourcePlayerID && relevantBeginCastIDs.has(event.abilityGameID)) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.BeginCast,
      abilityID: event.abilityGameID,
      sourcePlayerID,
    };
  }

  return null;
};
