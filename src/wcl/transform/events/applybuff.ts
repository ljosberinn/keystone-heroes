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
import { RACIALS } from "../../queries/events/racials";
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
    .flatMap((ability) => ability.ids),
  ...Object.values(RACIALS)
    .flat()
    .filter((ability) => ability.type.includes("applybuff"))
    .map((racial) => racial.id),
]);

export const applyBuffProcessor: Processor<CustomApplyBuffEvent> = (
  event,
  { sourcePlayerID, targetPlayerID, targetNPCID }
) => {
  const {
    timestamp,
    abilityGameID: abilityID,
    stacks = null,
    targetInstance: targetNPCInstance = null,
  } = event;

  if (sourcePlayerID && targetPlayerID) {
    if (sourcePlayerID === targetPlayerID && invisibilityIDs.has(abilityID)) {
      return {
        timestamp,
        sourcePlayerID,
        abilityID,
        eventType: EventType.ApplyBuff,
      };
    }

    if (noteworthyBuffs.has(abilityID)) {
      return {
        timestamp,
        eventType: EventType.ApplyBuff,
        abilityID,
        sourcePlayerID,
        targetPlayerID,
      };
    }
  }

  if (abilityID === BOLSTERING && targetNPCID) {
    return {
      timestamp,
      eventType: EventType.ApplyBuff,
      stacks,
      abilityID: BOLSTERING,
      targetNPCID,
      targetNPCInstance,
    };
  }

  // if (
  //   targetPlayerID &&
  //   (abilityID === SD_LANTERN_BUFF ||
  //     abilityID === NW.KYRIAN_ORB_BUFF ||
  //     abilityID === SD_ZRALI_SHIELD_BUFF)
  // ) {
  //   return {
  //     timestamp: timestamp,
  //     eventType: EventType.ApplyBuff,
  //     targetPlayerID,
  //     abilityID: abilityID,
  //   };
  // }

  // buffs applied from environment on player
  if (
    tormentedAbilityGameIDSet.has(abilityID) ||
    noteworthyBuffs.has(abilityID)
  ) {
    return {
      timestamp,
      eventType: EventType.ApplyBuff,
      targetPlayerID,
      abilityID,
    };
  }

  return null;
};
