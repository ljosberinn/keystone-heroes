import { EventType } from "@keystone-heroes/db/types";

import { DOS_URN } from "../../queries/events/dungeons/dos";
import { SOA_SPEAR } from "../../queries/events/dungeons/soa";
import type { ApplyDebuffEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

const ids = new Set([SOA_SPEAR, DOS_URN]);

/**
 * track SoA Spear & DOS Urn
 */
export const applyDebuffProcessor: Processor<ApplyDebuffEvent> = (event) => {
  if (ids.has(event.abilityGameID)) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.ApplyDebuff,
      abilityID: event.abilityGameID,
    };
  }

  return null;
};
