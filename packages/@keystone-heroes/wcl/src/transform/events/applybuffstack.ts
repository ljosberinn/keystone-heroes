import { EventType } from "@keystone-heroes/db/types";
import { tormentedAbilityGameIDSet } from "@keystone-heroes/wcl/queries/events/affixes/tormented";

import { SD_LANTERN_BUFF } from "../../queries/events/dungeons/sd";
import type { ApplyBuffStackEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

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

  if (tormentedAbilityGameIDSet.has(event.abilityGameID)) {
    return {
      timestamp: event.timestamp,
      targetPlayerID,
      eventType: EventType.ApplyBuffStack,
      abilityID: event.abilityGameID,
    };
  }

  return null;
};
