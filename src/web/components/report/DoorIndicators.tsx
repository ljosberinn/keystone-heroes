import type { POIContextDefinition } from "./poi/context";

type DoorIndicatorsProps = {
  xFactor: number;
  yFactor: number;
  doors: POIContextDefinition["doors"][number];
  onDoorClick: (zoneID: number) => void;
};

// door width / 2 / svg width
export const doorXOffset = 0.012_830_793_905_372_895;
export const doorYOffset = 0.014_440_433_212_996_39;

const width = 32;
const height = 24;

// eslint-disable-next-line import/no-default-export
export default function DoorIndicators({
  xFactor,
  yFactor,
  onDoorClick,
  doors,
}: DoorIndicatorsProps): JSX.Element | null {
  return (
    <g>
      {doors.map((door) => (
        <image
          href={`/static/icons/door_${door.type}.png`}
          key={door.x}
          x={(door.x + doorXOffset) * xFactor - width / 2}
          y={(door.y + doorYOffset) * yFactor - height / 2}
          className="cursor-pointer"
          onClick={() => {
            onDoorClick(door.to);
          }}
          width={width}
          height={height}
        />
      ))}
    </g>
  );
}
