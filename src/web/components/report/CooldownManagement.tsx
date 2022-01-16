import type { ChangeEvent, MutableRefObject } from "react";
import {
  memo,
  Fragment,
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
  useReducer,
} from "react";

import type { FightSuccessResponse } from "../../../api/functions/fight";
import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import { dungeons, isDungeonSpecificSpell, spells } from "../../staticData";
import { bgPrimary, bgSecondary, grayscale } from "../../styles/tokens";
import { timeDurationToString } from "../../utils";
import { classnames } from "../../utils/classnames";
import { getClassAndSpecName } from "../../utils/player";
import { STATIC_ICON_PREFIX } from "../AbilityIcon";
import { Checkbox } from "../Checkbox";
import { SpecIcon } from "../SpecIcon";
import { findMostRelevantNPCOfPull } from "./Events";

type DefaultEvent = FightSuccessResponse["pulls"][number]["events"][number];
type CastOrAbilityReadyEventWIthABilityAndSourcePlayerID = Omit<
  DefaultEvent,
  "sourcePlayerID" | "ability" | "type"
> & {
  type: "AbilityReady" | "Cast";
  ability: NonNullable<DefaultEvent["ability"]>;
  sourcePlayerID: NonNullable<DefaultEvent["sourcePlayerID"]>;
};

const rowHeight = 60;

// eslint-disable-next-line import/no-default-export
export default function CooldownManagement(): JSX.Element {
  const { player, pulls } = useFight().fight;
  const [zoomFactor, setZoomFactor] = useState(5);
  const [cooldown, setCooldown] = useState(120);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [trackedPlayer, setTrackedPlayer] = useState(player.map((p) => p.id));

  // required to apply initial zoom level of 5
  const [, forceRerender] = useReducer((val: number) => val + 1, 1);
  useEffect(forceRerender, [forceRerender]);

  const handleRangeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value);
      const { name } = event.target;

      if (name === "cooldown") {
        setCooldown(value);
      }

      if (name === "zoom") {
        setZoomFactor(value / 100);
      }
    },
    []
  );

  const togglePlayer = useCallback((playerID: number) => {
    setTrackedPlayer((prev) => {
      if (prev.includes(playerID)) {
        return prev.filter((id) => id !== playerID);
      }

      // TODO: sort by role
      return [...prev, playerID];
    });
  }, []);

  const allRelevantEvents = useMemo(
    () =>
      pulls.flatMap((pull) =>
        pull.events.filter(
          (
            event
          ): event is CastOrAbilityReadyEventWIthABilityAndSourcePlayerID =>
            isCastOrAbilityReadyEventWithAbilityAndSourcePlayerID(event) &&
            event.ability.id in spells
        )
      ),
    [pulls]
  );

  const { amountOfVisibleAbilities, allUsedAbilities, events, css } =
    useMemo(() => {
      const relevantEvents = allRelevantEvents.filter(
        ({ sourcePlayerID, ability }) =>
          trackedPlayer.includes(sourcePlayerID) &&
          spells[ability.id].cd >= cooldown
      );

      // eslint-disable-next-line unicorn/prefer-object-from-entries
      const castsByPlayer = relevantEvents.reduce<
        Record<number, CastOrAbilityReadyEventWIthABilityAndSourcePlayerID[]>
      >((acc, event) => {
        if (event.sourcePlayerID in acc) {
          acc[event.sourcePlayerID].push(event);
        } else {
          acc[event.sourcePlayerID] = [event];
        }

        return acc;
      }, {});

      const abilitiesByPlayer = Object.fromEntries(
        Object.entries(castsByPlayer).map(([id, casts]) => {
          return [id, [...new Set(casts.map((cast) => cast.ability.id))]];
        })
      );

      const amountOfVisibleAbilities = Object.entries(
        abilitiesByPlayer
      ).reduce<number>((acc, [, arr]) => acc + arr.length, 0);

      const playerIDFillColorMap = Object.fromEntries(
        player.map((p) => {
          const { colors } = getClassAndSpecName(p);

          return [p.id, colors.fill];
        })
      );

      const allUsedAbilities = player.flatMap(({ id }) => {
        const fillColor = playerIDFillColorMap[id];

        return (abilitiesByPlayer[id] ?? [])
          .map((ability) => {
            return { id: ability, fillColor, sourcePlayerID: id };
          })
          .sort((a, b) => {
            return sortAbilitiesByCdOrName(a.id, b.id);
          });
      });

      const events = Object.values(castsByPlayer).flatMap((arr) => {
        return arr
          .sort((a, b) => {
            return sortAbilitiesByCdOrName(a.ability.id, b.ability.id);
          })
          .map((event) => {
            const offset = allUsedAbilities.findIndex(
              (ability) =>
                ability.id === event.ability.id &&
                ability.sourcePlayerID === event.sourcePlayerID
            );

            return {
              ...event,
              offset,
            };
          });
      });

      const css = `${allUsedAbilities
        .reduce<string[]>((acc, ability) => {
          const data = `[data-ability-id="${ability.id}"][data-player-id="${ability.sourcePlayerID}"]`;
          const selector = `g${data}:hover image, g${data}:hover ~ g${data} image`;

          return acc.includes(selector) ? acc : [...acc, selector];
        }, [])
        .join(", ")} { filter: unset }`;

      return {
        amountOfVisibleAbilities,
        allUsedAbilities,
        events,
        css,
      };
    }, [allRelevantEvents, trackedPlayer, cooldown, player]);

  useEffect(() => {
    const sheet = document.createElement("style");
    sheet.textContent = css;

    document.head.append(sheet);

    return () => {
      sheet.remove();
    };
  }, [css]);

  const { width, height } = calculcateDimensions({
    amountOfVisibleAbilities,
    containerRef,
    zoomFactor,
  });

  return (
    <section aria-labelledby="cd-management-heading">
      <div className={`px-4 rounded-t-lg pb-4 pt-4 ${bgPrimary}`}>
        <h2 id="cd-management-heading" className="text-2xl font-bold">
          Cooldown Management
        </h2>
      </div>
      <div className={`rounded-b-lg ${bgSecondary} p-2`}>
        <div className="w-full">
          <Settings
            handleRangeChange={handleRangeChange}
            zoomFactor={zoomFactor}
            minCooldown={cooldown}
            togglePlayer={togglePlayer}
            trackedPlayer={trackedPlayer}
            player={player}
          />

          <div className={`${bgPrimary} p-2 mt-4 rounded-lg`}>
            <div
              className={classnames(
                "w-full",
                zoomFactor > 1 && "overflow-x-scroll"
              )}
              ref={containerRef}
            >
              <svg
                height={height}
                className="absolute max-w-[20ch] pointer-events-none"
              >
                <AbilityNames height={height} abilities={allUsedAbilities} />
              </svg>
              <svg
                width={width}
                className={classnames(
                  !width && "w-full",
                  zoomFactor > 1 && "mb-4"
                )}
                height={height}
              >
                <PullGrid height={height} zoom={zoomFactor} />
                <TimelineGrid height={height} zoom={zoomFactor} />
                <AbilityList events={events} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type SettingsProps = {
  trackedPlayer: number[];
  togglePlayer: (id: number) => void;
  handleRangeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  zoomFactor: number;
  minCooldown: number;
  player: FightSuccessResponse["player"];
};

function Settings({
  trackedPlayer,
  togglePlayer,
  handleRangeChange,
  zoomFactor,
  minCooldown,
  player,
}: SettingsProps) {
  return (
    <div className={`${bgSecondary} sticky top-0 z-10 p-2`}>
      <p>Filter Cooldowns by Player</p>
      <div className="flex justify-between w-full">
        <div className="flex flex-col md:flex-row">
          {player.map((p) => {
            const { className, specName, colors } = getClassAndSpecName(p);

            const checked = trackedPlayer.includes(p.id);
            const disabled = checked && trackedPlayer.length === 1;

            return (
              <span className="p-2" key={p.id}>
                <Checkbox
                  checked={checked}
                  disabled={disabled}
                  onChange={() => {
                    togglePlayer(p.id);
                  }}
                  className="w-full md:w-auto"
                  spanClassName={colors.peerFocus}
                >
                  <span className="w-8 h-8">
                    <SpecIcon
                      class={className}
                      spec={specName}
                      className={classnames(
                        "border-2",
                        checked ? colors.border : grayscale
                      )}
                    />
                  </span>
                  <span className={checked ? colors.text : undefined}>
                    {p.name}
                  </span>
                </Checkbox>
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="pt-4 md:pt-0">
          <label className="flex flex-col md:flex-row">
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              onChange={handleRangeChange}
              name="zoom"
              value={zoomFactor * 100}
            />
            <span className="pl-2">
              Zoom (default 5x, current {zoomFactor}x)
            </span>
          </label>
        </div>

        <div className="pt-4 md:pt-0">
          <label className="flex flex-col md:flex-row">
            <input
              type="range"
              min="60"
              max="600"
              step="30"
              name="cooldown"
              value={minCooldown}
              onChange={handleRangeChange}
            />
            <span className="pl-2">
              Minimum Ability Cooldown Threshold (default 120s, current{" "}
              {minCooldown}s)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

function calculatePullXCoordinates(
  pull: FightSuccessResponse["pulls"][number],
  meta: FightSuccessResponse["meta"]
): [number, number, number] {
  const pullStartX = ((pull.startTime - meta.startTime) / meta.time) * 100;
  const pullEndX = ((pull.endTime - meta.startTime) / meta.time) * 100;

  const finalPullEndX = pullEndX > 100 ? 100 : pullEndX;

  const center = (pullEndX + pullStartX) / 2;

  return [pullStartX, finalPullEndX, center];
}

function sortAbilitiesByCdOrName(a: number, b: number) {
  const abilityA = spells[a];
  const abilityB = spells[b];

  const cdDiff = abilityB.cd - abilityA.cd;

  if (cdDiff !== 0) {
    return cdDiff;
  }

  return abilityB.name.localeCompare(abilityA.name);
}

function isCastOrAbilityReadyEventWithAbilityAndSourcePlayerID(
  event: DefaultEvent
): event is CastOrAbilityReadyEventWIthABilityAndSourcePlayerID {
  if (event.type !== "AbilityReady" && event.type !== "Cast") {
    return false;
  }

  if (!event.ability) {
    return false;
  }

  if (!event.sourcePlayerID) {
    return false;
  }

  if (isDungeonSpecificSpell(event.ability.id)) {
    return false;
  }

  return true;
}

type PullGridProps = {
  height: number;
  zoom: number;
};

function PullGrid({ height, zoom }: PullGridProps) {
  const { pulls, meta, dungeon } = useFight().fight;

  const timelineOffset = isTimelineVisible(zoom) ? 20 : 0;

  return (
    <g data-type="pull-grid">
      {pulls.map((pull, index) => {
        const [pullStartX, pullEndX, center] = calculatePullXCoordinates(
          pull,
          meta
        );

        const { name } = findMostRelevantNPCOfPull(pull, dungeons[dungeon]);

        const lastPull = pulls[index - 1];
        const nextPull = pulls[index + 1];

        const pullDurationInfo = `${timeDurationToString(
          pull.startTime - meta.startTime,
          {
            omitMs: true,
          }
        )} - ${timeDurationToString(pull.endTime - meta.startTime, {
          omitMs: true,
        })}`;

        return (
          <Fragment key={pull.id}>
            {lastPull ? null : (
              <rect
                height="100%"
                x="0"
                width={`${pullStartX}%`}
                className="fill-gray-200 dark:fill-gray-600"
              />
            )}

            {nextPull ? (
              <rect
                height="100%"
                x={`${pullEndX}%`}
                width={`${
                  calculatePullXCoordinates(nextPull, meta)[0] - pullEndX
                }%`}
                className="fill-gray-200 dark:fill-gray-600"
              />
            ) : null}

            <text
              x={`${center}%`}
              y={height - timelineOffset}
              className="cursor-help"
            >
              <tspan
                x={`${center}%`}
                dx="0"
                dy="0"
                textAnchor="middle"
                fill="gray"
                stroke="transparent"
              >
                {zoom >= 2 ? `Pull ${pull.id}` : pull.id}
                <title>{pullDurationInfo}</title>
              </tspan>
            </text>

            {zoom >= 5 ? (
              <text
                x={`${center}%`}
                y={height - 20 - timelineOffset}
                className="hidden md:block"
              >
                <tspan
                  x={`${center}%`}
                  dx="0"
                  dy="0"
                  textAnchor="middle"
                  fill="gray"
                  stroke="transparent"
                >
                  {name}
                </tspan>
              </text>
            ) : null}

            <text x={`${center}%`} y="15" className="cursor-help">
              <tspan
                x={`${center}%`}
                dx="0"
                dy="0"
                textAnchor="middle"
                fill="gray"
                stroke="transparent"
              >
                {zoom >= 2 ? `Pull ${pull.id}` : pull.id}
                <title>{pullDurationInfo}</title>
              </tspan>
            </text>

            {zoom >= 5 ? (
              <text x={`${center}%`} y={35} className="hidden md:block">
                <tspan
                  x={`${center}%`}
                  dx="0"
                  dy="0"
                  textAnchor="middle"
                  fill="gray"
                  stroke="transparent"
                >
                  {name}
                </tspan>
              </text>
            ) : null}
          </Fragment>
        );
      })}
    </g>
  );
}

type AbilityNamesProps = {
  abilities: {
    id: number;
    fillColor: string;
    sourcePlayerID: number;
  }[];
  height: number;
};

const AbilityNames = memo(({ abilities, height }: AbilityNamesProps) => {
  return (
    <text dx="0" x="0" y={height} data-type="ability-names">
      {abilities.map((dataset, index) => {
        const ability = spells[dataset.id];

        const y = 55 + index * rowHeight;
        const lastIsDifferentPlayer = abilities[index - 1]
          ? abilities[index - 1].sourcePlayerID !== dataset.sourcePlayerID
          : true;

        return (
          <tspan
            key={`${dataset.id}-${dataset.fillColor}-${y}`}
            x="0"
            y={y}
            className={classnames(
              dataset.fillColor,
              lastIsDifferentPlayer && "font-bold"
            )}
          >
            {ability.name.slice(0, 20)}
            {ability.name.length > 20 ? "..." : null}
          </tspan>
        );
      })}
    </text>
  );
});

type AbilityListItemProps = {
  event: CastOrAbilityReadyEventWIthABilityAndSourcePlayerID & {
    offset: number;
  };
  keyStart: number;
  keyTime: number;
};

function AbilityListItem({ event, keyStart, keyTime }: AbilityListItemProps) {
  const ability = spells[event.ability.id];
  const cd = ability.cd * 1000;

  const x = ((event.timestamp - keyStart) / keyTime) * 100;
  const y = rowHeight / 2 + 7.5 + event.offset * rowHeight;

  const delay = event.ability.lastUse
    ? event.timestamp - event.ability.lastUse - cd
    : null;

  const title = [
    `${event.type} @ ${timeDurationToString(event.timestamp - keyStart, {
      omitMs: true,
    })}`,
    !event.ability.lastUse && "First Use",
    event.type === "Cast" &&
      delay &&
      delay > 0 &&
      `delayed by ${timeDurationToString(delay, {
        omitMs: true,
      })} after being ready`,
    delay &&
      delay < 0 &&
      `used ${timeDurationToString(delay * -1, {
        omitMs: true,
      })} under default cooldown`,
    event.ability.wasted && "wasted Cooldown Window",
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <g
      data-ability-id={event.ability.id}
      data-player-id={event.sourcePlayerID}
      className="cursor-help"
    >
      <image
        width="24"
        height="24"
        x={`${x < 0 ? 0 : x}%`}
        y={y}
        href={`${STATIC_ICON_PREFIX}${ability.icon}.jpg`}
        xlinkTitle="test"
        className={classnames(
          "grayscale",
          event.type === "AbilityReady" && "outline-dashed outline-1",
          event.ability.wasted
            ? "outline-red-500"
            : "opacity-75 outline-white-500"
        )}
      />
      <title>{title}</title>
    </g>
  );
}

type CalculcateDimensionsArgs = {
  zoomFactor: number;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  amountOfVisibleAbilities: number;
};

function calculcateDimensions({
  amountOfVisibleAbilities,
  containerRef,
  zoomFactor,
}: CalculcateDimensionsArgs) {
  const height =
    45 +
    amountOfVisibleAbilities * rowHeight +
    (isTimelineVisible(zoomFactor) ? 20 : 0);

  const width =
    // zoom 1 doesnt need to calc; without ref we can't calc
    zoomFactor === 1 || !containerRef.current
      ? undefined
      : // assign min width based on clientWidth (only affects mobile)
      containerRef.current.clientWidth > 1456
      ? containerRef.current.clientWidth * zoomFactor
      : 1456 * zoomFactor;

  return {
    width,
    height,
  };
}

type AbilityListProps = {
  events: AbilityListItemProps["event"][];
};

const AbilityList = memo(({ events }: AbilityListProps) => {
  const { meta } = useFight().fight;

  return (
    <g data-type="abilities">
      {events.map((event) => {
        return (
          <AbilityListItem
            event={event}
            keyStart={meta.startTime}
            keyTime={meta.time}
            key={`${event.sourcePlayerID}-${event.timestamp}-${event.offset}`}
          />
        );
      })}
    </g>
  );
});

type TimelineGripdProps = {
  zoom: number;
  height: number;
};

const interval = 5;
const isTimelineVisible = (zoomFactor: number) => zoomFactor >= 5.5;

function TimelineGrid({ zoom, height }: TimelineGripdProps) {
  const { meta } = useFight().fight;

  const visible = isTimelineVisible(zoom);

  const { steps, keyTimeInSeconds } = useMemo(() => {
    const keyTimeInSeconds = meta.time / 1000;

    const steps = Array.from(
      { length: Math.floor(keyTimeInSeconds / interval) + 1 },
      (_, index) => {
        return index * interval;
      }
    );

    return {
      steps,
      keyTimeInSeconds,
    };
  }, [meta.time]);

  const zoomOverEleven = zoom > 11;

  return (
    <g data-type="timeline">
      {steps.map((step) => {
        const isQuarterMinute = step % 15 === 0;

        if (step === 0 || (!isQuarterMinute && !visible)) {
          return null;
        }

        const x = (step / keyTimeInSeconds) * 100;
        const strokeOpacity = isQuarterMinute && visible ? 0.5 : 0.25;

        return (
          <TimelineGridItem
            key={step}
            strokeOpacity={strokeOpacity}
            x={x}
            height={height}
            hasText={(visible && isQuarterMinute) || zoomOverEleven}
            step={step}
          />
        );
      })}
    </g>
  );
}

type TimelineGridItemProps = {
  strokeOpacity: number;
  x: number;
  height: number;
  step: number;
  hasText: boolean;
};

const TimelineGridItem = memo(
  ({ strokeOpacity, x, height, step, hasText }: TimelineGridItemProps) => {
    return (
      <>
        <line
          y2="100%"
          x1={`${x}%`}
          x2={`${x}%`}
          stroke="darkgray"
          strokeDasharray={4}
          strokeOpacity={strokeOpacity}
        />
        {hasText ? (
          <text x={`${x}%`} y={height}>
            <tspan
              x={`${x}%`}
              dx="0"
              dy="0"
              textAnchor="middle"
              fill="gray"
              stroke="transparent"
            >
              {timeDurationToString(step * 1000, { omitMs: true })}
            </tspan>
          </text>
        ) : null}
      </>
    );
  }
);
