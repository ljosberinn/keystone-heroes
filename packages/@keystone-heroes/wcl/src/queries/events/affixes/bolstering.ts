// type StackDataset = {
//   targetID: number;
//   targetInstance: number | null;
//   stacks: number;
// };

import type { ApplyBuffEvent } from "..";
import { createIsSpecificEvent } from "../utils";

export const BOLSTERING = 209_859;

/**
 * @see https://www.warcraftlogs.com/reports/mBf1t94GZ2hRWprv#fight=7&type=auras&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22applybuff%22%20and%20ability.id%20%3D%20209859%20and%20target.type%20%3D%20%22NPC%22&hostility=1
 *
 * ```gql
 * {
 *   reportData {
 *     report(code: "mBf1t94GZ2hRWprv") {
 *       fights(fightIDs: [7]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 5996572, endTime: 7458759, limit: 2000, filterExpression: "type = \"applybuff\" and ability.id = 209859 and target.type = \"NPC\"") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = `type = "applybuff" and ability.id = ${BOLSTERING} and target.type = "NPC"`;

export const isBolsteringEvent = createIsSpecificEvent<ApplyBuffEvent>({
  type: "applybuff",
  abilityGameID: BOLSTERING,
});

// export const getBolsteringEvents = async (
//   params: GetEventBaseParams
// ): Promise<ApplyBuffEvent[]> => {
//   const allEvents = await getEvents<ApplyBuffEvent>({
//     ...params,
//     filterExpression,
//   });

//   const stacksPerNPC = allEvents.reduce<StackDataset[]>(
//     (acc, { targetID, targetInstance = null }) => {
//       const existingIndex = acc.findIndex(
//         (dataset) =>
//           dataset.targetInstance === targetInstance &&
//           targetID === dataset.targetID
//       );

//       if (existingIndex > -1) {
//         return acc.map((dataset, index) =>
//           index === existingIndex
//             ? { ...dataset, stacks: dataset.stacks + 1 }
//             : dataset
//         );
//       }

//       return [
//         ...acc,
//         {
//           targetID,
//           targetInstance,
//           stacks: 1,
//         },
//       ];
//     },
//     []
//   );

//   const highestStack = stacksPerNPC.reduce((acc, dataset) =>
//     acc?.stacks >= dataset.stacks ? acc : dataset
//   );

//   const NPCsWithSameFinalStackAmount = stacksPerNPC.filter(
//     (dataset) => dataset.stacks === highestStack.stacks
//   );

//   return allEvents.reduce<(ApplyBuffEvent & { stacks: number })[]>(
//     (acc, event) => {
//       const dataset = NPCsWithSameFinalStackAmount.find(
//         (npc) =>
//           npc.targetID === event.targetID &&
//           npc.targetInstance === event.targetInstance
//       );

//       if (!dataset) {
//         return acc;
//       }

//       const previousMatch = acc.find(
//         (oldEvent) =>
//           oldEvent.targetID === event.targetID &&
//           oldEvent.targetInstance === event.targetInstance
//       );

//       const enhancedEvent = { ...event, stacks: dataset.stacks };

//       if (!previousMatch) {
//         return [...acc, enhancedEvent];
//       }

//       // implicitly means it must be a higher stack amount as targetID and
//       // targetInstance match
//       const isNewer = event.timestamp > previousMatch.timestamp;

//       if (isNewer) {
//         return [
//           ...acc.filter((oldEvent) => oldEvent !== previousMatch),
//           enhancedEvent,
//         ];
//       }

//       return acc;
//     },
//     []
//   );
// };
