import { NECROTIC } from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import type {
  ApplyDebuffStackEvent,
  ApplyDebuffEvent,
  DamageEvent,
} from "../types";
import type { GetEventBaseParams } from "../utils";
import { getEvents, reduceEventsByPlayer } from "../utils";

export const getHighestNecroticStackAmount = async (
  params: GetEventBaseParams
): Promise<ApplyDebuffStackEvent[]> => {
  const allEvents = await getEvents<ApplyDebuffStackEvent | ApplyDebuffEvent>({
    ...params,
    dataType: EventDataType.Debuffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: NECROTIC,
  });

  const relevantEvents = allEvents.filter(
    (event): event is ApplyDebuffStackEvent => event.type === "applydebuffstack"
  );

  const highestStack = relevantEvents.reduce(
    (acc, event) => (acc >= event.stack ? acc : event.stack),
    0
  );

  return relevantEvents.filter((event) => event.stack === highestStack);
};

export const getNecroticDamageTakenEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: NECROTIC,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};
