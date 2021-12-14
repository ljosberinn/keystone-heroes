import { Affixes } from "@prisma/client";

import type { AllTrackedEventTypes, DamageEvent } from "../types";
import { createIsSpecificEvent } from "../utils";

export const EXPLOSIVE = {
  unit: 120_651,
  ability: 240_446,
} as const;

export const EXPLOSIVE_HEALTH = 224 as const;

/**
 * @see https://www.warcraftlogs.com/reports/YrA4zyZgQJvHbn32#fight=1&type=summary&view=events&pins=2%24Off%24%23244F4B%24expression%24target.id%20%3D120651%20AND%20type%20%3D%20%22damage%22%20AND%20overkill%20%3E%200%5E2%24Off%24%23909049%24expression%24target.type%20%3D%20%22player%22%20and%20rawDamage%20%3E%200%20and%20ability.id%20%3D%20240446
 * ```gql
 * {
 *   reportData {
 *     report(code: "YrA4zyZgQJvHbn32") {
 *       fights(fightIDs: [1]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 87034, endTime: 1527765, limit: 2000, filterExpression: "(target.type = \"player\" and rawDamage > 0 and ability.name = \"Explosion\") OR (target.name = \"Explosives\" AND type = \"damage\" AND overkill > 0)") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `target.type = "player" and rawDamage > 0 and ability.id = ${EXPLOSIVE.ability}`,
  `target.id = ${EXPLOSIVE.unit} and overkill > 0`,
];

const isExplosiveDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: EXPLOSIVE.ability,
});

const createIsExplosiveDeathEvent =
  (targetID: number) =>
  (event: AllTrackedEventTypes): event is DamageEvent => {
    return (
      event.type === "damage" &&
      "targetInstance" in event &&
      event.sourceID !== -1 &&
      event.targetID === targetID &&
      typeof event.overkill !== "undefined" &&
      event.overkill > 0
    );
  };

/**
 * explosives detection is solely based on the hope that it's the unit that
 * occured the most over the course of a logging session, and thus has the highest
 * `targetInstance` property
 */
export const findExplosiveTargetID = (
  allEvents: AllTrackedEventTypes[]
): number | null => {
  const dataset = allEvents.reduce<{
    targetID: null | number;
    targetInstance: null | number;
  }>(
    (acc, event) => {
      if (
        // skip non-DamageEvents
        event.type !== "damage" ||
        // ignore event if target is single instance
        !("targetInstance" in event) ||
        // skip empty instances, just TS here
        event.targetInstance === undefined ||
        // check whether the stored instance is lower than this events
        (acc.targetInstance && event.targetInstance < acc.targetInstance)
      ) {
        return acc;
      }

      return {
        targetID: event.targetID,
        targetInstance: event.targetInstance,
      };
    },
    {
      targetID: null,
      targetInstance: null,
    }
  );

  return dataset.targetID;
};

export const getExplosiveEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): { explosiveTargetID: null | number; events: DamageEvent[] } => {
  if (!affixSet.has(Affixes.Explosive)) {
    return { explosiveTargetID: null, events: [] };
  }

  const explosiveTargetID = findExplosiveTargetID(allEvents);

  if (!explosiveTargetID) {
    return { explosiveTargetID: null, events: [] };
  }

  const explosiveKills = allEvents.filter(
    createIsExplosiveDeathEvent(explosiveTargetID)
  );
  const explosiveDamage = allEvents.filter(isExplosiveDamageEvent);

  return {
    explosiveTargetID,
    events: [...explosiveDamage, ...explosiveKills],
  };
};
