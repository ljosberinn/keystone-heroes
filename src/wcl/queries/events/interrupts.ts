import type { AllTrackedEventTypes, InterruptEvent } from "./types";

export const interruptFilterExpression = `type = "interrupt" and source.type = "player"`;

const isPlayerInterruptingNPCEvent = (
  event: AllTrackedEventTypes
): event is InterruptEvent =>
  event.type === "interrupt" &&
  event.sourceID !== event.targetID &&
  // ignore arcane torrent as it doesn't interrupt anymore
  event.abilityGameID !== 32_747;

export const filterPlayerInterruptEvents = (
  allEvents: AllTrackedEventTypes[]
): InterruptEvent[] => {
  return allEvents.filter(isPlayerInterruptingNPCEvent);
};
