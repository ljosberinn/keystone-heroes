import { prisma } from "../client";
import { processEvents } from "../transform/events";
import { withPerformanceLogging } from "../utils";

import type {
  FurtherExtendedPlayer,
  InsertableFight,
} from "../../../api/src/handler/fight/utils";
import type { Prisma } from "@prisma/client";

export type CreateManyFightType_REFACTOR = Omit<
  InsertableFight,
  "composition"
> & {
  composition: FurtherExtendedPlayer[];
  fightID: number;
};

const createMany = async (
  fights: CreateManyFightType_REFACTOR[],
  actorPlayerMap: Map<number, number>
): Promise<void> => {
  await Promise.all(
    fights.flatMap((fight) => {
      return fight.pulls.map((pull) => {
        const allZones = pull.maps.map<Prisma.PullZoneCreateManyPullInput>(
          (map) => ({
            zoneID: map,
          })
        );

        const allNPCs = pull.npcs.map<Prisma.PullNPCCreateManyPullInput>(
          (npc) => ({
            npcID: npc.gameID,
            count: npc.maximumInstanceID - npc.minimumInstanceID + 1,
          })
        );

        const allEvents = processEvents(pull, actorPlayerMap);

        return prisma.pull.create({
          data: {
            fightID: fight.fightID,
            startTime: pull.startTime,
            endTime: pull.endTime,
            x: pull.x,
            y: pull.y,
            minX: pull.boundingBox.minX,
            minY: pull.boundingBox.minY,
            maxX: pull.boundingBox.maxX,
            maxY: pull.boundingBox.maxY,
            PullZone: {
              createMany: {
                data: allZones,
              },
            },
            PullNPC: {
              createMany: {
                data: allNPCs,
              },
            },
            Event: {
              createMany: {
                data: allEvents,
              },
            },
          },
        });
      });
    })
  );
};

export const PullRepo = {
  createMany: withPerformanceLogging(createMany, "PullRepo/createMany"),
};
