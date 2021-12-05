import { EventType } from "@prisma/client";

import { DOS_URN_OPENING } from "../../queries/events/dungeons/dos";
import { MOTS_OPENING } from "../../queries/events/dungeons/mots";
import { NW } from "../../queries/events/dungeons/nw";
import { SD_LANTERN_OPENING } from "../../queries/events/dungeons/sd";
import { SOA_OPENING } from "../../queries/events/dungeons/soa";
import { TOP_OPENING } from "../../queries/events/dungeons/top";
import type { BeginCastEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

const relevantBeginCastIDs = new Set<number>([
  SD_LANTERN_OPENING,
  NW.HAMMER,
  NW.SPEAR,
  TOP_OPENING,
  MOTS_OPENING,
  DOS_URN_OPENING,
  SOA_OPENING,
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
