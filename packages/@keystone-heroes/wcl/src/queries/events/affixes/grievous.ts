import { EventDataType, HostilityType } from "../../../types";
import type { DamageEvent } from "../types";
import type { GetEventBaseParams } from "../utils";
import { getEvents, reduceEventsByPlayer } from "../utils";

export const GRIEVOUS_WOUND = 240_559;

export const getGrievousDamageTakenEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: GRIEVOUS_WOUND,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};
