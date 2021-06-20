import type { ApplyDebuffEvent } from "../../types";
import {
  createChunkByThresholdReducer,
  createIsSpecificEvent,
} from "../../utils";

export const SOA_SPEAR = 339_917;

/**
 * @see https://www.warcraftlogs.com/reports/JVnw7NF6hyz8QqX4#fight=20&type=summary&view=events&pins=2%24Off%24%23a04D8A%24expression%24type%20%3D%20%22applydebuff%22%20and%20target.type%20%3D%20%22NPC%22%20and%20ability.id%20%3D%20339917&hostility=1
 */
export const filterExpression = [
  `type = "applydebuff" and target.type = "npc" and ability.id = ${SOA_SPEAR}`,
];

export const isSoaSpearEvent = createIsSpecificEvent<ApplyDebuffEvent>({
  type: "applydebuff",
  abilityGameID: SOA_SPEAR,
});

// SoA Spear stun lasts 10 seconds
// each usage should be thus at least 10s apart of each other
export const soaSpearReducer = createChunkByThresholdReducer(10 * 1000);
