import { EventDataType, HostilityType } from "../../../../types";
import type {
  BeginCastEvent,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  RemoveBuffEvent,
} from "../../types";
import { createEventFetcher } from "../../utils";

export const SD_LANTERN_OPENING = 340_013;
export const SD_LANTERN_BUFF = 340_433;

export const getSanguineDepthsLanternUsages =
  createEventFetcher<BeginCastEvent>({
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: SD_LANTERN_OPENING,
  });

export const getSanguineDepthsBuffEvents = createEventFetcher<
  ApplyBuffEvent | ApplyBuffStackEvent | RemoveBuffEvent
>({
  dataType: EventDataType.Buffs,
  hostilityType: HostilityType.Friendlies,
  abilityID: SD_LANTERN_BUFF,
});
