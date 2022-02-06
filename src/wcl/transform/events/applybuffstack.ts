import { EventType } from "@prisma/client";

import {
  tormentedAbilityGameIDSet,
  tormentedBuffsAndDebuffs,
} from "../../queries/events/affixes/tormented";
import { SD_LANTERN_BUFF } from "../../queries/events/dungeons/sd";
import { TRINKETS } from "../../queries/events/trinkets";
import type { ApplyBuffStackEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

const relevantIDs = new Set<number>([
  ...tormentedAbilityGameIDSet,
  SD_LANTERN_BUFF,
  ...tormentedBuffsAndDebuffs
    .filter((deBuff) => deBuff.type.includes("applybuffstack"))
    .map((buff) => buff.id),
  ...Object.values(TRINKETS)
    .filter((ability) => ability.type.includes("applybuffstack"))
    .flatMap((ability) => ability.ids),
]);

export const applyBuffStackProcessor: Processor<ApplyBuffStackEvent> = (
  event,
  { targetPlayerID }
) => {
  if (targetPlayerID && relevantIDs.has(event.abilityGameID)) {
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
