import { Fragment } from "react";

import { EXPLOSIVE } from "../../../staticData";
import { createWowheadUrl } from "../../../utils";
import { ExternalLink } from "../../ExternalLink";
import type { TableRowProps } from "../Pulls";
import type { DefaultEvent } from "../utils";

export type ExplosiveSummaryRowProps = {
  events: (Omit<
    DefaultEvent,
    "damage" | "targetNPC" | "type" | "sourcePlayerID"
  > & {
    damage: number;
    type: "DamageDone";
    targetNPC: NonNullable<DefaultEvent["targetNPC"]>;
    sourcePlayerID: NonNullable<DefaultEvent["sourcePlayerID"]>;
  })[];
} & Pick<TableRowProps, "playerIdPlayerNameMap" | "playerIdTextColorMap">;

// eslint-disable-next-line import/no-default-export
export default function ExplosivesSummaryRow({
  events,
  playerIdPlayerNameMap,
  playerIdTextColorMap,
}: ExplosiveSummaryRowProps): JSX.Element {
  const kills = Object.entries(
    // eslint-disable-next-line unicorn/prefer-object-from-entries
    events.reduce<Record<number, number>>((acc, event) => {
      const id = event.sourcePlayerID;

      acc[id] = acc[id] ? acc[id] + 1 : 1;

      return acc;
    }, {})
  );

  return (
    <tr className="text-white bg-yellow-700 border-t-2 border-coolgray-900 hover:bg-yellow-900">
      <td colSpan={6} className="text-center">
        <ExternalLink
          href={createWowheadUrl({
            category: "npc",
            id: EXPLOSIVE.unit,
          })}
        >
          <b className="pl-2">Explosives</b>
        </ExternalLink>
        <span> taken care of: </span>

        {kills.map(([id, amount], index) => {
          const idAsNumber = Number.parseInt(id);

          return (
            <Fragment key={id}>
              <span className={playerIdTextColorMap[idAsNumber]}>
                {playerIdPlayerNameMap[idAsNumber]}
              </span>
              <span className={index === kills.length - 1 ? undefined : "pr-2"}>
                {" "}
                {amount.toLocaleString("en-US")}
              </span>
            </Fragment>
          );
        })}
      </td>
    </tr>
  );
}
