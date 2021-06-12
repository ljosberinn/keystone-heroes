import { BOLSTERING } from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import type { ApplyBuffEvent, RemoveBuffEvent } from "../types";
import type { GetEventBaseParams } from "../utils";
import { getEvents } from "../utils";

type StackDataset = {
  targetID: number;
  targetInstance: number | null;
  stacks: number;
};

export const getBolsteringEvents = async (
  params: GetEventBaseParams
): Promise<ApplyBuffEvent[]> => {
  const allEvents = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Enemies,
    abilityID: BOLSTERING,
  });

  const relevantEvents = allEvents.filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );

  const stacksPerNPC = relevantEvents.reduce<StackDataset[]>(
    (acc, { targetID, targetInstance = null }) => {
      const existingIndex = acc.findIndex(
        (dataset) =>
          dataset.targetInstance === targetInstance &&
          targetID === dataset.targetID
      );

      if (existingIndex > -1) {
        return acc.map((dataset, index) =>
          index === existingIndex
            ? { ...dataset, stacks: dataset.stacks + 1 }
            : dataset
        );
      }

      return [
        ...acc,
        {
          targetID,
          targetInstance,
          stacks: 1,
        },
      ];
    },
    []
  );

  const highestStack = stacksPerNPC.reduce((acc, dataset) =>
    acc?.stacks >= dataset.stacks ? acc : dataset
  );

  const NPCsWithSameFinalStackAmount = stacksPerNPC.filter(
    (dataset) => dataset.stacks === highestStack.stacks
  );

  return relevantEvents.reduce<(ApplyBuffEvent & { stacks: number })[]>(
    (acc, event) => {
      const dataset = NPCsWithSameFinalStackAmount.find(
        (npc) =>
          npc.targetID === event.targetID &&
          npc.targetInstance === event.targetInstance
      );

      if (!dataset) {
        return acc;
      }

      const previousMatch = acc.find(
        (oldEvent) =>
          oldEvent.targetID === event.targetID &&
          oldEvent.targetInstance === event.targetInstance
      );

      const enhancedEvent = { ...event, stacks: dataset.stacks };

      if (!previousMatch) {
        return [...acc, enhancedEvent];
      }

      // implicitly means it must be a higher stack amount as targetID and
      // targetInstance match
      const isNewer = event.timestamp > previousMatch.timestamp;

      if (isNewer) {
        return [
          ...acc.filter((oldEvent) => oldEvent !== previousMatch),
          enhancedEvent,
        ];
      }

      return acc;
    },
    []
  );
};
