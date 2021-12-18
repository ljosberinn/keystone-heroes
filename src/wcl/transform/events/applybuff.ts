import { EventType } from "@prisma/client";

import { BOLSTERING } from "../../queries/events/affixes/bolstering";
import {
  tormentedBuffsAndDebuffs,
  tormentedAbilityGameIDSet,
} from "../../queries/events/affixes/tormented";
import { CHEAT_DEATHS } from "../../queries/events/cheathDeath";
import { NW } from "../../queries/events/dungeons/nw";
import { PF } from "../../queries/events/dungeons/pf";
import {
  SD_LANTERN_BUFF,
  SD_ZRALI_SHIELD,
  SD_ZRALI_SHIELD_BUFF,
} from "../../queries/events/dungeons/sd";
import { TOP_BANNER_AURA } from "../../queries/events/dungeons/top";
import { INVISIBILITY } from "../../queries/events/professions";
import { TRINKETS } from "../../queries/events/trinkets";
import type { ApplyBuffEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

type CustomApplyBuffEvent = ApplyBuffEvent & { stacks?: number };

const invisibilityIDs = new Set<number>([
  INVISIBILITY.POTION_OF_THE_HIDDEN_SPIRIT,
  INVISIBILITY.DIMENSIONAL_SHIFTER,
]);

const noteworthyBuffs = new Set<number>([
  TOP_BANNER_AURA,
  PF.GREEN_BUFF.aura,
  PF.RED_BUFF.aura,
  PF.PURPLE_BUFF.aura,
  NW.SHIELD,
  SD_ZRALI_SHIELD,
  SD_LANTERN_BUFF,
  SD_ZRALI_SHIELD_BUFF,
  NW.KYRIAN_ORB_BUFF,
  ...tormentedBuffsAndDebuffs
    .filter((deBuff) => deBuff.type.includes("applybuff"))
    .map((buff) => buff.id),
  ...Object.values(CHEAT_DEATHS)
    .filter((ability) => ability.type.includes("applybuff"))
    .map((ability) => ability.id),
  ...Object.values(TRINKETS)
    .filter((ability) => ability.type.includes("applybuff"))
    .map((ability) => ability.id),
]);

export const applyBuffProcessor: Processor<CustomApplyBuffEvent> = (
  event,
  { sourcePlayerID, targetPlayerID, targetNPCID }
) => {
  if (sourcePlayerID && targetPlayerID) {
    if (
      sourcePlayerID === targetPlayerID &&
      invisibilityIDs.has(event.abilityGameID)
    ) {
      return {
        timestamp: event.timestamp,
        sourcePlayerID,
        abilityID: event.abilityGameID,
        eventType: EventType.ApplyBuff,
      };
    }

    if (noteworthyBuffs.has(event.abilityGameID)) {
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

  // if (
  //   targetPlayerID &&
  //   (event.abilityGameID === SD_LANTERN_BUFF ||
  //     event.abilityGameID === NW.KYRIAN_ORB_BUFF ||
  //     event.abilityGameID === SD_ZRALI_SHIELD_BUFF)
  // ) {
  //   return {
  //     timestamp: event.timestamp,
  //     eventType: EventType.ApplyBuff,
  //     targetPlayerID,
  //     abilityID: event.abilityGameID,
  //   };
  // }

  // buffs applied from environment on player
  if (
    tormentedAbilityGameIDSet.has(event.abilityGameID) ||
    noteworthyBuffs.has(event.abilityGameID)
  ) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.ApplyBuff,
      targetPlayerID,
      abilityID: event.abilityGameID,
    };
  }

  return null;
};
