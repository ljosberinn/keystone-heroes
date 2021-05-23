import { prisma } from "../client";
import { withPerformanceLogging } from "../utils";

import type {
  FurtherExtendedPlayer,
  InsertableFight,
} from "../../../api/src/handler/fight/utils";
import type { Prisma } from "@prisma/client";

type CreateManyFightType_REFACTOR = Omit<InsertableFight, "composition"> & {
  composition: FurtherExtendedPlayer[];
  fightID: number;
};

export const PullRepo = {
  createMany: withPerformanceLogging(
    async (fights: CreateManyFightType_REFACTOR[]): Promise<void> => {
      const actorPlayerMap = new Map(
        fights.flatMap((fight) =>
          fight.composition.map((player) => [player.actorID, player.playerID])
        )
      );

      await Promise.all(
        fights.flatMap((fight) => {
          return fight.pulls.map((pull) => {
            const allMaps = pull.maps.map<Prisma.PullMapCreateManyPullInput>(
              (map) => ({
                mapID: map,
              })
            );

            const allNPCs = pull.npcs.map<Prisma.PullNPCCreateManyPullInput>(
              (npc) => ({
                npcID: npc.gameID,
                count: npc.maximumInstanceID - npc.minimumInstanceID + 1,
              })
            );

            const allEvents = pull.events
              .map<Prisma.EventCreateManyPullInput | null>((event) => {
                const untargeted = event.targetID === -1;
                const targetPlayerID = untargeted
                  ? null
                  : actorPlayerMap.get(event.targetID) ?? null;

                const sourcePlayerID = actorPlayerMap.get(event.sourceID);

                if (!sourcePlayerID) {
                  return null;
                }

                const targetIsPlayer = actorPlayerMap.has(event.targetID);

                const targetNPCID =
                  targetIsPlayer || untargeted
                    ? null
                    : pull.npcs.find((npc) => npc.id === event.targetID)
                        ?.gameID;

                return {
                  timestamp: event.timestamp,
                  targetNPCID,
                  targetPlayerID,
                  abiltiyID: event.abilityGameID,
                  sourcePlayerID,
                };
              })
              .filter(
                (dataset): dataset is Prisma.EventCreateManyPullInput =>
                  dataset !== null
              );

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
                PullMap: {
                  createMany: {
                    data: allMaps,
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
    },
    "PullRepo/createMany"
  ),
};
