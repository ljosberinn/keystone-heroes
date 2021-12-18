import { EventType } from "@prisma/client";

import { PF } from "../../queries/events/dungeons/pf";
import type { DeathEvent } from "../../queries/events/types";
import type { PersistedDungeonPull, Processor } from "../utils";

export const deathProcessor: Processor<
  DeathEvent,
  { pull: PersistedDungeonPull }
> = (event, { targetNPCID, targetPlayerID, pull }) => {
  const {
    timestamp,
    killerInstance: sourceNPCInstance = null,
    killerID,
    targetInstance: targetNPCInstance = null,
  } = event;

  // player death
  if (targetPlayerID) {
    const sourceNPCID = killerID
      ? pull.enemyNPCs.find((npc) => npc.id === killerID)?.gameID ?? null
      : null;

    return {
      timestamp,
      eventType: EventType.Death,
      sourceNPCInstance,
      targetPlayerID,
      sourceNPCID,
    };
  }

  if (
    PF.GREEN_BUFF.unit === targetNPCID ||
    PF.RED_BUFF.unit === targetNPCID ||
    PF.PURPLE_BUFF.unit === targetNPCID
  ) {
    return {
      timestamp,
      eventType: EventType.Death,
      targetNPCInstance,
      targetNPCID,
    };
  }

  return null;
};
