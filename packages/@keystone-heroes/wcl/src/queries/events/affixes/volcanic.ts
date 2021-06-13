import { EventDataType, HostilityType } from "../../../types";
import type { DamageEvent } from "../types";
import type { GetEventBaseParams } from "../utils";
import { getEvents, reduceEventsByPlayer } from "../utils";

export const VOLCANIC = 209_862;

export const getVolcanicDamageTakenEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: VOLCANIC,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};
