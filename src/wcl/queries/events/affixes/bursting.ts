import { Affixes } from "@prisma/client";

import type {
  AllTrackedEventTypes,
  ApplyDebuffEvent,
  ApplyDebuffStackEvent,
  DamageEvent,
} from "../types";
import { createIsSpecificEvent } from "../utils";

export const BURSTING = {
  damage: 243_237,
  debuff: 240_443,
};

/**
 * @see https://www.warcraftlogs.com/reports/hFj3wLzrapC4KvZk#fight=4&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22damage%22%20and%20target.type%20%3D%20%22player%22%20and%20ability.id%20%3D%20243237%20and%20rawDamage%20%3E%200
 * ```gql
 * {
 *   reportData {
 *     report(code: "hFj3wLzrapC4KvZk") {
 *       fights(fightIDs: [2]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 5987472, endTime: 7736379, limit: 2000, filterExpression: "type = \"damage\" and target.type = \"player\" and ability.id = 243237 and rawDamage > 0") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `type = "damage" and target.type = "player" and ability.id = ${BURSTING.damage} and rawDamage > 0`,
  `type in ("applydebuff", "applydebuffstack") and ability.id = ${BURSTING.debuff}`,
];

const isBurstingDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: BURSTING.damage,
});

const isBurstingApplyDebuffEvent = createIsSpecificEvent<ApplyDebuffEvent>({
  type: "applydebuff",
  abilityGameID: BURSTING.debuff,
});

const isBurstingApplyDebuffStackEvent =
  createIsSpecificEvent<ApplyDebuffStackEvent>({
    type: "applydebuffstack",
    abilityGameID: BURSTING.debuff,
  });

export const getBurstingEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): (DamageEvent | ApplyDebuffEvent | ApplyDebuffStackEvent)[] => {
  if (!affixSet.has(Affixes.Bursting)) {
    return [];
  }

  return [
    ...allEvents.filter(isBurstingDamageEvent),
    ...allEvents.filter(isBurstingApplyDebuffEvent),
    ...allEvents.filter(isBurstingApplyDebuffStackEvent),
  ];
};
