import type { DamageEvent, HealEvent } from "../types";
import { createIsSpecificEvent } from "../utils";

export const SANGUINE_ICHOR_HEALING = 226_510;
export const SANGUINE_ICHOR_DAMAGE = 226_512;

/**
 * @see https://www.warcraftlogs.com/reports/NVZndMKc7jJr6GpF#fight=30&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24target.type%20%3D%20%22player%22%20and%20type%20%3D%20%22damage%22%20and%20ability.name%20%3D%20%22Sanguine%20Ichor%22%5E2%24Off%24%23909049%24expression%24target.type%20%3D%20%22NPC%22%20and%20type%20%3D%20%22heal%22%20and%20ability.name%20%3D%20%22Sanguine%20Ichor%22
 * ```gql
 * {
 *   reportData {
 *     report(code: "NVZndMKc7jJr6GpF") {
 *       fights(fightIDs: [30]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 12782664, endTime: 14618665, limit: 2000, filterExpression: "ability.name = \"Sanguine Ichor\" AND ((target.type = \"player\" and type = \"damage\") OR (target.type = \"NPC\" and type = \"heal\"))") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
const expressions = {
  base: 'ability.name = "Sanguine Ichor"',
  damage: 'target.type = "player" and type = "damage"',
  heal: 'target.type = "npc" and type = "heal"',
};

export const filterExpression = [
  `${expressions.base} and ((${expressions.damage}) OR (${expressions.heal}))`,
];

export const isSanguineDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: SANGUINE_ICHOR_DAMAGE,
});

export const isSanguineHealEvent = createIsSpecificEvent<HealEvent>({
  type: "heal",
  abilityGameID: SANGUINE_ICHOR_HEALING,
});

export const reduceHealingDoneBySanguine = (
  events: HealEvent[]
): HealEvent[] => {
  return [
    events.reduce<HealEvent>((acc, event) => {
      return {
        ...acc,
        amount: acc.amount + event.amount,
        overheal: (acc.overheal ?? 0) + (event.overheal ?? 0),
      };
    }, events[0]),
  ];
};
