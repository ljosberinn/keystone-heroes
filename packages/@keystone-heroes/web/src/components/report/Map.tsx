import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import dynamic from "next/dynamic";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MutableRefObject,
} from "react";
import {
  useMemo,
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
} from "react";

import { usePrevious } from "../../hooks/usePrevious";
import { useFight } from "../../pages/report/[reportID]/[fightID]";
import {
  dungeons,
  isBoss,
  isTormentedLieutenant,
  spells,
  tormentedLieutenants,
} from "../../staticData";
import {
  useLegend,
  useMapOptions,
  useReportStore,
  useRestoreMapOptions,
} from "../../store";
import { bgPrimary, bgSecondary } from "../../styles/tokens";
import { timeDurationToString } from "../../utils";
import { classnames } from "../../utils/classnames";
import {
  INVIS_POTION_ICON,
  QUESTIONMARK_ICON,
  SHROUD_ICON,
  STATIC_ICON_PREFIX,
  ZOOM_ICON,
} from "../AbilityIcon";
import { TabList, TabButton, TabPanel } from "../Tabs";
import { usePointsOfInterest, PointsOfInterestProvider } from "./poi/context";
import { findBloodlust, detectInvisibilityUsage } from "./utils";

const createRafCleanup = <K extends keyof WindowEventMap>(
  rafRef: MutableRefObject<number | null>,
  eventType: K,
  listener: () => void
) => {
  return () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    window.removeEventListener(eventType, listener);
  };
};

function useImageDimensions() {
  const [imageSize, setImageSize] = useState<SvgProps["imageSize"]>({
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

    return createRafCleanup(rafRef, "resize", listener);
  }, [handleResize]);

  return {
    imageSize,
    imageRef,
    handleResize,
  };
}

const MapOptions = dynamic(
  () => import(/* webpackChunkName: "MapOptions" */ "./MapOptions"),
  {
    suspense: true,
  }
);

const Legend = dynamic(
  () => import(/* webpackChunkName: "Legend" */ "./Legend"),
  {
    suspense: true,
  }
);

const imageTuples = [
  [125, "3xl"],
  [96, "2xl"],
  [80, "xl"],
  [64, "lg"],
  [48, "md"],
  [40, "sm"],
] as const;

function Triangle() {
  return (
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
  );
}

export function Map(): JSX.Element {
  const { loading, fight } = useFight();
  const { imageRef, imageSize, handleResize } = useImageDimensions();
  const tabPanelRef = useRef<HTMLDivElement | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const selectedPull = useReportStore((state) => state.selectedPull);
  const previouslySelectedPull = usePrevious(selectedPull);
  const zones = useMemo(
    () => (fight ? dungeons[fight.dungeon].zones : []),
    [fight, dungeons]
  );
  const pulls = useMemo(() => (fight ? fight.pulls : []), [fight]);

  const [selectedTab, setSelectedTab] = useState(() => {
    if (fight?.pulls && fight.pulls.length > 0) {
      const dungeon = dungeons[fight.dungeon];

      const zoneToSelect = fight.pulls[0].zone;
      const tab = dungeon.zones.findIndex((zone) => zone.id === zoneToSelect);

      return tab > -1 ? tab : 0;
    }

    return 0;
  });

  const shouldFocusRef = useRef(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (shouldFocusRef.current) {
      shouldFocusRef.current = false;
      buttonRefs.current[selectedTab]?.focus();
    }
  });

  // synchronize selected tab with pull selection in <Data />
  useEffect(() => {
    if (
      previouslySelectedPull === selectedPull ||
      pulls.length === 1 ||
      zones.length === 1
    ) {
      return;
    }

    const nextZone = pulls[selectedPull - 1].zone;
    const nextTab = zones.findIndex((zone) => zone.id === nextZone);

    if (nextTab === selectedTab) {
      return;
    }

    setSelectedTab(nextTab);
  }, [selectedPull, previouslySelectedPull, pulls, zones, selectedTab]);

  const onTabButtonClick = (nextIndex: number) => {
    setSelectedTab(nextIndex);
  };

  const toggleFullscreen = useCallback((nextValue?: boolean) => {
    setFullscreen((prev) => {
      return typeof nextValue === "undefined" ? !prev : nextValue;
    });
  }, []);

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      const { key } = event;

      const isSMOrLarger = window.innerWidth >= 640;
      const nextKey = isSMOrLarger ? "ArrowRight" : "ArrowDown";
      const lastKey = isSMOrLarger ? "ArrowLeft" : "ArrowUp";

      const lookupValue = key === nextKey ? 1 : key === lastKey ? -1 : null;

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
    <section
      className="flex flex-col w-full h-auto max-w-screen-xl pt-4 lg:pt-0 lg:w-4/6"
      aria-labelledby="section-route"
    >
      <Triangle />
      <div className={`rounded-t-lg shadow-sm ${bgPrimary}`}>
        <h2 id="section-route" className="px-4 pt-4 text-2xl font-bold">
          Route
        </h2>

        <h3 id="zone-selection-heading" className="px-4 text-xl">
          Zone Selection
        </h3>

        <TabList aria-label="Zone Selection">
          {zones.map((zone, index) => {
            function onClick() {
              onTabButtonClick(index);
            }

            return (
              <TabButton
                key={zone.id}
                id={zone.id}
                ref={(ref) => {
                  buttonRefs.current[index] = ref;
                }}
                onKeyDown={onKeyDown}
                selectedIndex={selectedTab}
                onClick={onClick}
                index={index}
                listLength={zones.length}
                className="w-1/5"
              >
                {zone.name}
              </TabButton>
            );
          })}
        </TabList>

        <div className="p-4 sm:hidden">
          <select
            className="w-full py-2 text-center"
            value={selectedTab}
            onChange={(event) => {
              onTabButtonClick(Number.parseInt(event.target.value));
            }}
          >
            {zones.map((zone, index) => {
              return (
                <option value={index} key={zone.id}>
                  {zone.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className={`h-full p-2 rounded-b-lg shadow-sm ${bgSecondary}`}>
        {loading ? (
          <img
            src="/static/maps/ph.jpg"
            width="100%"
            height="100%"
            alt="Map Placeholder"
          />
        ) : (
          <>
            {zones.map((zone, index) => {
              const hidden = index !== selectedTab;

              return (
                <TabPanel
                  id={zone.id}
                  ref={tabPanelRef}
                  key={zone.id}
                  hidden={hidden}
                  className={
                    fullscreen
                      ? "absolute w-max top-0 left-0 p-4 z-10"
                      : "relative"
                  }
                  data-map-container={zone.id}
                >
                  <picture>
                    {imageTuples.map(([w, prefix]) => {
                      const url = `/static/maps/${prefix}-${w * 16}/${
                        zone.id
                      }.png`;

                      return (
                        <source
                          key={w}
                          srcSet={url}
                          media={`(min-width: ${w * 16}px)`}
                        />
                      );
                    })}

                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                    <img
                      src={`/static/maps/sm-640/${zone.id}.png`}
                      alt={zone.name}
                      ref={hidden ? undefined : imageRef}
                      className="w-full h-full rounded-md"
                      onLoad={handleResize}
                      width="1280"
                      height="853"
                    />
                  </picture>

                  {hidden ? null : (
                    <>
                      <Svg
                        imageSize={imageSize}
                        zoneID={zone.id}
                        onDoorClick={(zoneID: number) => {
                          const nextZoneIndex = zones.findIndex(
                            (zone) => zone.id === zoneID
                          );

                          if (nextZoneIndex > -1) {
                            onTabButtonClick(nextZoneIndex);
                          }
                        }}
                      />

                      <KillIndicator fullscreen={fullscreen} type="boss" />
                      <KillIndicator
                        fullscreen={fullscreen}
                        type="tormentedLieutenant"
                      />

                      <div
                        className={classnames(
                          "flex flex-col space-y-2 z-20",
                          fullscreen
                            ? "fixed right-6 top-6"
                            : "absolute right-2 top-2"
                        )}
                      >
                        <MapOptionsToggle />
                        <LegendToggle />

                        <FullScreenToggle
                          active={fullscreen}
                          toggle={toggleFullscreen}
                          tabPanelRef={tabPanelRef}
                        />
                      </div>

                      <MapOptionsWrapper />
                      <LegendWrapper />
                    </>
                  )}
                </TabPanel>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}

type KillIndicatorProps = {
  type: "boss" | "tormentedLieutenant";
  fullscreen: boolean;
};

function KillIndicator({ type, fullscreen }: KillIndicatorProps) {
  const setSelectedPull = useReportStore((state) => state.setSelectedPull);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { fight } = useFight();
  const pulls = fight ? fight.pulls : [];
  const startTime = fight ? fight.meta.startTime : 0;

  const [left, setLeft] = useState("32px");

  const isBossType = type === "boss";

  useEffect(() => {
    setLeft(() => {
      if (fullscreen && containerRef.current) {
        const offset = isBossType ? "40" : "60";

        return `calc(${offset}% - ${containerRef.current.clientWidth / 2}px)`;
      }

      return "32px";
    });
  }, [fullscreen, isBossType]);

  const filteredPulls = pulls.filter((pull) => {
    if (isBossType) {
      return pulls.filter((pull) => pull.hasBoss);
    }

    return pull.npcs.some((npc) => isTormentedLieutenant(npc.id));
  });

  const position = isBossType ? "left-2" : "right-2";

  return (
    <>
      <style jsx>
        {`
          .killIndicator {
            left: ${left};
          }
        `}
      </style>
      <div
        className={classnames(
          bgSecondary,
          "absolute rounded-lg p-2 hidden sm:block opacity-75",
          fullscreen ? "killIndicator bottom-8" : `${position} bottom-2`
        )}
        ref={containerRef}
      >
        {filteredPulls.map((pull) => {
          const usedLust = findBloodlust(pull);
          const lustAbility = usedLust ? spells[usedLust] : null;

          const maybeRelevantNpcName = isBossType
            ? pull.npcs
                .filter((npc) => isBoss(npc.id))
                .map((npc) => npc.name)?.[0]
            : pull.npcs.find((npc) => isTormentedLieutenant(npc.id))?.name;

          if (!maybeRelevantNpcName) {
            return null;
          }

          const fightStart = timeDurationToString(
            pull.startTime - startTime,
            true
          ).padStart(5, "0");

          const fightEnd = timeDurationToString(
            pull.endTime - startTime,
            true
          ).padStart(5, "0");

          const fightDuration = timeDurationToString(
            pull.endTime - pull.startTime,
            true
          ).padStart(5, "0");

          const percentUpToThisPull = pulls.reduce((acc, p) => {
            if (p.id >= pull.id) {
              return acc;
            }

            return acc + p.percent;
          }, 0);

          return (
            <span
              className="flex justify-between block w-full"
              key={pull.startTime}
            >
              <button
                type="button"
                className="cursor-pointer md:truncate md:max-w-1/2 hover:underline"
                onClick={() => {
                  setSelectedPull(pull.id);
                }}
              >
                {maybeRelevantNpcName}{" "}
                {usedLust && lustAbility && (
                  <img
                    className="inline w-6 h-6 rounded-full"
                    src={`${STATIC_ICON_PREFIX}${lustAbility.icon}.jpg`}
                    alt={`${lustAbility.name} was used on this pull.`}
                    width={24}
                    height={24}
                  />
                )}
              </button>{" "}
              <span className="hidden pl-2 md:block">
                <span>{percentUpToThisPull.toFixed(2)}%</span>{" "}
                <span title={`killed in ${fightDuration}`}>
                  {fightStart}-{fightEnd}
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </>
  );
}

function MapOptionsWrapper() {
  const visible = useMapOptions((state) => state.visible);

  useRestoreMapOptions();

  if (!visible) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <MapOptions />
    </Suspense>
  );
}

function LegendWrapper() {
  const visible = useLegend((state) => state.visible);

  if (!visible) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Legend />
    </Suspense>
  );
}

function MapOptionsToggle() {
  const toggleMapOptions = useMapOptions((state) => state.toggleMapOptions);

  return (
    <button
      type="button"
      onClick={toggleMapOptions}
      title="Map Options"
      className="flex p-1 bg-white rounded-full focus:outline-none focus:ring dark:bg-coolgray-600 dark:focus:bg-transparent"
    >
      <img
        src="/static/icons/trade_engineering.jpg"
        className="object-cover w-8 h-8 rounded-full"
        alt="Map Options"
        width={32}
        height={32}
      />
    </button>
  );
}

function LegendToggle() {
  const toggle = useLegend((state) => state.toggle);

  return (
    <button
      onClick={toggle}
      type="button"
      title="Legend"
      className="flex p-1 bg-white rounded-full focus:outline-none focus:ring dark:bg-coolgray-600 dark:focus:bg-transparent"
    >
      <img
        src={`${STATIC_ICON_PREFIX}${QUESTIONMARK_ICON}.jpg`}
        alt="Legend"
        className="object-cover w-8 h-8 rounded-full"
        width={32}
        height={32}
      />
    </button>
  );
}

type FullScreenToggleProps = {
  toggle: (nextValue?: boolean) => void;
  active: boolean;
  tabPanelRef: MutableRefObject<HTMLDivElement | null>;
};

function FullScreenToggle({
  toggle,
  active,
  tabPanelRef,
}: FullScreenToggleProps) {
  const firstRenderRef = useRef(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (active) {
      const listener = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          toggle();
        }
      };

      document.body.style.overflow = "hidden";

      document.addEventListener("keydown", listener);

      window.scrollTo({
        top: 0,
      });

      return () => {
        document.removeEventListener("keydown", listener);
        document.body.removeAttribute("style");
      };
    }
  }, [active, toggle]);

  useEffect(() => {
    // trigger resize to recalculate pull position icons if
    // - active
    // - not first render and no longer active
    if (active || (!active && !firstRenderRef.current)) {
      firstRenderRef.current = false;
      window.dispatchEvent(new CustomEvent("resize"));
    }
  }, [active]);

  useEffect(() => {
    const container = tabPanelRef.current;

    if (!container) {
      return;
    }

    if (active) {
      const recalculate = () => {
        // recalculate left offset of map container to ensure:
        // - map indicators are pointing to the correct position
        // - map stays centered
        const { clientWidth } = document.documentElement;

        // map cant be fullscreen below 1006px; deactive fullscreen
        if (clientWidth < 1006) {
          toggle(false);
          return;
        }

        const diff = container.clientWidth - clientWidth;
        const half = (diff / 2) * -1;

        container.style.setProperty("left", `${half}px`);
      };

      recalculate();

      const listener = () => {
        if (rafRef.current) {
          return;
        }

        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          recalculate();
        });
      };

      window.addEventListener("resize", listener);

      return createRafCleanup(rafRef, "resize", listener);
    }

    container.removeAttribute("style");
  }, [active, toggle, tabPanelRef.current]);

  return (
    <button
      type="button"
      onClick={() => {
        toggle();
      }}
      title="Toggle Fullscreen"
      className="flex hidden p-1 bg-white rounded-full focus:outline-none focus:ring dark:bg-coolgray-600 dark:focus:bg-transparent lg:block"
    >
      <img
        src={ZOOM_ICON}
        className="object-cover w-8 h-8 rounded-full"
        alt="Toggle Fullscreen"
        width={32}
        height={32}
      />
    </button>
  );
}

type SvgProps = {
  imageSize: Pick<
    HTMLImageElement,
    "clientHeight" | "clientWidth" | "offsetLeft" | "offsetTop"
  >;
  zoneID: number;
  onDoorClick: (zoneID: number) => void;
};

function Svg({ imageSize, zoneID, onDoorClick }: SvgProps) {
  const { fight } = useFight();
  const pulls = fight ? fight.pulls : [];
  const thisZonesPulls = pulls.filter((pull) => pull.zone === zoneID);

  if (imageSize.clientWidth === 0 || imageSize.clientHeight === 0) {
    return null;
  }

  return (
    <>
      <style jsx>
        {`
          .svg {
            left: ${imageSize.offsetLeft}px;
            top: ${imageSize.offsetTop}px;
          }
        `}
      </style>
      <svg className="absolute w-full h-full svg focus:outline-none">
        <PointsOfInterestProvider dungeonID={fight?.dungeon}>
          <DoorIndicatorsWrapper
            xFactor={imageSize.clientWidth}
            yFactor={imageSize.clientHeight}
            onDoorClick={onDoorClick}
            zoneID={zoneID}
          />
          <MapChangePolylineWrapper
            xFactor={imageSize.clientWidth}
            yFactor={imageSize.clientHeight}
            zoneID={zoneID}
          />
        </PointsOfInterestProvider>
        {thisZonesPulls.map((pull, index) => {
          const x = pull.x * imageSize.clientWidth;
          const y = pull.y * imageSize.clientHeight;
          const nextPull =
            thisZonesPulls[index + 1]?.id === pull.id + 1
              ? thisZonesPulls[index + 1]
              : null;

          return (
            <Fragment key={pull.startTime}>
              <PullIndicatorIcon pull={pull} x={x} y={y} />

              <PullConnectionPolyline
                x={x}
                y={y}
                pull={pull}
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
        x={twentyFivePercentX - 12}
        y={twentyFivePercentY - 12}
      />
      <image
        href={img}
        width={24}
        height={24}
        x={seventyFivePercentX - 12}
        y={seventyFivePercentY - 12}
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
  const selectedPull = useReportStore((state) => state.selectedPull);
  const setSelectedPull = useReportStore((state) => state.setSelectedPull);

  const selected = selectedPull === pull.id;

  const size = selected || pull.hasBoss ? 32 : 24;

  const centerX = x - size / 2;
  const centerY = y - size / 2;

  const gProps = {
    className: "cursor-pointer",
    onClick: () => {
      setSelectedPull(pull.id);
    },
  };

  const sharedProps = {
    className: classnames(
      "fill-current text-black rounded-full",
      selected ? "opacity-100 outline-white" : "opacity-50"
    ),
    width: size,
    height: size,
    x: centerX,
    y: centerY,
  };

  const bloodlust = findBloodlust(pull);

  if (bloodlust) {
    const ability = spells[bloodlust];

    return (
      <g {...gProps}>
        <image
          aria-label="Bloodlust | Heroism | Drums was/were used on this pull."
          href={`${STATIC_ICON_PREFIX}${ability.icon}.jpg`}
          {...sharedProps}
        />
        <text
          textAnchor="middle"
          x={x}
          y={y + 21.02 / 4}
          className="text-white fill-current"
        >
          {pull.id}
        </text>
      </g>
    );
  }

  const tormentedLieutenantNPC = pull.npcs.find((npc) =>
    isTormentedLieutenant(npc.id)
  );

  if (tormentedLieutenantNPC) {
    const lieutenant = tormentedLieutenants[tormentedLieutenantNPC.id];

    return (
      <g {...gProps}>
        <image
          aria-label={lieutenant.name}
          href={`${STATIC_ICON_PREFIX}${lieutenant.icon}.jpg`}
          {...sharedProps}
        />
        <text
          textAnchor="middle"
          x={x}
          y={y + 21.02 / 4}
          className="text-white fill-current"
        >
          {pull.id}
        </text>
      </g>
    );
  }

  const bossNPC = pull.npcs.find((npc) => isBoss(npc.id));

  return (
    <g {...gProps}>
      {bossNPC ? (
        <image
          aria-label={bossNPC.name}
          href={`/static/npcs/${bossNPC.id}.png`}
          className={classnames(
            selected ? "outline-white opacity-100" : "opacity-70"
          )}
          width={32}
          height={32}
          x={x - 32 / 2}
          y={y - 32 / 2}
        />
      ) : (
        <>
          <circle cx={x} cy={y} r={15} className={sharedProps.className} />
          <text
            textAnchor="middle"
            x={x}
            y={y + 21.02 / 4}
            className="text-white fill-current"
          >
            {pull.id}
          </text>
        </>
      )}
    </g>
  );
}

type PullConnectionPolylineProps = {
  x: number;
  y: number;
  pull: FightSuccessResponse["pulls"][number];
  nextPull: FightSuccessResponse["pulls"][number] | null;
  imageSize: Pick<
    HTMLImageElement,
    "clientHeight" | "clientWidth" | "offsetLeft" | "offsetTop"
  >;
};

function PullConnectionPolyline({
  nextPull,
  pull,
  x,
  y,
  imageSize,
}: PullConnectionPolylineProps) {
  const renderPullConnectionLines = useMapOptions(
    (state) => state.renderPullConnectionLines
  );
  const pullConnectionLineColor = useMapOptions(
    (state) => state.pullConnectionLineColor
  );

  const invisPullConnectionLineColor = useMapOptions(
    (state) => state.invisPullConnectionLineColor
  );

  if (!renderPullConnectionLines) {
    return null;
  }

  const invisibilityUsage = detectInvisibilityUsage(pull);

  const nextX = nextPull ? nextPull.x * (imageSize.clientWidth ?? 0) : null;
  const nextY = nextPull ? nextPull.y * (imageSize.clientHeight ?? 0) : null;

  const middleX = nextX ? x + (nextX - x) / 2 : null;
  const middleY = nextY ? y + (nextY - y) / 2 : null;

  if (!nextX || !nextY || !middleX || !middleY) {
    return null;
  }

  return (
    <g>
      <polyline
        markerMid="url(#triangle)"
        className={classnames(
          "polyline stroke-current"
          // invisibilityUsage ? "text-green-500" : "text-red-500"
        )}
        points={`${x},${y} ${middleX},${middleY} ${nextX},${nextY}`}
        style={{
          color: invisibilityUsage
            ? invisPullConnectionLineColor
            : pullConnectionLineColor,
        }}
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
    </g>
  );
}

const MapChangePolyline = dynamic(
  () =>
    import(/* webpackChunkName: "MapChangePolyline" */ "./MapChangePolyline"),
  {
    suspense: true,
  }
);

const DoorIndicators = dynamic(
  () => import(/* webpackChunkName: "DoorIndicators" */ "./DoorIndicators"),
  {
    suspense: true,
  }
);

type DoorIndicatorsWrapperProps = Pick<SvgProps, "onDoorClick"> & {
  xFactor: number;
  yFactor: number;
  zoneID: number;
};

function DoorIndicatorsWrapper({
  onDoorClick,
  xFactor,
  yFactor,
  zoneID,
}: DoorIndicatorsWrapperProps): JSX.Element | null {
  const { doors } = usePointsOfInterest();
  const thisZonesDoors = doors[zoneID];

  if (!thisZonesDoors) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <DoorIndicators
        doors={thisZonesDoors}
        xFactor={xFactor}
        yFactor={yFactor}
        onDoorClick={onDoorClick}
      />
    </Suspense>
  );
}

type MapChangePolylineWrapperProps = {
  zoneID: number;
  xFactor: number;
  yFactor: number;
};

function MapChangePolylineWrapper({
  zoneID,
  xFactor,
  yFactor,
}: MapChangePolylineWrapperProps): JSX.Element | null {
  const renderMapChangeLines = useMapOptions(
    (state) => state.renderMapChangeLines
  );
  const { doors } = usePointsOfInterest();
  const thisZonesDoors = doors[zoneID];

  if (!renderMapChangeLines || !thisZonesDoors) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <MapChangePolyline
        doors={thisZonesDoors}
        xFactor={xFactor}
        yFactor={yFactor}
        zoneID={zoneID}
      />
    </Suspense>
  );
}
