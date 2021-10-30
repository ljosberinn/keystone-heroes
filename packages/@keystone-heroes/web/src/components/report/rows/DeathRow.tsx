import { createWowheadUrl } from "../../../utils";
import { classnames } from "../../../utils/classnames";
import { ExternalLink } from "../../ExternalLink";
import type { TableRowProps } from "../Pulls";
import { TimestampCell, TypeCell, SourceOrTargetPlayerCell } from "../cells";
import type { PlayerDeathEvent, NPCDeathEvent } from "../utils";

export type DeathRowProps = {
  event: PlayerDeathEvent | NPCDeathEvent;
} & Pick<
  TableRowProps,
  "msSinceLastEvent" | "playerIdPlayerNameMap" | "playerIdTextColorMap"
>;

// eslint-disable-next-line import/no-default-export
export default function DeathRow({
  event,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
}: DeathRowProps): JSX.Element {
  return (
    <tr
      className={classnames(
        "text-center",
        event.targetPlayerID
          ? "bg-red-500 hover:bg-red-700"
          : "bg-green-600 hover:bg-green-800"
      )}
    >
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="Death" />

      {event.targetPlayerID && (
        <SourceOrTargetPlayerCell
          playerIdTextColorMap={playerIdTextColorMap}
          playerIdPlayerNameMap={playerIdPlayerNameMap}
          targetPlayerID={event.targetPlayerID}
          transparent
        />
      )}

      <td colSpan={event.targetPlayerID ? 3 : 4}>
        {event.targetPlayerID ? (
          event.sourceNPC ? (
            <>
              killed by{" "}
              <ExternalLink
                href={createWowheadUrl({
                  category: "npc",
                  id: event.sourceNPC.id,
                })}
                className="font-bold"
              >
                {event.sourceNPC.name}
              </ExternalLink>
            </>
          ) : (
            <span>Unknown Ability</span>
          )
        ) : event.targetNPC ? (
          <>
            killed{" "}
            <ExternalLink
              href={createWowheadUrl({
                category: "npc",
                id: event.targetNPC.id,
              })}
              className="font-bold"
            >
              {event.targetNPC.name}
            </ExternalLink>
          </>
        ) : null}
      </td>
    </tr>
  );
}
