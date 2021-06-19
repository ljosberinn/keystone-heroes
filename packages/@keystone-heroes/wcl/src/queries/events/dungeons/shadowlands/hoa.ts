import type { CastEvent } from "../../types";
import { createIsSpecificEvent } from "../../utils";

export const HOA_GARGOYLE = 342_171;
/**
 * @see https://www.warcraftlogs.com/reports/hFj3wLzrapC4KvZk#fight=4&type=summary&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22cast%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D%20342171&view=events
 */
export const filterExpression = [
  `type = "cast" and source.type = "player" and ability.id = ${HOA_GARGOYLE}`,
];

export const isHoaGargoyleEvent = createIsSpecificEvent<CastEvent>({
  type: "cast",
  abilityGameID: HOA_GARGOYLE,
});

// export const getHallsOfAtonementGargoyleCharms = async (
//   params: GetEventBaseParams
// ): Promise<CastEvent[]> => {
//   const data = await getEvents<CastEvent | BeginCastEvent>({
//     ...params,
//     dataType: EventDataType.Casts,
//     hostilityType: HostilityType.Friendlies,
//     abilityID: HOA_GARGOYLE,
//   });

//   return data.filter((event): event is CastEvent => event.type === "cast");
// };
