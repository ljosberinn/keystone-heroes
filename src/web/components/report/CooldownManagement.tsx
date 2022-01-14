import type { ChangeEvent } from "react";
import { useRef } from "react";
import { Fragment, useCallback, useMemo, useState } from "react";

import type { FightSuccessResponse } from "../../../api/functions/fight";
import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import { classes, spells } from "../../staticData";
import { bgPrimary, grayscale } from "../../styles/tokens";
import {
  classBorderColorMap,
  classFillColorMap,
  classTextColorMap,
} from "../../utils";
import { classnames } from "../../utils/classnames";
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

const isCastOrAbilityReadyEventWithAbilityAndSourcePlayerID = (
  event: DefaultEvent
): event is CastOrAbilityReadyEventWIthABilityAndSourcePlayerID => {
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
};

// eslint-disable-next-line import/no-default-export
export default function CooldownManagement(): JSX.Element {
  const { player, pulls, meta } = useFight().fight;
  const [zoomFactor, setZoomFactor] = useState(1);
  const [cooldown, setCooldown] = useState(120);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [trackedPlayer, setTrackedPlayer] = useState(player.map((p) => p.id));

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

  type Foo = Record<
    FightSuccessResponse["player"][number]["actorID"],
    Record<
      NonNullable<
        FightSuccessResponse["pulls"][number]["events"][number]["ability"]
      >["id"],
      (FightSuccessResponse["pulls"][number]["events"][number] & {
        key: string;
      })[]
    >
  >;

  const allRelevantEvents = useMemo(
    () =>
      pulls.flatMap((pull) =>
        pull.events
          .filter(isCastOrAbilityReadyEventWithAbilityAndSourcePlayerID)
          .filter((event) => event.ability.id in spells)
      ),
    [pulls]
  );

  const abilityIdTextColorMap = useMemo(() => {
    const playerClassMap = Object.fromEntries(
      player.map((p) => [p.id, classes[p.class].name.toLowerCase()])
    );

    return Object.fromEntries(
      allRelevantEvents.map(({ ability, sourcePlayerID }) => {
        const className = playerClassMap[sourcePlayerID];

        return [ability.id, classFillColorMap[className]];
      })
    );
  }, [player, allRelevantEvents]);

  const relevantEventsSubset = useMemo(
    () =>
      allRelevantEvents.filter(
        (event) =>
          trackedPlayer.includes(event.sourcePlayerID) &&
          spells[event.ability.id].cd >= cooldown
      ),
    [allRelevantEvents, trackedPlayer, cooldown]
  );

  // eslint-disable-next-line unicorn/prefer-object-from-entries
  const castsByPlayer = relevantEventsSubset.reduce<
    Record<number, CastOrAbilityReadyEventWIthABilityAndSourcePlayerID[]>
  >((acc, event) => {
    if (event.sourcePlayerID in acc) {
      acc[event.sourcePlayerID].push(event);
    } else {
      acc[event.sourcePlayerID] = [event];
    }

    return acc;
  }, {});

  // eslint-disable-next-line unicorn/prefer-object-from-entries
  const abilitiesByPlayer = relevantEventsSubset.reduce<
    Record<number, number[]>
  >((acc, event) => {
    const { ability, sourcePlayerID } = event;

    if (sourcePlayerID in acc) {
      if (!acc[sourcePlayerID].includes(ability.id)) {
        acc[sourcePlayerID].push(ability.id);
      }
    } else {
      acc[sourcePlayerID] = [ability.id];
    }

    return acc;
  }, {});

  const amountOfVisibleAbilities = Object.values(
    abilitiesByPlayer
  ).reduce<number>((acc, arr) => acc + arr.length, 0);

  console.log({ castsByPlayer, abilitiesByPlayer });

  const playerAbilityMap = useMemo(
    () =>
      pulls
        .flatMap((pull) => pull.events)
        // eslint-disable-next-line unicorn/prefer-object-from-entries
        .reduce<Foo>((acc, event, index) => {
          if (
            !event.ability ||
            !event.sourcePlayerID ||
            (event.type !== "Cast" && event.type !== "AbilityReady")
          ) {
            return acc;
          }

          const ability = spells[event.ability.id];

          if (!ability || ability.cd < cooldown) {
            return acc;
          }

          if (!(event.sourcePlayerID in acc)) {
            acc[event.sourcePlayerID] = {
              [event.ability.id]: [
                {
                  ...event,
                  key: `${event.timestamp}-${event.sourcePlayerID}-${index}`,
                },
              ],
            };

            return acc;
          }

          const ref = acc[event.sourcePlayerID];

          if (event.ability.id in ref) {
            ref[event.ability.id].push({
              ...event,
              key: `${event.timestamp}-${event.sourcePlayerID}-${index}`,
            });
          } else {
            ref[event.ability.id] = [
              {
                ...event,
                key: `${event.timestamp}-${event.sourcePlayerID}-${index}`,
              },
            ];
          }

          return acc;
        }, {}),
    [pulls, cooldown]
  );

  const css = Object.entries(playerAbilityMap)
    .flatMap(([, abilityMap]) => {
      return Object.keys(abilityMap).map((abilityID) => {
        const dataSelector = `[data-ability="${abilityID}"]`;
        return `
        ${dataSelector}:hover,
        ${dataSelector}:hover ~ image${dataSelector} {
          filter: none;
        }`;
      });
    })
    .join(" ");

  const width =
    zoomFactor === 1
      ? undefined
      : containerRef.current
      ? containerRef.current.clientWidth * zoomFactor
      : undefined;

  const height = 30 + amountOfVisibleAbilities * 40;
  console.log({ height, amountOfVisibleAbilities });

  const allUsedAbilities = Object.values(abilitiesByPlayer).flatMap((arr) =>
    arr.sort((a, b) => {
      const abilityA = spells[a];
      const abilityB = spells[b];

      const cdDiff = abilityB.cd - abilityA.cd;

      if (cdDiff !== 0) {
        return cdDiff;
      }

      return abilityB.name.localeCompare(abilityA.name);
    })
  );

  const mappableData = Object.values(castsByPlayer).flatMap((arr) => {
    return arr.sort((a, b) => {
      const abilityA = spells[a.ability.id];
      const abilityB = spells[b.ability.id];

      const cdDiff = abilityB.cd - abilityA.cd;

      if (cdDiff !== 0) {
        return cdDiff;
      }

      return abilityB.name.localeCompare(abilityA.name);
    });
  });

  console.log({ allUsedAbilities });

  return (
    <section className={`w-full px-4 py-2 rounded-lg ${bgPrimary}`}>
      <h3 className="pb-2 text-xl font-semibold font-xl">
        Cooldown Management
      </h3>
      <p>Filter Cooldowns by Player</p>
      <div className="flex justify-between w-full">
        <div className="flex flex-col md:flex-row ">
          {player.map((p) => {
            const checked = trackedPlayer.includes(p.id);

            const { name, specs } = classes[p.class];
            const spec = specs.find((spec) => spec.id === p.spec);

            if (!spec) {
              return null;
            }

            const disabled = checked && trackedPlayer.length === 1;

            const lowercasedClassName = name.toLowerCase();

            const classBorderColor = classBorderColorMap[lowercasedClassName];
            const classTextColor = classTextColorMap[lowercasedClassName];

            return (
              <span className="p-2" key={p.id}>
                <Checkbox
                  id={`player-${p.id}-cds`}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => {
                    setTrackedPlayer((prev) => {
                      if (prev.includes(p.id)) {
                        return prev.filter((id) => id !== p.id);
                      }

                      // TODO: sort by role
                      return [...prev, p.id];
                    });
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
                        class={name}
                        spec={spec.name}
                        className={classnames(
                          "border-2",
                          checked && classBorderColor
                        )}
                      />
                    </span>
                    <span className={classTextColor}>{p.name}</span>
                  </span>
                </Checkbox>
              </span>
            );
          })}
        </div>

        <div>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            onChange={handleRangeChange}
            name="zoom"
            aria-labelledby="zoom-label"
            value={zoomFactor * 100}
            id="zoom"
          />
          <label htmlFor="zoom" id="zoom-label">
            Zoom (default 1, current {zoomFactor})
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
            value={cooldown}
            onChange={handleRangeChange}
            id="cooldown"
            aria-labelledby="cooldown-label"
          />
          <label htmlFor="cooldown" id="cooldown-label">
            Minimum Ability Cooldown Threshold (default 120, current {cooldown})
          </label>
        </div>
      </div>

      <div
        className={classnames("w-full", zoomFactor > 1 && "overflow-x-scroll")}
        ref={containerRef}
      >
        <style jsx>{css}</style>
        <svg
          width={width}
          className={width === undefined ? "w-full" : undefined}
          height={height}
        >
          <g>
            {pulls.map((pull) => {
              const [pullStartX, pullEndX, center] = calculatePullXCoordinates(
                pull,
                meta
              );

              return (
                <Fragment key={pull.id}>
                  <line
                    y2="95%"
                    x1={`${pullStartX}%`}
                    x2={`${pullStartX}%`}
                    stroke="gray"
                    strokeDasharray={4}
                  />
                  <line
                    y2="95%"
                    x1={`${pullEndX}%`}
                    x2={`${pullEndX}%`}
                    stroke="gray"
                    strokeDasharray={4}
                  />

                  <text dx="0" x={`${center}%`} y={height}>
                    <tspan
                      x={`${center}%`}
                      dx="0"
                      dy="0"
                      textAnchor="middle"
                      fill="gray"
                      stroke="transparent"
                    >
                      {pull.id}
                    </tspan>
                  </text>
                </Fragment>
              );
            })}
          </g>

          <g>
            {allUsedAbilities.map((id, index) => {
              const ability = spells[id];

              const y = 20 + index * 40;

              return (
                <text dx="0" x="0" y={height} key={id}>
                  <tspan
                    x="0"
                    y={y}
                    dx="0"
                    dy="0"
                    textAnchor="left"
                    fill="gray"
                    stroke="transparent"
                    className={abilityIdTextColorMap[id]}
                  >
                    {ability.name}
                  </tspan>
                </text>
              );
            })}
          </g>

          <g>
            {mappableData.map((event, index) => {
              const { icon } = spells[event.ability.id];

              const x =
                ((event.timestamp - meta.startTime) / meta.time) * 100 -
                // x offset of half of icon width based on max svg size
                // so its on the line
                (12 / 1488) * 100;

              const index = allUsedAbilities.indexOf(event.ability.id);

              const y = 22.5 + index * 40;

              return (
                <image
                  key={`${event.sourcePlayerID}-${event.timestamp}-${index}`}
                  width="24"
                  height="24"
                  x={`${x < 0 ? 0 : x}%`}
                  y={y}
                  href={`${STATIC_ICON_PREFIX}${icon}.jpg`}
                  className={classnames(
                    "grayscale",
                    event.type === "AbilityReady" && "outline-dashed outline-1",
                    event.ability.wasted
                      ? "outline-red-500"
                      : "opacity-75 outline-white-500"
                  )}
                />
              );
            })}
          </g>

          {/* <g>
            {Object.entries(playerAbilityMap).flatMap(
              ([actorID, abilityMap]) => {
                if (!trackedPlayer.includes(Number.parseInt(actorID))) {
                  return null;
                }

                return Object.entries(abilityMap)
                  .sort((a, b) => {
                    const abilityA = spells[Number.parseInt(a[0])];
                    const abilityB = spells[Number.parseInt(b[0])];

                    if (!abilityA) {
                      return 1;
                    }

                    if (!abilityB) {
                      return -1;
                    }

                    return abilityB.cd - abilityA.cd;
                  })
                  .map(([abilityID, events], index, arr) => {
                    return events.map((event) => {
                      const ability = spells[Number.parseInt(abilityID)];

                      const x =
                        ((event.timestamp - meta.startTime) / meta.time) * 100 -
                        // x offset of half of icon width based on max svg size
                        // so its on the line
                        (12 / 1488) * 100;

                      const perRow = height / arr.length;

                      const y = 25 + index * perRow;

                      return (
                        <image
                          key={event.key}
                          href={`${STATIC_ICON_PREFIX}${ability.icon}.jpg`}
                          x={`${x < 0 ? 0 : x}%`}
                          y={y}
                          width={24}
                          height={24}
                          className={classnames(
                            "grayscale cursor-pointer",
                            event.type === "AbilityReady" &&
                              "outline-dashed outline-1",
                            event.ability.wasted
                              ? "outline-red-500"
                              : "opacity-75 outline-white-500"
                          )}
                          data-ability={abilityID}
                        />
                      );
                    });
                  });
              }
            )}
          </g> */}
        </svg>
      </div>
    </section>
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
