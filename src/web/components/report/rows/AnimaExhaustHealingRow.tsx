import { NW } from "../../../../wcl/queries/events/dungeons/nw";
import { spells } from "../../../staticData";
import { createWowheadUrl } from "../../../utils";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import type { DefaultEvent } from "../utils";

export type AnimaExhaustHealingRowProps = {
  events: (Omit<DefaultEvent, "ability" | "damage" | "type"> & {
    ability: NonNullable<DefaultEvent["ability"]>;
    damage: number;
    type: "HealingDone";
  })[];
};

const ability = spells[NW.KYRIAN_ORB_HEAL];

// eslint-disable-next-line import/no-default-export
export default function AnimaExhaustHealingRow({
  events,
}: AnimaExhaustHealingRowProps): JSX.Element {
  const totalHealingDone = events.reduce(
    (acc, event) =>
      event.type === "HealingDone" ? acc + (event.healingDone ?? 0) : acc,
    0
  );

  return (
    <tr className="text-white bg-yellow-700/50 border-t-2 border-gray-900 hover:bg-yellow-900">
      <td colSpan={6} className="text-center">
        <span>Total </span>
        <ExternalLink
          href={createWowheadUrl({
            category: "spell",
            id: NW.KYRIAN_ORB_HEAL,
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
        <span> Healing: </span>
        <b>{totalHealingDone.toLocaleString("en-US")}</b>
      </td>
    </tr>
  );
}
