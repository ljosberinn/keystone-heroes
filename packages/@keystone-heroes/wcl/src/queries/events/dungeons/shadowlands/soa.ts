import { EventDataType, HostilityType } from "../../../../types";
import type {
  ApplyDebuffEvent,
  RemoveDebuffEvent,
  RefreshDebuffEvent,
} from "../../types";
import type { GetEventBaseParams } from "../../utils";
import { createChunkByThresholdReducer, getEvents } from "../../utils";

export const SOA_SPEAR = 339_917;

// SoA Spear stun lasts 10 seconds
// each usage should be thus at least 10s apart of each other
const reducer = createChunkByThresholdReducer(10 * 1000);

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

  // picks the first event of each chunk
  return allEvents
    .filter((event): event is ApplyDebuffEvent => event.type === "applydebuff")
    .reduce<ApplyDebuffEvent[][]>(reducer, [])
    .flatMap((chunk) => chunk[0]);
};
