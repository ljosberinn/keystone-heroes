import type { Prisma, PullZone, Pull } from "@prisma/client";
import type { DeepNonNullable } from "ts-essentials";

import type { AnyEvent } from "../queries/events/types";
import type { ReportDungeonPullNpc } from "../types";

export type Processor<
  T extends AnyEvent,
  AdditionalParams = Record<string, unknown>
> = (
  event: T,
  params: {
    sourcePlayerID: number | null;
    targetPlayerID: number | null;
    sourceNPCID: number | null;
    targetNPCID: number | null;
  } & AdditionalParams
) => Prisma.EventCreateManyPullInput | null;

export type PersistedDungeonPull = Pick<
  Pull,
  "id" | "x" | "y" | "isWipe" | "percent"
> & {
  maps: PullZone["zoneID"][];
  enemyNPCs: Pick<
    Required<DeepNonNullable<ReportDungeonPullNpc>>,
    "gameID" | "id"
  >[];
  startTime: number;
  endTime: number;
};

export type PersistableDungeonPull = Omit<PersistedDungeonPull, "id"> & {
  count: number;
};
