import { EventType } from "@prisma/client";

import { SANGUINE_ICHOR_HEALING } from "../../queries/events/affixes/sanguine";
import { NW } from "../../queries/events/dungeons/nw";
import type { HealEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

export const healProcessor: Processor<HealEvent> = (
  event,
  { targetNPCID, targetPlayerID, sourcePlayerID }
) => {
  if (event.amount === 0) {
    return null;
  }

  const { timestamp, amount, abilityGameID: abilityID } = event;

  if (abilityID === NW.KYRIAN_ORB_HEAL && sourcePlayerID && targetPlayerID) {
    return {
      timestamp,
      eventType: EventType.HealingDone,
      abilityID: NW.KYRIAN_ORB_HEAL,
      healingDone: amount,
      sourcePlayerID,
      targetPlayerID,
    };
  }

  if (abilityID === SANGUINE_ICHOR_HEALING && targetNPCID) {
    return {
      timestamp,
      eventType: EventType.HealingDone,
      abilityID: SANGUINE_ICHOR_HEALING,
      healingDone: amount,
      targetNPCID,
    };
  }

  return null;
};
