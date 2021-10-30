import { createWowheadUrl, timeDurationToString } from "../../../utils";
import { classnames } from "../../../utils/classnames";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import {
  TimestampCell,
  TypeCell,
  SourceOrTargetPlayerCell,
  MaybeWastedCooldownCell,
} from "../cells";
import type { CastRowProps } from "./CastRow";

export type AbilityReadyRowProps = {
  event: Omit<CastRowProps["event"], "type"> & { type: "AbilityReady" };
  ability: CastRowProps["ability"];
  playerIdPlayerNameMap: Record<string, string>;
  playerIdTextColorMap: Record<string, string>;
  msSinceLastEvent: string | null;
};

// eslint-disable-next-line import/no-default-export
export default function AbilityReadyRow({
  event,
  ability,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
}: AbilityReadyRowProps): JSX.Element {
  const cooldown = ability ? ability.cd : 0;
  const abilityName = ability?.name ?? "Unknown Ability";

  const usedUnderCooldown = cooldown
    ? (event.timestamp - (event.ability.lastUse ?? 0)) / 1000 < cooldown
    : false;

  return (
    <tr className="text-center hover:bg-coolgray-200 dark:hover:bg-coolgray-600">
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="AbilityReady" />

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
          usedUnderCooldown && "text-green-500",
          event.ability.lastUse ? null : "text-yellow-500"
        )}
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
      </td>

      <MaybeWastedCooldownCell event={event} />
    </tr>
  );
}
