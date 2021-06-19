import type { ApplyDebuffEvent } from "../../types";
import { createIsSpecificEvent } from "../../utils";

export const DOS_URN = 228_626;

/**
 * @see https://www.warcraftlogs.com/reports/hFj3wLzrapC4KvZk#fight=2&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22applydebuff%22%20and%20target.type%20%3D%20%22NPC%22%20and%20ability.id%20%3D%20228626
 */
export const filterExpression = [
  `type = "applydebuff" and target.type = "NPC" and ability.id = ${DOS_URN}`,
];

export const isDosUrnEvent = createIsSpecificEvent<ApplyDebuffEvent>({
  type: "applydebuff",
  abilityGameID: DOS_URN,
});

// export const getDeOtherSideUrnUsage = async (
//   params: GetEventBaseParams
// ): Promise<ApplyDebuffEvent[]> => {
//   const allEvents = await getEvents<
//     ApplyDebuffEvent | RemoveDebuffEvent | RefreshDebuffEvent
//   >({
//     ...params,
//     dataType: EventDataType.Debuffs,
//     hostilityType: HostilityType.Enemies,
//     abilityID: DOS_URN,
//   });

//   return allEvents.filter(
//     (event): event is ApplyDebuffEvent => event.type === "applydebuff"
//   );
// };
