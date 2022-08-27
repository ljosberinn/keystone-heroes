import { outlineQuestionCircle } from "../../../icons";
import { DUMMY_CD, SD_LANTERN_OPENING } from "../../../staticData";
import { greenText, redText, yellowText } from "../../../styles/tokens";
import { createWowheadUrl, timeDurationToString } from "../../../utils";
import { classnames } from "../../../utils/classnames";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import type { TableRowProps } from "../Events";
import {
  TimestampCell,
  TypeCell,
  SourceOrTargetPlayerCell,
  MaybeWastedCooldownCell,
  ResponsiveAbilityCell,
} from "../cells";
import { determineAbility } from "../utils";
import type { DefaultEvent } from "../utils";

export type CastRowProps = {
  event: Omit<DefaultEvent, "ability" | "type" | "sourcePlayerID"> & {
    ability: NonNullable<DefaultEvent["ability"]>;
    sourcePlayerID: NonNullable<DefaultEvent["sourcePlayerID"]>;
    type: "Cast" | "BeginCast";
  };
} & Pick<
  TableRowProps,
  | "msSinceLastEvent"
  | "playerIdPlayerNameMap"
  | "playerIdTextColorMap"
  | "playerIdIconMap"
>;

// eslint-disable-next-line import/no-default-export
export default function CastRow({
  event,
  playerIdPlayerNameMap,
  msSinceLastEvent,
  playerIdTextColorMap,
  playerIdIconMap,
}: CastRowProps): JSX.Element | null {
  const ability = determineAbility(event.ability.id);

  if (!ability) {
    if (typeof window !== "undefined") {
      console.log(event);
    }
    return null;
  }

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
    <tr
      className={
        event.type === "BeginCast" || event.ability.id === SD_LANTERN_OPENING
          ? "bg-yellow-700/50 hover:bg-yellow-900"
          : "bg-gray-200/50 hover:bg-white dark:bg-gray-600 dark:hover:bg-gray-700"
      }
    >
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />

      <TypeCell type={event.type} />

      <SourceOrTargetPlayerCell
        playerIdTextColorMap={playerIdTextColorMap}
        playerIdPlayerNameMap={playerIdPlayerNameMap}
        sourcePlayerID={event.sourcePlayerID}
        playerIdIconMap={playerIdIconMap}
        transparent
      />

      <td colSpan={ability.cd === DUMMY_CD ? 3 : 1}>
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

      {ability.cd === DUMMY_CD ? null : (
        <td
          className={classnames(
            delayedTooHard && redText,
            usedUnderCooldown && greenText,
            event.ability.lastUse ? null : yellowText
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
            <>
              <span className="md:hidden">-</span>
              <span>
                {timeDurationToString(event.timestamp - event.ability.lastUse, {
                  omitMs: true,
                })}
              </span>

              <span className="hidden md:inline"> ago</span>
            </>
          ) : (
            <>
              <span className="hidden md:inline">first use</span>
              <span className="md:hidden">1st</span>
            </>
          )}
          {delayedTooHard && (
            <sup className="hidden lg:inline">
              <svg className="inline w-4 h-4 ml-2 text-black dark:text-white">
                <use href={`#${outlineQuestionCircle.id}`} />
              </svg>
            </sup>
          )}
        </td>
      )}

      <MaybeWastedCooldownCell event={event} />
    </tr>
  );
}
