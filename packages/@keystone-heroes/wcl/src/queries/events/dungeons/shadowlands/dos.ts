import { EventDataType, HostilityType } from "../../../../types";
import type {
  ApplyDebuffEvent,
  RefreshDebuffEvent,
  RemoveDebuffEvent,
} from "../../types";
import type { GetEventBaseParams } from "../../utils";
import { getEvents } from "../../utils";

export const DOS_URN = 228_626;

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
