import type { POIContextDefinition } from "./poi/context";

type DoorIndicatorsProps = {
  xFactor: number;
  yFactor: number;
  doors: POIContextDefinition["doors"][number];
  onDoorClick: (zoneID: number) => void;
};

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
          x={door.x * xFactor}
          y={door.y * yFactor}
          className="w-8 h-6 cursor-pointer"
          onClick={() => {
            onDoorClick(door.to);
          }}
          width={32}
          height={24}
        />
      ))}
    </g>
  );
}
