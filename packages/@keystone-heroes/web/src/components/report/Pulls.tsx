import { useStaticData } from "src/context/StaticData";
import { useFight } from "src/pages/report/[reportID]/[fightID]";
import { useReportStore } from "src/store";
import { bgSecondary } from "src/styles/tokens";
import { createWowheadUrl } from "src/utils";
import { classnames } from "src/utils/classnames";

import type { FightSuccessResponse } from "../../../../api/src/functions/fight";
import type { StaticData } from "../../staticData";
import { isBoss, isTormentedLieutenant } from "../../staticData";
import {
  AbilityIcon,
  BLOODLUST_ICON,
  INVIS_POTION_ICON,
  SHROUD_ICON,
} from "../AbilityIcon";
import { ExternalLink } from "../ExternalLink";
import { detectInvisibilityUsage, hasBloodLust } from "./utils";

// type PullHeaderProps = {
//   percentUpToThisPull: string;
//   pull: FightSuccessResponse["pulls"][number];
//   firstPullStartTime: number;
//   selected: boolean;
// };

// function PullHeader({
//   percentUpToThisPull,
//   pull,
//   firstPullStartTime,
//   selected,
// }: PullHeaderProps) {
//   const { reportID, fightID } = useFight();

//   const deaths = pull.events.filter(
//     (event) => event.type === "Death" && !event.targetNPC
//   ).length;
//   const setSelectedPull = useReportStore((state) => state.setSelectedPull);

//   return (
//     <div
//       className={classnames(
//         "flex justify-between w-full p-2 shadow-lg shadow-sm",
//         bgPrimary,
//         selected ? "rounded-t-lg" : "rounded-lg"
//       )}
//     >
//       <div className="flex items-center">
//         <span>{pull.id}</span>
//         <span>{pull.percent > 0 ? <>{pull.percent.toFixed(2)}%</> : "-"}</span>
//         <span className="italic text-gray-500 dark:text-gray-400">
//           ({percentUpToThisPull}%)
//         </span>
//         <span>{fightTimeToString(pull.endTime - pull.startTime, true)}</span>
//         <span className="italic text-gray-500 dark:text-gray-400">
//           ({fightTimeToString(pull.endTime - firstPullStartTime, true)})
//         </span>
//         <span className="flex space-x-2">
//           {pull.npcs.map((npc) => (
//             <span
//               key={npc.id}
//               className="flex items-center w-10 h-10 space-x-2 lg:w-12 lg:h-12"
//             >
//               <span>{npc.count}</span>
//               <ExternalLink
//                 href={createWowheadUrl({
//                   category: "npc",
//                   id: npc.id,
//                 })}
//               >
//                 <img
//                   src={`/static/npcs/${npc.id}.png`}
//                   alt={npc.name}
//                   title={npc.name}
//                   className="object-cover w-8 h-8 rounded-full"
//                 />
//               </ExternalLink>
//             </span>
//           ))}
//         </span>
//       </div>
//       <div className="flex items-center space-x-2">
//         {deaths > 0 && (
//           <ExternalLink
//             className="relative inline-flex items-center justify-center w-8 h-8"
//             href={createWCLUrl({
//               reportID,
//               fightID,
//               start: pull.startTime,
//               end: pull.endTime,
//               type: "deaths",
//             })}
//           >
//             <style jsx>
//               {`
//                 .deaths {
//                   background-image: url(/static/icons/ability_rogue_feigndeath.jpg);
//                 }
//               `}
//             </style>
//             <div
//               className="absolute w-full h-full bg-center bg-cover rounded-full opacity-25 deaths"
//               title="View deaths of this pull on WarcraftLogs"
//             />
//             <div className="font-bold text-red-500">{deaths}</div>
//           </ExternalLink>
//         )}
//         <ExternalLink
//           href={createWCLUrl({
//             reportID,
//             fightID,
//             start: pull.startTime,
//             end: pull.endTime,
//           })}
//         >
//           <img
//             src="/static/icons/wcl.png"
//             alt="View this pull on WarcraftLogs"
//             title="View this pull on WarcraftLogs"
//             className="w-8 h-8"
//           />
//         </ExternalLink>
//         <button
//           type="button"
//           onClick={() => {
//             setSelectedPull(pull.id);
//           }}
//         >
//           <img
//             src="/static/icons/misc_arrowdown.jpg"
//             alt={`${selected ? "Hide" : "Show"} pull details`}
//             title={`${selected ? "Hide" : "Show"} pull details`}
//             className={classnames(
//               "w-8 h-8 filter rounded-full",
//               selected ? "" : "grayscale hover:grayscale-0"
//             )}
//           />
//         </button>
//       </div>
//     </div>
//   );
// }

type MostRelevantNPCReturn = {
  last: null | ReturnType<typeof findMostRelevantNPCOfPull>;
  current: null | ReturnType<typeof findMostRelevantNPCOfPull>;
  next: null | ReturnType<typeof findMostRelevantNPCOfPull>;
};

const useMostRelevantNPCByPull = (
  selectedPullID: number
): MostRelevantNPCReturn => {
  const { fight } = useFight();
  const { dungeons } = useStaticData();

  if (!fight) {
    return {
      last: null,
      current: null,
      next: null,
    };
  }

  const dungeon = dungeons[fight.dungeon];

  if (!dungeon) {
    return {
      last: null,
      current: null,
      next: null,
    };
  }

  return fight.pulls.reduce<MostRelevantNPCReturn>(
    (acc, pull) => {
      if (pull.id === selectedPullID - 1) {
        return {
          ...acc,
          last: findMostRelevantNPCOfPull(pull, dungeon),
        };
      }

      if (pull.id === selectedPullID) {
        return {
          ...acc,
          current: findMostRelevantNPCOfPull(pull, dungeon),
        };
      }

      if (pull.id === selectedPullID + 1) {
        return {
          ...acc,
          next: findMostRelevantNPCOfPull(pull, dungeon),
        };
      }

      return acc;
    },
    {
      last: null,
      current: null,
      next: null,
    }
  );
};

const findMostRelevantNPCOfPull = (
  pull: FightSuccessResponse["pulls"][number],
  dungeon: StaticData["dungeons"][number]
) => {
  const boss = pull.npcs.find((npc) => isBoss(npc.id));

  if (boss) {
    return boss;
  }

  const lieutenant = pull.npcs.find((npc) => isTormentedLieutenant(npc.id));

  if (lieutenant) {
    return lieutenant;
  }

  type EnhancedNPC = typeof pull.npcs[number] & { rawCount: number };

  const npcWithHighestCount = pull.npcs
    .map<EnhancedNPC>((npc) => ({
      ...npc,
      rawCount: dungeon.unitCountMap[npc.id] ?? 0,
    }))
    .reduce<EnhancedNPC | null>((acc, npc) => {
      if (!acc) {
        return npc;
      }

      // identical count gain; compare amount of units in pull and pick higher
      // or first if identical
      if (acc.rawCount === npc.rawCount) {
        return acc.count >= npc.count ? acc : npc;
      }

      // pick npc with most raw count as its likely the most noteworthy npc
      return acc.rawCount > npc.rawCount ? acc : npc;
    }, null);

  return npcWithHighestCount ?? { id: 0, count: 0, name: "Unknown" };
};

function PullSelection() {
  const { fight } = useFight();

  const selectedPullID = useReportStore((state) => state.selectedPull);
  const setSelectedPull = useReportStore((state) => state.setSelectedPull);
  const mostRelevantNPCsByPull = useMostRelevantNPCByPull(selectedPullID);

  if (!fight || !mostRelevantNPCsByPull.current) {
    return null;
  }

  const selectedPull = fight.pulls.find((pull) => pull.id === selectedPullID);

  if (!selectedPull) {
    return null;
  }

  const isFirst = selectedPullID === 1;
  const isLast = fight.pulls[fight.pulls.length - 1].id === selectedPullID;

  const lastPull = isFirst ? null : fight.pulls[selectedPullID - 2];

  const usedBloodlustOrHeroism = hasBloodLust(selectedPull);
  const invisibilityType = lastPull ? detectInvisibilityUsage(lastPull) : null;

  return (
    <div className="flex justify-between w-full p-4">
      <button
        type="button"
        disabled={isFirst}
        className="w-8 h-8 rounded-full"
        onClick={
          isFirst
            ? undefined
            : () => {
                setSelectedPull(selectedPullID - 1);
              }
        }
      >
        <AbilityIcon
          icon="misc_arrowleft"
          alt="Last pull"
          className={classnames("rounded-full", isFirst && "filter grayscale")}
          width={32}
          height={32}
        />
      </button>

      <div className="flex space-x-2">
        {invisibilityType ? (
          <span>
            {invisibilityType === "shroud" ? (
              <img
                src={SHROUD_ICON}
                alt="Shroud of Concealment was used before this pull."
                title="Shroud of Concealment was used before this pull."
                className="object-cover w-8 h-8 rounded-full"
                width={32}
                height={32}
              />
            ) : null}
            {invisibilityType === "invisibility" ? (
              <img
                src={INVIS_POTION_ICON}
                alt="Invisibility was used before this pull."
                title="Invisibility was used before this pull."
                className="object-cover w-8 h-8 rounded-full"
                width={32}
                height={32}
              />
            ) : null}
          </span>
        ) : null}

        <ExternalLink
          href={createWowheadUrl({
            category: "npc",
            id: mostRelevantNPCsByPull.current.id,
          })}
          className="flex items-center space-x-2"
        >
          <img
            src={`/static/npcs/${mostRelevantNPCsByPull.current.id}.png`}
            alt={mostRelevantNPCsByPull.current.name}
            className="object-cover w-8 h-8 rounded-full"
            width={32}
            height={32}
          />

          <span>{mostRelevantNPCsByPull.current.name}</span>
        </ExternalLink>

        <span>
          {usedBloodlustOrHeroism ? (
            <img
              src={BLOODLUST_ICON}
              alt="Some form of Bloodlust/Heroism was used on this pull."
              title="Some form of Bloodlust/Heroism was used on this pull."
              className="object-cover w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
          ) : null}
        </span>
      </div>

      <button
        type="button"
        disabled={isLast}
        className="w-8 h-8"
        onClick={
          isLast
            ? undefined
            : () => {
                setSelectedPull(selectedPullID + 1);
              }
        }
      >
        <AbilityIcon
          icon="misc_arrowright"
          alt="Next pull"
          className={classnames("rounded-full", isLast && "filter grayscale")}
          width={32}
          height={32}
        />
      </button>
    </div>
  );
}

export function Pulls(): JSX.Element | null {
  const { fight } = useFight();
  const pulls = fight ? fight.pulls : [];
  const selectedPullID = useReportStore((state) => state.selectedPull);
  const { dungeons } = useStaticData();
  // const player = fight ? fight.player : [];

  const selectedPull = pulls.find((pull) => pull.id === selectedPullID);
  const dungeon = fight ? dungeons[fight.dungeon] : null;

  if (!selectedPull || !dungeon) {
    return null;
  }

  const npcs = selectedPull.npcs
    .map((npc) => {
      const countPerNPC =
        npc.id in dungeon.unitCountMap ? dungeon.unitCountMap[npc.id] : 0;
      const percentPerNPC =
        countPerNPC === 0 ? 0 : (countPerNPC / dungeon.count) * 100;
      const totalPercent = percentPerNPC === 0 ? 0 : npc.count * percentPerNPC;

      return {
        ...npc,
        totalPercent,
        percentPerNPC,
        countPerNPC,
        isBoss: isBoss(npc.id),
        isTormentedLieutenant: isTormentedLieutenant(npc.id),
      };
    })
    .sort((a, b) => {
      if (a.isBoss || a.isTormentedLieutenant) {
        return -1;
      }

      if (b.isBoss || b.isTormentedLieutenant) {
        return 1;
      }

      if (a.totalPercent === b.totalPercent) {
        if (a.totalPercent === 0) {
          return -1;
        }

        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (nameB > nameA) {
          return -1;
        }

        if (nameA > nameB) {
          return 1;
        }

        return 0;
      }

      return a.totalPercent > b.totalPercent ? -1 : 1;
    });

  return (
    <div className={`rounded-b-lg ${bgSecondary} p-2`}>
      <div className="w-full">
        <PullSelection />

        <div className="flex flex-col w-full space-y-4 lg:space-x-4 lg:flex-row lg:space-y-0">
          <div className="flex flex-col w-full rounded-lg lg:w-3/12 dark:bg-coolgray-700">
            {npcs.map((npc) => {
              return (
                <div
                  key={npc.id}
                  className="flex justify-between w-full px-4 py-2"
                >
                  <ExternalLink
                    href={createWowheadUrl({
                      category: "npc",
                      id: npc.id,
                    })}
                    className="flex items-center w-full"
                  >
                    <span>{npc.count}x</span>

                    <span className="flex items-center flex-1 px-2 truncate">
                      <img
                        src={`/static/npcs/${npc.id}.png`}
                        alt={npc.name}
                        className="object-cover w-8 h-8 rounded-full"
                        width={32}
                        height={32}
                      />

                      <span className="pl-2 truncate">{npc.name}</span>
                    </span>

                    {npc.totalPercent && npc.percentPerNPC ? (
                      <span
                        title={`${npc.percentPerNPC.toFixed(2)}% or ${
                          npc.countPerNPC
                        } count per NPC`}
                        className="justify-self-end"
                      >
                        {npc.totalPercent.toFixed(2)}%
                      </span>
                    ) : null}
                  </ExternalLink>
                </div>
              );
            })}
          </div>

          <div className="flex w-full px-4 py-2 rounded-lg lg:w-9/23 dark:bg-coolgray-700">
            ph
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="space-y-4">
  //     {pulls.map((pull, index) => {
  //       const selected = selectedPull === pull.id;

  //       const percentUpToThisPull = pulls
  //         .slice(0, index + 1)
  //         .reduce((acc, pull) => acc + pull.percent, 0)
  //         .toFixed(2);

  //       return (
  //         <div key={pull.id}>
  //           <PullHeader
  //             pull={pull}
  //             percentUpToThisPull={percentUpToThisPull}
  //             firstPullStartTime={pulls[0].startTime}
  //             selected={selected}
  //           />
  //           {selected && <PullBody pull={pull} player={player} />}
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
}

// type PullBodyProps = {
//   pull: FightSuccessResponse["pulls"][number];
//   player: FightSuccessResponse["player"];
// };

// function PullBody({ pull, player }: PullBodyProps) {
//   const { spells } = useStaticData();
//   const { events } = pull;

//   const sourceIDPlayerNameMap = Object.fromEntries(
//     player.map((p) => [p.id, p.name])
//   );

//   return (
//     <div className={`p-2 rounded-b-lg shadow-sm ${bgSecondary}`}>
//       {events
//         .filter(
//           (event) => "sourcePlayerID" in event && event.sourcePlayerID !== null
//         )
//         .map((event) => {
//           const ability = event.ability ? spells[event.ability.id] : null;

//           return (
//             <p
//               key={`${event.timestamp}-${
//                 event.sourceNPC
//                   ? event.sourceNPC.id
//                   : event.sourcePlayerID
//                   ? event.sourcePlayerID
//                   : event.targetPlayerID ?? "unknown"
//               }-${event.ability?.id ?? ""}`}
//               data-category={event.category}
//             >
//               Type: {event.type} | Source:{" "}
//               {event.sourcePlayerID ? (
//                 sourceIDPlayerNameMap[event.sourcePlayerID]
//               ) : event.sourceNPC ? (
//                 <ExternalLink
//                   href={`https://wowhead.com/npc=${event.sourceNPC.id}`}
//                 >
//                   {event.sourceNPC.name}
//                 </ExternalLink>
//               ) : (
//                 "unknown"
//               )}{" "}
//               | Ability:{" "}
//               {event.ability && ability ? (
//                 <ExternalLink
//                   href={`https://wowhead.com/spell=${event.ability.id}`}
//                 >
//                   <AbilityIcon
//                     className="inline w-6 h-6"
//                     icon={ability.icon}
//                     alt={ability.name}
//                     title={
//                       event.ability.lastUse
//                         ? `Last used ${Math.round(
//                             (event.timestamp - event.ability.lastUse) / 1000
//                           )} seconds ago.`
//                         : "First usage."
//                     }
//                   />{" "}
//                   {ability.name}
//                 </ExternalLink>
//               ) : (
//                 "-"
//               )}
//             </p>
//           );
//         })}
//     </div>
//   );
// }
