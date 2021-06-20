import type {
  AnyEvent,
  ApplyBuffEvent,
  DamageEvent,
  DeathEvent,
} from "../../types";
import { createIsSpecificEvent } from "../../utils";

export const PF_RED_BUFF = {
  unit: 164_705,
  aura: 340_225,
  // buff: 340_227,
} as const;

export const PF_PURPLE_BUFF = {
  unit: 164_707,
  aura: 340_271,
  // buff: 340_273,
} as const;

export const PF_GREEN_BUFF = {
  unit: 163_891,
  aura: 340_210,
  // buff: 340_211,
} as const;

export const PLAGUE_BOMB = 328_501;

/**
 * @see https://www.warcraftlogs.com/reports/MDF7g3JLzjR2xGHK#fight=9&type=summary&view=events&pins=2%24Off%24%23909049%24expression%24type%20%3D%20%22death%22%20and%20target.type%20%3D%20%22npc%22%20and%20target.id%20in%20(164705,%20164707,%20163891)
 */
const unitIDExpression = `type = "death" and target.type = "npc" and target.id in (${PF_RED_BUFF.unit}, ${PF_PURPLE_BUFF.unit}, ${PF_GREEN_BUFF.unit})`;
/**
 * @see https://www.warcraftlogs.com/reports/qGV26X4kLbRFBJDt#fight=5&type=auras&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22applybuff%22%20and%20target.type%20%3D%20%22player%22%20and%20ability.id%20in%20(340225,%20340271,%20340210)
 */
const auraExpression = `type = "applybuff" and target.type = "player" and ability.id in (${PF_RED_BUFF.aura}, ${PF_PURPLE_BUFF.aura}, ${PF_GREEN_BUFF.aura})`;
const debuffExpression = `type = "damage" and ability.id = ${PLAGUE_BOMB}`;

export const filterExpression = [
  unitIDExpression,
  auraExpression,
  debuffExpression,
];

export const isPfSlimeDeathEvent = (
  event: AnyEvent,
  actorIDSet: Set<number>
): event is DeathEvent => {
  return (
    event.type === "death" &&
    !actorIDSet.has(event.targetID) &&
    "targetInstance" in event &&
    event.targetInstance !== undefined
  );
};

export const isPfSlimeBuffEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: [PF_GREEN_BUFF.aura, PF_GREEN_BUFF.aura, PF_PURPLE_BUFF.aura],
});

export const isPfPlagueBombDamageEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: PLAGUE_BOMB,
});

// type PFSlimeKillsParams = GetEventBaseParams & {
//   fightID: number;
// };

// export const getPFSlimeKills = async (
//   params: PFSlimeKillsParams
// ): Promise<(DeathEvent | ApplyBuffEvent)[]> => {
//   const {
//     [PF_RED_BUFF.unit]: red,
//     [PF_GREEN_BUFF.unit]: green,
//     [PF_PURPLE_BUFF.unit]: purple,
//   } = await getEnemyNPCIDs(
//     {
//       fightIDs: [params.fightID],
//       reportID: params.reportID,
//     },
//     [PF_RED_BUFF.unit, PF_GREEN_BUFF.unit, PF_PURPLE_BUFF.unit]
//   );

//   const [
//     redDeathEvents,
//     greenDeathEvents,
//     purpleDeathEvents,
//   ] = await Promise.all<DeathEvent[]>(
//     [red, green, purple].map(async (sourceID) => {
//       if (!sourceID) {
//         return [];
//       }

//       return getEvents<DeathEvent>({
//         ...params,
//         dataType: EventDataType.Deaths,
//         hostilityType: HostilityType.Enemies,
//         sourceID,
//       });
//     })
//   );

//   const earliestUnitDeathTimestamp = [
//     ...redDeathEvents,
//     ...greenDeathEvents,
//     ...purpleDeathEvents,
//   ].reduce(
//     (acc, event) => (acc <= event.timestamp ? acc : event.timestamp),
//     Infinity
//   );

//   const [
//     redAuraApplication,
//     greenAuraApplication,
//     purpleAuraApplication,
//   ] = await Promise.all(
//     [PF_RED_BUFF.aura, PF_GREEN_BUFF.aura, PF_PURPLE_BUFF.aura].map(
//       async (abilityID) => {
//         if (earliestUnitDeathTimestamp === Infinity) {
//           return [];
//         }

//         const events = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
//           ...params,
//           startTime: earliestUnitDeathTimestamp,
//           dataType: EventDataType.Buffs,
//           hostilityType: HostilityType.Friendlies,
//           abilityID,
//         });

//         return events.filter(
//           (event): event is ApplyBuffEvent => event.type === "applybuff"
//         );
//       }
//     )
//   );

//   return [
//     ...redDeathEvents,
//     ...greenDeathEvents,
//     ...purpleDeathEvents,
//     ...redAuraApplication,
//     ...greenAuraApplication,
//     ...purpleAuraApplication,
//   ];

//   // return {
//   //   red: {
//   //     kills: redDeathEvents.length,
//   //     consumed: redAuraApplication.length,
//   //   },
//   //   green: {
//   //     kills: greenDeathEvents.length,
//   //     consumed: greenAuraApplication.length,
//   //   },
//   //   purple: {
//   //     kills: purpleDeathEvents.length,
//   //     consumed: purpleAuraApplication.length,
//   //   },
//   // };
// };
