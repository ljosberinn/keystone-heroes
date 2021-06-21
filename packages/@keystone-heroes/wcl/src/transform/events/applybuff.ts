import { EventType } from "@keystone-heroes/db/types";

import { BOLSTERING } from "../../queries/events/affixes/bolstering";
import { PF } from "../../queries/events/dungeons/pf";
import { SD_LANTERN_BUFF } from "../../queries/events/dungeons/sd";
import { TOP_BANNER_AURA } from "../../queries/events/dungeons/top";
import { INVISIBILITY } from "../../queries/events/other";
import type { ApplyBuffEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

type CustomApplyBuffEvent = ApplyBuffEvent & { stacks?: number };

/**
 * track invis potion, bolstering, ToP, SD and PF buffs
 */
export const applyBuffProcessor: Processor<CustomApplyBuffEvent> = (
  event,
  { sourcePlayerID, targetPlayerID, targetNPCID }
) => {
  if (sourcePlayerID && targetPlayerID) {
    if (
      sourcePlayerID === targetPlayerID &&
      (event.abilityGameID === INVISIBILITY.POTION_OF_THE_HIDDEN_SPIRIT ||
        event.abilityGameID === INVISIBILITY.DIMENSIONAL_SHIFTER)
    ) {
      return {
        timestamp: event.timestamp,
        sourcePlayerID,
        abilityID: event.abilityGameID,
        eventType: EventType.ApplyBuff,
      };
    }

    if (
      event.abilityGameID === TOP_BANNER_AURA ||
      event.abilityGameID === PF.GREEN_BUFF.aura ||
      event.abilityGameID === PF.RED_BUFF.aura ||
      event.abilityGameID === PF.PURPLE_BUFF.aura
    ) {
      return {
        timestamp: event.timestamp,
        eventType: EventType.ApplyBuff,
        abilityID: event.abilityGameID,
        sourcePlayerID,
        targetPlayerID,
      };
    }
  }

  if (event.abilityGameID === BOLSTERING && targetNPCID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.ApplyBuff,
      stacks: event.stacks ?? null,
      abilityID: BOLSTERING,
      targetNPCID,
      targetNPCInstance: event.targetInstance ?? null,
    };
  }

  if (event.abilityGameID === SD_LANTERN_BUFF && targetPlayerID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.ApplyBuff,
      targetPlayerID,
      abilityID: event.abilityGameID,
    };
  }

  return null;
};
