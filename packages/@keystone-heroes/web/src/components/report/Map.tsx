import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import type { KeyboardEvent } from "react";
import { Fragment, useState, useRef, useEffect, useCallback } from "react";
import { useFightIDContext } from "src/pages/report/[reportID]/[fightID]";
import { classnames } from "src/utils/classnames";

import { WCL_ASSET_URL } from "../AbilityIcon";
import { findTormentedLieutenantPull } from "./utils";

type MapProps = {
  zones: FightSuccessResponse["dungeon"]["zones"];
  pulls: FightSuccessResponse["pulls"];
};

export function Map({ zones, pulls }: MapProps): JSX.Element {
  const [imageSize, setImageSize] = useState<PullIndicatorsProps["imageSize"]>({
    clientHeight: 0,
    clientWidth: 0,
    offsetLeft: 0,
    offsetTop: 0,
  });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const tabPanelRef = useRef<HTMLDivElement | null>(null);
  const { selectedPull } = useFightIDContext();

  const handleResize = useCallback(() => {
    if (imageRef.current) {
      const { clientHeight, clientWidth, offsetTop, offsetLeft } =
        imageRef.current;

      setImageSize((prev) => {
        // prevent unnecessary rerenders through image onLoad
        if (
          prev.clientHeight !== clientHeight ||
          prev.clientWidth !== clientWidth ||
          prev.offsetTop !== offsetTop ||
          prev.offsetLeft !== offsetLeft
        ) {
          return { clientHeight, clientWidth, offsetTop, offsetLeft };
        }

        return prev;
      });
    }
  }, []);

  const zoneToSelect = pulls[selectedPull - 1].zones;
  const tab = zones.findIndex((zone) => zone.id === zoneToSelect[0]);
  const [selectedTab, setSelectedTab] = useState(tab);

  const shouldFocusRef = useRef(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (shouldFocusRef.current) {
      shouldFocusRef.current = false;
      buttonRefs.current[selectedTab]?.focus();
    }
  });

  const onTabButtonClick = useCallback((nextIndex) => {
    setSelectedTab(nextIndex);
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const { key } = event;

      const lookupValue =
        key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : null;

      if (!lookupValue) {
        return;
      }

      event.preventDefault();
      shouldFocusRef.current = true;

      setSelectedTab((currentIndex) => {
        const nextIndex = currentIndex + lookupValue;

        // going from first to last
        if (nextIndex < 0) {
          return zones.length - 1;
        }

        // going from nth to nth
        if (zones.length - 1 >= nextIndex) {
          return nextIndex;
        }

        // going from last to first
        return 0;
      });
    },
    [zones.length]
  );

  return (
    <section className="w-full lg:w-4/6">
      <h1 className="text-2xl font-bold">Route</h1>
      <svg height="0" width="0">
        <marker
          id="triangle"
          viewBox="0 0 10 10"
          refX="1"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
        </marker>
      </svg>
      <div role="tablist" aria-orientation="horizontal" className="flex">
        {zones.map((zone, index) => {
          const selected = index === selectedTab;

          return (
            <div className="p-4" key={zone.id}>
              <button
                type="button"
                role="tab"
                data-orientation="horizontal"
                aria-controls={`tabpanel-${zone.id}`}
                id={`tab-${zone.id}`}
                onKeyDown={onKeyDown}
                ref={(ref) => {
                  buttonRefs.current[index] = ref;
                }}
                className={`focus:outline-none focus:ring disabled:cursor-not-allowed dark:disabled:text-coolgray-500 disabled:text-coolgray-700 ${
                  selected ? "border-coolgray-500 font-bold" : ""
                }`}
                onClick={() => {
                  onTabButtonClick(index);
                }}
              >
                {zone.name}
              </button>
            </div>
          );
        })}
      </div>
      {zones.map((zone, index) => {
        const hidden = index !== selectedTab;

        return (
          <div
            role="tabpanel"
            data-orientation="horizontal"
            data-state="active"
            id={`tabpanel-${zone.id}`}
            aria-labelledby={`tab-${zone.id}`}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            ref={hidden ? undefined : tabPanelRef}
            key={zone.id}
          >
            {hidden ? null : (
              <>
                <picture>
                  {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                  <img
                    src={`/static/maps/${zone.id}.png`}
                    alt={zone.name}
                    ref={imageRef}
                    className="object-cover w-full h-full"
                    onLoad={handleResize}
                  />
                </picture>
                <PullIndicators
                  pulls={pulls.filter((pull) => pull.zones[0] === zone.id)}
                  imageSize={imageSize}
                  handleResize={handleResize}
                />
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}

type PullIndicatorsProps = Pick<MapProps, "pulls"> & {
  imageSize: Pick<
    HTMLImageElement,
    "clientHeight" | "clientWidth" | "offsetLeft" | "offsetTop"
  >;
  handleResize: () => void;
};

function PullIndicators({
  pulls,
  handleResize,
  imageSize,
}: PullIndicatorsProps) {
  const rafRef = useRef<number | null>(null);
  const { selectedPull, handlePullSelectionChange } = useFightIDContext();

  useEffect(() => {
    const listener = () => {
      if (rafRef.current) {
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        handleResize();
      });
    };

    window.addEventListener("resize", listener);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("resize", listener);
    };
  }, [handleResize]);

  return (
    <>
      <style jsx>
        {`
          .svg {
            left: ${imageSize.offsetLeft}px;
            top: ${imageSize.offsetTop}px;
            width: ${imageSize.clientWidth}px;
            height: ${imageSize.clientHeight}px;
          }

          .polyline {
            marker-mid: url(#triangle);
            stroke: red;
          }

          .polyline.invisibility {
            stroke: darkgreen;
          }

          .rect {
            fill: black;
            opacity: 0.5;
          }

          .selected {
            outline: 2px dashed yellow;
            opacity: 1;
          }
        `}
      </style>
      <svg className="absolute svg">
        {pulls.map((pull, index) => {
          const x = pull.x * imageSize.clientWidth;
          const y = pull.y * imageSize.clientHeight;

          const tormentedLieutenant = findTormentedLieutenantPull(pull);

          const nextPull =
            pulls[index + 1]?.id === pull.id + 1 ? pulls[index + 1] : null;

          const invisibilityUsage = nextPull
            ? detectInvisibilityUsage(nextPull)
            : null;

          const nextX = nextPull
            ? nextPull.x * (imageSize.clientWidth ?? 0)
            : null;
          const nextY = nextPull
            ? nextPull.y * (imageSize.clientHeight ?? 0)
            : null;

          const middleX = nextX ? x + (nextX - x) / 2 : null;
          const middleY = nextY ? y + (nextY - y) / 2 : null;

          const selected = selectedPull === pull.id;

          const size = selected ? 32 : 24;

          const sharedProps = {
            width: size,
            height: size,
            onClick: () => {
              handlePullSelectionChange(pull.id);
            },
            x: (x - (selected ? 16 : 12)).toFixed(2),
            y: (y - (selected ? 16 : 12)).toFixed(2),
          };

          return (
            <Fragment key={pull.startTime}>
              {invisibilityUsage && (
                <ShroudOrInvisIndicator
                  x={x}
                  y={y}
                  nextX={nextX}
                  nextY={nextY}
                  type={invisibilityUsage}
                />
              )}
              {tormentedLieutenant ? (
                <image
                  className={classnames(
                    "cursor-pointer",
                    selected && "selected"
                  )}
                  href={`${WCL_ASSET_URL}${tormentedLieutenant.icon}.jpg`}
                  {...sharedProps}
                />
              ) : (
                <rect
                  className={classnames(
                    "cursor-pointer",
                    "rect",
                    selected && "selected"
                  )}
                  {...sharedProps}
                />
              )}
              {nextX && nextY && middleX && middleY && (
                <polyline
                  className={classnames(
                    "polyline",
                    invisibilityUsage && "invisibility"
                  )}
                  points={`${x.toFixed(2)},${y.toFixed(2)} ${middleX.toFixed(
                    2
                  )},${middleY.toFixed(2)} ${nextX.toFixed(2)},${nextY.toFixed(
                    2
                  )}`}
                />
              )}
            </Fragment>
          );
        })}
      </svg>
    </>
  );
}

const detectInvisibilityUsage = (pull: MapProps["pulls"][number]) => {
  const eventWasBeforeThisPull = (
    event: MapProps["pulls"][number]["events"][number]
  ) => event.timestamp < pull.startTime;

  const invisEvent = pull.events.find(
    (event) =>
      event.eventType === "ApplyBuff" &&
      (event.ability?.id === 307_195 || event.ability?.id === 321_422)
  );

  if (invisEvent && eventWasBeforeThisPull(invisEvent)) {
    return "invisibility";
  }

  const shroudEvent = pull.events.find(
    (event) => event.eventType === "Cast" && event.ability?.id === 114_018
  );

  if (shroudEvent && eventWasBeforeThisPull(shroudEvent)) {
    return "shroud";
  }

  return null;
};

type ShroudOrInvisIndicatorProps = {
  x: number;
  y: number;
  nextX: number | null;
  nextY: number | null;
  type: "shroud" | "invisibility";
};

function ShroudOrInvisIndicator({
  x,
  y,
  nextX,
  nextY,
  type,
}: ShroudOrInvisIndicatorProps) {
  if (!nextX || !nextY) {
    return null;
  }

  const diffX = nextX - x;
  const diffY = nextY - y;

  const quarterX = diffX / 4;
  const quarterY = diffY / 4;

  const twentyFivePercentX = x + quarterX;
  const twentyFivePercentY = y + quarterY;

  const seventyFivePercentX = x + quarterX * 3;
  const seventyFivePercentY = y + quarterY * 3;

  const img =
    type === "shroud"
      ? "ability_rogue_shroudofconcealment"
      : "inv_alchemy_80_potion02orange";

  return (
    <>
      <image
        href={`${WCL_ASSET_URL}${img}.jpg`}
        width={24}
        height={24}
        x={(twentyFivePercentX - 12).toFixed(2)}
        y={(twentyFivePercentY - 12).toFixed(2)}
      />
      <image
        href={`${WCL_ASSET_URL}${img}.jpg`}
        width={24}
        height={24}
        x={(seventyFivePercentX - 12).toFixed(2)}
        y={(seventyFivePercentY - 12).toFixed(2)}
      />
    </>
  );
}
