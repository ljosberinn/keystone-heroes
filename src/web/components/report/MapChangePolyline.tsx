import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import type { POIContextDefinition } from "./poi/context";

type MapChangePolylineProps = {
  doors: POIContextDefinition["doors"][number];
  xFactor: number;
  yFactor: number;
  zoneID: number;
};

// door width / 2 / svg width
const doorXOffset = 0.012_830_793_905_372_895;
const doorYOffset = 0.014_440_433_212_996_39;

// eslint-disable-next-line import/no-default-export
export default function MapChangePolyline({
  xFactor,
  yFactor,
  doors,
  zoneID,
}: MapChangePolylineProps): JSX.Element | null {
  const { pulls } = useFight().fight;

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

            const middleX = pull.x + (originDoor.x + doorXOffset - pull.x) / 2;
            const middleY = pull.y + (originDoor.y + doorYOffset - pull.y) / 2;

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

            const middleX =
              lastPull.x + (targetDoor.x + doorXOffset - lastPull.x) / 2;
            const middleY =
              lastPull.y + (targetDoor.y + doorYOffset - lastPull.y) / 2;

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
