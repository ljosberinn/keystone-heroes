import { createWowheadUrl } from "../../../utils";
import { ExternalLink } from "../../ExternalLink";
import type { TableRowProps } from "../Pulls";
import { TimestampCell, TypeCell, SourceOrTargetPlayerCell } from "../cells";
import type { PlayerDeathEvent, NPCDeathEvent } from "../utils";

export type DeathRowProps = {
  event: PlayerDeathEvent | NPCDeathEvent;
} & Pick<
  TableRowProps,
  | "msSinceLastEvent"
  | "playerIdPlayerNameMap"
  | "playerIdTextColorMap"
  | "playerIdIconMap"
>;

// eslint-disable-next-line import/no-default-export
export default function DeathRow({
  event,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
  playerIdIconMap,
}: DeathRowProps): JSX.Element {
  return (
    <tr
      className={
        event.targetPlayerID
          ? "bg-red-500 hover:bg-red-700"
          : "bg-emerald-600 hover:bg-emerald-800"
      }
    >
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="Death" />

      {event.targetPlayerID && (
        <SourceOrTargetPlayerCell
          playerIdTextColorMap={playerIdTextColorMap}
          playerIdPlayerNameMap={playerIdPlayerNameMap}
          targetPlayerID={event.targetPlayerID}
          transparent
          playerIdIconMap={playerIdIconMap}
        />
      )}

      <td colSpan={event.targetPlayerID ? 3 : 4}>
        {event.targetPlayerID ? (
          event.sourceNPC ? (
            <>
              <span className="hidden md:inline">killed by </span>
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
            <span>killed </span>
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
