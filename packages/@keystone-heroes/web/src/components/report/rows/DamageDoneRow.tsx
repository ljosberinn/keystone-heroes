import { createWowheadUrl } from "../../../utils";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import type { TableRowProps } from "../Pulls";
import { TimestampCell, TypeCell, SourceOrTargetPlayerCell } from "../cells";
import type { DefaultEvent } from "../utils";
import { determineAbility } from "../utils";
import type { CastRowProps } from "./CastRow";

export type DamageDoneRowProps = {
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

// eslint-disable-next-line import/no-default-export
export default function DamageDoneRow({
  event,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
}: DamageDoneRowProps): JSX.Element | null {
  const ability = determineAbility(event.ability.id);

  if (!ability) {
    if (typeof window !== "undefined") {
      console.log(ability);
    }
    return null;
  }

  return (
    <tr className="text-center text-white bg-green-600">
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="DamageDone" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.sourcePlayerID}
        transparent
      />

      <td colSpan={4} className="text-white">
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
          <b className="pl-2">{ability.name}</b>
        </ExternalLink>
        {event.sourceNPC && (
          <>
            <span> of </span>
            <ExternalLink
              href={createWowheadUrl({
                category: "npc",
                id: event.sourceNPC.id,
              })}
            >
              <b>{event.sourceNPC.name}</b>
            </ExternalLink>
          </>
        )}
        {event.targetNPC && (
          <>
            <span> damaged </span>
            <ExternalLink
              href={createWowheadUrl({
                category: "npc",
                id: event.targetNPC.id,
              })}
            >
              <b>{event.targetNPC.name}</b>
            </ExternalLink>
          </>
        )}
        <span> for </span>
        <b>{event.damage.toLocaleString("en-US")}</b>.
      </td>
    </tr>
  );
}
