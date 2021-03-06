import type { Prisma } from "@prisma/client";

import type { AllTrackedEventTypes } from "../queries/events/types";
import { applyBuffProcessor } from "./events/applybuff";
import { applyBuffStackProcessor } from "./events/applybuffstack";
import { applyDebuffProcessor } from "./events/applydebuff";
import { applyDebuffStackprocessor } from "./events/applydebuffstack";
import { beginCastProcessor } from "./events/begincast";
import { castProcessor } from "./events/cast";
import { damageProcessor } from "./events/damage";
import { deathProcessor } from "./events/death";
import { healProcessor } from "./events/heal";
import { interruptProcessor } from "./events/interrupt";
import { removeBuffProcessor } from "./events/removebuff";
import { removeDebuffProcessor } from "./events/removedebuff";
import type { PersistedDungeonPull, Processor } from "./utils";

const getProcessorParams = (
  event: AllTrackedEventTypes,
  pull: PersistedDungeonPull,
  actorPlayerMap: Map<number, number>,
  allPulledNPCsMap: Record<number, number>
): Parameters<Processor<AllTrackedEventTypes>>[1] => {
  const params: Parameters<Processor<AllTrackedEventTypes>>[1] = {
    sourceNPCID: null,
    sourcePlayerID: null,
    targetNPCID: null,
    targetPlayerID: null,
  };

  if ("sourceID" in event) {
    params.sourcePlayerID = actorPlayerMap.get(event.sourceID) ?? null;
    params.sourceNPCID =
      pull.enemyNPCs.find((npc) => npc.id === event.sourceID)?.gameID ?? null;
  }

  if ("targetID" in event) {
    params.targetPlayerID = actorPlayerMap.get(event.targetID) ?? null;
    params.targetNPCID =
      event.targetID in allPulledNPCsMap
        ? allPulledNPCsMap[event.targetID]
        : null;
  }

  return params;
};

export const processEvents = (
  pull: PersistedDungeonPull,
  events: AllTrackedEventTypes[],
  actorPlayerMap: Map<number, number>,
  allPulledNPCsMap: Record<number, number>
): Omit<Prisma.EventCreateManyInput, "pullID">[] => {
  return events
    .map<Omit<Prisma.EventCreateManyInput, "pullID"> | null>((event) => {
      const params = getProcessorParams(
        event,
        pull,
        actorPlayerMap,
        allPulledNPCsMap
      );

      switch (event.type) {
        case "applybuff":
          return applyBuffProcessor(event, params);
        case "applydebuffstack":
          return applyDebuffStackprocessor(event, params);
        case "applybuffstack":
          return applyBuffStackProcessor(event, params);
        case "applydebuff":
          return applyDebuffProcessor(event, params);
        case "begincast":
          return beginCastProcessor(event, params);
        case "cast":
          return castProcessor(event, params);
        case "damage":
          return damageProcessor(event, params);
        case "death":
          return deathProcessor(event, { ...params, pull });
        case "heal":
          return healProcessor(event, params);
        case "interrupt":
          return interruptProcessor(event, params);
        case "removebuff":
          return removeBuffProcessor(event, params);
        case "removedebuff":
          return removeDebuffProcessor(event, params);
        default:
          return null;
      }
    })
    .filter(
      (dataset): dataset is Omit<Prisma.EventCreateManyInput, "pullID"> =>
        dataset !== null
    );
};
