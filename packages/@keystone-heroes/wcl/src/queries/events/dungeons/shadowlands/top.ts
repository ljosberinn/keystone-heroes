import { TOP_BANNER_AURA } from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import type { ApplyBuffEvent, RemoveBuffEvent } from "../../types";
import type { GetEventBaseParams } from "../../utils";
import { getEvents } from "../../utils";

export const getTheaterOfPainBannerUsage = async (
  params: GetEventBaseParams
): Promise<ApplyBuffEvent[]> => {
  const data = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: TOP_BANNER_AURA,
  });

  return data.filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );
};
