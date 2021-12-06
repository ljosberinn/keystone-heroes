import { useMapOptions } from "../../store";
import { STATIC_ICON_PREFIX } from "../AbilityIcon";
import type { POIContextDefinition } from "./poi/context";

export type PointsOfInterestProps = {
  poi: POIContextDefinition["poi"][number];
};

// eslint-disable-next-line import/no-default-export
export default function PointsOfInterest({
  poi,
}: PointsOfInterestProps): JSX.Element | null {
  const renderPOIs = useMapOptions((state) => state.renderPOIs);

  if (!renderPOIs) {
    return null;
  }

  return (
    <g>
      {poi.map((element) => {
        return (
          <image
            key={`${element.x}-${element.y}`}
            aria-label={element.label}
            href={`${
              element.icon.includes("/")
                ? `/static/${element.icon}`
                : `${STATIC_ICON_PREFIX}/${element.icon}.jpg`
            }`}
            width={16}
            height={16}
            className="text-black rounded-full opacity-75 fill-current"
            x={`${element.x * 100}%`}
            y={`${element.y * 100}%`}
          />
        );
      })}
    </g>
  );
}
