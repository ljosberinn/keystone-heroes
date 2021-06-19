import type { ApplyBuffEvent } from "../../types";
import { createIsSpecificEvent } from "../../utils";

export const TOP_BANNER_AURA = 340_378;

/**
 * @see https://www.warcraftlogs.com/reports/MKdfLJm8byVhXA32#fight=17&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22applybuff%22%20and%20ability.id%20%3D%20340378
 */
export const filterExpression = [
  `type = "applybuff" and ability.id = ${TOP_BANNER_AURA}`,
];

export const isTopBannerAuraEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: TOP_BANNER_AURA,
});

// export const getTheaterOfPainBannerUsage = async (
//   params: GetEventBaseParams
// ): Promise<ApplyBuffEvent[]> => {
//   const data = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
//     ...params,
//     dataType: EventDataType.Buffs,
//     hostilityType: HostilityType.Friendlies,
//     abilityID: TOP_BANNER_AURA,
//   });

//   return data.filter(
//     (event): event is ApplyBuffEvent => event.type === "applybuff"
//   );
// };
