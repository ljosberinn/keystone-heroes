import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import { spells, DUMMY_CD } from "../../staticData";
import { timeDurationToString } from "../../utils";
import { classnames } from "../../utils/classnames";
import { usePullDetailsSettings } from "./PullDetailsSettings";
import type { AbilityReadyRowProps } from "./rows/AbilityReadyRow";
import type { CastRowProps } from "./rows/CastRow";
import { findBloodlust } from "./utils";

type MaybeWastedCooldownCellProps = {
  event: AbilityReadyRowProps["event"] | CastRowProps["event"];
};

const calcMissedUsageCount = ({
  now,
  then,
  cd,
  offset,
}: {
  now: number;
  then: number;
  cd: number;
  offset: number;
}) => {
  return (then - now) / 1000 / cd - offset;
};

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
    return <td>irrelevant</td>;
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

  const couldUseNTimes = calcMissedUsageCount({
    now: event.timestamp,
    then: event.ability.nextUse ? event.ability.nextUse : keyEnd,
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
        className={
          wastedCastUpcoming
            ? "bg-red-500"
            : nextCastIsUnderCD
            ? "text-green-500"
            : undefined
        }
      >
        in {timeDurationToString(event.ability.nextUse - event.timestamp, true)}{" "}
        {wastedCastUpcoming && <>(missing {Math.floor(couldUseNTimes)}x)</>}
      </td>
    );
  }

  if (couldUseNTimes <= 1) {
    return <td>impossible</td>;
  }

  return (
    <td className="bg-red-500">
      never (missing {Math.floor(couldUseNTimes)}x)
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
    | "ApplyDebuffStack";
};

export function TypeCell({ type }: TypeCellProps): JSX.Element {
  return <td>{type}</td>;
}

type TimestampCellProps<Event = { timestamp: number; relTimestamp: number }> = {
  msSinceLastEvent: string | null;
  event: Event;
};

export function TimestampCell({
  msSinceLastEvent,
  event,
}: TimestampCellProps): JSX.Element {
  const { useAbsoluteTimestamps, fightStartTime } = usePullDetailsSettings();

  return (
    <td>
      <span
        title={
          msSinceLastEvent ? `${msSinceLastEvent} after last event` : undefined
        }
      >
        {timeDurationToString(
          useAbsoluteTimestamps
            ? event.timestamp - fightStartTime
            : event.relTimestamp
        )}
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
  | {
      environment: boolean;
    }
);

export function SourceOrTargetPlayerCell(
  props: SourceOrTargetPlayerCellProps
): JSX.Element | null {
  const transparency = props.transparent
    ? "bg-white dark:bg-coolgray-700 px-2"
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
    <td className={classnames(props.playerIdTextColorMap[id])}>
      <span className={transparency}>{props.playerIdPlayerNameMap[id]}</span>
    </td>
  );
}
