import { SOA_SPEAR } from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import type {
  ApplyDebuffEvent,
  RemoveDebuffEvent,
  RefreshDebuffEvent,
} from "../../types";
import type { GetEventBaseParams } from "../../utils";
import { getEvents, reduceToChunkByThreshold } from "../../utils";

export const getSpiresOfAscensionSpearUsage = async (
  params: GetEventBaseParams
): Promise<ApplyDebuffEvent[]> => {
  const allEvents = await getEvents<
    ApplyDebuffEvent | RemoveDebuffEvent | RefreshDebuffEvent
  >({
    ...params,
    dataType: EventDataType.Debuffs,
    hostilityType: HostilityType.Enemies,
    abilityID: SOA_SPEAR,
  });

  // SoA Spear stun lasts 10 seconds
  // each usage should be thus at least 10s apart of each other
  const threshold = 10 * 1000;

  // picks the first event of each chunk
  return allEvents
    .filter((event): event is ApplyDebuffEvent => event.type === "applydebuff")
    .reduce<ApplyDebuffEvent[][]>(
      (acc, event) => reduceToChunkByThreshold(acc, event, threshold),
      []
    )
    .flatMap((chunk) => chunk[0]);
};
