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
import { determineAbility } from "../utils";

export type DamageTakenRowProps = {
  event: Omit<DefaultEvent, "ability" | "type" | "targetPlayerID"> & {
    ability: NonNullable<DefaultEvent["ability"]>;
    targetPlayerID: NonNullable<DefaultEvent["targetPlayerID"]>;
    type: "DamageTaken";
    damage: NonNullable<DefaultEvent["damage"]>;
  };
} & Pick<
  TableRowProps,
  "msSinceLastEvent" | "playerIdPlayerNameMap" | "playerIdTextColorMap"
>;

// eslint-disable-next-line import/no-default-export
export default function DamageTakenRow({
  event,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
  msSinceLastEvent,
}: DamageTakenRowProps): JSX.Element {
  const ability = event.ability ? determineAbility(event.ability.id) : null;

  return (
    <tr className="text-center text-white bg-red-500 hover:bg-red-700">
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="DamageTaken" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.targetPlayerID}
        transparent
      />

      <td colSpan={3} className="text-left">
        {ability ? (
          <>
            <span className="hidden xl:inline"> hit by </span>

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

            {event.damage && (
              <>
                <span className="hidden xl:inline"> for</span>
                <span> </span>
                <span className="lg:hidden"> -</span>
                <b className="hidden md:inline">
                  {event.damage.toLocaleString("en-US")}
                </b>
                <b className="md:hidden">
                  {Number.parseFloat(
                    (event.damage / 1000).toFixed(2)
                  ).toLocaleString("en-US")}
                  k
                </b>
                <span className="hidden xl:inline"> damage</span>
              </>
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
