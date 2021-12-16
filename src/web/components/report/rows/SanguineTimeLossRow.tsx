import { useFight } from "../../../../pages/report/[reportID]/[fightID]";
import { SANGUINE_ICHOR_HEALING, spells } from "../../../staticData";
import { createWowheadUrl, timeDurationToString } from "../../../utils";
import { calculateSanguineMetrics } from "../../../utils/affixes";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import type { DefaultEvent } from "../utils";
import { formatNumber } from "../utils";

export type SanguineTimeLossRowProps = {
  events: (Omit<DefaultEvent, "healingDone" | "ability" | "type"> & {
    healingDone: number;
    type: "HealingDone";
    ability: NonNullable<DefaultEvent["ability"]>;
  })[];
};

const ability = spells[SANGUINE_ICHOR_HEALING];

// eslint-disable-next-line import/no-default-export
export default function SanguineTimeLossRow({
  events,
}: SanguineTimeLossRowProps): JSX.Element {
  const { fight } = useFight();

  const { estTimeLoss, healing } = calculateSanguineMetrics({
    affixes: [8],
    events,
    groupDPS: fight.meta.dps,
  });

  return (
    <tr className="text-white bg-yellow-700 border-t-2 border-gray-900 hover:bg-yellow-900">
      <td colSpan={6} className="text-center">
        <span>Total </span>
        <ExternalLink
          href={createWowheadUrl({
            category: "spell",
            id: SANGUINE_ICHOR_HEALING,
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
        <b>{formatNumber(healing)}</b>
        <span> - Estimated Time Loss: </span>
        <b>{timeDurationToString(estTimeLoss * 1000, true)}</b>
      </td>
    </tr>
  );
}
