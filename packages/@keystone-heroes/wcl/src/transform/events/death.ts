import { EventType } from "@keystone-heroes/db/types";
import { PF } from "@keystone-heroes/wcl/queries/events/dungeons/pf";

import type { DeathEvent } from "../../queries/events/types";
import type { PersistedDungeonPull, Processor } from "../utils";

/**
 * track deaths:
 * - all player deaths
 * - PF slimes
 */
export const deathProcessor: Processor<
  DeathEvent,
  { pull: PersistedDungeonPull }
> = (event, { targetNPCID, targetPlayerID, pull }) => {
  // player death
  if (targetPlayerID) {
    const sourceNPCID = event.killerID
      ? pull.enemyNPCs.find((npc) => npc.id === event.killerID)?.gameID ?? null
      : null;

    return {
      timestamp: event.timestamp,
      eventType: EventType.Death,
      sourceNPCInstance: event.killerInstance ?? null,
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
      timestamp: event.timestamp,
      eventType: EventType.Death,
      targetNPCInstance: event.targetInstance ?? null,
      targetNPCID,
    };
  }

  return null;
};
