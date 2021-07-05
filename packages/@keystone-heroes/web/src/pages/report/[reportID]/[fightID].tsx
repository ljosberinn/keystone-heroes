import type { FightResponse } from "@keystone-heroes/api/functions/fight";
import { isValidReportId } from "@keystone-heroes/wcl/utils";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import type { KeyboardEvent, MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { useAbortableFetch } from "src/hooks/useAbortableFetch";
import { useForceRerender } from "src/hooks/useForceRerender";

type FightIDProps = {
  cache?: {
    fight: FightResponse | null;
    reportID: string | null;
    fightID: number | null;
  };
};

const useFightURL = (cache: FightIDProps["cache"]) => {
  const { query, isFallback } = useRouter();

  if (isFallback) {
    return {
      url: null,
      reportID: null,
      fightID: null,
    };
  }

  if (cache?.fight) {
    return {
      url: null,
      reportID: cache.reportID,
      fightID: cache.fightID,
    };
  }

  const { reportID, fightID } = query;

  if (!isValidReportId(reportID)) {
    return {
      url: null,
      fightID: null,
      reportID: null,
    };
  }

  if (!fightID || Array.isArray(fightID)) {
    return {
      url: null,
      fightID: null,
      reportID: null,
    };
  }

  const maybeFightID = Number.parseInt(fightID);

  if (!maybeFightID || Number.isNaN(maybeFightID) || maybeFightID < 1) {
    return {
      url: null,
      fightID: null,
      reportID: null,
    };
  }

  const params = new URLSearchParams({
    reportID,
    fightID: `${fightID}`,
  }).toString();

  return {
    url: `/api/fight?${params}`,
    fightID,
    reportID,
  };
};

export default function FightID({ cache }: FightIDProps): JSX.Element | null {
  const { url, fightID, reportID } = useFightURL(cache);

  const [fight] = useAbortableFetch<FightResponse>({
    url,
    initialState: cache?.fight ?? null,
  });

  if (!fightID || !reportID || !fight) {
    return null;
  }

  if ("error" in fight) {
    return <h1>{fight.error}</h1>;
  }

  return (
    <div>
      <Map
        zones={fight.dungeon.zones}
        pulls={fight.pulls.map((pull, index) => ({ ...pull, id: index + 1 }))}
      />
    </div>
  );
}

type Bar<T, K extends string> = T extends { [P in K]: unknown } ? T[K] : never;

type MapProps = {
  zones: Bar<FightResponse, "dungeon">["zones"];
  pulls: (Bar<FightResponse, "pulls">[number] & { id: number })[];
};

function Map({ zones, pulls }: MapProps) {
  const [zoneIndex, setZoneIndex] = useState(0);
  const shouldFocusRef = useRef(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const tabPanelRef = useRef<HTMLDivElement | null>(null);

  function handleZoneChange(id: number) {
    setZoneIndex(id);
  }

  useEffect(() => {
    if (shouldFocusRef.current) {
      shouldFocusRef.current = false;
      buttonRefs.current[zoneIndex]?.focus();
    }
  });

  return (
    <>
      <div role="tablist" aria-orientation="horizontal" className="flex">
        {zones.map((zone, index) => {
          const selected = zoneIndex === index;

          function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
            const { key } = event;

            const lookupValue =
              key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : null;

            if (!lookupValue) {
              return;
            }

            event.preventDefault();
            shouldFocusRef.current = true;

            const nextIndex = index + lookupValue;

            if (zones[nextIndex]) {
              setZoneIndex(nextIndex);
            } else {
              setZoneIndex(lookupValue === 1 ? 0 : zones.length - 1);
            }
          }

          return (
            <button
              type="button"
              className={`p-4 focus:outline-none focus:ring ${
                selected ? "border-coolgray-500 font-bold" : ""
              }`}
              role="tab"
              tabIndex={selected ? 0 : -1}
              aria-selected={selected}
              aria-controls={`tabpanel-${zone.id}`}
              id={`tab-${zone.id}`}
              onClick={() => {
                shouldFocusRef.current = false;
                handleZoneChange(index);
              }}
              onKeyDown={handleKeyDown}
              ref={(ref) => {
                buttonRefs.current[index] = ref;
              }}
              key={zone.id}
            >
              {zone.name}
            </button>
          );
        })}
      </div>
      <div>
        {zones.map((zone, index) => {
          const hidden = zoneIndex !== index;

          return (
            <div
              role="tabpanel"
              id={`tabpanel-${zone.id}`}
              aria-labelledby={`tab-${zone.id}`}
              hidden={hidden}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
              key={zone.id}
              ref={hidden ? undefined : tabPanelRef}
            >
              <picture>
                <img
                  src={`/static/maps/${zone.id}.png`}
                  loading="lazy"
                  alt={zone.name}
                  ref={hidden ? undefined : imageRef}
                />
              </picture>
              <PullIndicators
                pulls={pulls.filter((pull) => pull.zones.includes(zone.id))}
                imageRef={imageRef}
                tabPanelRef={tabPanelRef}
                zone={zone}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

const calcX = (
  x: number,
  zone: MapProps["zones"][number],
  imageRef: MutableRefObject<HTMLImageElement | null>,
  tabPanelRef: MutableRefObject<HTMLDivElement | null>
) => {
  if (!imageRef.current || !tabPanelRef.current) {
    return 0;
  }

  // TODO: move this to backend
  const percent = (x - zone.minX) / (zone.maxX - zone.minX);

  return (
    imageRef.current.clientWidth * percent + tabPanelRef.current.offsetLeft
  );
};

const calcY = (
  y: number,
  zone: MapProps["zones"][number],
  imageRef: MutableRefObject<HTMLImageElement | null>,
  tabPanelRef: MutableRefObject<HTMLDivElement | null>
) => {
  if (!imageRef.current || !tabPanelRef.current) {
    return 0;
  }

  const percent = (y - zone.maxY) / (zone.minY - zone.maxY);

  return (
    imageRef.current.clientHeight * percent + tabPanelRef.current.offsetTop
  );
};

type PullIndicatorsProps = Pick<MapProps, "pulls"> & {
  imageRef: MutableRefObject<HTMLImageElement | null>;
  tabPanelRef: MutableRefObject<HTMLDivElement | null>;
  zone: MapProps["zones"][number];
};

let attached = false;

function PullIndicators({
  pulls,
  imageRef,
  tabPanelRef,
  zone,
}: PullIndicatorsProps) {
  const redraw = useForceRerender();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (imageRef.current && tabPanelRef.current) {
      const listener = () => {
        if (attached) {
          return;
        }

        attached = true;

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          attached = false;
          redraw();
        }, 100);
      };

      window.addEventListener("resize", listener);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        window.removeEventListener("resize", listener);
      };
    }
  }, [imageRef, tabPanelRef, redraw]);

  return (
    <>
      {pulls.map((pull) => {
        const x = calcX(pull.x, zone, imageRef, tabPanelRef);
        const y = calcY(pull.y, zone, imageRef, tabPanelRef);

        if (!x || !y) {
          return null;
        }

        return (
          <span
            className="absolute w-4 h-4"
            style={{
              border: "1px solid red",
              top: `${y}px`,
              left: `${x}px`,
            }}
            key={pull.startTime}
            data-events={pull.events.length}
            data-npcs={pull.npcs.length}
            data-percent={pull.percent}
          >
            {pull.id}
          </span>
        );
      })}
    </>
  );
}

type StaticPathParams = {
  reportID: string;
  fightID: string;
};

export const getStaticPaths: GetStaticPaths<StaticPathParams> = () => {
  return {
    fallback: true,
    paths: [],
  };
};

export const getStaticProps: GetStaticProps<FightIDProps, StaticPathParams> =
  () => {
    return {
      props: {
        cache: {
          fight: null,
          fightID: null,
          reportID: null,
        },
      },
    };
  };
