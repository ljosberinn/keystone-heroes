import { useFight } from "../../../../pages/report/[reportID]/[fightID]";
import { WS, spells } from "../../../staticData";
import { createWowheadUrl, timeDurationToString } from "../../../utils";
import { AbilityIcon } from "../../AbilityIcon";
import { ExternalLink } from "../../ExternalLink";
import type { DefaultEvent } from "../utils";

export type RocketBarrageDamageRowProps = {
  events: (Omit<DefaultEvent, "ability" | "damage" | "type"> & {
    ability: NonNullable<DefaultEvent["ability"]>;
    damage: number;
    type: "DamageTaken";
  })[];
};

const ability = spells[WS.ROCKET_BARRAGE];

// eslint-disable-next-line import/no-default-export
export default function RocketBarrageDamageRow({
  events,
}: RocketBarrageDamageRowProps): JSX.Element {
  const { fight } = useFight();

  const totalDamageDone = events.reduce((acc, event) => acc + event.damage, 0);

  return (
    <tr className="text-white bg-yellow-700 border-t-2 border-gray-900 hover:bg-yellow-900">
      <td colSpan={6} className="text-center">
        <span>Total </span>
        <ExternalLink
          href={createWowheadUrl({
            category: "spell",
            id: WS.ROCKET_BARRAGE,
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
        <span> Damage: </span>
        <b>{totalDamageDone.toLocaleString("en-US")}</b>
        <span> - Estimated Time Save: </span>
        <b>
          {timeDurationToString((totalDamageDone / fight.meta.dps) * 1000, {
            omitMs: true,
          })}
        </b>
      </td>
    </tr>
  );
}
