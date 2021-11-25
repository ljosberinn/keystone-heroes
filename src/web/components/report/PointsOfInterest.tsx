import { STATIC_ICON_PREFIX } from "../AbilityIcon";
import type { POIContextDefinition } from "./poi/context";

export type PointsOfInterestProps = {
  poi: POIContextDefinition["poi"][number];
  xFactor: number;
  yFactor: number;
};

// eslint-disable-next-line import/no-default-export
export default function PointsOfInterest({
  poi,
  xFactor,
  yFactor,
}: PointsOfInterestProps): JSX.Element {
  return (
    <>
      {poi.map((element) => {
        return (
          <g key={element.x}>
            <image
              aria-label={element.label}
              href={`${STATIC_ICON_PREFIX}${element.icon}.jpg`}
              width={16}
              height={16}
              className="text-black rounded-full opacity-75 fill-current"
              x={element.x * xFactor}
              y={element.y * yFactor}
            />
          </g>
        );
      })}
    </>
  );
}
