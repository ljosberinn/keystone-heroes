import type { Prisma, Pull, PullZone } from "@keystone-heroes/db/types";
import type { DeepNonNullable } from "ts-essentials";

import type { AnyEvent } from "../queries/events/types";
import type { ReportMapBoundingBox, ReportDungeonPullNpc } from "../types";

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
  "id" | "x" | "y" | "startTime" | "endTime" | "isWipe" | "percent"
> & {
  maps: PullZone["zoneID"][];
  boundingBox: ReportMapBoundingBox;
  enemyNPCs: Pick<
    Required<DeepNonNullable<ReportDungeonPullNpc>>,
    "gameID" | "minimumInstanceID" | "maximumInstanceID" | "id"
  >[];
};
