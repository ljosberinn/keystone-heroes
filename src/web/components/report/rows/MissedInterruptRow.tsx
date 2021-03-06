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
import { determineAbility } from "../utils";

export type MissedInterruptRowProps = {
  event: Omit<DefaultEvent, "ability" | "type" | "sourcePlayerID"> & {
    ability: NonNullable<DefaultEvent["ability"]>;
    type: "MissedInterrupt";
    sourcePlayerID: number;
  };
} & Pick<
  TableRowProps,
  | "msSinceLastEvent"
  | "playerIdPlayerNameMap"
  | "playerIdTextColorMap"
  | "playerIdIconMap"
>;

// eslint-disable-next-line import/no-default-export
export default function MissedInterruptRow({
  event,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
  msSinceLastEvent,
  playerIdIconMap,
}: MissedInterruptRowProps): JSX.Element {
  const ability = event.ability ? determineAbility(event.ability.id) : null;

  return (
    <tr className="text-white bg-red-500 hover:bg-red-700">
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="MissedInterrupt" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.sourcePlayerID}
        playerIdIconMap={playerIdIconMap}
        transparent
      />

      <td colSpan={3}>
        {ability ? (
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
            <ResponsiveAbilityCell name={ability.name} />
          </ExternalLink>
        ) : null}
      </td>
    </tr>
  );
}
