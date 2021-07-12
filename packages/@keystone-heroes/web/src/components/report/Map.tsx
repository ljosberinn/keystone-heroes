import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import { Fragment, useState, useRef, useEffect, useCallback } from "react";
import { classnames } from "src/utils/classnames";

import { TabListProvider } from "../tab";
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
      <TabListProvider amountOfTabs={zones.length}>
        <TabListProvider.TabList>
          {zones.map((zone, index) => {
            return (
              <TabListProvider.TabButton
                key={zone.id}
                index={index}
                id={zone.id}
              >
                {zone.name}
              </TabListProvider.TabButton>
            );
          })}
        </TabListProvider.TabList>
        {zones.map((zone, index) => {
          return (
            <TabListProvider.TabPanel
              id={zone.id}
              index={index}
              key={zone.id}
              ref={tabPanelRef}
            >
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
            </TabListProvider.TabPanel>
          );
        })}
      </TabListProvider>
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

          .rect {
            fill: rgba(0, 0, 0, 0.5);
          }

          .tormentedLieutenant {
            fill: red;
          }
        `}
      </style>
      <svg className="absolute svg">
        {pulls.map((pull, index) => {
          const x = pull.x * imageSize.clientWidth;
          const y = pull.y * imageSize.clientHeight;

          const isTormentedLieutenantPull = findTormentedLieutenantPull(pull);

          const nextPull =
            pulls[index + 1]?.id === pull.id + 1 ? pulls[index + 1] : null;

          const nextX = nextPull
            ? nextPull.x * (imageSize.clientWidth ?? 0)
            : null;
          const nextY = nextPull
            ? nextPull.y * (imageSize.clientHeight ?? 0)
            : null;

          const middleX = nextX ? x + (nextX - x) / 2 : null;
          const middleY = nextY ? y + (nextY - y) / 2 : null;

          return (
            <Fragment key={pull.startTime}>
              <rect
                className={classnames(
                  "rect",
                  isTormentedLieutenantPull && "tormentedLieutenant"
                )}
                x={(x - 8).toFixed(2)}
                y={(y - 8).toFixed(2)}
                width="16"
                height="16"
              />
              {nextX && nextY && middleX && middleY && (
                <polyline
                  className="polyline"
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
