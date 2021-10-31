import { EventType } from "@keystone-heroes/db/types";

import { BURSTING } from "../../queries/events/affixes/bursting";
import { NECROTIC } from "../../queries/events/affixes/necrotic";
import type { ApplyDebuffStackEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

const relevantDebuffs = new Set<number>([NECROTIC, BURSTING.debuff]);

export const applyDebuffStackprocessor: Processor<ApplyDebuffStackEvent> = (
  event,
  { targetPlayerID }
) => {
  if (targetPlayerID && relevantDebuffs.has(event.abilityGameID)) {
    return {
      timestamp: event.timestamp,
      abilityID: event.abilityGameID,
      stacks: event.stack,
      eventType: EventType.ApplyDebuffStack,
      targetPlayerID,
    };
  }

  return null;
};
