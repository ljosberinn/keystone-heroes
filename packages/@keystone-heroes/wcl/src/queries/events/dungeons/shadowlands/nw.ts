import type { DamageEvent, HealEvent } from "../../types";
import {
  createChunkByThresholdReducer,
  createIsSpecificEvent,
} from "../../utils";

export const NW = {
  ORB: 328_406,
  HAMMER: 328_128,
  SPEAR: 328_351,
  KYRIAN_ORB_HEAL: 344_422,
  KYRIAN_ORB_DAMAGE: 344_421,
} as const;

/**
 * @see https://www.warcraftlogs.com/reports/Jq7KrbYV1hmTWMyw#fight=4&type=summary&view=events&pins=2%24Off%24%23909049%24expression%24type%20%3D%20%22heal%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D344422%5E2%24Off%24%23909049%24expression%24type%20%3D%20%22damage%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D328406%5E2%24Off%24%23a04D8A%24expression%24type%20%3D%20%22damage%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D328128%5E2%24Off%24%23DF5353%24expression%24type%20%3D%20%22damage%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D328351%5E2%24Off%24rgb(78%25,%2061%25,%2043%25)%24expression%24type%20%3D%20%22damage%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D344421
 */

export const filterExpression = [
  `type = "damage" and source.type = "player" and ability.id in (${Object.values(
    NW
  ).join(", ")})`,
];

export const isNwSpearEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.SPEAR,
});

export const isNwHammerEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.HAMMER,
});

export const isNwOrbEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.ORB,
});

export const isNwKyrianOrbDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.KYRIAN_ORB_DAMAGE,
});

export const isNwKyrianOrbHealEvent = createIsSpecificEvent<HealEvent>({
  type: "heal",
  abilityGameID: NW.KYRIAN_ORB_HEAL,
});

// NW Spear applies a bleed for 16 seconds
// each usage is hopefully thus at least 16s apart of each other
// may have to adjust later for multi-spearing...
export const nwSpearReducer = createChunkByThresholdReducer(16 * 1000);

// NW Orb pulses every 1s for 8s
// each usage is hopefully thus at least 8s apart of each other
// may have to adjust later for multi-orbing...
export const nwOrbReducer = createChunkByThresholdReducer(8 * 1000);
