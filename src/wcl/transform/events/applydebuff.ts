import { EventType } from "@prisma/client";

import { BURSTING } from "../../queries/events/affixes/bursting";
import { encryptedDebuffIDs } from "../../queries/events/affixes/encrypted";
import { NECROTIC } from "../../queries/events/affixes/necrotic";
import { tormentedBuffsAndDebuffs } from "../../queries/events/affixes/tormented";
import { CHEAT_DEATHS } from "../../queries/events/cheathDeath";
import { DOS_URN } from "../../queries/events/dungeons/dos";
import { ENVELOPMENT_OF_MISTS } from "../../queries/events/dungeons/mots";
import { SOA_SPEAR } from "../../queries/events/dungeons/soa";
import { TRINKETS } from "../../queries/events/trinkets";
import type { ApplyDebuffEvent } from "../../queries/events/types";
import type { Processor } from "../utils";

const ids = new Set<number>([
  SOA_SPEAR,
  DOS_URN,
  ENVELOPMENT_OF_MISTS,
  BURSTING.debuff,
  NECROTIC,
  ...tormentedBuffsAndDebuffs
    .filter((deBuff) => deBuff.type.includes("applydebuff"))
    .map((debuff) => debuff.id),
  ...Object.values(CHEAT_DEATHS)
    .filter((ability) => ability.type.includes("applydebuff"))
    .map((ability) => ability.id),
  ...Object.values(TRINKETS)
    .filter((ability) => ability.type.includes("applydebuff"))
    .flatMap((ability) => ability.ids),
  ...Object.values(encryptedDebuffIDs),
]);

export const applyDebuffProcessor: Processor<ApplyDebuffEvent> = (
  event,
  { targetPlayerID, targetNPCID, sourcePlayerID }
) => {
  if (ids.has(event.abilityGameID)) {
    return {
      timestamp: event.timestamp,
      eventType: EventType.ApplyDebuff,
      abilityID: event.abilityGameID,
      targetPlayerID,
      targetNPCID,
      sourcePlayerID,
    };
  }

  return null;
};
