import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import type { KeyboardEvent } from "react";
import { Fragment, useState, useRef, useEffect, useCallback } from "react";
import { useReportStore } from "src/store";
import { classnames } from "src/utils/classnames";
import shallow from "zustand/shallow";

import {
  BLOODLUST_ICON,
  INVIS_POTION_ICON,
  SHROUD_ICON,
  WCL_ASSET_URL,
} from "../AbilityIcon";
import {
  hasBloodLust,
  detectInvisibilityUsage,
  findTormentedLieutenantPull,
} from "./utils";

type MapProps = {
  zones: FightSuccessResponse["dungeon"]["zones"];
  pulls: FightSuccessResponse["pulls"];
};

function useImageDimensions() {
  const [imageSize, setImageSize] = useState<PullIndicatorsProps["imageSize"]>({
    clientHeight: 0,
    clientWidth: 0,
    offsetLeft: 0,
    offsetTop: 0,
  });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

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

  return {
    imageSize,
    imageRef,
    handleResize,
  };
}

export function Map({ zones, pulls }: MapProps): JSX.Element {
  const { imageRef, imageSize, handleResize } = useImageDimensions();
  const tabPanelRef = useRef<HTMLDivElement | null>(null);
  const selectedPull = useReportStore((state) => state.selectedPull);

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
    <section className="w-full lg:pl-5 lg:w-4/6">
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
};

function PullIndicators({ pulls, imageSize }: PullIndicatorsProps) {
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
        `}
      </style>
      <svg className="absolute svg focus:outline-none">
        {pulls.map((pull, index) => {
          const x = pull.x * imageSize.clientWidth;
          const y = pull.y * imageSize.clientHeight;
          const nextPull =
            pulls[index + 1]?.id === pull.id + 1 ? pulls[index + 1] : null;

          return (
            <Fragment key={pull.startTime}>
              <PullIndicatorIcon pull={pull} x={x} y={y} />

              <PullConnectionPolyline
                x={x}
                y={y}
                nextPull={nextPull}
                imageSize={imageSize}
              />
            </Fragment>
          );
        })}
      </svg>
    </>
  );
}

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

  const img = type === "shroud" ? SHROUD_ICON : INVIS_POTION_ICON;

  return (
    <>
      <image
        href={img}
        width={24}
        height={24}
        x={(twentyFivePercentX - 12).toFixed(2)}
        y={(twentyFivePercentY - 12).toFixed(2)}
      />
      <image
        href={img}
        width={24}
        height={24}
        x={(seventyFivePercentX - 12).toFixed(2)}
        y={(seventyFivePercentY - 12).toFixed(2)}
      />
    </>
  );
}

type PullIndicatorIconProps = {
  pull: FightSuccessResponse["pulls"][number];
  x: number;
  y: number;
};

function PullIndicatorIcon({ pull, x, y }: PullIndicatorIconProps) {
  const [selectedPull, setSelectedPull] = useReportStore(
    (state) => [state.selectedPull, state.setSelectedPull],
    shallow
  );

  const selected = selectedPull === pull.id;

  const size = selected ? 32 : 24;

  const centerX = x - size / 2;
  const centerY = y - size / 2;

  const sharedProps = {
    className: classnames(
      "cursor-pointer fill-current text-black",
      selected ? "opacity-100 outline-white" : "opacity-50"
    ),
    width: size,
    height: size,
    onClick: () => {
      setSelectedPull(pull.id);
    },
    x: centerX.toFixed(2),
    y: centerY.toFixed(2),
  };

  if (hasBloodLust(pull)) {
    return <image href={BLOODLUST_ICON} {...sharedProps} />;
  }

  const tormentedLieutenant = findTormentedLieutenantPull(pull);

  if (tormentedLieutenant) {
    return (
      <image
        aria-label={tormentedLieutenant.name}
        href={`${WCL_ASSET_URL}${tormentedLieutenant.icon}.jpg`}
        {...sharedProps}
      />
    );
  }

  return (
    <g>
      <rect {...sharedProps} />
      <text
        x={sharedProps.x}
        y={sharedProps.y}
        className="text-white fill-current"
      >
        {pull.id}
      </text>
    </g>
  );
}

type PullConnectionPolylineProps = {
  x: number;
  y: number;
  nextPull: FightSuccessResponse["pulls"][number] | null;
  imageSize: Pick<
    HTMLImageElement,
    "clientHeight" | "clientWidth" | "offsetLeft" | "offsetTop"
  >;
};

function PullConnectionPolyline({
  nextPull,
  x,
  y,
  imageSize,
}: PullConnectionPolylineProps) {
  const invisibilityUsage = nextPull ? detectInvisibilityUsage(nextPull) : null;

  const nextX = nextPull ? nextPull.x * (imageSize.clientWidth ?? 0) : null;
  const nextY = nextPull ? nextPull.y * (imageSize.clientHeight ?? 0) : null;

  const middleX = nextX ? x + (nextX - x) / 2 : null;
  const middleY = nextY ? y + (nextY - y) / 2 : null;

  if (!nextX || !nextY || !middleX || !middleY) {
    return null;
  }

  return (
    <>
      <style jsx>
        {`
          .polyline {
            marker-mid: url(#triangle);
          }
        `}
      </style>
      <polyline
        className={classnames(
          "polyline stroke-current",
          invisibilityUsage ? "text-green-500" : "text-red-500"
        )}
        points={`${x.toFixed(2)},${y.toFixed(2)} ${middleX.toFixed(
          2
        )},${middleY.toFixed(2)} ${nextX.toFixed(2)},${nextY.toFixed(2)}`}
      />
      {invisibilityUsage && (
        <ShroudOrInvisIndicator
          x={x}
          y={y}
          nextX={nextX}
          nextY={nextY}
          type={invisibilityUsage}
        />
      )}
    </>
  );
}
