import dynamic from "next/dynamic";
import type { MutableRefObject } from "react";
import {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
} from "react";

import type { FightSuccessResponse } from "../../../api/functions/fight";
import type { DungeonIDs } from "../../../db/data/dungeons";
import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import { shroudedAbilities } from "../../../wcl/queries/events/affixes/shrouded";
import { usePrevious } from "../../hooks/usePrevious";
import {
  DOS_URN,
  dungeons,
  EXPLOSIVE,
  HOA_GARGOYLE,
  isBoss,
  isTormentedLieutenant,
  isEncryptedMiniboss,
  npcs,
  NW,
  SD_LANTERN_BUFF,
  SOA_SPEAR,
  spells,
  TOP_BANNER_AURA,
  tormentedLieutenants,
  encryptedAbilities,
  SHROUDED,
} from "../../staticData";
import type { MapOptionsStore } from "../../store";
import {
  useLegend,
  reportStoreSelector,
  useMapOptions,
  useReportStore,
  useRestoreMapOptions,
} from "../../store";
import { bgPrimary, bgSecondary, hoverShadow } from "../../styles/tokens";
import { timeDurationToString } from "../../utils";
import { classnames } from "../../utils/classnames";
import {
  AbilityIcon,
  INVIS_POTION_ICON,
  QUESTIONMARK_ICON,
  SHROUD_ICON,
  STATIC_ICON_PREFIX,
  ZOOM_ICON,
} from "../AbilityIcon";
import { TabList, TabButton, TabPanel, useTabs } from "../Tabs";
import { SidebarNPC } from "./SidebarNPC";
import { usePullNPCs } from "./hooks";
import { usePointsOfInterest, PointsOfInterestProvider } from "./poi/context";
import {
  findBloodlust,
  detectInvisibilityUsage,
  determineAbility,
} from "./utils";

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

const createRafListener = (
  rafRef: MutableRefObject<null | number>,
  listener: () => void
) => {
  return () => {
    if (rafRef.current) {
      return;
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      listener();
    });
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
    const listener = createRafListener(rafRef, handleResize);

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
  { suspense: true }
);

const Legend = dynamic(
  () => import(/* webpackChunkName: "Legend" */ "./Legend"),
  { suspense: true }
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
  const { fight } = useFight();
  const { imageRef, imageSize, handleResize } = useImageDimensions();
  const tabPanelRef = useRef<HTMLDivElement | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const selectedPull = useReportStore((state) => state.selectedPull);
  const previouslySelectedPull = usePrevious(selectedPull);
  const { zones } = dungeons[fight.dungeon];
  const { pulls } = fight;

  const { attachRef, onKeyDown, onTabClick, selectedTab } = useTabs(
    zones,
    () => {
      if (pulls.length > 0) {
        const dungeon = dungeons[fight.dungeon];

        const zoneToSelect = pulls[0].zone;
        const tab = dungeon.zones.findIndex((zone) => zone.id === zoneToSelect);

        return tab > -1 ? tab : 0;
      }

      return 0;
    }
  );

  // synchronize selected tab with pull selection in <Analysis />
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

    onTabClick(nextTab);
  }, [
    selectedPull,
    previouslySelectedPull,
    pulls,
    zones,
    selectedTab,
    onTabClick,
  ]);

  const toggleFullscreen = useCallback((nextValue?: boolean) => {
    setFullscreen((prev) => {
      return typeof nextValue === "undefined" ? !prev : nextValue;
    });
  }, []);

  return (
    <section
      className="flex flex-col w-full h-auto max-w-screen-xl pt-4 lg:pt-0 lg:w-4/6"
      aria-labelledby="section-route"
    >
      <Triangle />
      <div className={`rounded-t-lg ${bgSecondary}`}>
        <h2 id="section-route" className="px-4 pt-4 text-2xl font-bold">
          Route
        </h2>

        <h3 id="zone-selection-heading" className="px-4 text-xl">
          Zone Selection
        </h3>

        <TabList aria-label="Zone Selection">
          {zones.map((zone, index) => {
            function onClick() {
              onTabClick(index);
            }

            return (
              <TabButton
                key={zone.id}
                id={zone.id}
                ref={(ref) => {
                  attachRef(index, ref);
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
              onTabClick(Number.parseInt(event.target.value));
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
      <div className={`p-2 rounded-b-lg ${bgPrimary} ${hoverShadow}`}>
        {zones.map((zone, index) => {
          const hidden = index !== selectedTab;

          return (
            <TabPanel
              id={zone.id}
              ref={tabPanelRef}
              key={zone.id}
              hidden={hidden}
              className={
                fullscreen ? "absolute w-max top-0 left-0 p-4 z-10" : "relative"
              }
              data-map-container={zone.id}
            >
              <picture>
                {imageTuples.map(([w, prefix]) => {
                  const url = `/static/maps/${prefix}-${w * 16}/${zone.id}.png`;

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
                    fullscreen={fullscreen}
                    imageSize={imageSize}
                    zoneID={zone.id}
                    onDoorClick={(zoneID: number) => {
                      const nextZoneIndex = zones.findIndex(
                        (zone) => zone.id === zoneID
                      );

                      if (nextZoneIndex > -1) {
                        onTabClick(nextZoneIndex);
                      }
                    }}
                  />

                  {fullscreen ? (
                    <>
                      <FullscreenNavigation />
                      <FullscreenPullNPCs />
                    </>
                  ) : null}

                  <KillIndicator fullscreen={fullscreen} type="boss" />
                  <KillIndicator
                    fullscreen={fullscreen}
                    type="tormentedLieutenant"
                  />
                  <KillIndicator fullscreen={fullscreen} type="encrypted" />
                  <KillIndicator fullscreen={fullscreen} type="shrouded" />

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
      </div>
      <div
        className="absolute top-0 left-0 w-screen h-screen opacity-50 bg-stone-600"
        hidden={!fullscreen}
      />
    </section>
  );
}

function FullscreenPullNPCs() {
  const selectedPull = useReportStore((store) => store.selectedPull);
  const pullNPCs = usePullNPCs(selectedPull);

  if (!pullNPCs) {
    return null;
  }

  return (
    <details
      open
      className={classnames(
        bgSecondary,
        "absolute left-1/4 top-1/3 rounded-lg opacity-75 hover:opacity-100 transition-opacity"
      )}
    >
      <summary className="p-2 cursor-pointer">Enemies</summary>

      {pullNPCs.npcs.map((npc, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return <SidebarNPC npc={npc} key={`${npc.id}-${index}`} />;
      })}

      {pullNPCs.explosives.size > 0 && (
        <SidebarNPC
          npc={{
            count: pullNPCs.explosives.size,
            countPerNPC: 0,
            id: EXPLOSIVE.unit,
            name: "Explosives",
            percentPerNPC: null,
            totalPercent: null,
          }}
        />
      )}

      <div className="flex w-full px-4 py-2 border-t-2 border-gray-600 place-content-end">
        this pull {pullNPCs.pull.percent.toFixed(2)}%
      </div>

      <div className="flex w-full px-4 py-2 place-content-end">
        total {pullNPCs.percentAfterThisPull.toFixed(2)}%
      </div>
    </details>
  );
}

function FullscreenNavigation() {
  const { selectedPull, setSelectedPull } = useReportStore(reportStoreSelector);
  const { pulls } = useFight().fight;

  const isFirst = pulls[0].id === selectedPull;
  const isLast = pulls[pulls.length - 1].id === selectedPull;

  return (
    <div className="absolute flex content-center justify-between w-1/3 w-full p-2 rounded-lg top-8 left-1/3">
      <button
        type="button"
        className={`${bgSecondary} p-2 rounded-full`}
        disabled={isFirst}
        onClick={() => {
          setSelectedPull(selectedPull - 1);
        }}
        aria-label="Last pull"
      >
        <AbilityIcon
          icon="misc_arrowleft"
          alt="Last pull"
          className={classnames(
            "rounded-full w-8 h-8 xl:w-16 xl:h-16",
            isFirst && "filter grayscale"
          )}
          width={32}
          height={32}
        />
      </button>
      <button
        type="button"
        className={`${bgSecondary} p-2 rounded-full`}
        disabled={isLast}
        onClick={() => {
          setSelectedPull(selectedPull + 1);
        }}
        aria-label="Next pull"
      >
        <AbilityIcon
          icon="misc_arrowright"
          alt="Next pull"
          className={classnames(
            "rounded-full w-8 h-8 xl:w-16 xl:h-16",
            isLast && "filter grayscale"
          )}
          width={32}
          height={32}
        />
      </button>
    </div>
  );
}

type KillIndicatorProps = {
  type: "boss" | "tormentedLieutenant" | "encrypted" | "shrouded";
  fullscreen: boolean;
};

const killIndicatorSelector = ({
  renderBossKillIndicator,
  renderTormentedKillIndicator,
}: MapOptionsStore) => ({
  renderBossKillIndicator,
  renderTormentedKillIndicator,
});

function findBossOrLieutenantName(
  pull: FightSuccessResponse["pulls"][number],
  isBossType: boolean
) {
  if (isBossType) {
    const boss = pull.npcs.find((npc) => isBoss(npc.id));

    if (!boss) {
      return null;
    }

    return npcs[boss.id] ?? `${boss.id}`;
  }

  const lieutenant = pull.npcs.find((npc) => isTormentedLieutenant(npc.id));

  if (!lieutenant) {
    return null;
  }

  return npcs[lieutenant.id];
}

function KillIndicator({ type, fullscreen }: KillIndicatorProps) {
  const setSelectedPull = useReportStore((state) => state.setSelectedPull);
  const { renderBossKillIndicator, renderTormentedKillIndicator } =
    useMapOptions(killIndicatorSelector);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { fight } = useFight();
  const { pulls, meta, affixes, player } = fight;
  const rafRef = useRef<number | null>(null);

  const [left, setLeft] = useState("32px");

  const isBossType = type === "boss";
  const isTormentedType = type === "tormentedLieutenant";
  const isShroudedType = type === "shrouded";
  const isEncryptedType = type === "encrypted";

  useEffect(() => {
    const recalculate = () => {
      setLeft(() => {
        if (!fullscreen || !containerRef.current) {
          return "32px";
        }

        const usesLargerGaps =
          window.innerWidth < 1900 || window.innerHeight < 1160;

        const left = 35 - (usesLargerGaps ? 10 : 0);
        const right = 65 + (usesLargerGaps ? 10 : 0);

        const offset = isBossType ? left : right;

        return `calc(${offset}% - ${containerRef.current.clientWidth / 2}px)`;
      });
    };

    recalculate();

    const listener = createRafListener(rafRef, recalculate);

    window.addEventListener("resize", listener);

    return createRafCleanup(rafRef, "resize", listener);
  }, [fullscreen, isBossType]);

  if (!isBossType && !renderTormentedKillIndicator) {
    return null;
  }

  if (isShroudedType && !affixes.includes(131)) {
    return null;
  }

  if (isBossType && !renderBossKillIndicator) {
    return null;
  }

  if (isEncryptedType && !affixes.includes(130)) {
    return null;
  }

  if (isTormentedType && !affixes.includes(128)) {
    return null;
  }

  const shroudedEvents = isShroudedType
    ? pulls
        .flatMap((pull) => pull.events)
        .filter(
          (event) =>
            event.type === "ApplyBuffStack" &&
            event.ability &&
            SHROUDED.has(event.ability.id)
        )
    : [];

  const filteredPulls = isShroudedType
    ? []
    : pulls.filter((pull) => {
        if (isBossType) {
          return pulls.filter((pull) => pull.hasBoss);
        }

        if (isTormentedType) {
          return pull.npcs.some((npc) => isTormentedLieutenant(npc.id));
        }

        return pull.npcs.some((npc) => isEncryptedMiniboss(npc.id));
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
          "absolute rounded-lg p-2 hidden sm:block opacity-75 hover:opacity-100 transition-opacity",
          fullscreen ? "killIndicator bottom-8" : `${position} bottom-2`
        )}
        ref={containerRef}
      >
        {type === "shrouded"
          ? player.map((player) => {
              const applyBuffStackEvents = shroudedEvents.filter(
                (event) => event.targetPlayerID === player.id
              );

              const last =
                applyBuffStackEvents[applyBuffStackEvents.length - 1];

              if (!last || !last.ability) {
                return null;
              }

              const count = last.stacks ?? 0;
              const buff = determineAbility(last.ability?.id);

              if (!buff) {
                return null;
              }

              return (
                <span className="flex justify-between w-full" key={player.id}>
                  <span>{player.name}</span>
                  <span className="hidden pl-2 md:block lg:hidden xl:block space-x-1">
                    <span>{count}</span>

                    <AbilityIcon
                      icon={buff.icon}
                      alt={buff.name}
                      width={16}
                      height={16}
                      className="inline"
                      title={buff.name}
                    />
                  </span>
                </span>
              );
            })
          : type === "encrypted"
          ? Object.entries(encryptedAbilities).map(([key, value]) => {
              const id = Number.parseInt(key);

              const count = filteredPulls.filter((pull) =>
                pull.events.some(
                  (event) =>
                    event.type === "ApplyDebuff" && event.ability?.id === id
                )
              ).length;

              return (
                <span className="flex justify-between w-full" key={key}>
                  <span className="space-x-1">
                    <AbilityIcon
                      icon={value.icon}
                      alt={value.name}
                      width={16}
                      height={16}
                      className="inline"
                      title={value.name}
                    />
                    <span>{value.type.toUpperCase()}</span>
                  </span>
                  <span className="hidden pl-2 md:block lg:hidden xl:block">
                    {count}
                  </span>
                </span>
              );
            })
          : filteredPulls.map((pull) => {
              const usedLust = findBloodlust(pull);
              const lustAbility = usedLust ? spells[usedLust] : null;

              const maybeRelevantNpcName = findBossOrLieutenantName(
                pull,
                isBossType
              );

              if (!maybeRelevantNpcName) {
                return null;
              }

              const fightStart = timeDurationToString(
                pull.startTime - meta.startTime,
                { omitMs: true }
              ).padStart(5, "0");

              const fightEnd = timeDurationToString(
                pull.endTime - meta.startTime,
                {
                  omitMs: true,
                }
              ).padStart(5, "0");

              const fightDuration = timeDurationToString(
                pull.endTime - pull.startTime,
                { omitMs: true }
              ).padStart(5, "0");

              const percentUpToThisPull = pulls.reduce((acc, p) => {
                if (p.id >= pull.id) {
                  return acc;
                }

                return acc + p.percent;
              }, 0);

              const encryptedBuff = pull.events.find(
                findEncryptedApplyDebuffEvent
              );

              return (
                <span
                  className="flex justify-between block w-full"
                  key={pull.startTime}
                >
                  <button
                    type="button"
                    className={classnames(
                      `space-x-1 cursor-pointer md:truncate md:max-w-1/2 lg:max-w-full xl:max-w-1/2`,
                      pull.isWipe
                        ? "line-through hover:line-through hover:underline"
                        : "hover:underline"
                    )}
                    onClick={() => {
                      setSelectedPull(pull.id);
                    }}
                  >
                    {pull.isWipe ? (
                      <img
                        className="inline w-4 h-4 rounded-full"
                        src="/static/skull.png"
                        alt="The group wiped."
                        title="The group wiped."
                        width={16}
                        height={16}
                      />
                    ) : null}

                    <span className="md:hidden">
                      {maybeRelevantNpcName.split(" ").slice(-1)}
                    </span>
                    <span className="hidden md:inline">
                      {maybeRelevantNpcName}
                    </span>
                    {usedLust && lustAbility && (
                      <img
                        className="inline w-6 h-6 rounded-full"
                        src={`${STATIC_ICON_PREFIX}${lustAbility.icon}.jpg`}
                        alt={`${lustAbility.name} was used on this pull.`}
                        width={24}
                        height={24}
                      />
                    )}
                    {encryptedBuff?.ability?.id ? (
                      <AbilityIcon
                        icon={encryptedAbilities[encryptedBuff.ability.id].icon}
                        alt={encryptedAbilities[encryptedBuff.ability.id].name}
                        width={16}
                        height={16}
                        className="inline"
                        title={
                          encryptedAbilities[encryptedBuff.ability.id].name
                        }
                      />
                    ) : null}
                  </button>
                  <span className="hidden pl-2 md:block lg:hidden xl:block">
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
      className="flex p-1 bg-white rounded-full focus:outline-none focus:ring dark:bg-gray-600 dark:focus:bg-transparent"
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
      className="flex p-1 bg-white rounded-full focus:outline-none focus:ring dark:bg-gray-600 dark:focus:bg-transparent"
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

      const listener = createRafListener(rafRef, recalculate);

      window.addEventListener("resize", listener);

      return createRafCleanup(rafRef, "resize", listener);
    }

    container.removeAttribute("style");
  }, [active, toggle, tabPanelRef]);

  return (
    <button
      type="button"
      onClick={() => {
        toggle();
      }}
      title="Toggle Fullscreen"
      className="flex hidden p-1 bg-white rounded-full focus:outline-none focus:ring dark:bg-gray-600 dark:focus:bg-transparent lg:block"
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
  fullscreen: boolean;
};

function Svg({ imageSize, zoneID, onDoorClick, fullscreen }: SvgProps) {
  const { fight } = useFight();
  const { pulls, dungeon } = fight;
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
            /* account for padding on fullscreen */
            ${fullscreen
              ? `
            height: calc(100% - 2rem);
            width: calc(100% - 2rem);
            `
              : ""}
          }
        `}
      </style>
      <svg className="absolute w-full h-full svg focus:outline-none">
        <PointsOfInterestProvider dungeonID={dungeon}>
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
          <PointsOfInterestWrapper zoneID={zoneID} />
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

const selectedOutlineClasses =
  "opacity-100 outline-white outline-2 outline-dotted outline-offset-2";

type EncryptedEvent = Omit<
  FightSuccessResponse["pulls"][number]["events"][number],
  "ability"
> & {
  ability: NonNullable<
    FightSuccessResponse["pulls"][number]["events"][number]["ability"]
  >;
  type: "ApplyDebuff";
};

const findEncryptedApplyDebuffEvent = (
  event: FightSuccessResponse["pulls"][number]["events"][number]
): event is EncryptedEvent => {
  return (
    event.type === "ApplyDebuff" &&
    event.ability !== null &&
    event.ability.id in encryptedAbilities
  );
};

const shroudedDamageEvent = (
  event: FightSuccessResponse["pulls"][number]["events"][number]
): event is EncryptedEvent => {
  return (
    event.type === "DamageTaken" &&
    event.ability !== null &&
    SHROUDED.has(event.ability.id)
  );
};

function findAffixSpecificPullIndicatorEvent(
  pull: PullIndicatorIconProps["pull"]
): { label: string; icon: string } | null {
  const encryptedDebuff = pull.events.find(findEncryptedApplyDebuffEvent);

  if (encryptedDebuff?.ability) {
    const debuff = encryptedAbilities[encryptedDebuff.ability.id];

    return {
      icon: debuff.icon,
      label: debuff.name,
    };
  }

  const shroudedDamage = pull.events.find(shroudedDamageEvent);

  if (shroudedDamage?.ability) {
    const icon = shroudedAbilities.find(
      (ability) => ability.id === shroudedDamage.ability.id
    );

    if (!icon) {
      return null;
    }

    return {
      icon: icon.icon,
      label: icon.name,
    };
  }

  return null;
}

function findDungeonSpecificPullIndicatorEvent(
  pull: PullIndicatorIconProps["pull"],
  dungeon: DungeonIDs
): {
  label: string;
  icon: string;
} | null {
  const slug = dungeons[dungeon].slug.toLowerCase();

  switch (slug) {
    case "sd": {
      const lanternOpening = pull.events.some(
        (event) =>
          event.type === "ApplyBuff" && event.ability?.id === SD_LANTERN_BUFF
      );

      if (lanternOpening) {
        return {
          label: `A lantern was used during this pull.`,
          icon: spells[SD_LANTERN_BUFF].icon,
        };
      }

      return null;
    }
    case "hoa": {
      const gargoyle = pull.events.some(
        (event) => event.type === "Cast" && event.ability?.id === HOA_GARGOYLE
      );

      if (gargoyle) {
        return {
          label: `${spells[HOA_GARGOYLE].name} was charmed during this pull.`,
          icon: spells[HOA_GARGOYLE].icon,
        };
      }

      return null;
    }
    case "top": {
      const banner = pull.events.some(
        (event) =>
          event.type === "ApplyBuff" && event.ability?.id === TOP_BANNER_AURA
      );

      if (banner) {
        return {
          label: `${spells[TOP_BANNER_AURA].name} was activated.`,
          icon: spells[TOP_BANNER_AURA].icon,
        };
      }

      return null;
    }
    case "nw":
      {
        const spear = pull.events.some(
          (event) => event.type === "Cast" && event.ability?.id === NW.SPEAR
        );

        if (spear) {
          return {
            label: `${spells[NW.SPEAR].name} was used on this pull.`,
            icon: spells[NW.SPEAR].icon,
          };
        }

        const hammer = pull.events.some(
          (event) => event.type === "Cast" && event.ability?.id === NW.HAMMER
        );

        if (hammer) {
          return {
            label: `${spells[NW.HAMMER].name} was used on this pull.`,
            icon: spells[NW.HAMMER].icon,
          };
        }

        const orb = pull.events.some(
          (event) => event.type === "DamageDone" && event.ability?.id === NW.ORB
        );

        if (orb) {
          return {
            label: `${spells[NW.ORB].name} was used on this pull.`,
            icon: spells[NW.ORB].icon,
          };
        }

        const kyrianOrb = pull.events.some(
          (event) =>
            event.type === "DamageDone" &&
            event.ability?.id === NW.KYRIAN_ORB_DAMAGE
        );

        if (kyrianOrb) {
          return {
            label: `${spells[NW.KYRIAN_ORB_BUFF].name} was used on this pull.`,
            icon: spells[NW.KYRIAN_ORB_BUFF].icon,
          };
        }

        // shield? :shrug:
      }
      break;
    case "dos":
      {
        const usedUrn = pull.events.some(
          (event) =>
            event.type === "ApplyDebuff" && event.ability?.id === DOS_URN
        );

        if (usedUrn) {
          return {
            label: `${spells[DOS_URN].name} was used on this pull.`,
            icon: spells[DOS_URN].icon,
          };
        }
      }

      break;
    case "soa": {
      const hasSpear = pull.events.some(
        (event) =>
          event.type === "ApplyDebuff" && event.ability?.id === SOA_SPEAR
      );

      if (hasSpear) {
        return {
          label: `${spells[SOA_SPEAR].name} was used on this pull.`,
          icon: spells[SOA_SPEAR].icon,
        };
      }

      return null;
    }
    default: {
      return null;
    }
  }

  return null;
}

function PullIndicatorIcon({ pull, x, y }: PullIndicatorIconProps) {
  const { selectedPull, setSelectedPull } = useReportStore(reportStoreSelector);
  const { dungeon } = useFight().fight;

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
      selected ? selectedOutlineClasses : "opacity-50"
    ),
    width: size,
    height: size,
    x: centerX,
    y: centerY,
  };

  const bossNPC = pull.npcs.find((npc) => isBoss(npc.id));

  if (bossNPC) {
    return (
      <g {...gProps}>
        <image
          aria-label={npcs[bossNPC.id]}
          href={`/static/npcs/${bossNPC.id}.png`}
          className={classnames(
            selected ? selectedOutlineClasses : "opacity-70"
          )}
          width={32}
          height={32}
          x={x - 32 / 2}
          y={y - 32 / 2}
        />
      </g>
    );
  }

  const affixSpecificIcon = findAffixSpecificPullIndicatorEvent(pull);

  if (affixSpecificIcon) {
    return (
      <g {...gProps}>
        <image
          aria-label={affixSpecificIcon.label}
          href={`${STATIC_ICON_PREFIX}${affixSpecificIcon.icon}.jpg`}
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

  const dungeonSpecificIcon = findDungeonSpecificPullIndicatorEvent(
    pull,
    dungeon
  );

  if (dungeonSpecificIcon) {
    return (
      <g {...gProps}>
        <image
          aria-label={dungeonSpecificIcon.label}
          href={`${STATIC_ICON_PREFIX}${dungeonSpecificIcon.icon}.jpg`}
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

  if (pull.isWipe) {
    return (
      <g {...gProps}>
        <image
          aria-label="This pull was a wipe."
          href="/static/skull.png"
          {...sharedProps}
        />
        <text
          textAnchor="middle"
          x={x}
          y={y + 21.02 / 4}
          className="fill-red-600"
        >
          {pull.id}
        </text>
      </g>
    );
  }

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

  return (
    <g {...gProps}>
      <circle cx={x} cy={y} r={15} className={sharedProps.className} />
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
    <>
      <polyline
        markerMid="url(#triangle)"
        className={classnames(
          "polyline stroke-current"
          // invisibilityUsage ? "text-emerald-500" : "text-red-500"
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
    </>
  );
}

const MapChangePolyline = dynamic(
  () =>
    import(/* webpackChunkName: "MapChangePolyline" */ "./MapChangePolyline"),
  { suspense: true }
);

const DoorIndicators = dynamic(
  () => import(/* webpackChunkName: "DoorIndicators" */ "./DoorIndicators"),
  { suspense: true }
);

const PointsOfInterest = dynamic(
  () => import(/* webpackChunkName: "PointsOfInterest" */ "./PointsOfInterest"),
  { suspense: true }
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

type PointsOfInterestWrapperProps = {
  zoneID: number;
};

function PointsOfInterestWrapper({
  zoneID,
}: PointsOfInterestWrapperProps): JSX.Element | null {
  const renderPOIs = useMapOptions((state) => state.renderPOIs);
  const { poi } = usePointsOfInterest();
  const thisZonesPOIs = poi[zoneID];

  if (!renderPOIs || !thisZonesPOIs) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <PointsOfInterest poi={thisZonesPOIs} />
    </Suspense>
  );
}
