import { EventType } from "@prisma/client";

import { encryptedAbilityIDs } from "../../queries/events/affixes/encrypted";
import { tormentedBuffsAndDebuffs } from "../../queries/events/affixes/tormented";
import { CHEAT_DEATHS } from "../../queries/events/cheathDeath";
import { NW } from "../../queries/events/dungeons/nw";
import {
  SD_LANTERN_BUFF,
  SD_ZRALI_SHIELD,
  SD_ZRALI_SHIELD_BUFF,
} from "../../queries/events/dungeons/sd";
import { TOP_BANNER_AURA } from "../../queries/events/dungeons/top";
import { RACIALS } from "../../queries/events/racials";
import { TRINKETS } from "../../queries/events/trinkets";
import type { RemoveBuffEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

const relevantBuffs = new Set<number>([
  SD_LANTERN_BUFF,
  TOP_BANNER_AURA,
  SD_ZRALI_SHIELD,
  SD_ZRALI_SHIELD_BUFF,
  NW.KYRIAN_ORB_BUFF,
  NW.SHIELD,
  ...tormentedBuffsAndDebuffs
    .filter((deBuff) => deBuff.type.includes("removebuff"))
    .map((buff) => buff.id),
  ...Object.values(CHEAT_DEATHS)
    .filter((ability) => ability.type.includes("removebuff"))
    .map((ability) => ability.id),
  ...Object.values(TRINKETS)
    .filter((ability) => ability.type.includes("removebuff"))
    .flatMap((ability) => ability.ids),
  ...Object.values(RACIALS)
    .flat()
    .filter((ability) => ability.type.includes("removebuff"))
    .map((racial) => racial.id),
  ...Object.values(encryptedAbilityIDs),
]);

export const removeBuffProcessor: Processor<RemoveBuffEvent> = (
  event,
  { targetPlayerID }
) => {
  if (relevantBuffs.has(event.abilityGameID) && targetPlayerID) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.RemoveBuff,
      abilityID: event.abilityGameID,
      targetPlayerID,
    };
  }

  return null;
};
