import React from "react";

import { createWowheadUrl } from "../../../utils";
import { classnames } from "../../../utils/classnames";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import type { TableRowProps } from "../Pulls";
import { TimestampCell, TypeCell, SourceOrTargetPlayerCell } from "../cells";
import type { DefaultEvent } from "../utils";
import { determineAbility } from "../utils";
import type { CastRowProps } from "./CastRow";

export type ApplyBuffRowProps = {
  event: Omit<DefaultEvent, "ability" | "type"> & {
    ability: CastRowProps["event"]["ability"];
    type: "ApplyBuff" | "ApplyBuffStack" | "RemoveBuff";
  };
} & Pick<
  TableRowProps,
  "msSinceLastEvent" | "playerIdPlayerNameMap" | "playerIdTextColorMap"
>;

// eslint-disable-next-line import/no-default-export
export default function ApplyBuffRow({
  event,
  msSinceLastEvent,
  playerIdPlayerNameMap,
  playerIdTextColorMap,
}: ApplyBuffRowProps): JSX.Element | null {
  const ability = determineAbility(event.ability.id);

  if (!ability) {
    if (typeof window !== "undefined") {
      console.log(event.type, { event });
    }
    return null;
  }

  return (
    <tr
      className={classnames(
        "text-center",
        event.type === "RemoveBuff"
          ? "bg-yellow-700 text-white hover:bg-yellow-900"
          : "bg-green-600 hover:bg-green-800"
      )}
    >
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type={event.type} />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        environment={!!event.sourcePlayerID && !!event.targetPlayerID}
        sourcePlayerID={
          event.sourcePlayerID
            ? event.sourcePlayerID
            : event.targetPlayerID
            ? event.targetPlayerID
            : undefined
        }
        transparent
      />

      <td colSpan={3}>
        {event.stacks && "re"}
        {event.type === "RemoveBuff" ? "removed" : "applied"}{" "}
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
          <b className="pl-2">
            {event.stacks && <>{event.stacks}x</>} {ability.name}
          </b>
        </ExternalLink>
      </td>
    </tr>
  );
}
