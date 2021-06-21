import { EventType } from "@keystone-heroes/db/types";

import { NECROTIC } from "../../queries/events/affixes/necrotic";
import type { ApplyDebuffStackEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

export const applyDebuffStackprocessor: Processor<ApplyDebuffStackEvent> = (
  event,
  { targetPlayerID }
) => {
  if (targetPlayerID && event.abilityGameID === NECROTIC) {
    return {
      timestamp: event.timestamp,
      abilityID: NECROTIC,
      stacks: event.stack,
      eventType: EventType.ApplyDebuffStack,
    };
  }

  return null;
};
