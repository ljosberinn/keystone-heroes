import { EXPLOSIVE } from "../../../staticData";
import { createWowheadUrl } from "../../../utils";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import type { TableRowProps } from "../Events";
import {
  TimestampCell,
  TypeCell,
  SourceOrTargetPlayerCell,
  ResponsiveAbilityCell,
} from "../cells";
import type { DefaultEvent } from "../utils";
import { determineAbility, formatNumber } from "../utils";
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
  | "msSinceLastEvent"
  | "playerIdPlayerNameMap"
  | "playerIdTextColorMap"
  | "playerIdIconMap"
>;

// eslint-disable-next-line import/no-default-export
export default function DamageDoneRow({
  event,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
  playerIdIconMap,
}: DamageDoneRowProps): JSX.Element | null {
  if (event.targetNPC && event.targetNPC.id === EXPLOSIVE.unit) {
    return (
      <tr className="text-white bg-emerald-600 ">
        <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

        <TypeCell type="DamageDone" />

        <SourceOrTargetPlayerCell
          playerIdTextColorMap={playerIdTextColorMap}
          playerIdPlayerNameMap={playerIdPlayerNameMap}
          sourcePlayerID={event.sourcePlayerID}
          playerIdIconMap={playerIdIconMap}
          transparent
        />

        <td colSpan={4}>
          <ExternalLink
            href={createWowheadUrl({
              category: "npc",
              id: event.targetNPC.id,
            })}
          >
            <b>{event.targetNPC.name}</b>
          </ExternalLink>
        </td>
      </tr>
    );
  }

  const ability = determineAbility(event.ability.id);

  if (!ability) {
    if (typeof window !== "undefined") {
      console.log(event);
    }
    return null;
  }

  return (
    <tr className="text-white bg-emerald-600">
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="DamageDone" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.sourcePlayerID}
        playerIdIconMap={playerIdIconMap}
        transparent
      />

      <td colSpan={4}>
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
          <ResponsiveAbilityCell bold name={ability.name} />
        </ExternalLink>

        {event.sourceNPC && (
          <>
            <span className="hidden md:inline md:pl-2">of</span>
            <ExternalLink
              href={createWowheadUrl({
                category: "npc",
                id: event.sourceNPC.id,
              })}
            >
              <ResponsiveAbilityCell bold name={event.sourceNPC.name} />
            </ExternalLink>
          </>
        )}

        {event.targetNPC && (
          <>
            <span className="hidden md:inline md:pl-2">-</span>
            <ExternalLink
              href={createWowheadUrl({
                category: "npc",
                id: event.targetNPC.id,
              })}
              className="pl-2 md:pl-0"
            >
              <ResponsiveAbilityCell bold name={event.targetNPC.name} />
            </ExternalLink>
          </>
        )}
        <b className="md:pl-2">{formatNumber(event.damage)}</b>
      </td>
    </tr>
  );
}
