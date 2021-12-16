import { Fragment } from "react";

import { EXPLOSIVE } from "../../../staticData";
import { bgPrimary } from "../../../styles/tokens";
import { createWowheadUrl } from "../../../utils";
import { calculateExplosiveMetrics } from "../../../utils/affixes";
import { classnames } from "../../../utils/classnames";
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
  const metrics = calculateExplosiveMetrics({
    affixes: [13],
    events,
    groupDPS: 0,
  });

  const kills = Object.entries(metrics.kills);

  return (
    <tr className="text-white bg-yellow-700 border-t-2 border-gray-900 hover:bg-yellow-900">
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
              <span
                className={classnames(
                  playerIdTextColorMap[idAsNumber],
                  bgPrimary,
                  "px-2"
                )}
              >
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
