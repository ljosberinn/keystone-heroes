import { useState } from "react";
import { useFight } from "src/pages/report/[reportID]/[fightID]";
import { useReportStore } from "src/store";
import { bgSecondary } from "src/styles/tokens";
import {
  classTextColorMap,
  createWowheadUrl,
  timeDurationToString,
} from "src/utils";
import { classnames } from "src/utils/classnames";

import type { FightSuccessResponse } from "../../../../api/src/functions/fight";
import { outlineQuestionCircle, tableLine, timeline } from "../../icons";
import {
  classes,
  dungeons,
  spells,
  isBoss,
  isTormentedLieutenant,
  affixes,
} from "../../staticData";
import {
  AbilityIcon,
  INVIS_POTION_ICON,
  SHROUD_ICON,
  STATIC_ICON_PREFIX,
} from "../AbilityIcon";
import { ExternalLink } from "../ExternalLink";
import { detectInvisibilityUsage, findBloodlust } from "./utils";

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
          {usedBloodlustOrHeroism && lustAbility ? (
            <img
              src={`${STATIC_ICON_PREFIX}${lustAbility.icon}.jpg`}
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
        className="flex items-center justify-end w-1/3 space-x-2 focus:outline-none focus:ring"
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

  if (!fight || !selectedPull || !dungeon) {
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
      <div className="flex w-full p-2 justify-evenly">
        <span>
          {timeDurationToString(
            selectedPull.startTime - fight.meta.startTime,
            true
          )}{" "}
          -{" "}
          {timeDurationToString(
            selectedPull.endTime - fight.meta.startTime,
            true
          )}{" "}
          (+
          {timeDurationToString(
            selectedPull.endTime - selectedPull.startTime,
            true
          )}
          )
        </span>
      </div>

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

type DefaultEvent = FightSuccessResponse["pulls"][number]["events"][number];

type CastRowProps = {
  event: Omit<DefaultEvent, "ability" | "type" | "sourcePlayerID"> & {
    ability: NonNullable<DefaultEvent["ability"]>;
    sourcePlayerID: NonNullable<DefaultEvent["sourcePlayerID"]>;
    type: "Cast";
  };
  ability: NonNullable<ReturnType<typeof determineAbility>>;
} & Pick<
  TableRowProps,
  "msSinceLastEvent" | "playerIdPlayerNameMap" | "playerIdTextColorMap"
>;

const isCastEventWithAbilityAndSourcePlayer = (
  event: DefaultEvent
): event is CastRowProps["event"] =>
  event.type === "Cast" &&
  event.ability !== null &&
  event.sourcePlayerID !== null;

const isAbilityReadyEventWithAbilityAndSourcePlayer = (
  event: DefaultEvent
): event is AbilityReadyRowProps["event"] =>
  event.type === "AbilityReady" &&
  event.ability !== null &&
  event.sourcePlayerID !== null;

type MsSinceLastEventCellProps = {
  msSinceLastEvent: string | null;
  relTimestamp: number;
};

function MsSinceLastEventCell({
  msSinceLastEvent,
  relTimestamp,
}: MsSinceLastEventCellProps) {
  return (
    <td>
      <span
        title={
          msSinceLastEvent ? `${msSinceLastEvent} after last event` : undefined
        }
      >
        {timeDurationToString(relTimestamp)}
      </span>
    </td>
  );
}

type SourceOrTargetPlayerCellProps = {
  playerIdTextColorMap: Record<number, string>;
  playerIdPlayerNameMap: Record<number, string>;
  transparent?: boolean;
} & (
  | {
      sourcePlayerID: number;
      targetPlayerID?: never;
    }
  | {
      targetPlayerID: number;
      sourcePlayerID?: never;
    }
);

function SourceOrTargetPlayerCell(props: SourceOrTargetPlayerCellProps) {
  const id = props.sourcePlayerID ?? props.targetPlayerID;

  return (
    <td className={props.playerIdTextColorMap[id]}>
      <span
        className={props.transparent ? "dark:bg-coolgray-700 px-2" : undefined}
      >
        {props.playerIdPlayerNameMap[id]}
      </span>
    </td>
  );
}

function CastRow({
  event,
  ability,
  playerIdPlayerNameMap,
  msSinceLastEvent,
  playerIdTextColorMap,
}: CastRowProps) {
  const cooldown = ability ? ability.cd : 0;
  const abilityName = ability?.name ?? "Unknown Ability";

  const usedUnderCooldown = cooldown
    ? (event.timestamp - (event.ability.lastUse ?? 0)) / 1000 <= cooldown
    : false;

  const possibleUsageCount = event.ability.lastUse
    ? Math.floor(
        (event.timestamp - event.ability.lastUse + cooldown) / 1000 / cooldown
      )
    : 0;

  const delayedTooHard = possibleUsageCount > 1;

  return (
    <tr className="text-center dark:bg-coolgray-600 dark:hover:bg-coolgray-700">
      <MsSinceLastEventCell
        relTimestamp={event.relTimestamp}
        msSinceLastEvent={msSinceLastEvent}
      />

      <TypeCell type="Cast" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.sourcePlayerID}
      />

      <td>
        <ExternalLink
          href={createWowheadUrl({
            category: "spell",
            id: event.ability.id,
          })}
        >
          <AbilityIcon
            icon={ability.icon}
            alt={abilityName}
            className="inline object-cover w-4 h-4 rounded-lg"
            width={16}
            height={16}
          />
          <span className="pl-2">{abilityName}</span>
        </ExternalLink>
      </td>

      <td
        className={classnames(
          delayedTooHard && "text-red-500",
          usedUnderCooldown && "text-green-500",
          event.ability.lastUse ? null : "text-yellow-500"
        )}
        title={
          delayedTooHard
            ? `This ability could have been used at least ${
                possibleUsageCount - 1
              }x since its last usage.`
            : undefined
        }
      >
        {event.ability.lastUse ? (
          <span>
            {timeDurationToString(
              event.timestamp - event.ability.lastUse,
              true
            )}{" "}
            ago
          </span>
        ) : (
          "first use"
        )}
        {delayedTooHard && (
          <sup>
            <svg className="inline w-4 h-4 ml-2 text-black dark:text-white">
              <use href={`#${outlineQuestionCircle.id}`} />
            </svg>
          </sup>
        )}
      </td>

      <MaybeWastedCooldownCell event={event} />
    </tr>
  );
}

const isDamageTakenEventWithTargetPlayer = (
  event: DefaultEvent
): event is DamageTakenRowProps["event"] =>
  event.type === "DamageTaken" &&
  event.targetPlayerID !== null &&
  event.damage !== null;

type DamageTakenRowProps = {
  event: Omit<DefaultEvent, "ability" | "type" | "targetPlayerID"> & {
    ability: NonNullable<DefaultEvent["ability"]>;
    targetPlayerID: NonNullable<DefaultEvent["targetPlayerID"]>;
    type: "DamageTaken";
    damage: number;
  };
} & Pick<
  TableRowProps,
  "msSinceLastEvent" | "playerIdPlayerNameMap" | "playerIdTextColorMap"
>;

const determineAbility = (id: number) => {
  if (spells[id]) {
    return spells[id];
  }

  // Engineer rez
  if (id === 345_130) {
    return {
      name: "Disposable Spectrophasic Reanimator",
      icon: "inv_engineering_90_lightningbox",
      cd: 0,
    };
  }

  // Necrotic
  if (id === 209_858) {
    return {
      name: "Necrotic Wound",
      icon: "ability_rogue_venomouswounds",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Bursting
  if (id === 243_237) {
    return {
      name: affixes["11"].name,
      icon: affixes["11"].icon,
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Explosive
  if (id === 240_446) {
    return {
      name: affixes["13"].name,
      icon: affixes["13"].icon,
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Storming
  if (id === 343_520) {
    return {
      name: affixes["124"].name,
      icon: affixes["124"].icon,
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Volcanic
  if (id === 209_862) {
    return {
      name: affixes["3"].name,
      icon: affixes["3"].icon,
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Quaking
  if (id === 240_448) {
    return {
      name: affixes["14"].name,
      icon: affixes["14"].icon,
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === 342_171) {
    return {
      name: "Loyal Stoneborn",
      icon: "ability_revendreth_mage",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === 328_406) {
    return {
      name: "Discharged Anima",
      icon: "spell_animabastion_orb",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === 344_421) {
    return {
      name: "Anima Exhaust",
      icon: "spell_animabastion_orb",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === 328_351) {
    return {
      name: "Bloody Javelin",
      icon: "inv_polearm_2h_bastionquest_b_01",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Grievous
  if (id === 240_559) {
    return {
      name: "Grievous Wound",
      icon: "ability_backstab",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === 350_163) {
    return {
      name: "Spiteful Shade",
      icon: "ability_meleedamage",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  return null;
};

function DamageTakenRow({
  event,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
  msSinceLastEvent,
}: DamageTakenRowProps) {
  const ability = event.ability ? determineAbility(event.ability.id) : null;

  return (
    <tr className="text-center bg-red-500">
      <MsSinceLastEventCell
        relTimestamp={event.relTimestamp}
        msSinceLastEvent={msSinceLastEvent}
      />

      <TypeCell type="DamageTaken" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.targetPlayerID}
        transparent
      />

      <td className="bg-red-500" colSpan={3}>
        {ability ? (
          <>
            <span>hit by</span>{" "}
            <ExternalLink
              href={createWowheadUrl({
                category: "spell",
                id: event.ability.id,
              })}
            >
              <AbilityIcon
                icon={ability.icon}
                alt={ability.name}
                className="inline object-cover w-4 h-4 rounded-lg"
                width={16}
                height={16}
              />
              <span className="pl-2">{ability.name}</span>
            </ExternalLink>
            {event.damage && (
              <span>
                {" "}
                for <b>{event.damage.toLocaleString("en-US")}</b> damage
              </span>
            )}
            {event.sourcePlayerID && (
              <>
                <span> via </span>
                <span
                  className={classnames(
                    playerIdTextColorMap[event.sourcePlayerID],
                    "dark:bg-coolgray-700 px-2"
                  )}
                >
                  {playerIdPlayerNameMap[event.sourcePlayerID]}
                </span>
              </>
            )}
          </>
        ) : null}
      </td>
    </tr>
  );
}

type TypeCellProps = {
  type:
    | "Cast"
    | "DamageTaken"
    | "AbilityReady"
    | "Death"
    | "Interrupt"
    | "DamageDone";
};

function TypeCell({ type }: TypeCellProps) {
  return <td>{type}</td>;
}

type AbilityReadyRowProps = {
  event: Omit<CastRowProps["event"], "type"> & { type: "AbilityReady" };
  ability: CastRowProps["ability"];
  playerIdPlayerNameMap: Record<string, string>;
  playerIdTextColorMap: Record<string, string>;
  msSinceLastEvent: string | null;
};

function AbilityReadyRow({
  event,
  ability,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
}: AbilityReadyRowProps) {
  const cooldown = ability ? ability.cd : 0;
  const abilityName = ability?.name ?? "Unknown Ability";

  const usedUnderCooldown = cooldown
    ? (event.timestamp - (event.ability.lastUse ?? 0)) / 1000 < cooldown
    : false;

  return (
    <tr className="text-center dark:hover:bg-coolgray-600">
      <MsSinceLastEventCell
        relTimestamp={event.relTimestamp}
        msSinceLastEvent={msSinceLastEvent}
      />

      <TypeCell type="AbilityReady" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.sourcePlayerID}
      />

      <td>
        <ExternalLink
          href={createWowheadUrl({
            category: "spell",
            id: event.ability.id,
          })}
        >
          <AbilityIcon
            icon={ability.icon}
            alt={abilityName}
            className="inline object-cover w-4 h-4 rounded-lg"
            width={16}
            height={16}
          />
          <span className="pl-2">{abilityName}</span>
        </ExternalLink>
      </td>

      <td
        className={classnames(
          usedUnderCooldown && "text-green-500",
          event.ability.lastUse ? null : "text-yellow-500"
        )}
      >
        {event.ability.lastUse ? (
          <span>
            {timeDurationToString(
              event.timestamp - event.ability.lastUse,
              true
            )}{" "}
            ago
          </span>
        ) : (
          "first use"
        )}
      </td>

      <MaybeWastedCooldownCell event={event} />
    </tr>
  );
}

type DeathRowProps = {
  event: Omit<DefaultEvent, "ability" | "type" | "targetPlayerID"> & {
    ability: null;
    targetPlayerID: NonNullable<DefaultEvent["targetPlayerID"]>;
    type: "Death";
    sourceNPC?: NonNullable<DefaultEvent["sourceNPC"]>;
  };
  msSinceLastEvent: string;
  playerIdTextColorMap: SourceOrTargetPlayerCellProps["playerIdTextColorMap"];
  playerIdPlayerNameMap: SourceOrTargetPlayerCellProps["playerIdPlayerNameMap"];
};

const isDeathEventWithTargetPlayer = (
  event: DefaultEvent
): event is DeathRowProps["event"] =>
  event.type === "Death" &&
  event.targetPlayerID !== null &&
  event.sourceNPC !== null;

function DeathRow({
  event,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
}: DeathRowProps) {
  return (
    <tr className="text-center bg-red-500">
      <MsSinceLastEventCell
        relTimestamp={event.relTimestamp}
        msSinceLastEvent={msSinceLastEvent}
      />

      <TypeCell type="Death" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        targetPlayerID={event.targetPlayerID}
        transparent
      />

      <td colSpan={3}>
        killed by{" "}
        {event.sourceNPC ? (
          <ExternalLink
            href={createWowheadUrl({
              category: "npc",
              id: event.sourceNPC.id,
            })}
          >
            {event.sourceNPC.name}
          </ExternalLink>
        ) : (
          "Unkown Ability"
        )}
      </td>
    </tr>
  );
}

const isInterruptEventWithSourceAndTargetPlayerAndAbility = (
  event: DefaultEvent
): event is InterruptRowProps["event"] =>
  event.type === "Interrupt" &&
  event.sourcePlayerID !== null &&
  event.ability !== null &&
  event.targetPlayerID !== null;

type InterruptRowProps = {
  event: Omit<
    DefaultEvent,
    "ability" | "type" | "targetPlayerID" | "sourcePlayerID"
  > & {
    ability: CastRowProps["event"]["ability"];
    targetPlayerID: NonNullable<DefaultEvent["targetPlayerID"]>;
    sourcePlayerID: NonNullable<DefaultEvent["sourcePlayerID"]>;
    type: "Interrupt";
    interruptedAbility: number;
  };
} & Pick<
  TableRowProps,
  "msSinceLastEvent" | "playerIdPlayerNameMap" | "playerIdTextColorMap"
>;

function InterruptRow({
  event,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
}: InterruptRowProps) {
  const ability = determineAbility(event.ability.id);
  const interruptedAbility = determineAbility(event.interruptedAbility);

  return (
    <tr className="text-center bg-red-500">
      <MsSinceLastEventCell
        relTimestamp={event.relTimestamp}
        msSinceLastEvent={msSinceLastEvent}
      />

      <TypeCell type="Interrupt" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        targetPlayerID={event.targetPlayerID}
        transparent
      />

      <td className="bg-red-500" colSpan={3}>
        {ability && (
          <>
            <span>interrupted </span>
            <ExternalLink
              href={createWowheadUrl({
                category: "spell",
                id: event.interruptedAbility,
              })}
            >
              {interruptedAbility ? (
                <>
                  <AbilityIcon
                    icon={interruptedAbility.icon}
                    alt={interruptedAbility.name}
                    className="inline object-cover w-4 h-4 rounded-lg"
                    width={16}
                    height={16}
                  />
                  <span className="pl-2"> {interruptedAbility.name}</span>
                </>
              ) : (
                "Untracked Ability"
              )}
            </ExternalLink>
            <span> by </span>
            <ExternalLink
              href={createWowheadUrl({
                category: "spell",
                id: event.ability.id,
              })}
            >
              <AbilityIcon
                icon={ability.icon}
                alt={ability.name}
                className="inline object-cover w-4 h-4 rounded-lg"
                width={16}
                height={16}
              />
              <span className="pl-2">{ability.name}</span>
            </ExternalLink>
            {event.damage && (
              <span>
                {" "}
                for <b>{event.damage.toLocaleString("en-US")}</b> damage
              </span>
            )}
            {event.sourcePlayerID && (
              <>
                {" "}
                via{" "}
                <span
                  className={classnames(
                    playerIdTextColorMap[event.sourcePlayerID],
                    "bg-coolgray-700 px-2"
                  )}
                >
                  {playerIdPlayerNameMap[event.sourcePlayerID]}
                </span>
              </>
            )}
          </>
        )}
      </td>
    </tr>
  );
}

type MaybeWastedCooldownCellProps = {
  event: AbilityReadyRowProps["event"] | CastRowProps["event"];
};

function MaybeWastedCooldownCell({ event }: MaybeWastedCooldownCellProps) {
  const { fight } = useFight();

  const ability = spells[event.ability.id];

  if (!fight || !ability) {
    return <td />;
  }

  const isBloodlustIsh = findBloodlust({
    events: [{ ...event, type: "Cast" }],
  });

  if (isBloodlustIsh) {
    return <td>irrelevant</td>;
  }

  const keyEnd = fight.meta.time + fight.meta.startTime;

  if (event.ability.wasted) {
    if (event.ability.nextUse) {
      const couldUseNTimes = Math.floor(
        (event.ability.nextUse - event.timestamp) / 1000 / ability.cd
      );

      return (
        <td className="bg-red-500">
          in{" "}
          {timeDurationToString(event.ability.nextUse - event.timestamp, true)}{" "}
          (missing {couldUseNTimes}x)
        </td>
      );
    }

    const couldUseNTimes = Math.floor(
      (keyEnd - event.timestamp) / 1000 / ability.cd
    );

    return <td className="bg-red-500">never (missing {couldUseNTimes}x)</td>;
  }

  if (event.ability.nextUse) {
    const isCastEvent = event.type === "Cast";
    const couldUseNTimes =
      (event.ability.nextUse - event.timestamp) / 1000 / ability.cd -
      // offset by 1 if Cast since CD must recuperate first
      (isCastEvent ? 1 : 0);
    // offset by 2 if Cast since if the next seen cast requires this cd,
    // annotating that it could have been used in between would be wrong
    const wastedCastUpcoming = couldUseNTimes > 1;

    return (
      <td className={wastedCastUpcoming ? "bg-red-500" : undefined}>
        in {timeDurationToString(event.ability.nextUse - event.timestamp, true)}{" "}
        {wastedCastUpcoming && <>(missing {Math.floor(couldUseNTimes)}x)</>}
      </td>
    );
  }

  // TODO: move to backend, this is identical to the wasted = true branch above
  const couldUseNTimes = Math.floor(
    (keyEnd - event.timestamp) / 1000 / ability.cd
  );

  return <td className="bg-red-500">never (missing {couldUseNTimes}x)</td>;
}

const isDamageDoneEventWithAbility = (
  event: DefaultEvent
): event is DamageDoneRowProps["event"] =>
  event.type === "DamageDone" &&
  event.ability !== null &&
  event.damage !== null &&
  event.sourcePlayerID !== null;

type DamageDoneRowProps = {
  event: Omit<
    DefaultEvent,
    "ability" | "type" | "sourcePlayerID" | "damage"
  > & {
    ability: CastRowProps["event"]["ability"];
    sourcePlayerID: NonNullable<DefaultEvent["sourcePlayerID"]>;
    type: "DamageDone";
    damage: number;
  };
} & Pick<
  TableRowProps,
  "msSinceLastEvent" | "playerIdPlayerNameMap" | "playerIdTextColorMap"
>;
function DamageDoneRow({
  event,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
}: DamageDoneRowProps) {
  const ability = determineAbility(event.ability.id);

  if (!ability) {
    if (typeof window !== "undefined") {
      console.log(ability);
    }
    return null;
  }

  return (
    <tr className="text-center bg-green-600">
      <MsSinceLastEventCell
        relTimestamp={event.relTimestamp}
        msSinceLastEvent={msSinceLastEvent}
      />

      <TypeCell type="DamageDone" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.sourcePlayerID}
        transparent
      />

      <td colSpan={3}>
        <ExternalLink
          href={createWowheadUrl({
            category: "spell",
            id: event.ability.id,
          })}
        >
          <AbilityIcon
            icon={ability.icon}
            alt={ability.name}
            className="inline object-cover w-4 h-4 rounded-lg"
            width={16}
            height={16}
          />
          <span className="pl-2">{ability.name}</span>
          <span>
            {" "}
            did <b>{event.damage.toLocaleString("en-US")}</b> damage.
          </span>
        </ExternalLink>
      </td>
    </tr>
  );
}

type EventCategory = "before" | "during" | "after";

function Events() {
  const { fight } = useFight();
  const pulls = fight ? fight.pulls : [];
  const player = fight ? fight.player : [];

  const selectedPullID = useReportStore((state) => state.selectedPull);
  const selectedPull = pulls.find((pull) => pull.id === selectedPullID);

  const [trackedPlayer, setTrackedPlayer] = useState(player.map((p) => p.id));
  const [mode, setMode] = useState<"table" | "timeline">("table");

  if (!selectedPull) {
    return null;
  }

  // const allEvents = pulls.flatMap((pull) => pull.events);

  const isTable = mode === "table";

  const playerIdPlayerNameMap = Object.fromEntries<string>(
    player.map((p) => [p.id, p.name])
  );

  const playerIdTextColorMap = Object.fromEntries(
    player.map((p) => [
      p.id,
      classTextColorMap[classes[p.class].name.toLowerCase()],
    ])
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
                  className={`pl-2 ${playerIdTextColorMap[p.id]}`}
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
            <svg className="w-4 h-4">
              <use href={`#${tableLine.id}`} />
            </svg>
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
            <svg className="w-4 h-4">
              <use href={`#${timeline.id}`} />
            </svg>
          </button>
        </div>
      </div>

      {isTable ? (
        <table className="w-full">
          <thead>
            <tr>
              <th>Rel. Timestamp</th>
              <th>Type</th>
              <th>Player</th>
              <th>Ability</th>
              <th>Last Use</th>
              <th>Next Use</th>
            </tr>
          </thead>

          {before.length > 0 && (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center">
                  <span
                    className="font-semibold"
                    title="Events that happend closer to this pull than the last can be found here."
                  >
                    Before Pull
                    <sup>
                      <svg className="inline w-4 h-4 ml-2 text-black dark:text-white">
                        <use href={`#${outlineQuestionCircle.id}`} />
                      </svg>
                    </sup>
                  </span>
                </td>
              </tr>
              {before.map((event, index) => {
                const msSinceLastEvent = before[index - 1]
                  ? timeDurationToString(
                      event.timestamp - before[index - 1].timestamp
                    )
                  : timeDurationToString(0);

                return (
                  <TableRow
                    event={event}
                    key={createRowKey(event, index)}
                    msSinceLastEvent={msSinceLastEvent}
                    playerIdPlayerNameMap={playerIdPlayerNameMap}
                    playerIdTextColorMap={playerIdTextColorMap}
                  />
                );
              })}
            </tbody>
          )}

          <tbody
            className={
              before.length > 0
                ? "border-t-2 border-coolgray-900 text-center"
                : undefined
            }
          >
            <tr>
              <td colSpan={6} className="text-center">
                <span className="font-semibold">During Pull</span>
              </td>
            </tr>
            {during.map((event, index) => {
              const msSinceLastEvent = during[index - 1]
                ? timeDurationToString(
                    event.timestamp - during[index - 1].timestamp
                  )
                : timeDurationToString(0);

              return (
                <TableRow
                  event={event}
                  key={createRowKey(event, index)}
                  msSinceLastEvent={msSinceLastEvent}
                  playerIdPlayerNameMap={playerIdPlayerNameMap}
                  playerIdTextColorMap={playerIdTextColorMap}
                />
              );
            })}
          </tbody>

          {after.length > 0 && (
            <tbody className="border-t-2 border-coolgray-900">
              <tr>
                <td colSpan={6} className="text-center">
                  <span
                    className="font-semibold"
                    title="Events that happend closer to this pull than the next can be found here."
                  >
                    After Pull
                    <sup>
                      <svg className="inline w-4 h-4 ml-2 text-black dark:text-white">
                        <use href={`#${outlineQuestionCircle.id}`} />
                      </svg>
                    </sup>
                  </span>
                </td>
              </tr>
              {after.map((event, index) => {
                const msSinceLastEvent = after[index - 1]
                  ? timeDurationToString(
                      event.timestamp - after[index - 1].timestamp
                    )
                  : timeDurationToString(0);

                return (
                  <TableRow
                    event={event}
                    key={createRowKey(event, index)}
                    msSinceLastEvent={msSinceLastEvent}
                    playerIdPlayerNameMap={playerIdPlayerNameMap}
                    playerIdTextColorMap={playerIdTextColorMap}
                  />
                );
              })}
            </tbody>
          )}
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

type TableRowProps = {
  event: DefaultEvent;
  msSinceLastEvent: string;
  playerIdPlayerNameMap: Record<number, string>;
  playerIdTextColorMap: Record<number, string>;
};

function TableRow({
  event,
  playerIdPlayerNameMap,
  playerIdTextColorMap,
  msSinceLastEvent,
}: TableRowProps) {
  if (isCastEventWithAbilityAndSourcePlayer(event)) {
    const ability = determineAbility(event.ability.id);

    if (!ability) {
      console.info(`encountered uncaught ability in event`, event);
      return null;
    }

    return (
      <CastRow
        event={event}
        ability={ability}
        msSinceLastEvent={msSinceLastEvent}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        playerIdTextColorMap={playerIdTextColorMap}
      />
    );
  }

  if (isDamageTakenEventWithTargetPlayer(event)) {
    return (
      <DamageTakenRow
        event={event}
        msSinceLastEvent={msSinceLastEvent}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        playerIdTextColorMap={playerIdTextColorMap}
      />
    );
  }

  if (isAbilityReadyEventWithAbilityAndSourcePlayer(event)) {
    const ability = determineAbility(event.ability.id);

    if (!ability) {
      console.info(`encountered uncaught ability in event`, event);
      return null;
    }

    return (
      <AbilityReadyRow
        event={event}
        ability={ability}
        msSinceLastEvent={msSinceLastEvent}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        playerIdTextColorMap={playerIdTextColorMap}
      />
    );
  }

  if (isDeathEventWithTargetPlayer(event)) {
    return (
      <DeathRow
        event={event}
        msSinceLastEvent={msSinceLastEvent}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        playerIdTextColorMap={playerIdTextColorMap}
      />
    );
  }

  if (isInterruptEventWithSourceAndTargetPlayerAndAbility(event)) {
    return (
      <InterruptRow
        event={event}
        msSinceLastEvent={msSinceLastEvent}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        playerIdTextColorMap={playerIdTextColorMap}
      />
    );
  }

  if (isDamageDoneEventWithAbility(event)) {
    return (
      <DamageDoneRow
        event={event}
        msSinceLastEvent={msSinceLastEvent}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        playerIdTextColorMap={playerIdTextColorMap}
      />
    );
  }

  if (typeof window !== "undefined") {
    console.log(event.type, event);
  }

  return null;
}
