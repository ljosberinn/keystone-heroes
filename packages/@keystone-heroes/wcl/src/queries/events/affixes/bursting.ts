import { EventDataType, HostilityType } from "../../../types";
import type { DamageEvent } from "../types";
import type { GetEventBaseParams } from "../utils";
import { getEvents, reduceEventsByPlayer } from "../utils";

export const BURSTING = 243_237;

export const getBurstingDamageTakenEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: BURSTING,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};
