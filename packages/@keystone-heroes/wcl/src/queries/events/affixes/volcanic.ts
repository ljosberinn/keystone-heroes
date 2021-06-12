import { VOLCANIC } from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import type { DamageEvent } from "../types";
import { createEventFetcher } from "../utils";

export const getVolcanicDamageTakenEvents = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageTaken,
  hostilityType: HostilityType.Friendlies,
  abilityID: VOLCANIC,
});
