import { outlineQuestionCircle } from "../../../icons";
import { createWowheadUrl, timeDurationToString } from "../../../utils";
import { classnames } from "../../../utils/classnames";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import type { TableRowProps } from "../Pulls";
import {
  TimestampCell,
  TypeCell,
  SourceOrTargetPlayerCell,
  MaybeWastedCooldownCell,
} from "../cells";
import type { DefaultEvent, determineAbility } from "../utils";

export type CastRowProps = {
  event: Omit<DefaultEvent, "ability" | "type" | "sourcePlayerID"> & {
    ability: NonNullable<DefaultEvent["ability"]>;
    sourcePlayerID: NonNullable<DefaultEvent["sourcePlayerID"]>;
    type: "Cast" | "BeginCast";
  };
  ability: NonNullable<ReturnType<typeof determineAbility>>;
} & Pick<
  TableRowProps,
  "msSinceLastEvent" | "playerIdPlayerNameMap" | "playerIdTextColorMap"
>;

// eslint-disable-next-line import/no-default-export
export default function CastRow({
  event,
  ability,
  playerIdPlayerNameMap,
  msSinceLastEvent,
  playerIdTextColorMap,
}: CastRowProps): JSX.Element {
  const cooldown = ability ? ability.cd : 0;
  const abilityName = ability?.name ?? "Unknown Ability";

  const usedUnderCooldown = cooldown
    ? (event.timestamp - (event.ability.lastUse ?? 0)) / 1000 <= cooldown
    : false;

  const possibleUsageCount = event.ability.lastUse
    ? Math.floor(
        (event.timestamp - event.ability.lastUse + cooldown) / 1000 / cooldown
      )
    : 0;

  const delayedTooHard = possibleUsageCount > 1;

  return (
    <tr className="text-center bg-coolgray-200 hover:bg-white dark:bg-coolgray-600 dark:hover:bg-coolgray-700">
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type={event.type} />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.sourcePlayerID}
      />

      <td>
        <ExternalLink
          href={createWowheadUrl({
            category: "spell",
            id: event.ability.id,
          })}
        >
          <AbilityIcon
            icon={ability.icon}
            alt={abilityName}
            className="inline object-cover w-4 h-4 rounded-lg"
            width={16}
            height={16}
          />
          <span className="pl-2">{abilityName}</span>
        </ExternalLink>
      </td>

      <td
        className={classnames(
          delayedTooHard && "text-red-500",
          usedUnderCooldown && "text-green-500",
          event.ability.lastUse ? null : "text-yellow-500"
        )}
        title={
          delayedTooHard
            ? `This ability could have been used at least ${
                possibleUsageCount - 1
              }x since its last usage.`
            : undefined
        }
      >
        {event.ability.lastUse ? (
          <span>
            {timeDurationToString(
              event.timestamp - event.ability.lastUse,
              true
            )}{" "}
            ago
          </span>
        ) : (
          "first use"
        )}
        {delayedTooHard && (
          <sup>
            <svg className="inline w-4 h-4 ml-2 text-black dark:text-white">
              <use href={`#${outlineQuestionCircle.id}`} />
            </svg>
          </sup>
        )}
      </td>

      <MaybeWastedCooldownCell event={event} />
    </tr>
  );
}
