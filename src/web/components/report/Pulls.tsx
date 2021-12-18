import dynamic from "next/dynamic";
import { Suspense, useState, SuspenseList, useMemo } from "react";

import type { FightSuccessResponse } from "../../../api/functions/fight";
import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import { outlineQuestionCircle } from "../../icons";
import {
  classes,
  dungeons,
  spells,
  isBoss,
  isTormentedLieutenant,
  EXPLOSIVE,
  affixNameIdMap,
} from "../../staticData";
import { usePullSettings, useReportStore } from "../../store";
import { bgPrimary, bgSecondary } from "../../styles/tokens";
import {
  createWowheadUrl,
  timeDurationToString,
  classTextColorMap,
} from "../../utils";
import { classnames } from "../../utils/classnames";
import {
  AbilityIcon,
  INVIS_POTION_ICON,
  SHROUD_ICON,
  STATIC_ICON_PREFIX,
} from "../AbilityIcon";
import { ErrorBoundary } from "../ErrorBoundary";
import { ExternalLink } from "../ExternalLink";
import { SpecIcon } from "../SpecIcon";
import { PullMetaProvider } from "./PullDetailsSettings";
import { SidebarNPC } from "./SidebarNPC";
import type { SourceOrTargetPlayerCellProps } from "./cells";
import { usePullNPCs } from "./hooks";
import type { DefaultEvent } from "./utils";
import {
  isAbilityReadyEventWithAbilityAndSourcePlayer,
  isApplyBuffEventWithAbility,
  isCastEventWithAbilityAndSourcePlayer,
  isDamageDoneEventWithAbility,
  isDamageTakenEventWithTargetPlayer,
  isHealingDoneEventWithAbility,
  isInterruptEventWithSourceAndTargetPlayerAndAbility,
  isPlayerOrNPCDeathEvent,
  detectInvisibilityUsage,
  isViolentDetonationDamageEvent,
  isApplyDebuffEventWithAbility,
  isSanguineHealEvent,
  findBloodlust,
  isPlagueBombDamageEvent,
  isExplosivesDamageEvent,
  isMissingInterruptEventWithAbility,
  isThrowCleaverDamageEvent,
} from "./utils";

type MostRelevantNPCReturn = {
  last: null | ReturnType<typeof findMostRelevantNPCOfPull>;
  current: null | ReturnType<typeof findMostRelevantNPCOfPull>;
  next: null | ReturnType<typeof findMostRelevantNPCOfPull>;
};

const useMostRelevantNPCByPull = (
  selectedPullID: number
): MostRelevantNPCReturn => {
  const { fight } = useFight();

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

  if (!mostRelevantNPCsByPull.current) {
    return null;
  }

  const selectedPull = fight.pulls[selectedPullID - 1];

  const isFirst = selectedPullID === 1;
  const isLast = fight.pulls[fight.pulls.length - 1].id === selectedPullID;

  const lastPull = isFirst ? null : fight.pulls[selectedPullID - 2];

  const usedBloodlustOrHeroism = findBloodlust(selectedPull);
  const lustAbility = usedBloodlustOrHeroism
    ? spells[usedBloodlustOrHeroism]
    : null;
  const invisibilityType = lastPull ? detectInvisibilityUsage(lastPull) : null;

  return (
    <div className="flex justify-between w-full p-4">
      <button
        type="button"
        disabled={isFirst}
        className="flex items-center w-1/3 space-x-2 focus:outline-none focus:ring"
        onClick={() => {
          setSelectedPull(selectedPullID - 1);
        }}
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

      <div className="flex justify-center w-1/3 space-x-2">
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
                loading="lazy"
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
                loading="lazy"
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
            loading="lazy"
          />

          <span>{`${mostRelevantNPCsByPull.current.name} ${
            selectedPull.isWipe ? "(Wipe)" : ""
          }`}</span>
        </ExternalLink>

        <span>
          {usedBloodlustOrHeroism && lustAbility ? (
            <img
              src={`${STATIC_ICON_PREFIX}${lustAbility.icon}.jpg`}
              alt="Some form of Bloodlust/Heroism was used on this pull."
              title="Some form of Bloodlust/Heroism was used on this pull."
              className="object-cover w-8 h-8 rounded-full"
              width={32}
              height={32}
              loading="lazy"
            />
          ) : null}
        </span>
      </div>

      <button
        type="button"
        disabled={isLast}
        className="flex items-center justify-end w-1/3 space-x-2 focus:outline-none focus:ring"
        onClick={() => {
          setSelectedPull(selectedPullID + 1);
        }}
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
  const pullNPCs = usePullNPCs();

  if (!pullNPCs) {
    return null;
  }

  return (
    <div className="flex flex-col w-full bg-white rounded-lg lg:w-3/12 dark:bg-gray-700">
      <div className="flex w-full p-2 justify-evenly">
        <span>
          {timeDurationToString(
            pullNPCs.pull.startTime - fight.meta.startTime,
            true
          )}{" "}
          -{" "}
          {timeDurationToString(
            pullNPCs.pull.endTime - fight.meta.startTime,
            true
          )}{" "}
          (+
          {timeDurationToString(
            pullNPCs.pull.endTime - pullNPCs.pull.startTime,
            true
          )}
          )
        </span>
      </div>

      {pullNPCs.npcs.map((npc) => {
        return <SidebarNPC npc={npc} key={npc.id} />;
      })}

      {pullNPCs.explosives.size > 0 && (
        <SidebarNPC
          npc={{
            count: pullNPCs.explosives.size,
            countPerNPC: 0,
            id: EXPLOSIVE.unit,
            name: "Explosives",
            percentPerNPC: null,
            totalPercent: null,
          }}
        />
      )}

      <div className="flex w-full px-4 py-2 border-t-2 border-gray-600 place-content-end">
        this pull {pullNPCs.pull.percent.toFixed(2)}%
      </div>

      <div className="flex w-full px-4 py-2 place-content-end">
        total {pullNPCs.percentAfterThisPull.toFixed(2)}%
      </div>
    </div>
  );
}

function usePullSummaryRows(
  selectedPull: FightSuccessResponse["pulls"][number]
) {
  const { dungeon, affixes } = useFight().fight;

  const isPlaguefall = dungeons[dungeon].slug === "PF";
  const isNecroticWake = dungeons[dungeon].slug === "NW";

  return {
    sanguineHealEvents: affixes.includes(affixNameIdMap.sanguine)
      ? selectedPull.events.filter(isSanguineHealEvent)
      : [],
    plagueBombDamageEvents: isPlaguefall
      ? selectedPull.events.filter(isPlagueBombDamageEvent)
      : [],
    violentDetonationDamageEvents: isPlaguefall
      ? selectedPull.events.filter(isViolentDetonationDamageEvent)
      : [],
    explosivesEvents: affixes.includes(affixNameIdMap.explosive)
      ? selectedPull.events.filter(isExplosivesDamageEvent)
      : [],
    throwCleaverDamageEvents: isNecroticWake
      ? selectedPull.events.filter(isThrowCleaverDamageEvent)
      : [],
  };
}

type EventCategory = "before" | "during" | "after";

function Events() {
  const { pulls, player, meta } = useFight().fight;

  const selectedPullID = useReportStore((state) => state.selectedPull);
  const selectedPull = pulls[selectedPullID - 1];

  const [trackedPlayer, setTrackedPlayer] = useState(player.map((p) => p.id));

  const playerIdPlayerNameMap = useMemo(
    () => Object.fromEntries<string>(player.map((p) => [p.id, p.name])),
    [player]
  );

  const playerIdTextColorMap = useMemo(
    () =>
      Object.fromEntries(
        player.map((p) => [
          p.id,
          classTextColorMap[classes[p.class].name.toLowerCase()],
        ])
      ),
    [player]
  );

  const playerIdIconMap = useMemo(
    () =>
      Object.fromEntries(
        player.map((player) => {
          const { name, specs } = classes[player.class];
          const spec = specs.find((spec) => spec.id === player.spec);

          return [
            player.id,

            <span className="block w-4 h-4" key={player.actorID}>
              {spec ? (
                <SpecIcon size={4} class={name} spec={spec.name} />
              ) : null}
            </span>,
          ];
        })
      ),
    [player]
  );

  const { before, during, after } = selectedPull.events.reduce<
    Record<EventCategory, DefaultEvent[]>
  >(
    (acc, event) => {
      if (
        (event.sourcePlayerID &&
          !trackedPlayer.includes(event.sourcePlayerID)) ||
        (event.targetPlayerID && !trackedPlayer.includes(event.targetPlayerID))
      ) {
        return acc;
      }

      if (event.category === "BEFORE") {
        return {
          ...acc,
          before: [...acc.before, event],
        };
      }

      if (event.category === "DURING") {
        return {
          ...acc,
          during: [...acc.during, event],
        };
      }

      if (event.category === "AFTER") {
        return {
          ...acc,
          after: [...acc.after, event],
        };
      }

      return acc;
    },
    {
      before: [],
      during: [],
      after: [],
    }
  );

  const {
    explosivesEvents,
    plagueBombDamageEvents,
    sanguineHealEvents,
    throwCleaverDamageEvents,
    violentDetonationDamageEvents,
  } = usePullSummaryRows(selectedPull);

  return (
    <div className="w-full min-h-screen px-4 py-2 bg-white rounded-lg lg:w-9/23 dark:bg-gray-700">
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
                  className={`pl-2 ${playerIdTextColorMap[p.id]}`}
                >
                  {p.name}
                </label>
              </span>
            );
          })}
        </div>
      </div>

      <table className="w-full">
        <TableSettings />
        <TableHead />

        <PullMetaProvider
          fightStartTime={meta.startTime}
          pullEndTime={selectedPull.endTime}
        >
          {before.length > 0 && (
            <ErrorBoundary>
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center">
                    <span
                      className="font-semibold"
                      title="Events that happend closer to this pull than the last can be found here."
                    >
                      Before Pull
                      <sup className="hidden lg:inline">
                        <svg className="inline w-4 h-4 ml-2 text-black dark:text-white">
                          <use href={`#${outlineQuestionCircle.id}`} />
                        </svg>
                      </sup>
                    </span>
                  </td>
                </tr>
                <SuspenseList revealOrder="forwards">
                  {before.map((event, index) => {
                    const msSinceLastEvent = before[index - 1]
                      ? timeDurationToString(
                          event.timestamp - before[index - 1].timestamp
                        )
                      : timeDurationToString(0);

                    return (
                      <Suspense
                        fallback={null}
                        key={createRowKey(event, index)}
                      >
                        <TableRow
                          event={event}
                          msSinceLastEvent={msSinceLastEvent}
                          playerIdPlayerNameMap={playerIdPlayerNameMap}
                          playerIdTextColorMap={playerIdTextColorMap}
                          playerIdIconMap={playerIdIconMap}
                        />
                      </Suspense>
                    );
                  })}
                </SuspenseList>
              </tbody>
            </ErrorBoundary>
          )}

          <ErrorBoundary>
            <tbody
              className={
                before.length > 0 ? "border-t-2 border-gray-900" : undefined
              }
            >
              <tr>
                <td colSpan={6} className="text-center">
                  <span className="font-semibold">During Pull</span>
                </td>
              </tr>
              <SuspenseList revealOrder="forwards">
                {during.map((event, index) => {
                  const msSinceLastEvent = during[index - 1]
                    ? timeDurationToString(
                        event.timestamp - during[index - 1].timestamp
                      )
                    : timeDurationToString(
                        before.length > 0
                          ? event.timestamp -
                              before[before.length - 1].timestamp
                          : 0
                      );

                  return (
                    <Suspense fallback={null} key={createRowKey(event, index)}>
                      <TableRow
                        event={event}
                        msSinceLastEvent={msSinceLastEvent}
                        playerIdPlayerNameMap={playerIdPlayerNameMap}
                        playerIdTextColorMap={playerIdTextColorMap}
                        playerIdIconMap={playerIdIconMap}
                      />
                    </Suspense>
                  );
                })}
              </SuspenseList>
            </tbody>
          </ErrorBoundary>

          {after.length > 0 && (
            <ErrorBoundary>
              <tbody className="border-t-2 border-gray-900">
                <tr>
                  <td colSpan={6} className="text-center">
                    <span
                      className="font-semibold"
                      title="Events that happend closer to this pull than the next can be found here."
                    >
                      After Pull
                      <sup className="hidden lg:inline">
                        <svg className="inline w-4 h-4 ml-2 text-black dark:text-white">
                          <use href={`#${outlineQuestionCircle.id}`} />
                        </svg>
                      </sup>
                    </span>
                  </td>
                </tr>
                <SuspenseList revealOrder="forwards">
                  {after.map((event, index) => {
                    const msSinceLastEvent = after[index - 1]
                      ? timeDurationToString(
                          event.timestamp - after[index - 1].timestamp
                        )
                      : timeDurationToString(
                          event.timestamp -
                            (during[during.length - 1]?.timestamp ??
                              before[before.length - 1]?.timestamp ??
                              0)
                        );

                    return (
                      <Suspense
                        fallback={null}
                        key={createRowKey(event, index)}
                      >
                        <TableRow
                          event={event}
                          msSinceLastEvent={msSinceLastEvent}
                          playerIdPlayerNameMap={playerIdPlayerNameMap}
                          playerIdTextColorMap={playerIdTextColorMap}
                          playerIdIconMap={playerIdIconMap}
                        />
                      </Suspense>
                    );
                  })}
                </SuspenseList>
              </tbody>
            </ErrorBoundary>
          )}

          <tfoot>
            <Suspense fallback={null}>
              {sanguineHealEvents.length > 0 ? (
                <SanguineTimeLossRow events={sanguineHealEvents} />
              ) : null}
              {plagueBombDamageEvents.length > 0 ? (
                <PlagueBombDamageRow events={plagueBombDamageEvents} />
              ) : null}
              {violentDetonationDamageEvents.length > 0 ? (
                <ViolentDetonationDamageRow
                  events={violentDetonationDamageEvents}
                />
              ) : null}

              {throwCleaverDamageEvents.length > 0 ? (
                <ThrowCleaverDamageRow events={throwCleaverDamageEvents} />
              ) : null}
              {explosivesEvents.length > 0 ? (
                <ExplosivesSummaryRow
                  events={explosivesEvents}
                  playerIdPlayerNameMap={playerIdPlayerNameMap}
                  playerIdTextColorMap={playerIdTextColorMap}
                />
              ) : null}
            </Suspense>
          </tfoot>
        </PullMetaProvider>
      </table>
    </div>
  );
}

function TableSettings() {
  const { toggleAbsoluteTimestamps, useAbsoluteTimestamps, toggle, open } =
    usePullSettings();

  return (
    <>
      <thead>
        <tr>
          <th colSpan={6} className={`sticky top-0 z-10 ${bgPrimary}`}>
            <button
              type="button"
              className="flex items-center justify-center w-full py-2 space-x-2"
              onClick={toggle}
            >
              <img
                src="/static/icons/trade_engineering.jpg"
                className="object-cover w-8 h-8 rounded-full"
                alt="Map Options"
                width="32"
                height="32"
              />
              <span>Settings</span>
            </button>
          </th>
        </tr>
      </thead>
      {open ? (
        <tbody>
          <tr>
            <td colSpan={6} className={`sticky top-12 z-10 ${bgPrimary} pb-2`}>
              <div className="flex items-center hidden space-x-2 md:block">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={useAbsoluteTimestamps}
                  onChange={toggleAbsoluteTimestamps}
                  id="useAbsoluteTimestamps"
                  aria-labelledby="useAbsoluteTimestamps"
                />
                <label
                  htmlFor="useAbsoluteTimestamps"
                  className="cursor-pointer"
                >
                  use absolute timestamps
                </label>
              </div>
            </td>
          </tr>
        </tbody>
      ) : null}
    </>
  );
}

function TableHead() {
  const usesAbsoluteTimestamps = usePullSettings(
    (state) => state.useAbsoluteTimestamps
  );
  const settingsOpen = usePullSettings((state) => state.open);

  const zIndex = settingsOpen ? "top-20" : "top-12";
  const className = `sticky z-10 ${bgPrimary} ${zIndex}`;

  return (
    <thead>
      <tr className="text-left">
        <th className={classnames(className, "hidden md:table-cell")}>
          {usesAbsoluteTimestamps ? "Abs." : "Rel."} Time
        </th>
        <th className={className}>Type</th>
        <th className={className}>Actor</th>
        <th className={className}>Spell</th>
        <th className={`${className} space-x-1`}>
          <span>Last</span>
          <span className="hidden md:inline">Cast</span>
        </th>
        <th className={`${className} space-x-1`}>
          <span>Next</span>
          <span className="hidden md:inline">Cast</span>
        </th>
      </tr>
    </thead>
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

const SanguineTimeLossRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "SanguineTimeLossRow" */ "./rows/SanguineTimeLossRow"
    ),
  { suspense: true }
);

const ExplosivesSummaryRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "ExplosivesSummaryRow" */ "./rows/ExplosivesSummaryRow"
    ),
  { suspense: true }
);

const PlagueBombDamageRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "PlagueBombDamageRow" */ "./rows/PlagueBombDamageRow"
    ),
  { suspense: true }
);

const ViolentDetonationDamageRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "ViolentDetonationDamageRow" */ "./rows/ViolentDetonationDamageRow"
    ),
  { suspense: true }
);

const ThrowCleaverDamageRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "ThrowCleaverDamageRow" */ "./rows/ThrowCleaverDamageRow"
    ),
  { suspense: true }
);

const CastRow = dynamic(
  () => import(/* webpackChunkName: "CastRow" */ "./rows/CastRow"),
  { suspense: true }
);

const DamageTakenRow = dynamic(
  () =>
    import(/* webpackChunkName: "DamageTakenRow" */ "./rows/DamageTakenRow"),
  { suspense: true }
);

const MissedInterruptRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "MissedInterruptRow" */ "./rows/MissedInterruptRow"
    ),
  { suspense: true }
);

const AbilityReadyRow = dynamic(
  () =>
    import(/* webpackChunkName: "AbilityReadyRow" */ "./rows/AbilityReadyRow"),
  { suspense: true }
);

const DeathRow = dynamic(
  () => import(/* webpackChunkName: "DeathRow" */ "./rows/DeathRow"),
  { suspense: true }
);

const InterruptRow = dynamic(
  () => import(/* webpackChunkName: "InterruptRow" */ "./rows/InterruptRow"),
  { suspense: true }
);

const DamageDoneRow = dynamic(
  () => import(/* webpackChunkName: "DamageDoneRow" */ "./rows/DamageDoneRow"),
  { suspense: true }
);

const HealingDoneRow = dynamic(
  () =>
    import(/* webpackChunkName: "HealingDoneRow" */ "./rows/HealingDoneRow"),
  { suspense: true }
);

const ApplyBuffRow = dynamic(
  () => import(/* webpackChunkName: "ApplyBuffRow" */ "./rows/ApplyBuffRow"),
  { suspense: true }
);

const ApplyDebuffRow = dynamic(
  () =>
    import(/* webpackChunkName: "ApplyDebuffRow" */ "./rows/ApplyDebuffRow"),
  { suspense: true }
);

const createRowKey = (event: DefaultEvent, index: number) =>
  `${event.timestamp}-${event.targetNPC ? event.targetNPC.id : "no-npc"}-${
    event.sourcePlayerID ?? "no-sourceplayerid"
  }-${event.targetPlayerID ? event.targetPlayerID : "no-targetplayerid"}-${
    event.type
  }-${event.ability ? event.ability.id : "no-ability"}-${
    event.interruptedAbility
      ? event.interruptedAbility
      : "no-interrupted-ability"
  }-${index}`;

export type TableRowProps = {
  event: DefaultEvent;
  msSinceLastEvent: string;
} & Omit<SourceOrTargetPlayerCellProps, "transparent">;

function TableRow({
  event,
  playerIdPlayerNameMap,
  playerIdTextColorMap,
  msSinceLastEvent,
  playerIdIconMap,
}: TableRowProps) {
  const sharedProps = {
    msSinceLastEvent,
    playerIdPlayerNameMap,
    playerIdTextColorMap,
    playerIdIconMap,
  };

  if (isCastEventWithAbilityAndSourcePlayer(event)) {
    return <CastRow event={event} {...sharedProps} />;
  }

  if (isDamageTakenEventWithTargetPlayer(event)) {
    return <DamageTakenRow event={event} {...sharedProps} />;
  }

  if (isAbilityReadyEventWithAbilityAndSourcePlayer(event)) {
    return <AbilityReadyRow event={event} {...sharedProps} />;
  }

  if (isPlayerOrNPCDeathEvent(event)) {
    return <DeathRow event={event} {...sharedProps} />;
  }

  if (isInterruptEventWithSourceAndTargetPlayerAndAbility(event)) {
    return <InterruptRow event={event} {...sharedProps} />;
  }

  if (isDamageDoneEventWithAbility(event)) {
    return <DamageDoneRow event={event} {...sharedProps} />;
  }

  if (isHealingDoneEventWithAbility(event)) {
    return <HealingDoneRow event={event} {...sharedProps} />;
  }

  if (isApplyBuffEventWithAbility(event)) {
    return <ApplyBuffRow event={event} {...sharedProps} />;
  }

  if (isApplyDebuffEventWithAbility(event)) {
    return <ApplyDebuffRow event={event} {...sharedProps} />;
  }

  if (isMissingInterruptEventWithAbility(event)) {
    return <MissedInterruptRow event={event} {...sharedProps} />;
  }

  if (typeof window !== "undefined") {
    console.log(event);
  }

  return null;
}
