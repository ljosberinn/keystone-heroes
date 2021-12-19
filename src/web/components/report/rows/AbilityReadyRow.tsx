import { yellowText } from "../../../styles/tokens";
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
  ResponsiveAbilityCell,
} from "../cells";
import { determineAbility } from "../utils";
import type { CastRowProps } from "./CastRow";

export type AbilityReadyRowProps = {
  event: Omit<CastRowProps["event"], "type"> & { type: "AbilityReady" };
} & Pick<
  TableRowProps,
  | "msSinceLastEvent"
  | "playerIdPlayerNameMap"
  | "playerIdTextColorMap"
  | "playerIdIconMap"
>;

// eslint-disable-next-line import/no-default-export
export default function AbilityReadyRow({
  event,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdPlayerNameMap,
  playerIdIconMap,
}: AbilityReadyRowProps): JSX.Element | null {
  const ability = determineAbility(event.ability.id);

  if (!ability) {
    return null;
  }

  const cooldown = ability ? ability.cd : 0;
  const abilityName = ability?.name ?? "Unknown Ability";

  const usedUnderCooldown = cooldown
    ? (event.timestamp - (event.ability.lastUse ?? 0)) / 1000 < cooldown
    : false;

  return (
    <tr className="hover:bg-gray-200 dark:hover:bg-gray-600">
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type="AbilityReady" />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.sourcePlayerID}
        playerIdIconMap={playerIdIconMap}
        transparent
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
          <ResponsiveAbilityCell name={abilityName} />
        </ExternalLink>
      </td>

      <td
        className={classnames(
          usedUnderCooldown && "text-emerald-500",
          !event.ability.lastUse && yellowText
        )}
      >
        {event.ability.lastUse ? (
          <>
            <span className="md:hidden">-</span>
            <span>
              {timeDurationToString(
                event.timestamp - event.ability.lastUse,
                true
              )}
            </span>
            <span className="hidden md:inline"> ago</span>
          </>
        ) : (
          "first use"
        )}
      </td>

      <MaybeWastedCooldownCell event={event} />
    </tr>
  );
}
