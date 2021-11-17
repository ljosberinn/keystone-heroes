import { createWowheadUrl } from "../../../utils";
import { classnames } from "../../../utils/classnames";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import type { TableRowProps } from "../Pulls";
import { TimestampCell, TypeCell, SourceOrTargetPlayerCell } from "../cells";
import type { DefaultEvent } from "../utils";
import { determineAbility } from "../utils";
import type { CastRowProps } from "./CastRow";

export type InterruptRowProps = {
  event: Omit<
    DefaultEvent,
    "ability" | "type" | "targetPlayerID" | "sourcePlayerID"
  > & {
    ability: CastRowProps["event"]["ability"];
    targetPlayerID: NonNullable<DefaultEvent["targetPlayerID"]>;
    sourcePlayerID: NonNullable<DefaultEvent["sourcePlayerID"]>;
    type: "Interrupt";
    interruptedAbility: number;
  };
} & Pick<
  TableRowProps,
  "msSinceLastEvent" | "playerIdPlayerNameMap" | "playerIdTextColorMap"
>;

// eslint-disable-next-line import/no-default-export
export default function InterruptRow({
  event,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
}: InterruptRowProps): JSX.Element {
  const ability = determineAbility(event.ability.id);
  const interruptedAbility = determineAbility(event.interruptedAbility);

  return (
    <tr className="text-center bg-red-500">
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="Interrupt" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        targetPlayerID={event.targetPlayerID}
        transparent
      />

      <td className="bg-red-500" colSpan={3}>
        {ability && (
          <>
            <span>interrupted </span>
            <ExternalLink
              href={createWowheadUrl({
                category: "spell",
                id: event.interruptedAbility,
              })}
            >
              {interruptedAbility ? (
                <>
                  <AbilityIcon
                    icon={interruptedAbility.icon}
                    alt={interruptedAbility.name}
                    className="inline object-cover w-4 h-4 rounded-lg"
                    width={16}
                    height={16}
                  />
                  <span className="pl-2">{interruptedAbility.name}</span>
                </>
              ) : (
                "Untracked Ability"
              )}
            </ExternalLink>
            <span> by </span>
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
              <span className="pl-2">{ability.name}</span>
            </ExternalLink>
            {event.damage && (
              <span>
                {" "}
                for <b>{event.damage.toLocaleString("en-US")}</b> damage
              </span>
            )}
            {event.sourcePlayerID && (
              <>
                <span> via </span>
                <span
                  className={classnames(
                    playerIdTextColorMap[event.sourcePlayerID],
                    "bg-coolgray-700 px-2"
                  )}
                >
                  {playerIdPlayerNameMap[event.sourcePlayerID]}
                </span>
              </>
            )}
          </>
        )}
      </td>
    </tr>
  );
}
