import type { ApplyDebuffEvent } from "../../types";
import { createIsSpecificEvent } from "../../utils";

export const DOS_URN = 228_626;

/**
 * @see https://www.warcraftlogs.com/reports/hFj3wLzrapC4KvZk#fight=2&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22applydebuff%22%20and%20target.type%20%3D%20%22NPC%22%20and%20ability.id%20%3D%20228626
 */
export const filterExpression = [
  `type = "applydebuff" and target.type = "npc" and ability.id = ${DOS_URN}`,
];

export const isDosUrnEvent = createIsSpecificEvent<ApplyDebuffEvent>({
  type: "applydebuff",
  abilityGameID: DOS_URN,
});
