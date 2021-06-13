import { EventDataType, HostilityType } from "../../../types";
import type { DamageEvent } from "../types";
import { createEventFetcher } from "../utils";

export const STORMING = 343_520;

export const getStormingDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: STORMING,
});
