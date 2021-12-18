import { EXPLOSIVE_HEALTH } from "./affixes/explosive";
import type {
  AllTrackedEventTypes,
  DeathEvent,
  BeginCastEvent,
  DamageEvent,
} from "./types";

const RENEWING_MIST = 300_155;
/**
 * @description filters for
 * - _any_ death event
 * - the `Renewing Mist` cast Tirnenn Villagers do upon their "death"
 */
export const deathFilterExpression = `(type = "death" and target.type != "pet") or (ability.id = ${RENEWING_MIST} and type = "begincast")`;
// TODO: feign false doesnt work?
// export const friendliesDeathFilterExpression =
//   'target.type = "player" and type = "death"'; //  and feign = false

export const filterEnemyDeathEvents = (
  allEvents: AllTrackedEventTypes[],
  actorIDSet: Set<number>,
  explosiveTargetID: number | null
): (DeathEvent | BeginCastEvent | DamageEvent)[] => {
  return allEvents.filter(
    (event): event is DeathEvent | BeginCastEvent | DamageEvent => {
      if (event.type === "death") {
        // may not be an actor, aka player
        // source of death must be environment
        return !actorIDSet.has(event.targetID) && event.sourceID === -1;
      }

      // see Renewing Mist
      if (event.type === "begincast") {
        return event.abilityGameID === RENEWING_MIST;
      }

      if (explosiveTargetID && event.type === "damage") {
        // explosives do not send death events
        // however, `overkill` is set given non melee hits
        // on melee hits, there's no `overkill` but the amount must be higher than 224
        return (
          event.targetID === explosiveTargetID &&
          (event.overkill !== undefined || event.amount >= EXPLOSIVE_HEALTH)
        );
      }

      return false;
    }
  );
};

export const filterPlayerDeathEvents = (
  allEvents: AllTrackedEventTypes[],
  actorIDSet: Set<number>
  // remarkableSpellEvents: CastEvent[]
): DeathEvent[] => {
  // const actorIDSet = new Set(
  // playerMetaInformation.map((dataset) => dataset.actorID)
  // );

  // const hunter = playerMetaInformation.find(
  //   (player) => player.class === PlayableClass.Hunter
  // );

  return allEvents.filter((event): event is DeathEvent => {
    return (
      event.type === "death" &&
      // must be a known actor
      actorIDSet.has(event.targetID) &&
      // source of death must be environment
      event.sourceID === -1
    );
  });

  // if (!hunter) {
  //   return deathEvents;
  // }

  // const hunterDeaths = deathEvents.filter(
  //   (event) => event.targetID === hunter.actorID
  // );

  // if (hunterDeaths.length === 0) {
  //   return deathEvents;
  // }

  // return deathEvents.filter((event) => {
  //   const isHunterDeath = hunterDeaths.includes(event);

  //   if (!isHunterDeath) {
  //     return true;
  //   }

  //   const nextHunterCD = remarkableSpellEvents.find((e) => {
  //     return e.sourceID === event.targetID && e.timestamp > event.timestamp;
  //   });

  //   if (!nextHunterCD) {
  //     return true;
  //   }

  //   // assume a hunter feigned if he used a cd within the next 2 seconds
  //   // could alternatively be solved by querying
  //   // hostilityType: Friendlies, dataType: Deaths
  //   // once separately...
  //   return nextHunterCD.timestamp - event.timestamp >= 2000;
  // });
};
