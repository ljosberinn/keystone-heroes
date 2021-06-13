import { EventDataType, HostilityType } from "../../../types";
import type { DamageEvent, InterruptEvent } from "../types";
import type { GetEventBaseParams } from "../utils";
import { createEventFetcher, getEvents } from "../utils";

export const QUAKING = 240_448;

export const getQuakingDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: QUAKING,
});

export const getQuakingInterruptEvents = async (
  params: GetEventBaseParams
): Promise<InterruptEvent[]> => {
  const allEvents = await getEvents<InterruptEvent>({
    ...params,
    dataType: EventDataType.Interrupts,
    hostilityType: HostilityType.Friendlies,
    abilityID: QUAKING,
  });

  // see https://canary.discord.com/channels/180033360939319296/681904912090529801/842578775840391188
  return allEvents.filter((event) => event.abilityGameID === QUAKING);
};
