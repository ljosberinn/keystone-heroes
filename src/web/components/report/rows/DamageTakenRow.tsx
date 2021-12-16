import { createWowheadUrl } from "../../../utils";
import { classnames } from "../../../utils/classnames";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import type { TableRowProps } from "../Pulls";
import {
  TimestampCell,
  TypeCell,
  SourceOrTargetPlayerCell,
  ResponsiveAbilityCell,
} from "../cells";
import type { DefaultEvent } from "../utils";
import { determineAbility, formatNumber } from "../utils";

export type DamageTakenRowProps = {
  event: Omit<DefaultEvent, "ability" | "type" | "targetPlayerID"> & {
    ability: NonNullable<DefaultEvent["ability"]>;
    targetPlayerID: NonNullable<DefaultEvent["targetPlayerID"]>;
    type: "DamageTaken";
    damage: NonNullable<DefaultEvent["damage"]>;
  };
} & Pick<
  TableRowProps,
  | "msSinceLastEvent"
  | "playerIdPlayerNameMap"
  | "playerIdTextColorMap"
  | "playerIdIconMap"
>;

// eslint-disable-next-line import/no-default-export
export default function DamageTakenRow({
  event,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
  msSinceLastEvent,
  playerIdIconMap,
}: DamageTakenRowProps): JSX.Element {
  const ability = event.ability ? determineAbility(event.ability.id) : null;

  return (
    <tr className="text-white bg-red-500 hover:bg-red-700">
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="DamageTaken" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.targetPlayerID}
        playerIdIconMap={playerIdIconMap}
        transparent
      />

      <td colSpan={3} className="space-x-2">
        {ability ? (
          <>
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

            {event.damage && <b>{formatNumber(event.damage)}</b>}

            {event.sourcePlayerID && (
              <>
                <span>via</span>
                <span
                  className={classnames(
                    playerIdTextColorMap[event.sourcePlayerID],
                    "dark:bg-gray-700 px-2"
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
