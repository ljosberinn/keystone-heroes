import { DOS_URN } from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import type {
  ApplyDebuffEvent,
  RefreshDebuffEvent,
  RemoveDebuffEvent,
} from "../../types";
import type { GetEventBaseParams } from "../../utils";
import { getEvents } from "../../utils";

export const getDeOtherSideUrnUsage = async (
  params: GetEventBaseParams
): Promise<ApplyDebuffEvent[]> => {
  const allEvents = await getEvents<
    ApplyDebuffEvent | RemoveDebuffEvent | RefreshDebuffEvent
  >({
    ...params,
    dataType: EventDataType.Debuffs,
    hostilityType: HostilityType.Enemies,
    abilityID: DOS_URN,
  });

  return allEvents.filter(
    (event): event is ApplyDebuffEvent => event.type === "applydebuff"
  );
};
