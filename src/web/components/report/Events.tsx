import dynamic from "next/dynamic";
import { Suspense, useState, SuspenseList, useMemo, memo } from "react";

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
  npcs,
} from "../../staticData";
import type { PullSettings } from "../../store";
import { usePullSettings, useReportStore } from "../../store";
import { bgPrimary, bgSecondary, grayscale } from "../../styles/tokens";
import {
  createWowheadUrl,
  timeDurationToString,
  classTextColorMap,
  createWCLUrl,
} from "../../utils";
import { classnames } from "../../utils/classnames";
import { getClassAndSpecName } from "../../utils/player";
import {
  AbilityIcon,
  INVIS_POTION_ICON,
  SHROUD_ICON,
  STATIC_ICON_PREFIX,
} from "../AbilityIcon";
import { Checkbox } from "../Checkbox";
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
  isAnimaExhaustDamageEvent,
  isAnimaExhaustHealEvent,
  isBloodyJavelinDamageEvent,
  isDischargedAnimaDamageEvent,
  isForgottenForgehammerDamageEvent,
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

type EnhancedNPC = FightSuccessResponse["pulls"][number]["npcs"][number] & {
  rawCount: number;
};

export const findMostRelevantNPCOfPull = (
  pull: FightSuccessResponse["pulls"][number],
  dungeon: typeof dungeons[number]
): { id: number; count: number; name: string } => {
  const boss = pull.npcs.find((npc) => isBoss(npc.id));

  if (boss) {
    return {
      ...boss,
      name: npcs[boss.id],
    };
  }

  const lieutenant = pull.npcs.find((npc) => isTormentedLieutenant(npc.id));

  if (lieutenant) {
    return {
      ...lieutenant,
      name: npcs[lieutenant.id],
    };
  }

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

  if (!npcWithHighestCount) {
    return {
      id: 0,
      count: 0,
      name: "Unknown",
    };
  }

  return {
    ...npcWithHighestCount,
    name: npcs[npcWithHighestCount.id],
  };
};

type PullNavigationButtonProps = {
  disabled: boolean;
  nextPullID: number;
  unitName: string | null;
  direction: "left" | "right";
};

function PullNavigationButton({
  disabled,
  unitName,
  direction,
  nextPullID,
}: PullNavigationButtonProps) {
  const setSelectedPull = useReportStore((state) => state.setSelectedPull);

  const iconClassName = classnames(
    "rounded-full w-8 h-8",
    disabled && grayscale
  );

  const isRight = direction === "right";

  return (
    <button
      type="button"
      disabled={disabled}
      className={classnames(
        "flex items-center w-1/6 space-x-2 md:w-1/4 lg:w-1/3 focus:outline-none focus:ring",
        isRight && "justify-end"
      )}
      onClick={() => {
        setSelectedPull(nextPullID);
      }}
    >
      {isRight ? null : (
        <AbilityIcon
          icon="misc_arrowleft"
          alt="Last pull"
          className={iconClassName}
          width={32}
          height={32}
        />
      )}

      {unitName ? (
        <span className="hidden truncate md:inline">{unitName}</span>
      ) : null}

      {isRight ? (
        <AbilityIcon
          icon="misc_arrowright"
          alt="Next pull"
          className={iconClassName}
          width={32}
          height={32}
        />
      ) : null}
    </button>
  );
}

function PullSelection() {
  const { fight } = useFight();

  const selectedPullID = useReportStore((state) => state.selectedPull);
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
      <PullNavigationButton
        disabled={isFirst}
        nextPullID={selectedPullID - 1}
        direction="left"
        unitName={
          mostRelevantNPCsByPull.last ? mostRelevantNPCsByPull.last.name : null
        }
      />

      <div className="flex justify-center w-4/6 space-x-2 md:w-2/4 lg:w-1/3">
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
          className="flex items-center space-x-2 truncate"
        >
          <img
            src={`/static/npcs/${mostRelevantNPCsByPull.current.id}.png`}
            alt={mostRelevantNPCsByPull.current.name}
            className="object-cover w-8 h-8 rounded-full"
            width={32}
            height={32}
            loading="lazy"
          />

          <span className="space-x-1">
            <span>{mostRelevantNPCsByPull.current.name}</span>
            {selectedPull.isWipe ? <span>(Wipe)</span> : null}
          </span>
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

      <PullNavigationButton
        disabled={isLast}
        nextPullID={selectedPullID + 1}
        direction="right"
        unitName={
          mostRelevantNPCsByPull.next ? mostRelevantNPCsByPull.next.name : null
        }
      />
    </div>
  );
}

function Sidebar() {
  const { fight, fightID, reportID } = useFight();
  const selectedPullID = useReportStore((store) => store.selectedPull);

  const pullNPCs = usePullNPCs(selectedPullID);

  if (!pullNPCs) {
    return null;
  }

  const previousPullEnd =
    selectedPullID === 1
      ? null
      : fight.pulls.find((pull) => pull.id === selectedPullID - 1)?.endTime ??
        null;

  const nextPullStart =
    fight.pulls.find((pull) => pull.id === selectedPullID + 1)?.startTime ??
    null;

  return (
    <div className="flex flex-col w-full bg-white rounded-lg lg:w-3/12 dark:bg-gray-700">
      <h3 className="px-2 pt-2 text-xl font-semibold text-center">
        Pull {selectedPullID}
      </h3>
      <div className="flex w-full p-2 justify-evenly">
        <span>
          {previousPullEnd ? (
            <>
              +{Math.round((pullNPCs.pull.startTime - previousPullEnd) / 1000)}s
            </>
          ) : (
            "-"
          )}
        </span>
        <ExternalLink
          href={createWCLUrl({
            reportID,
            fightID,
            start: pullNPCs.pull.startTime,
            end: pullNPCs.pull.endTime,
          })}
          className="space-x-1"
        >
          <span>
            {timeDurationToString(
              pullNPCs.pull.startTime - fight.meta.startTime,
              { omitMs: true }
            )}
          </span>
          <span>-</span>
          <span>
            {timeDurationToString(
              pullNPCs.pull.endTime - fight.meta.startTime,
              { omitMs: true }
            )}
          </span>
        </ExternalLink>

        <span>
          {nextPullStart ? (
            <>+{Math.round((nextPullStart - pullNPCs.pull.endTime) / 1000)}s</>
          ) : (
            "-"
          )}
        </span>
      </div>

      <div className="flex justify-around w-full px-2 pb-2">
        <span
          className="hidden lg:inline"
          title="Time spent out of combat after last pull"
        >
          <svg className="inline w-4 h-4">
            <use href={`#${outlineQuestionCircle.id}`} />
          </svg>
        </span>
        <span>
          +
          {timeDurationToString(
            pullNPCs.pull.endTime - pullNPCs.pull.startTime,
            { omitMs: true }
          )}
        </span>
        <span
          className="hidden lg:inline"
          title="Amount of time spent out of combat before next pull"
        >
          <svg className="inline w-4 h-4">
            <use href={`#${outlineQuestionCircle.id}`} />
          </svg>
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
    animaaExhaustDamageEvents: isNecroticWake
      ? selectedPull.events.filter(isAnimaExhaustDamageEvent)
      : [],
    animaExhaustHealEvents: isNecroticWake
      ? selectedPull.events.filter(isAnimaExhaustHealEvent)
      : [],
    bloodyJavelinDamageEvents: isNecroticWake
      ? selectedPull.events.filter(isBloodyJavelinDamageEvent)
      : [],
    dischargedAnimaDamageEvents: isNecroticWake
      ? selectedPull.events.filter(isDischargedAnimaDamageEvent)
      : [],
    forgottenForgehammerEvents: isNecroticWake
      ? selectedPull.events.filter(isForgottenForgehammerDamageEvent)
      : [],
  };
}

type EventCategory = "before" | "during" | "after";

function EventsTable() {
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
          const { className, specName } = getClassAndSpecName(player);

          return [
            player.id,

            <span className="block w-4 h-4" key={player.actorID}>
              <SpecIcon size={4} class={className} spec={specName} />
            </span>,
          ];
        })
      ),
    [player]
  );

  const { before, during, after } = selectedPull.events.reduce<
    Record<EventCategory, (DefaultEvent & { key: string })[]>
  >(
    (acc, event, index) => {
      const playerID = event.sourcePlayerID ?? event.targetPlayerID;
      const isIgnored = playerID ? !trackedPlayer.includes(playerID) : false;

      if (isIgnored) {
        return acc;
      }

      if (event.category === "BEFORE") {
        acc.before.push({ ...event, key: createKey(event, index) });
        return acc;
      }

      if (event.category === "DURING") {
        acc.during.push({ ...event, key: createKey(event, index) });
        return acc;
      }

      if (event.category === "AFTER") {
        acc.after.push({ ...event, key: createKey(event, index) });
        return acc;
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
    animaaExhaustDamageEvents,
    animaExhaustHealEvents,
    bloodyJavelinDamageEvents,
    dischargedAnimaDamageEvents,
    forgottenForgehammerEvents,
  } = usePullSummaryRows(selectedPull);

  return (
    <div
      className={`w-full min-h-screen px-4 py-2 rounded-lg lg:w-9/12 ${bgPrimary}`}
    >
      <p>Filter Events by Player</p>
      <div className="flex justify-between w-full">
        <div className="flex flex-col md:flex-row">
          {player.map((p) => {
            const { className, specName, colors } = getClassAndSpecName(p);

            const checked = trackedPlayer.includes(p.id);
            const disabled = checked && trackedPlayer.length === 1;

            return (
              <span className="p-2" key={p.id}>
                <Checkbox
                  checked={checked}
                  disabled={disabled}
                  onChange={() => {
                    setTrackedPlayer((prev) =>
                      prev.includes(p.id)
                        ? prev.filter((id) => id !== p.id)
                        : [...prev, p.id]
                    );
                  }}
                  spanClassName={colors.peerFocus}
                >
                  <span className="w-8 h-8">
                    <SpecIcon
                      class={className}
                      spec={specName}
                      className={classnames(
                        "border-2",
                        checked ? colors.border : grayscale
                      )}
                    />
                  </span>
                  <span className={checked ? colors.text : undefined}>
                    {p.name}
                  </span>
                </Checkbox>
              </span>
            );
          })}
        </div>
      </div>

      <table className="w-full">
        <TableHead />

        <PullMetaProvider
          fightStartTime={meta.startTime}
          pullEndTime={selectedPull.endTime}
        >
          {before.length > 0 && (
            <ErrorBoundary>
              <tbody>
                <tr>
                  <td
                    colSpan={6}
                    className={`sticky text-center top-6 ${bgPrimary}`}
                  >
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
                      <TableRow
                        event={event}
                        msSinceLastEvent={msSinceLastEvent}
                        playerIdPlayerNameMap={playerIdPlayerNameMap}
                        playerIdTextColorMap={playerIdTextColorMap}
                        playerIdIconMap={playerIdIconMap}
                        key={event.key}
                      />
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
                <td
                  colSpan={6}
                  className={`sticky text-center top-6 ${bgPrimary}`}
                >
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
                    <TableRow
                      event={event}
                      msSinceLastEvent={msSinceLastEvent}
                      playerIdPlayerNameMap={playerIdPlayerNameMap}
                      playerIdTextColorMap={playerIdTextColorMap}
                      playerIdIconMap={playerIdIconMap}
                      key={event.key}
                    />
                  );
                })}
              </SuspenseList>
            </tbody>
          </ErrorBoundary>

          {after.length > 0 && (
            <ErrorBoundary>
              <tbody className="border-t-2 border-gray-900">
                <tr>
                  <td
                    colSpan={6}
                    className={`sticky text-center top-6 ${bgPrimary}`}
                  >
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
                      <TableRow
                        event={event}
                        msSinceLastEvent={msSinceLastEvent}
                        playerIdPlayerNameMap={playerIdPlayerNameMap}
                        playerIdTextColorMap={playerIdTextColorMap}
                        playerIdIconMap={playerIdIconMap}
                        key={event.key}
                      />
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
              {animaaExhaustDamageEvents.length > 0 ? (
                <AnimaExhaustDamageRow events={animaaExhaustDamageEvents} />
              ) : null}
              {animaExhaustHealEvents.length > 0 ? (
                <AnimaExhaustHealingRow events={animaExhaustHealEvents} />
              ) : null}
              {bloodyJavelinDamageEvents.length > 0 ? (
                <BloodyJavelinDamageRow events={bloodyJavelinDamageEvents} />
              ) : null}
              {dischargedAnimaDamageEvents.length > 0 ? (
                <DischargedAnimaDamageRow
                  events={dischargedAnimaDamageEvents}
                />
              ) : null}
              {forgottenForgehammerEvents.length > 0 ? (
                <ForgottenForgehammerRow events={forgottenForgehammerEvents} />
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

const createKey = (event: DefaultEvent, index: number) => {
  return `${event.timestamp}-${event.type}-${index}`;
};

const tableSettingsSelector = ({
  toggleAbsoluteTimestamps,
  useAbsoluteTimestamps,
  toggle,
  open,
}: PullSettings) => ({
  toggleAbsoluteTimestamps,
  useAbsoluteTimestamps,
  toggle,
  open,
});

function TableHead() {
  const { toggleAbsoluteTimestamps, useAbsoluteTimestamps, toggle, open } =
    usePullSettings(tableSettingsSelector);

  const top = open ? "md:top-24" : "md:top-12";
  const className = `sticky z-10 ${bgPrimary} top-0 ${top}`;

  return (
    <thead>
      <tr className="hidden md:table-row">
        <th colSpan={6} className={`sticky top-0 z-10 ${bgPrimary}`}>
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 space-x-2"
            onClick={toggle}
          >
            <img
              src="/static/icons/trade_engineering.jpg"
              className="object-cover w-8 h-8 rounded-full"
              alt=""
              width="32"
              height="32"
            />
            <span>Settings</span>
          </button>
        </th>
      </tr>

      {open ? (
        <tr className="hidden md:table-row">
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
              <label htmlFor="useAbsoluteTimestamps" className="cursor-pointer">
                use absolute timestamps
              </label>
            </div>

            <div className="flex items-center hidden space-x-2 md:block">
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={false}
                // onChange={toggleAbsoluteTimestamps}
                id="groupSimilarEvents"
                aria-labelledby="groupSimilarEvents"
                disabled
              />
              <label htmlFor="groupSimilarEvents" className="cursor-pointer">
                group similar events (e.g. Bursting)
              </label>
            </div>
          </td>
        </tr>
      ) : null}
      <tr className="text-left">
        <th className={classnames(className, "hidden md:table-cell")}>
          {useAbsoluteTimestamps ? "Abs." : "Rel."} Time
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

// eslint-disable-next-line import/no-default-export
export default function Events(): JSX.Element {
  return (
    <section aria-labelledby="events-heading">
      <div className={`px-4 rounded-t-lg pb-4 pt-4 ${bgPrimary}`}>
        <h2 id="events-heading" className="text-2xl font-bold">
          Events
        </h2>
      </div>
      <div className={`rounded-b-lg ${bgSecondary} p-2 w-full`}>
        <PullSelection />

        <div className="flex flex-col w-full space-y-4 lg:space-x-4 lg:flex-row lg:space-y-0">
          <Sidebar />

          <EventsTable />
        </div>
      </div>
    </section>
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

const AnimaExhaustDamageRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "AnimaExhaustDamageRow" */ "./rows/AnimaExhaustDamageRow"
    ),
  { suspense: true }
);

const AnimaExhaustHealingRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "AnimaExhaustHealingRow" */ "./rows/AnimaExhaustHealingRow"
    ),
  { suspense: true }
);

const BloodyJavelinDamageRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "BloodyJavelinDamageRow" */ "./rows/BloodyJavelinDamageRow"
    ),
  { suspense: true }
);

const DischargedAnimaDamageRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "DischargedAnimaDamageRow" */ "./rows/DischargedAnimaDamageRow"
    ),
  { suspense: true }
);

const ForgottenForgehammerRow = dynamic(
  () =>
    import(
      /* webpackChunkName: "ForgottenForgehammerRow" */ "./rows/ForgottenForgehammerRow"
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

const comparator = <T extends { event: { key: string } }>(prev: T, next: T) =>
  prev.event.key === next.event.key;

export type TableRowProps = {
  event: DefaultEvent & { key: string };
  msSinceLastEvent: string;
} & Omit<SourceOrTargetPlayerCellProps, "transparent">;

const TableRow = memo(
  ({
    event,
    msSinceLastEvent,
    playerIdIconMap,
    playerIdPlayerNameMap,
    playerIdTextColorMap,
  }: TableRowProps) => {
    const sharedProps = {
      msSinceLastEvent,
      playerIdPlayerNameMap,
      playerIdTextColorMap,
      playerIdIconMap,
    };

    // yep I know :shrug: better than memoing each and every of them individually
    return (
      <Suspense fallback={null}>
        {isCastEventWithAbilityAndSourcePlayer(event) ? (
          <CastRow event={event} {...sharedProps} />
        ) : isDamageTakenEventWithTargetPlayer(event) ? (
          <DamageTakenRow event={event} {...sharedProps} />
        ) : isAbilityReadyEventWithAbilityAndSourcePlayer(event) ? (
          <AbilityReadyRow event={event} {...sharedProps} />
        ) : isPlayerOrNPCDeathEvent(event) ? (
          <DeathRow event={event} {...sharedProps} />
        ) : isInterruptEventWithSourceAndTargetPlayerAndAbility(event) ? (
          <InterruptRow event={event} {...sharedProps} />
        ) : isDamageDoneEventWithAbility(event) ? (
          <DamageDoneRow event={event} {...sharedProps} />
        ) : isHealingDoneEventWithAbility(event) ? (
          <HealingDoneRow event={event} {...sharedProps} />
        ) : isApplyBuffEventWithAbility(event) ? (
          <ApplyBuffRow event={event} {...sharedProps} />
        ) : isApplyDebuffEventWithAbility(event) ? (
          <ApplyDebuffRow event={event} {...sharedProps} />
        ) : isMissingInterruptEventWithAbility(event) ? (
          <MissedInterruptRow event={event} {...sharedProps} />
        ) : null}
      </Suspense>
    );
  },
  comparator
);

if (process.env.NODE_ENV === "development") {
  TableRow.displayName = "TableRow";
}
