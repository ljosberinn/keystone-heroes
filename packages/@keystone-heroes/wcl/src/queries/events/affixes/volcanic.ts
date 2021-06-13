import { EventDataType, HostilityType } from "../../../types";
import type { DamageEvent } from "../types";
import { createEventFetcher } from "../utils";

export const VOLCANIC = 209_862;

export const getVolcanicDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: VOLCANIC,
});
