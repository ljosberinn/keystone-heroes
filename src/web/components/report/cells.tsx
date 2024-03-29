import type { FightSuccessResponse } from "../../../api/functions/fight";
import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import { asc } from "../../icons";
import { spells, DUMMY_CD } from "../../staticData";
import {
  reportStoreSelector,
  usePullSettings,
  useReportStore,
} from "../../store";
import { timeDurationToString } from "../../utils";
import { classnames } from "../../utils/classnames";
import { usePullMeta } from "./PullDetailsSettings";
import type { AbilityReadyRowProps } from "./rows/AbilityReadyRow";
import type { CastRowProps } from "./rows/CastRow";
import { findBloodlust } from "./utils";

type MaybeWastedCooldownCellProps = {
  event: AbilityReadyRowProps["event"] | CastRowProps["event"];
};

const calcMissedUsageCount = ({
  now,
  other,
  cd,
  offset,
}: {
  now: number;
  other: number;
  cd: number;
  offset: number;
}) => {
  return (other - now) / 1000 / cd - offset;
};

function findNextPullBasedOnTimestamp(
  nextUseTimestamp: number,
  allPulls: FightSuccessResponse["pulls"]
) {
  const match = allPulls.find((pull) => {
    return (
      pull.startTime <= nextUseTimestamp && pull.endTime >= nextUseTimestamp
    );
  });

  return match ? match.id : null;
}

type LinkToNextUsePullButtonProps = {
  nextUse: null | number;
  allPulls: FightSuccessResponse["pulls"];
  children: JSX.Element | (JSX.Element | null)[];
};

function LinkToUsePullButton({
  allPulls,
  children,
  nextUse,
}: LinkToNextUsePullButtonProps): JSX.Element {
  const { setSelectedPull, selectedPull } = useReportStore(reportStoreSelector);

  const nextUsePullID = nextUse
    ? findNextPullBasedOnTimestamp(nextUse, allPulls)
    : null;

  if (!nextUsePullID || selectedPull === nextUsePullID) {
    // @ts-expect-error its fine
    return children;
  }

  const handleClick = () => {
    setSelectedPull(nextUsePullID);
  };

  return (
    <button type="button" onClick={handleClick}>
      {children}
      <sup className="hidden md:inline" title="Jump to pull with next use">
        <svg className="inline w-4 h-4 rotate-45">
          <use href={`#${asc.id}`} />
        </svg>
      </sup>
    </button>
  );
}

export function MaybeWastedCooldownCell({
  event,
}: MaybeWastedCooldownCellProps): JSX.Element | null {
  const { fight } = useFight();

  const ability = spells[event.ability.id];

  if (!ability) {
    return <td />;
  }

  if (ability.cd === DUMMY_CD) {
    return null;
  }

  const isBloodlustIsh = findBloodlust({
    events: [{ ...event, type: "Cast" }],
  });

  if (isBloodlustIsh) {
    return <td>-</td>;
  }

  const keyEnd = fight.meta.time + fight.meta.startTime;

  if (event.ability.wasted) {
    if (event.ability.nextUse) {
      const couldUseNTimes =
        event.type !== "BeginCast" &&
        Math.floor(
          (event.ability.nextUse - event.timestamp) / 1000 / ability.cd
        );

      return (
        <td className="pl-2 bg-red-500/50">
          <LinkToUsePullButton
            allPulls={fight.pulls}
            nextUse={event.ability.nextUse}
          >
            <span className="hidden md:inline">in </span>
            <span className="md:hidden">+</span>
            <span>
              {timeDurationToString(event.ability.nextUse - event.timestamp, {
                omitMs: true,
              })}{" "}
            </span>
            <span className="hidden xl:inline">
              (missing {couldUseNTimes}x)
            </span>
          </LinkToUsePullButton>
        </td>
      );
    }

    const couldUseNTimes = Math.floor(
      (keyEnd - event.timestamp) / 1000 / ability.cd
    );

    return (
      <td className="pl-2 bg-red-500/50">
        <span>never</span>
        <span className="hidden xl:inline"> (missing {couldUseNTimes}x)</span>
      </td>
    );
  }

  const couldUseNTimes = calcMissedUsageCount({
    now: event.timestamp,
    other: event.ability.nextUse ? event.ability.nextUse : keyEnd,
    cd: ability.cd,
    // offset by 1 if Cast since CD must recuperate first
    offset: event.ability.nextUse && event.type === "Cast" ? 1 : 0,
  });

  if (event.ability.nextUse) {
    // offset by additional 1 if Cast since if the next seen cast requires this cd,
    // annotating that it could have been used in between would be wrong
    const wastedCastUpcoming = event.type !== "BeginCast" && couldUseNTimes > 1;

    const nextCastIsUnderCD =
      event.type === "Cast" &&
      (event.ability.nextUse - event.timestamp) / 1000 <= ability.cd;

    return (
      <td
        className={classnames(
          "pl-2",
          wastedCastUpcoming
            ? "bg-red-500/50"
            : nextCastIsUnderCD
            ? "text-emerald-500"
            : undefined
        )}
      >
        <LinkToUsePullButton
          allPulls={fight.pulls}
          nextUse={event.ability.nextUse}
        >
          <span className="hidden md:inline">in </span>
          <span className="md:hidden">+</span>
          <span>
            {timeDurationToString(event.ability.nextUse - event.timestamp, {
              omitMs: true,
            })}{" "}
          </span>
          {wastedCastUpcoming ? (
            <span className="hidden xl:inline">
              (missing {Math.floor(couldUseNTimes)}x)
            </span>
          ) : null}
        </LinkToUsePullButton>
      </td>
    );
  }

  if (couldUseNTimes <= 1) {
    return <td className="pl-2">impossible</td>;
  }

  return (
    <td className="pl-2 bg-red-500/50">
      <span>never </span>
      <span className="hidden xl:inline">
        (missing {Math.floor(couldUseNTimes)}x)
      </span>
    </td>
  );
}

type TypeCellProps = {
  type:
    | "Cast"
    | "DamageTaken"
    | "AbilityReady"
    | "Death"
    | "Interrupt"
    | "DamageDone"
    | "HealingDone"
    | "ApplyBuff"
    | "ApplyBuffStack"
    | "RemoveBuff"
    | "BeginCast"
    | "ApplyDebuff"
    | "ApplyDebuffStack"
    | "MissedInterrupt"
    | "RemoveDebuff";
};

export function TypeCell({ type }: TypeCellProps): JSX.Element {
  return (
    <td className="pl-2 md:pl-0">
      <span className="block truncate max-w-[8ch] md:inline" title={type}>
        {type}
      </span>
    </td>
  );
}

type TimestampCellProps<Event = { timestamp: number; relTimestamp: number }> = {
  msSinceLastEvent: string | null;
  event: Event;
};

export function TimestampCell({
  msSinceLastEvent,
  event,
}: TimestampCellProps): JSX.Element {
  const useAbsoluteTimestamps = usePullSettings(
    (state) => state.useAbsoluteTimestamps
  );
  const { fight } = useFight();
  const { pullEndTime } = usePullMeta();

  const timestamp = useAbsoluteTimestamps
    ? event.timestamp - fight.meta.startTime
    : event.timestamp > pullEndTime
    ? event.timestamp - pullEndTime
    : event.relTimestamp;

  return (
    <td className="hidden pl-2 md:table-cell">
      <span
        title={
          msSinceLastEvent ? `${msSinceLastEvent} after last event` : undefined
        }
      >
        {timeDurationToString(timestamp)}
      </span>
    </td>
  );
}

export type SourceOrTargetPlayerCellProps = {
  playerIdTextColorMap: Record<number, string>;
  playerIdPlayerNameMap: Record<number, string>;
  playerIdIconMap: Record<number, JSX.Element>;
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
  | {
      environment: boolean;
    }
);

export function SourceOrTargetPlayerCell(
  props: SourceOrTargetPlayerCellProps
): JSX.Element | null {
  const transparency = props.transparent
    ? "hidden md:inline bg-white dark:bg-gray-700 px-2"
    : undefined;

  if ("environment" in props && props.environment) {
    return (
      <td>
        <span className={transparency}>Environment</span>
      </td>
    );
  }

  const id =
    "sourcePlayerID" in props && props.sourcePlayerID
      ? props.sourcePlayerID
      : "targetPlayerID" in props && props.targetPlayerID
      ? props.targetPlayerID
      : null;

  if (!id) {
    return null;
  }

  return (
    <td className={props.playerIdTextColorMap[id]}>
      <span className="md:hidden">{props.playerIdIconMap[id]}</span>
      <span className={transparency}>{props.playerIdPlayerNameMap[id]}</span>
    </td>
  );
}

type ResponsiveAbilityCellProps = {
  name: string;
  bold?: boolean;
  paddingless?: boolean;
  stacks?: number | null;
};

export function ResponsiveAbilityCell({
  name,
  bold,
  paddingless,
  stacks,
}: ResponsiveAbilityCellProps): JSX.Element {
  const Tag = bold ? "b" : "span";

  return (
    <>
      <Tag
        className={classnames(
          "hidden md:inline xl:hidden",
          !paddingless && "pl-2"
        )}
      >
        {stacks ? `${stacks}x ` : null}
        {name.split(" ").slice(-1)}
      </Tag>
      <Tag className={classnames("hidden xl:inline", !paddingless && "pl-2")}>
        {stacks ? `${stacks}x ` : null}
        {name}
      </Tag>
    </>
  );
}
