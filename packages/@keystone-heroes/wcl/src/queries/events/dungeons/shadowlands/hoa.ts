import { EventDataType, HostilityType } from "../../../../types";
import type { CastEvent, BeginCastEvent } from "../../types";
import type { GetEventBaseParams } from "../../utils";
import { getEvents } from "../../utils";

export const HOA_GARGOYLE = 342_171;

export const getHallsOfAtonementGargoyleCharms = async (
  params: GetEventBaseParams
): Promise<CastEvent[]> => {
  const data = await getEvents<CastEvent | BeginCastEvent>({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
    abilityID: HOA_GARGOYLE,
  });

  return data.filter((event): event is CastEvent => event.type === "cast");
};
