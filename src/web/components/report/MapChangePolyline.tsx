import type { FightSuccessResponse } from "../../../api/functions/fight";
import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import { doorXOffset, doorYOffset } from "./DoorIndicators";
import type { POIContextDefinition } from "./poi/context";

export type MapChangePolylineProps = {
  doors: POIContextDefinition["doors"][number];
  xFactor: number;
  yFactor: number;
  zoneID: number;
};

const calcMiddle = (
  pull: FightSuccessResponse["pulls"][number],
  door: MapChangePolylineProps["doors"][number],
  type: "x" | "y"
) => {
  const isX = type === "x";
  const pullCoordinate = isX ? pull.x : pull.y;
  const foo = isX ? door.x : door.y;
  const offset = isX ? doorXOffset : doorYOffset;

  return pullCoordinate + (foo + offset - pullCoordinate) / 2;
};

// eslint-disable-next-line import/no-default-export
export default function MapChangePolyline({
  xFactor,
  yFactor,
  doors,
  zoneID,
}: MapChangePolylineProps): JSX.Element | null {
  const { pulls } = useFight().fight;

  // looks huge but isnt worth memoizing
  // in dev, this takes around 0.1s...
  return (
    <>
      {pulls
        .reduce<
          {
            startX: number;
            middleX: number;
            endX: number;
            startY: number;
            middleY: number;
            endY: number;
            key: number;
          }[]
        >((acc, pull, index) => {
          const lastPull = pulls[index - 1];

          if (!lastPull) {
            return acc;
          }

          const lastPullWasInOtherZone = lastPull.zone !== zoneID;
          const thisPullIsInThisZone = pull.zone === zoneID;

          if (lastPullWasInOtherZone && thisPullIsInThisZone) {
            const originDoor = doors.find((door) => door.to === lastPull.zone);

            if (!originDoor) {
              return acc;
            }

            const middleX = calcMiddle(pull, originDoor, "x");
            const middleY = calcMiddle(pull, originDoor, "y");

            return [
              ...acc,
              {
                startX: (originDoor.x + doorXOffset) * xFactor,
                middleX: middleX * xFactor,
                endX: pull.x * xFactor,

                startY: (originDoor.y + doorYOffset) * yFactor,
                middleY: middleY * yFactor,
                endY: pull.y * yFactor,

                key: index,
              },
            ];
          }

          if (!lastPullWasInOtherZone && !thisPullIsInThisZone) {
            const targetDoor = doors.find((door) => door.to === pull.zone);

            if (!targetDoor) {
              return acc;
            }

            const middleX = calcMiddle(lastPull, targetDoor, "x");
            const middleY = calcMiddle(lastPull, targetDoor, "y");

            return [
              ...acc,
              {
                startX: lastPull.x * xFactor,
                middleX: middleX * xFactor,
                endX: (targetDoor.x + doorXOffset) * xFactor,

                startY: lastPull.y * yFactor,
                middleY: middleY * yFactor,
                endY: (targetDoor.y + doorYOffset) * yFactor,

                key: index,
              },
            ];
          }

          return acc;
        }, [])
        .map(({ startX, startY, middleX, middleY, endX, endY, key }) => {
          return (
            <polyline
              key={key}
              markerMid="url(#triangle)"
              className="text-blue-900 stroke-current"
              points={`${startX},${startY} ${middleX},${middleY} ${endX},${endY}`}
            />
          );
        })}
    </>
  );
}
