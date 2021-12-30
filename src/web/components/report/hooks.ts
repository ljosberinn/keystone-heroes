import type { FightSuccessResponse } from "../../../api/functions/fight";
import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import {
  dungeons,
  EXPLOSIVE,
  isBoss,
  isTormentedLieutenant,
  npcs as allNPCs,
} from "../../staticData";
import { isExplosivesDamageEvent } from "./utils";

type PullNPCs = {
  npcs: {
    totalPercent: number;
    percentPerNPC: number;
    countPerNPC: number;
    isBoss: boolean;
    isTormentedLieutenant: boolean;
    count: number;
    id: number;
    name: string;
  }[];
  explosives: Set<number>;
  pull: FightSuccessResponse["pulls"][number];
  selectedPull: number;
  percentAfterThisPull: number;
} | null;

export function usePullNPCs(selectedPullID: number): PullNPCs {
  const { fight } = useFight();
  const { pulls, dungeon: dungeonID } = fight;

  const pull = pulls[selectedPullID - 1];

  const dungeon = dungeons[dungeonID];

  const npcs = pull.npcs
    .filter((npc) => npc.id !== EXPLOSIVE.unit)
    .map((npc) => {
      const countPerNPC =
        npc.id in dungeon.unitCountMap ? dungeon.unitCountMap[npc.id] : 0;
      const percentPerNPC =
        countPerNPC === 0 ? 0 : (countPerNPC / dungeon.count) * 100;
      const totalPercent = percentPerNPC === 0 ? 0 : npc.count * percentPerNPC;

      return {
        ...npc,
        totalPercent,
        percentPerNPC,
        countPerNPC,
        isBoss: isBoss(npc.id),
        isTormentedLieutenant: isTormentedLieutenant(npc.id),
        name: allNPCs[npc.id],
      };
    })
    .sort((a, b) => {
      if (a.isBoss || a.isTormentedLieutenant) {
        return -1;
      }

      if (b.isBoss || b.isTormentedLieutenant) {
        return 1;
      }

      if (a.totalPercent === b.totalPercent) {
        if (a.totalPercent === 0) {
          return -1;
        }

        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (nameB > nameA) {
          return -1;
        }

        if (nameA > nameB) {
          return 1;
        }

        return 0;
      }

      return a.totalPercent > b.totalPercent ? -1 : 1;
    });

  const explosives = new Set(
    pull.events
      .filter(
        (event) =>
          isExplosivesDamageEvent(event) ||
          (event.type === "DamageTaken" &&
            event.ability?.id === EXPLOSIVE.ability)
      )
      .map((event) => event.timestamp)
  );

  return {
    npcs,
    explosives,
    selectedPull: selectedPullID,
    pull,
    percentAfterThisPull: pulls.reduce(
      (acc, p) => (p.id <= pull.id ? acc + p.percent : acc),
      0
    ),
  };
}
