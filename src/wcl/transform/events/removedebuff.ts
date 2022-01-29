import { EventType } from "@prisma/client";

import { tormentedBuffsAndDebuffs } from "../../queries/events/affixes/tormented";
import { CHEAT_DEATHS } from "../../queries/events/cheathDeath";
import { TRINKETS } from "../../queries/events/trinkets";
import type { RemoveDebuffEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

const relevantBuffs = new Set<number>([
  ...tormentedBuffsAndDebuffs
    .filter((deBuff) => deBuff.type.includes("removedebuff"))
    .map((buff) => buff.id),
  ...Object.values(CHEAT_DEATHS)
    .filter((ability) => ability.type.includes("removedebuff"))
    .map((ability) => ability.id),
  ...Object.values(TRINKETS)
    .filter((ability) => ability.type.includes("removedebuff"))
    .flatMap((ability) => ability.ids),
]);

export const removeDebuffProcessor: Processor<RemoveDebuffEvent> = (
  event,
  { targetNPCID, sourcePlayerID, sourceNPCID, targetPlayerID }
) => {
  if (relevantBuffs.has(event.abilityGameID)) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.RemoveDebuff,
      abilityID: event.abilityGameID,
      targetNPCID: targetNPCID ? targetNPCID : null,
      sourcePlayerID: sourcePlayerID ? sourcePlayerID : null,
      sourceNPCID: sourceNPCID ? sourceNPCID : null,
      targetPlayerID: targetPlayerID ? targetPlayerID : null,
    };
  }

  return null;
};
