import type { ChangeEvent } from "react";
import { memo, Fragment, useCallback, useMemo, useState, useRef } from "react";

import type { FightSuccessResponse } from "../../../api/functions/fight";
import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import { spells } from "../../staticData";
import { bgPrimary, bgSecondary, grayscale } from "../../styles/tokens";
import { timeDurationToString } from "../../utils";
import { classnames } from "../../utils/classnames";
import { getClassAndSpecName } from "../../utils/player";
import { STATIC_ICON_PREFIX } from "../AbilityIcon";
import { Checkbox } from "../Checkbox";
import { SpecIcon } from "../SpecIcon";

type DefaultEvent = FightSuccessResponse["pulls"][number]["events"][number];
type CastOrAbilityReadyEventWIthABilityAndSourcePlayerID = Omit<
  DefaultEvent,
  "sourcePlayerID" | "ability" | "type"
> & {
  type: "AbilityReady" | "Cast";
  ability: NonNullable<DefaultEvent["ability"]>;
  sourcePlayerID: NonNullable<DefaultEvent["sourcePlayerID"]>;
};

const rowHeight = 45;

// eslint-disable-next-line import/no-default-export
export default function CooldownManagement(): JSX.Element {
  const { player, pulls, meta } = useFight().fight;
  const [zoomFactor, setZoomFactor] = useState(2);
  const [cooldown, setCooldown] = useState(120);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [trackedPlayer, setTrackedPlayer] = useState(player.map((p) => p.id));
  console.time("test");

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

  const { amountOfVisibleAbilities, allUsedAbilities, displayableData } =
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

      const displayableData = Object.values(castsByPlayer).flatMap((arr) => {
        return arr.sort((a, b) => {
          return sortAbilitiesByCdOrName(a.ability.id, b.ability.id);
        });
      });

      return {
        amountOfVisibleAbilities,
        allUsedAbilities,
        displayableData,
      };
    }, [allRelevantEvents, trackedPlayer, cooldown, player]);

  // type Foo = Record<
  //   FightSuccessResponse["player"][number]["actorID"],
  //   Record<
  //     NonNullable<
  //       FightSuccessResponse["pulls"][number]["events"][number]["ability"]
  //     >["id"],
  //     (FightSuccessResponse["pulls"][number]["events"][number] & {
  //       key: string;
  //     })[]
  //   >
  // >;

  // const playerAbilityMap = useMemo(
  //   () =>
  //     pulls
  //       .flatMap((pull) => pull.events)
  //       // eslint-disable-next-line unicorn/prefer-object-from-entries
  //       .reduce<Foo>((acc, event, index) => {
  //         if (
  //           !event.ability ||
  //           !event.sourcePlayerID ||
  //           (event.type !== "Cast" && event.type !== "AbilityReady")
  //         ) {
  //           return acc;
  //         }

  //         const ability = spells[event.ability.id];

  //         if (!ability || ability.cd < cooldown) {
  //           return acc;
  //         }

  //         if (!(event.sourcePlayerID in acc)) {
  //           acc[event.sourcePlayerID] = {
  //             [event.ability.id]: [
  //               {
  //                 ...event,
  //                 key: `${event.timestamp}-${event.sourcePlayerID}-${index}`,
  //               },
  //             ],
  //           };

  //           return acc;
  //         }

  //         const ref = acc[event.sourcePlayerID];

  //         if (event.ability.id in ref) {
  //           ref[event.ability.id].push({
  //             ...event,
  //             key: `${event.timestamp}-${event.sourcePlayerID}-${index}`,
  //           });
  //         } else {
  //           ref[event.ability.id] = [
  //             {
  //               ...event,
  //               key: `${event.timestamp}-${event.sourcePlayerID}-${index}`,
  //             },
  //           ];
  //         }

  //         return acc;
  //       }, {}),
  //   [pulls, cooldown]
  // );

  // const css = Object.entries(playerAbilityMap)
  //   .flatMap(([, abilityMap]) => {
  //     return Object.keys(abilityMap).map((abilityID) => {
  //       const dataSelector = `[data-ability="${abilityID}"]`;
  //       return `
  //       ${dataSelector}:hover,
  //       ${dataSelector}:hover ~ image${dataSelector} {
  //         filter: none;
  //       }`;
  //     });
  //   })
  //   .join(" ");

  const width =
    zoomFactor === 1 || !containerRef.current
      ? undefined
      : containerRef.current.clientWidth * zoomFactor;

  const height = 40 + amountOfVisibleAbilities * rowHeight;

  console.timeEnd("test");

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

          <div className="flex flex-col w-full space-y-4 lg:space-x-4 lg:flex-row lg:space-y-0">
            <div
              className={classnames(
                "w-full",
                zoomFactor > 1 && "overflow-x-scroll"
              )}
              ref={containerRef}
            >
              {/* <style jsx>{css}</style> */}
              <svg
                width={width}
                className={classnames(
                  width === undefined && "w-full",
                  zoomFactor > 1 && "mb-4"
                )}
                height={height}
              >
                <PullGrid height={height} />
                <AbilityNames height={height} abilities={allUsedAbilities} />

                <g data-type="abilities">
                  {displayableData.map((event) => {
                    const index = allUsedAbilities.findIndex(
                      (ability) =>
                        ability.id === event.ability.id &&
                        ability.sourcePlayerID === event.sourcePlayerID
                    );

                    return (
                      <AbilityListItem
                        event={event}
                        keyStart={meta.startTime}
                        keyTime={meta.time}
                        offset={index}
                        key={`${event.sourcePlayerID}-${event.timestamp}-${index}`}
                      />
                    );
                  })}
                </g>
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
    <>
      <p>Filter Cooldowns by Player</p>
      <div className="flex justify-between w-full">
        <div className="flex flex-col md:flex-row">
          {player.map((p) => {
            const checked = trackedPlayer.includes(p.id);
            const { className, specName, colors } = getClassAndSpecName(p);

            const disabled = checked && trackedPlayer.length === 1;

            return (
              <span className="p-2" key={p.id}>
                <Checkbox
                  id={`player-${p.id}-cds`}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => {
                    togglePlayer(p.id);
                  }}
                >
                  <span
                    className={classnames(
                      "flex items-center space-x-2",
                      !checked && grayscale
                    )}
                  >
                    <span className="w-8 h-8">
                      <SpecIcon
                        class={className}
                        spec={specName}
                        className={classnames(
                          "border-2",
                          checked && colors.border
                        )}
                      />
                    </span>
                    <span className={colors.text}>{p.name}</span>
                  </span>
                </Checkbox>
              </span>
            );
          })}
        </div>
      </div>

      <p>asd</p>
      <div className="flex flex-col md:flex-row">
        <div>
          <input
            type="range"
            min="100"
            max="1500"
            step="50"
            onChange={handleRangeChange}
            name="zoom"
            aria-labelledby="zoom-label"
            value={zoomFactor * 100}
            id="zoom"
          />
          <label htmlFor="zoom" id="zoom-label">
            Zoom (default 2, current {zoomFactor})
          </label>
        </div>

        <div>
          <input
            type="range"
            min="60"
            max="600"
            step="30"
            name="cooldown"
            aria-label="Cooldown"
            value={minCooldown}
            onChange={handleRangeChange}
            id="cooldown"
            aria-labelledby="cooldown-label"
          />
          <label htmlFor="cooldown" id="cooldown-label">
            Minimum Ability Cooldown Threshold (default 120, current{" "}
            {minCooldown})
          </label>
        </div>
      </div>
    </>
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

  return true;
}

type PullGridProps = {
  height: number;
};

const PullGrid = memo(({ height }: PullGridProps) => {
  const { pulls, meta } = useFight().fight;

  return (
    <g data-type="pull-grid">
      {pulls.map((pull, index) => {
        const [pullStartX, pullEndX, center] = calculatePullXCoordinates(
          pull,
          meta
        );

        const lastPull = pulls[index - 1];
        const nextPull = pulls[index + 1];

        return (
          <Fragment key={pull.id}>
            {lastPull ? null : (
              <rect
                height="100%"
                x="0"
                width={`${pullStartX}%`}
                className="dark:fill-gray-600"
              />
            )}
            <line
              y2="100%"
              x1={`${pullStartX}%`}
              x2={`${pullStartX}%`}
              stroke="gray"
              strokeDasharray={4}
            />
            <line
              y2="100%"
              x1={`${pullEndX}%`}
              x2={`${pullEndX}%`}
              stroke="gray"
              strokeDasharray={4}
            />

            {nextPull ? (
              <rect
                height="100%"
                x={`${pullEndX}%`}
                width={`${
                  calculatePullXCoordinates(nextPull, meta)[0] - pullEndX
                }%`}
                className="dark:fill-gray-600"
              />
            ) : null}

            <text x={`${center}%`} y={height}>
              <tspan
                x={`${center}%`}
                dx="0"
                dy="0"
                textAnchor="middle"
                fill="gray"
                stroke="transparent"
              >
                Pull {pull.id}
              </tspan>
            </text>

            <text x={`${center}%`} y="15">
              <tspan
                x={`${center}%`}
                dx="0"
                dy="0"
                textAnchor="middle"
                fill="gray"
                stroke="transparent"
              >
                Pull {pull.id}
              </tspan>
            </text>
          </Fragment>
        );
      })}
    </g>
  );
});

type AbilityNamesProps = {
  abilities: {
    id: number;
    fillColor: string;
  }[];
  height: number;
};

const AbilityNames = memo(({ abilities, height }: AbilityNamesProps) => {
  return (
    <text dx="0" x="0" y={height} data-type="ability-names">
      {abilities.map((dataset, index) => {
        const ability = spells[dataset.id];

        const y = 30 + index * rowHeight;

        return (
          <tspan
            key={`${dataset.id}-${dataset.fillColor}-${y}`}
            x="0"
            y={y}
            className={dataset.fillColor}
            aria-details="test"
          >
            {ability.name}
          </tspan>
        );
      })}
    </text>
  );
});

type AbilityListItemProps = {
  event: CastOrAbilityReadyEventWIthABilityAndSourcePlayerID;
  keyStart: number;
  keyTime: number;
  offset: number;
};

const AbilityListItem = memo(
  ({ event, keyStart, keyTime, offset }: AbilityListItemProps) => {
    const ability = spells[event.ability.id];
    const cd = ability.cd * 1000;

    const x =
      ((event.timestamp - keyStart) / keyTime) * 100 -
      // x offset of half of icon width based on max svg size
      // so its on the line
      (12 / 1456) * 100;

    const y = 34 + offset * rowHeight;

    const title = [
      event.type,
      !event.ability.lastUse && "First Use",
      event.type === "Cast" &&
        event.ability.lastUse &&
        `delayed by ${timeDurationToString(
          event.timestamp - event.ability.lastUse - cd,
          { omitMs: true }
        )}s after being ready`,
      event.ability.wasted && "wasted Cooldown Window",
    ]
      .filter(Boolean)
      .join(" - ");

    return (
      <g>
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
);
