import { useState } from "react";
import { MdTimeline } from "react-icons/md";
import { RiTableLine } from "react-icons/ri";
import { useFight } from "src/pages/report/[reportID]/[fightID]";
import { useReportStore } from "src/store";
import { bgSecondary } from "src/styles/tokens";
import {
  classTextColorMap,
  createWowheadUrl,
  fightTimeToString,
} from "src/utils";
import { classnames } from "src/utils/classnames";

import type { FightSuccessResponse } from "../../../../api/src/functions/fight";
import {
  classes,
  dungeons,
  spells,
  isBoss,
  isTormentedLieutenant,
} from "../../staticData";
import {
  AbilityIcon,
  BLOODLUST_ICON,
  INVIS_POTION_ICON,
  SHROUD_ICON,
} from "../AbilityIcon";
import { ExternalLink } from "../ExternalLink";
import { detectInvisibilityUsage, hasBloodLust } from "./utils";

type MostRelevantNPCReturn = {
  last: null | ReturnType<typeof findMostRelevantNPCOfPull>;
  current: null | ReturnType<typeof findMostRelevantNPCOfPull>;
  next: null | ReturnType<typeof findMostRelevantNPCOfPull>;
};

const useMostRelevantNPCByPull = (
  selectedPullID: number
): MostRelevantNPCReturn => {
  const { fight } = useFight();

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
  dungeon: typeof dungeons[number]
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
        className="flex items-center space-x-2 focus:outline-none focus:ring"
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
          className={classnames(
            "rounded-full w-8 h-8",
            isFirst && "filter grayscale"
          )}
          width={32}
          height={32}
        />

        {mostRelevantNPCsByPull.last ? (
          <span>{mostRelevantNPCsByPull.last.name}</span>
        ) : null}
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
        className="flex items-center space-x-2 focus:outline-none focus:ring"
        onClick={
          isLast
            ? undefined
            : () => {
                setSelectedPull(selectedPullID + 1);
              }
        }
      >
        {mostRelevantNPCsByPull.next ? (
          <span>{mostRelevantNPCsByPull.next.name}</span>
        ) : null}

        <AbilityIcon
          icon="misc_arrowright"
          alt="Next pull"
          className={classnames(
            "rounded-full w-8 h-8",
            isLast && "filter grayscale"
          )}
          width={32}
          height={32}
        />
      </button>
    </div>
  );
}

function Sidebar() {
  const { fight } = useFight();
  const pulls = fight ? fight.pulls : [];

  const selectedPullID = useReportStore((state) => state.selectedPull);
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
    <div className="flex flex-col w-full rounded-lg lg:w-3/12 dark:bg-coolgray-700">
      {npcs.map((npc) => {
        return (
          <div
            key={npc.id}
            className="flex items-center justify-between w-full px-4 py-2"
          >
            <span>{npc.count}x</span>

            <ExternalLink
              href={createWowheadUrl({
                category: "npc",
                id: npc.id,
              })}
              className="flex items-center flex-1 px-2 truncate"
            >
              <img
                src={`/static/npcs/${npc.id}.png`}
                alt={npc.name}
                className="object-cover w-8 h-8 rounded-full"
                width={32}
                height={32}
              />

              <span className="pl-2 truncate">{npc.name}</span>
            </ExternalLink>

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
          </div>
        );
      })}

      <div className="flex w-full px-4 py-2 border-t-2 place-content-end border-coolgray-600">
        this pull {selectedPull.percent.toFixed(2)}%
      </div>

      <div className="flex w-full px-4 py-2 place-content-end">
        total{" "}
        {pulls
          .reduce(
            (acc, pull) =>
              pull.id <= selectedPull.id ? acc + pull.percent : acc,
            0
          )
          .toFixed(2)}
        %
      </div>
    </div>
  );
}

function Events() {
  const { fight } = useFight();
  const { pulls, player } = fight ?? { pulls: [], player: [] };

  const selectedPullID = useReportStore((state) => state.selectedPull);
  const selectedPull = pulls.find((pull) => pull.id === selectedPullID);

  const [trackedPlayer, setTrackedPlayer] = useState(player.map((p) => p.id));
  const [mode, setMode] = useState<"table" | "timeline">("table");

  if (!selectedPull) {
    return null;
  }

  // const allEvents = pulls.flatMap((pull) => pull.events);

  const isTable = mode === "table";

  const sourceIDPlayerNameMap = Object.fromEntries(
    player.map((p) => [p.id, p.name])
  );

  const sourceIDClassTextColorMap = Object.fromEntries(
    player.map((p) => [
      p.id,
      classTextColorMap[classes[p.class].name.toLowerCase()],
    ])
  );

  const eventsBeforePull = selectedPull.events.filter(
    (event) =>
      event.category === "BEFORE" &&
      event.sourcePlayerID !== null &&
      trackedPlayer.includes(event.sourcePlayerID) &&
      event.type === "Cast"
  );
  const eventsDuringPull = selectedPull.events.filter(
    (event) =>
      event.category === "DURING" &&
      event.sourcePlayerID !== null &&
      trackedPlayer.includes(event.sourcePlayerID) &&
      event.type === "Cast"
  );
  // const eventsAfterPull = selectedPull.events.filter(
  //   (event) =>
  //     event.category === "AFTER" &&
  //     event.sourcePlayerID !== null &&
  //     trackedPlayer.includes(event.sourcePlayerID) &&
  //     event.type === "Cast"
  // );

  return (
    <div className="w-full px-4 py-2 rounded-lg lg:w-9/23 dark:bg-coolgray-700">
      <div className="flex justify-between w-full">
        <div className="flex">
          {player.map((p) => {
            const checked = trackedPlayer.includes(p.id);

            return (
              <span className="p-2" key={p.id}>
                <input
                  type="checkbox"
                  aria-labelledby={`player-${p.id}`}
                  id={`player-${p.id}`}
                  checked={checked}
                  disabled={checked && trackedPlayer.length === 1}
                  onChange={() => {
                    setTrackedPlayer((prev) =>
                      prev.includes(p.id)
                        ? prev.filter((id) => id !== p.id)
                        : [...prev, p.id]
                    );
                  }}
                />
                <label
                  htmlFor={`player-${p.id}`}
                  className={`pl-2 ${sourceIDClassTextColorMap[p.id]}`}
                >
                  {p.name}
                </label>
              </span>
            );
          })}
        </div>

        <div className="hidden md:items-center md:flex">
          <button
            type="button"
            className={classnames(
              "p-2 rounded-tl-lg rounded-bl-lg",
              isTable ? "bg-coolgray-900" : "bg-coolgray-600"
            )}
            onClick={() => {
              setMode("table");
            }}
            disabled={isTable}
            title="View as Table"
          >
            <RiTableLine />
          </button>
          <button
            type="button"
            className={classnames(
              "p-2 rounded-tr-lg rounded-br-lg",
              isTable ? "bg-coolgray-600" : "bg-coolgray-900"
            )}
            onClick={() => {
              setMode("timeline");
            }}
            disabled={!isTable}
            title="View as Timeline"
          >
            <MdTimeline />
          </button>
        </div>
      </div>

      {isTable ? (
        <table className="w-full">
          <thead>
            <tr>
              <th>Rel. Timestamp</th>
              <th>Player</th>
              <th>Ability</th>
              <th>Last Use</th>
              <th>Next Use</th>
            </tr>
          </thead>

          {/* {eventsBeforePull.length > 0 && (
          <tbody>
           
            
          </tbody>
        )} */}

          <tbody
            className={
              eventsBeforePull.length > 0
                ? "border-t-2 border-coolgray-600"
                : undefined
            }
          >
            {eventsDuringPull.map((event, index) => {
              if (!event.ability || !event.sourcePlayerID) {
                return null;
              }

              const ability = spells[event.ability.id];
              const cooldown = ability ? ability.cd : 0;

              const abilityName = ability?.name ?? "Unknown Ability";

              const usedUnderCooldown = cooldown
                ? (event.timestamp - (event.ability.lastUse ?? 0)) / 1000 <=
                  cooldown
                : false;

              const msSinceLastEvent = eventsDuringPull[index - 1]
                ? fightTimeToString(
                    event.timestamp - eventsDuringPull[index - 1].timestamp
                  )
                : -1;

              return (
                <tr
                  key={`${event.timestamp}-${event.sourcePlayerID}-${
                    event.type
                  }-${abilityName.split(" ").join("-")}`.toLowerCase()}
                  className="dark:hover:bg-coolgray-600"
                >
                  <td className="text-right">
                    <span
                      title={
                        msSinceLastEvent === -1
                          ? undefined
                          : `${msSinceLastEvent} after last event`
                      }
                    >
                      {fightTimeToString(event.relTimestamp)}
                    </span>
                  </td>

                  <td
                    className={`${
                      sourceIDClassTextColorMap[event.sourcePlayerID]
                    } text-right`}
                  >
                    {sourceIDPlayerNameMap[event.sourcePlayerID]}
                  </td>

                  <td className="text-right">
                    <ExternalLink
                      href={createWowheadUrl({
                        category: "spell",
                        id: event.ability.id,
                      })}
                    >
                      {abilityName}
                    </ExternalLink>
                  </td>

                  <td
                    className={classnames(
                      "text-right",
                      event.ability.wasted && "text-red-500",
                      usedUnderCooldown && "text-green-500",
                      event.ability.lastUse ? null : "text-yellow-500"
                    )}
                  >
                    {event.ability.lastUse ? (
                      <span>
                        {Math.round(
                          (event.timestamp - event.ability.lastUse) / 1000
                        )}
                        s ago
                      </span>
                    ) : (
                      "first use"
                    )}
                  </td>

                  <td className="text-right">-</td>
                </tr>
              );
            })}
          </tbody>

          {/* {eventsAfterPull.length > 0 && (
          <tbody className="border-t-2 border-coolgray-600">
          
          </tbody>
        )} */}
        </table>
      ) : null}
    </div>
  );
}

export function Pulls(): JSX.Element | null {
  return (
    <div className={`rounded-b-lg ${bgSecondary} p-2`}>
      <div className="w-full">
        <PullSelection />

        <div className="flex flex-col w-full space-y-4 lg:space-x-4 lg:flex-row lg:space-y-0">
          <Sidebar />

          <Events />
        </div>
      </div>
    </div>
  );
}
