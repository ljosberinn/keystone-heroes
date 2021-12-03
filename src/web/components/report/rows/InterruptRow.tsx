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

  const isQuaking = event.sourcePlayerID === event.targetPlayerID;

  return (
    <tr className={`text-center ${isQuaking ? "bg-red-500" : "bg-green-500"}`}>
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="Interrupt" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        targetPlayerID={isQuaking ? event.targetPlayerID : event.sourcePlayerID}
        transparent
      />

      <td
        colSpan={3}
        className={classnames("text-center", isQuaking && "bg-red-500")}
      >
        {ability && (
          <>
            <span className="hidden lg:inline">interrupted </span>
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
                  <ResponsiveAbilityCell name={interruptedAbility.name} />
                </>
              ) : (
                "Untracked Ability"
              )}
            </ExternalLink>

            <span className="hidden lg:inline">
              {" "}
              {isQuaking ? "by" : "with"}{" "}
            </span>

            <span className="lg:hidden"> {"<"} </span>

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

            {event.damage && (
              <span>
                {" "}
                for <b>{event.damage.toLocaleString("en-US")}</b> damage
              </span>
            )}

            {isQuaking && event.sourcePlayerID && (
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
