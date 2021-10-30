import { outlineQuestionCircle } from "../../../icons";
import { createWowheadUrl } from "../../../utils";
import { classnames } from "../../../utils/classnames";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import { usePullDetailsSettings } from "../PullDetailsSettings";
import type { TableRowProps } from "../Pulls";
import { TimestampCell, TypeCell, SourceOrTargetPlayerCell } from "../cells";
import type { DefaultEvent } from "../utils";
import { determineAbility } from "../utils";
import type { CastRowProps } from "./CastRow";

export type HealingDoneRowProps = {
  event: Omit<
    DefaultEvent,
    "ability" | "type" | "healing" | "sourcePlayerID" | "targetNPC"
  > & {
    ability: CastRowProps["event"]["ability"];
    type: "HealingDone";
    healingDone: number;
  } & (
      | {
          sourcePlayerID: number;
          targetNPC: null;
        }
      | {
          targetNPC: { id: number; name: string };
          sourcePlayerID: null;
        }
    );
} & Pick<
  TableRowProps,
  "msSinceLastEvent" | "playerIdPlayerNameMap" | "playerIdTextColorMap"
>;

// eslint-disable-next-line import/no-default-export
export default function HealingDoneRow({
  event,
  msSinceLastEvent,
  playerIdPlayerNameMap,
  playerIdTextColorMap,
}: HealingDoneRowProps): JSX.Element | null {
  const ability = determineAbility(event.ability.id);
  const { groupDPS } = usePullDetailsSettings();

  if (!ability) {
    if (typeof window !== "undefined") {
      console.log(ability);
    }
    return null;
  }

  return (
    <tr
      className={classnames(
        "text-center",
        event.sourcePlayerID && "bg-green-600 hover:bg-green-800",
        event.targetNPC && "bg-red-700 hover:bg-red-900"
      )}
    >
      <TimestampCell event={event} msSinceLastEvent={msSinceLastEvent} />
      <TypeCell type="HealingDone" />

      {event.sourcePlayerID && (
        <SourceOrTargetPlayerCell
          playerIdTextColorMap={playerIdTextColorMap}
          playerIdPlayerNameMap={playerIdPlayerNameMap}
          sourcePlayerID={event.sourcePlayerID}
          transparent
        />
      )}

      <td colSpan={event.targetNPC ? 4 : 3}>
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
          <b className="pl-2">{ability.name}</b>
        </ExternalLink>
        <span> healed </span>
        {event.targetNPC && (
          <ExternalLink
            href={createWowheadUrl({
              category: "npc",
              id: event.targetNPC.id,
            })}
            className="font-bold"
          >
            {event.targetNPC.name}
          </ExternalLink>
        )}
        <span> for </span>
        <b>{event.healingDone.toLocaleString("en-US")} </b>
        {event.targetNPC && (
          <span title="This time loss is estimated based on your overall average group DPS.">
            (+{(event.healingDone / groupDPS).toFixed(2)}s)
            <sup>
              <svg className="inline w-4 h-4 ml-2 text-black dark:text-white">
                <use href={`#${outlineQuestionCircle.id}`} />
              </svg>
            </sup>
          </span>
        )}
        .
      </td>
    </tr>
  );
}
