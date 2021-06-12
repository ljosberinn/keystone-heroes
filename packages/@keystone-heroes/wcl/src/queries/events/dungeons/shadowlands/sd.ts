import { SD_LANTERN_OPENING } from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import type { BeginCastEvent } from "../../types";
import { createEventFetcher } from "../../utils";

export const getSanguineDepthsLanternUsages = createEventFetcher<BeginCastEvent>(
  {
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: SD_LANTERN_OPENING,
  }
);
