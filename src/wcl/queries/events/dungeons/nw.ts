import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  BeginCastEvent,
  CastEvent,
  DamageEvent,
  HealEvent,
} from "../types";
import { createIsSpecificEvent } from "../utils";

export const NW = {
  ORB: 328_406,
  HAMMER: 328_128,
  SPEAR: 328_351,
  KYRIAN_ORB_BUFF: 335_161,
  KYRIAN_ORB_HEAL: 344_422,
  KYRIAN_ORB_DAMAGE: 344_421,
} as const;

/**
 * @see https://www.warcraftlogs.com/reports/Jq7KrbYV1hmTWMyw#fight=4&view=events&pins=2%24Off%24%23244F4B%24expression%24(type%20%3D%20%22heal%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D%20344422)%0Aor%20(type%20%3D%20%22damage%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20in%20(328128,%20344421,%20328351,%20328406))%0Aor%20((type%20%3D%20%22begincast%22%20or%20type%20%3D%20%22cast%22)%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20in%20(328128,%20328351))%0Aor%20(type%20%3D%20%22applybuff%22%20and%20source.type%20%3D%20%22player%22%20and%20ability.id%20%3D%20335161)
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
  `type = "applybuff" and ability.id = ${NW.KYRIAN_ORB_BUFF}`,
  `type = "heal" and source.type = "player" and ability.id = ${NW.KYRIAN_ORB_HEAL}`,
  `type = "damage" and source.type = "player" and ability.id in (${[
    NW.HAMMER,
    NW.KYRIAN_ORB_DAMAGE,
    NW.SPEAR,
    NW.ORB,
  ].join(", ")})`,
  `(type = "begincast" or type = "cast") and source.type = "player" and ability.id in (${[
    NW.HAMMER,
    NW.SPEAR,
  ].join(", ")})`,
];

const isNwSpearEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.SPEAR,
});

const isNwSpearCastEvent = createIsSpecificEvent<CastEvent>({
  type: "cast",
  abilityGameID: NW.SPEAR,
});

const isNwSpearBeginCastEvent = createIsSpecificEvent<BeginCastEvent>({
  type: "begincast",
  abilityGameID: NW.SPEAR,
});

const isNwHammerEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.HAMMER,
});

const isNwHammerCastEvent = createIsSpecificEvent<CastEvent>({
  type: "cast",
  abilityGameID: NW.HAMMER,
});

const isNwHammerBeginCastEvent = createIsSpecificEvent<BeginCastEvent>({
  type: "begincast",
  abilityGameID: NW.HAMMER,
});

const isNwOrbEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: NW.ORB,
});

const isNwOrbCastEvent = createIsSpecificEvent<CastEvent>({
  type: "cast",
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

const isNwKyrianOrbApplyBuffEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: NW.KYRIAN_ORB_BUFF,
});

export const getNWEvents = (
  allEvents: AllTrackedEventTypes[]
): (
  | ApplyBuffEvent
  | DamageEvent
  | HealEvent
  | BeginCastEvent
  | CastEvent
)[] => {
  const spearDamageEvents = allEvents.filter(isNwSpearEvent);

  const spearBeginCastEvents = allEvents.filter(isNwSpearBeginCastEvent);
  const spearCastEvents = allEvents.filter(isNwSpearCastEvent);

  const hammerBeginCastEvents = allEvents.filter(isNwHammerBeginCastEvent);
  const hammerCastEvents = allEvents.filter(isNwHammerCastEvent);
  const hammerDamageEvents = allEvents.filter(isNwHammerEvent);

  const orbCastEvents = allEvents.filter(isNwOrbCastEvent);
  const orbDamageEvents = allEvents.filter(isNwOrbEvent);

  const kyrianOrbApplyBuffEvents = allEvents.filter(
    isNwKyrianOrbApplyBuffEvent
  );
  const kyrianOrbDamageEvents = allEvents.filter(isNwKyrianOrbDamageEvent);
  const kyrianOrbHealEvents = allEvents.filter(isNwKyrianOrbHealEvent);

  return [
    ...spearDamageEvents,
    ...spearBeginCastEvents,
    ...spearCastEvents,

    ...hammerBeginCastEvents,
    ...hammerCastEvents,
    ...hammerDamageEvents,

    ...orbCastEvents,
    ...orbDamageEvents,

    ...kyrianOrbApplyBuffEvents,
    ...kyrianOrbDamageEvents,
    ...kyrianOrbHealEvents,
  ];
};
