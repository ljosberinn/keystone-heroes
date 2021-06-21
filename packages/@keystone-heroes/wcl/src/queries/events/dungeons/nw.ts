import type { AllTrackedEventTypes, DamageEvent, HealEvent } from "../types";
import {
  createChunkByThresholdReducer,
  createIsSpecificEvent,
  reduceEventsByPlayer,
} from "../utils";

export const NW = {
  ORB: 328_406,
  HAMMER: 328_128,
  SPEAR: 328_351,
  KYRIAN_ORB_HEAL: 344_422,
  KYRIAN_ORB_DAMAGE: 344_421,
} as const;

/**
 * @see https://www.warcraftlogs.com/reports/Jq7KrbYV1hmTWMyw#fight=4&type=summary&view=events&pins=2%24Off%24%23909049%24expression%24type%20%3D%20%22heal%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D344422%5E2%24Off%24%23909049%24expression%24type%20%3D%20%22damage%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D328406%5E2%24Off%24%23a04D8A%24expression%24type%20%3D%20%22damage%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D328128%5E2%24Off%24%23DF5353%24expression%24type%20%3D%20%22damage%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D328351%5E2%24Off%24rgb(78%25,%2061%25,%2043%25)%24expression%24type%20%3D%20%22damage%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D344421
 * @example
 * ```gql
 * {
 *   reportData {
 *     report(code: "Jq7KrbYV1hmTWMyw") {
 *       fights(fightIDs: [4]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 1764363, endTime: 3716117, filterExpression: "(type = \"heal\" and source.type = \"player\" and ability.id = 344422) or (type = \"damage\" and source.type = \"player\" and ability.id in (328406, 328128, 328351, 344421))") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `type = "heal" and source.type = "player" and ability.id = ${NW.KYRIAN_ORB_HEAL}`,
  `type = "damage" and source.type = "player" and ability.id in (${Object.values(
    NW
  )
    .filter((value) => value !== NW.KYRIAN_ORB_HEAL)
    .join(", ")})`,
];

const isNwSpearEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.SPEAR,
});

const isNwHammerEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.HAMMER,
});

const isNwOrbEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.ORB,
});

const isNwKyrianOrbDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.KYRIAN_ORB_DAMAGE,
});

const isNwKyrianOrbHealEvent = createIsSpecificEvent<HealEvent>({
  type: "heal",
  abilityGameID: NW.KYRIAN_ORB_HEAL,
});

// NW Spear applies a bleed for 16 seconds
// each usage is hopefully thus at least 16s apart of each other
// may have to adjust later for multi-spearing...
const nwSpearReducer = createChunkByThresholdReducer(16 * 1000);

// NW Orb pulses every 1s for 8s
// each usage is hopefully thus at least 8s apart of each other
// may have to adjust later for multi-orbing...
const nwOrbReducer = createChunkByThresholdReducer(8 * 1000);

export const getNWEvents = (
  allEvents: AllTrackedEventTypes[]
): (DamageEvent | HealEvent)[] => {
  return [
    ...allEvents
      .filter(isNwSpearEvent)
      .reduce<DamageEvent[][]>(nwSpearReducer, [])
      .flatMap((chunk) => reduceEventsByPlayer(chunk, "sourceID")),
    ...allEvents
      .filter(isNwOrbEvent)
      .reduce<DamageEvent[][]>(nwOrbReducer, [])
      .flatMap((chunk) => reduceEventsByPlayer(chunk, "sourceID")),
    ...allEvents.filter(isNwHammerEvent),
    ...reduceEventsByPlayer(
      allEvents.filter(isNwKyrianOrbDamageEvent),
      "sourceID"
    ),
    ...reduceEventsByPlayer(
      allEvents.filter(isNwKyrianOrbHealEvent),
      "sourceID"
    ),
  ];
};
