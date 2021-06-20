import type { PlayableClass } from "@keystone-heroes/db/types";

import type {
  AllTrackedEventTypes,
  AnyEvent,
  ApplyBuffEvent,
  DamageEvent,
  DeathEvent,
} from "../types";
import {
  createChunkByThresholdReducer,
  createIsSpecificEvent,
  reduceEventsByPlayer,
} from "../utils";

const RED_BUFF = {
  unit: 164_705,
  aura: 340_225,
  // buff: 340_227,
} as const;

const PURPLE_BUFF = {
  unit: 164_707,
  aura: 340_271,
  // buff: 340_273,
} as const;

const GREEN_BUFF = {
  unit: 163_891,
  aura: 340_210,
  // buff: 340_211,
} as const;

export const PF = {
  PLAGUE_BOMB: 328_501,
  RIGGED_PLAGUEBORER: 168_878,
  GREEN_BUFF,
  RED_BUFF,
  PURPLE_BUFF,
};

/**
 * @see https://www.warcraftlogs.com/reports/MDF7g3JLzjR2xGHK#fight=9&type=summary&view=events&pins=2%24Off%24%23909049%24expression%24type%20%3D%20%22death%22%20and%20target.type%20%3D%20%22npc%22%20and%20target.id%20in%20(164705,%20164707,%20163891)
 */
const unitIDExpression = `type = "death" and target.type = "npc" and target.id in (${RED_BUFF.unit}, ${PURPLE_BUFF.unit}, ${GREEN_BUFF.unit})`;
/**
 * @see https://www.warcraftlogs.com/reports/qGV26X4kLbRFBJDt#fight=5&type=auras&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22applybuff%22%20and%20target.type%20%3D%20%22player%22%20and%20ability.id%20in%20(340225,%20340271,%20340210)
 */
const auraExpression = `type = "applybuff" and target.type = "player" and ability.id in (${RED_BUFF.aura}, ${PURPLE_BUFF.aura}, ${GREEN_BUFF.aura})`;
const debuffExpression = `type = "damage" and ability.id = ${PF.PLAGUE_BOMB}`;

export const filterExpression = [
  unitIDExpression,
  auraExpression,
  debuffExpression,
];

const createIsPfSlimeDeathEvent =
  (actorIDSet: Set<number>) =>
  (event: AnyEvent): event is DeathEvent => {
    return (
      event.type === "death" &&
      !actorIDSet.has(event.targetID) &&
      "targetInstance" in event &&
      event.targetInstance !== undefined
    );
  };

const isPfSlimeBuffEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: [GREEN_BUFF.aura, RED_BUFF.aura, PURPLE_BUFF.aura],
});

const isPfPlagueBombDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: PF.PLAGUE_BOMB,
});

// ApplyBuff events fire a lot for the PF Slime Auras for some reason
// Fleshcraft gets its CD reduced, but its unlikely to reduce it by 75%
const pfSlimeBuffReducer = createChunkByThresholdReducer(30 * 1000);

export const getPFEvents = (
  allEvents: AllTrackedEventTypes,
  playerMetaInformation: { actorID: number; class: PlayableClass }[]
): (DeathEvent | DamageEvent | ApplyBuffEvent)[] => {
  const actorIDSet = new Set(
    playerMetaInformation.map((player) => player.actorID)
  );

  const plagueBombDamageEvents = allEvents.filter(isPfPlagueBombDamageEvent);

  const plagueBombDamageTakenEvents = reduceEventsByPlayer(
    plagueBombDamageEvents.filter((event) => actorIDSet.has(event.targetID)),
    "targetID"
  );
  const plagueBombDamageDoneEvents = plagueBombDamageEvents.filter(
    (event) => !actorIDSet.has(event.targetID)
  );

  const aggregatedPlagueBombDamageEvent =
    plagueBombDamageDoneEvents.length > 0
      ? plagueBombDamageDoneEvents.reduce((acc, event) => {
          if (acc === event) {
            return acc;
          }

          return {
            ...acc,
            amount: acc.amount + event.amount - (event.overkill ?? 0),
          };
        }, plagueBombDamageDoneEvents[0])
      : null;

  const buffEvents = allEvents.filter(isPfSlimeBuffEvent).reduce<{
    red: ApplyBuffEvent[];
    green: ApplyBuffEvent[];
    purple: ApplyBuffEvent[];
  }>(
    (acc, event) => {
      switch (event.abilityGameID) {
        case GREEN_BUFF.aura:
          return { ...acc, green: [...acc.green, event] };
        case RED_BUFF.aura:
          return { ...acc, red: [...acc.red, event] };
        case PURPLE_BUFF.aura:
          return { ...acc, purple: [...acc.purple, event] };
      }

      return acc;
    },
    {
      red: [],
      green: [],
      purple: [],
    }
  );

  return [
    ...allEvents.filter(createIsPfSlimeDeathEvent(actorIDSet)),
    ...buffEvents.green
      .reduce<ApplyBuffEvent[][]>(pfSlimeBuffReducer, [])
      .flatMap((chunk) => chunk[0]),
    ...buffEvents.red
      .reduce<ApplyBuffEvent[][]>(pfSlimeBuffReducer, [])
      .flatMap((chunk) => chunk[0]),
    ...buffEvents.purple
      .reduce<ApplyBuffEvent[][]>(pfSlimeBuffReducer, [])
      .flatMap((chunk) => chunk[0]),
    ...plagueBombDamageTakenEvents,
    ...(aggregatedPlagueBombDamageEvent
      ? [aggregatedPlagueBombDamageEvent]
      : []),
  ];
};
