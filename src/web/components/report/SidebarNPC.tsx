import { useState } from "react";

import { EXPLOSIVE, spells } from "../../staticData";
import { createWowheadUrl } from "../../utils";
import { AbilityIcon } from "../AbilityIcon";
import { ExternalLink } from "../ExternalLink";

type SidebarNPCProps = {
  npc: {
    count: number;
    id: number;
    name: string;
    totalPercent: number | null;
    percentPerNPC: number | null;
    countPerNPC: number;
  };
};

export function SidebarNPC({ npc }: SidebarNPCProps): JSX.Element {
  const [npcIconErrored, setNpcIconErrored] = useState(false);

  return (
    <div className="flex items-center justify-between w-full px-4 py-2">
      <span>{npc.count}x</span>

      <ExternalLink
        href={createWowheadUrl({
          category: "npc",
          id: npc.id,
        })}
        className="flex items-center flex-1 px-2 truncate"
      >
        {npc.id === EXPLOSIVE.unit ? (
          <AbilityIcon
            icon={spells[EXPLOSIVE.ability].icon}
            width={32}
            height={32}
            className="object-cover w-8 h-8 rounded-full"
            alt={spells[EXPLOSIVE.ability].name}
          />
        ) : npcIconErrored ? (
          <span className="w-8 h-8" />
        ) : (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            src={`/static/npcs/${npc.id}.png`}
            alt=""
            className="object-cover w-8 h-8 rounded-full"
            width={32}
            height={32}
            loading="lazy"
            onError={() => {
              setNpcIconErrored(true);
            }}
          />
        )}

        <span className="pl-2 truncate">{npc.name}</span>
      </ExternalLink>

      {npc.totalPercent && npc.percentPerNPC ? (
        <span
          title={`${npc.percentPerNPC.toFixed(2)}% or ${
            npc.countPerNPC
          } count per NPC`}
          className="justify-self-end"
        >
          {npc.totalPercent.toFixed(2)}%
        </span>
      ) : null}
    </div>
  );
}
