/* eslint-disable sonarjs/no-identical-functions */
import type { SpecName } from "@prisma/client";
import Link from "next/link";
import type { FormEventHandler } from "react";
import { useState } from "react";

import type { DiscoveryResponse } from "../../api/functions/discovery";
import { dungeonMap } from "../../db/data/dungeons";
import { specs } from "../../db/data/specs";
import { Seo } from "../../web/components/Seo";
import { MIN_KEYSTONE_LEVEL } from "../../web/env";
import { useAbortableFetch } from "../../web/hooks/useAbortableFetch";
import {
  dungeons,
  weeks,
  specIDsPerRole,
  classes,
  covenants,
  soulbinds,
  legendariesBySpec,
  legendaries,
} from "../../web/staticData";
import type { LivingDiscoveryQueryParams } from "../../web/store";
import { useRouteDiscovery } from "../../web/store";
import {
  bgPrimary,
  bgSecondary,
  hoverShadow,
  widthConstraint,
} from "../../web/styles/tokens";

export default function Discover(): JSX.Element {
  const [url, setUrl] = useState<string | null>(null);
  const [data, loading] = useAbortableFetch<DiscoveryResponse>({
    url,
    initialState: [],
  });

  const handleReset = () => {
    setUrl(null);
  };

  const handleSubmit = (query: LivingDiscoveryQueryParams) => {
    try {
      const sanitized = Object.fromEntries(
        Object.entries(query)
          .filter((arr): arr is [string, number] => arr[1] !== null)
          .map(([key, value]) => [key, `${value}`])
      );

      setUrl(`/api/discovery?${new URLSearchParams(sanitized).toString()}`);
    } catch {}
  };

  return (
    <>
      <Seo title="Route Discovery" />

      <div className={`${widthConstraint} py-6`}>
        <div className="flex flex-col mx-auto space-x-0 lg:flex-row max-w-screen-2xl lg:space-x-4">
          <div className={`"flex-1 rounded-b-lg ${hoverShadow} lg:w-2/6`}>
            <div className={`p-4 rounded-t-lg ${bgSecondary}`}>
              <h1 className="text-3xl font-bold">Route Discovery</h1>
            </div>
            <div className={`h-auto p-4 rounded-b-lg ${bgPrimary}`}>
              <Form
                onSubmit={handleSubmit}
                onReset={handleReset}
                loading={loading}
              />
            </div>
          </div>

          <div className="w-full h-auto max-w-screen-xl pt-4 lg:w-4/6 lg:pt-0">
            <div className={`p-4 rounded-t-lg ${bgSecondary}`}>
              <h2 className="text-2xl font-bold">Results</h2>
            </div>

            <DiscoveryResults data={data} loading={loading} />
          </div>
        </div>
      </div>
    </>
  );
}

type DiscoveryResultsProps = {
  data: DiscoveryResponse;
  loading: boolean;
};

function DiscoveryResults({ data }: DiscoveryResultsProps) {
  return (
    <div className={`p-2 rounded-b-lg ${bgPrimary} ${hoverShadow}`}>
      {data.map((dataset) => {
        const dungeon = dungeonMap[dataset.dungeonID];

        return (
          <div
            key={`${dataset.report}-${dataset.fightID}`}
            className={`bg-maincolor bg-cover rounded-md bg-${dungeon.slug.toLowerCase()} hover:bg-blend-multiply`}
          >
            <h2 className="font-extrabold">
              {dungeon.slug} +{dataset.keystoneLevel}
            </h2>
            <Link href={`/report/${dataset.report}/${dataset.fightID}`}>
              <a>
                {dataset.report}-{dataset.fightID}
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

type FormProps = {
  onSubmit: (query: LivingDiscoveryQueryParams) => void;
  onReset: () => void;
  loading: boolean;
};

function Form({ onSubmit, onReset, loading }: FormProps) {
  const {
    reset,
    dungeonID,
    affix1,
    affix2,
    affix3,
    dps1,
    dps2,
    dps3,
    handlePropertyChange,
    heal,
    maxDeaths,
    maxItemLevelAvg,
    minItemLevelAvg,
    maxKeyLevel,
    minKeyLevel,
    tank,
    dps1Covenant,
    dps1Legendary1,
    dps1Legendary2,
    dps1Soulbind,
    dps2Covenant,
    dps2Legendary1,
    dps2Legendary2,
    dps2Soulbind,
    dps3Covenant,
    dps3Legendary1,
    dps3Legendary2,
    dps3Soulbind,
    healCovenant,
    healLegendary1,
    healLegendary2,
    healSoulbind,
    tankCovenant,
    tankLegendary1,
    tankLegendary2,
    tankSoulbind,
    maxPercent,
  } = useRouteDiscovery();

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();

    onSubmit({
      dungeonID,
      affix1,
      affix2,
      affix3,
      heal,
      dps1,
      dps2,
      dps3,
      maxDeaths,
      maxItemLevelAvg,
      maxKeyLevel,
      minKeyLevel,
      minItemLevelAvg,
      tank,
      dps1Covenant,
      dps1Legendary1,
      dps1Legendary2,
      dps1Soulbind,
      dps2Covenant,
      dps2Legendary1,
      dps2Legendary2,
      dps2Soulbind,
      dps3Covenant,
      dps3Legendary1,
      dps3Legendary2,
      dps3Soulbind,
      healCovenant,
      healLegendary1,
      healLegendary2,
      healSoulbind,
      tankCovenant,
      tankLegendary1,
      tankLegendary2,
      tankSoulbind,
      maxPercent,
    });
  };

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        <div className="flex space-x-4 lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-y-0 xl:space-x-4">
          <div className="flex flex-col w-1/2 md:w-full">
            <label htmlFor="dungeon-selection">Dungeon</label>

            <select
              id="dungeon-selection"
              value={dungeonID ? dungeonID : -1}
              onChange={(event) => {
                try {
                  const value = Number.parseInt(event.target.value);

                  handlePropertyChange(
                    "dungeonID",
                    value === null ? null : value
                  );
                } catch {
                  handlePropertyChange("dungeonID", null);
                }
              }}
              className="w-full border-2 border-solid dark:border-gray-600"
            >
              <option value={-1}>select dungeon</option>
              {Object.entries(dungeons)
                .map(([id, data]) => {
                  return {
                    id: Number.parseInt(id),
                    name: data.name,
                    slug: data.slug,
                  };
                })
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((dungeon) => {
                  return (
                    <option key={dungeon.id} value={dungeon.id}>
                      {dungeon.name}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="flex flex-row w-1/2 space-x-2 lg:w-full lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-x-4 xl:space-y-0">
            <div className="w-1/2 lg:w-full xl:w-1/2">
              <label htmlFor="min-level">Min Level</label>

              <div>
                <input
                  type="number"
                  name="minKeyLevel"
                  min={MIN_KEYSTONE_LEVEL}
                  max="44"
                  step="1"
                  id="min-level"
                  aria-label="Min Level"
                  placeholder="Min Level"
                  className="w-full border-2 border-solid dark:border-gray-600"
                  value={minKeyLevel ? minKeyLevel : ""}
                  onChange={(event) => {
                    try {
                      const value = Number.parseInt(event.target.value);

                      handlePropertyChange(
                        "minKeyLevel",
                        Number.isNaN(value) ? null : value
                      );
                    } catch {
                      handlePropertyChange("minKeyLevel", null);
                    }
                  }}
                />
              </div>
            </div>

            <div className="w-1/2 lg:w-full xl:w-1/2">
              <label htmlFor="max-level">Max Level</label>

              <div>
                <input
                  type="number"
                  name="maxKeyLevel"
                  min="11"
                  max="45"
                  step="1"
                  id="max-level"
                  aria-label="Max Level"
                  placeholder="Max Level"
                  className="w-full border-2 border-solid dark:border-gray-600"
                  value={maxKeyLevel ? maxKeyLevel : ""}
                  onChange={(event) => {
                    try {
                      const value = Number.parseInt(event.target.value);

                      handlePropertyChange(
                        "maxKeyLevel",
                        Number.isNaN(value) ? null : value
                      );
                    } catch {
                      handlePropertyChange("maxKeyLevel", null);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-y-0 xl:space-x-4 lg:pt-2">
          <div className="flex flex-col w-1/2 lg:w-full">
            <label htmlFor="dungeon-selection">Affixes</label>

            <select
              id="affix-selection"
              value={
                affix1 && affix2 && affix3
                  ? [affix1, affix2, affix3].join("-")
                  : ""
              }
              onChange={(event) => {
                try {
                  const ids = event.target.value
                    .split("-")
                    .map((id) => Number.parseInt(id));

                  if (ids.length === 3) {
                    handlePropertyChange("affix1", ids[0]);
                    handlePropertyChange("affix2", ids[1]);
                    handlePropertyChange("affix3", ids[2]);
                  } else {
                    handlePropertyChange("affix1", null);
                    handlePropertyChange("affix2", null);
                    handlePropertyChange("affix3", null);
                  }
                } catch {
                  handlePropertyChange("affix1", null);
                  handlePropertyChange("affix2", null);
                  handlePropertyChange("affix3", null);
                }
              }}
              className="w-full border-2 border-solid dark:border-gray-600"
            >
              <option value={-1}>select week</option>
              {Object.entries(weeks).map(([group, weeks]) => {
                return (
                  <optgroup label={group} key={group}>
                    {weeks
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((week) => {
                        const key = week.ids.join("-");

                        return (
                          <option key={key} value={key}>
                            {week.name}
                          </option>
                        );
                      })}
                  </optgroup>
                );
              })}
            </select>
          </div>

          <div className="flex flex-row w-1/2 space-x-2 lg:w-full lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-x-4 xl:space-y-0">
            <div className="w-1/2 lg:w-full xl:w-1/2">
              <label htmlFor="min-item-level-avg">Min ILVL Ø</label>

              <div>
                <input
                  type="number"
                  name="minItemlevel"
                  min="180"
                  max="300"
                  step="1"
                  id="min-item-level-avg"
                  aria-label="Min ILVL Ø"
                  placeholder="Min ILVL Ø"
                  className="w-full border-2 border-solid dark:border-gray-600"
                  value={minItemLevelAvg ? minItemLevelAvg : ""}
                  onChange={(event) => {
                    try {
                      const value = Number.parseInt(event.target.value);

                      handlePropertyChange(
                        "minItemLevelAvg",
                        Number.isNaN(value) ? null : value
                      );
                    } catch {
                      handlePropertyChange("minItemLevelAvg", null);
                    }
                  }}
                />
              </div>
            </div>

            <div className="w-1/2 lg:w-full xl:w-1/2">
              <label htmlFor="max-item-level-avg">Max ILVL Ø</label>

              <div>
                <input
                  type="number"
                  name="maxItemlevelAvg"
                  min="180"
                  max="300"
                  step="1"
                  id="max-item-level-avg"
                  aria-label="Max ILVL Ø"
                  placeholder="Max ILVL Ø"
                  className="w-full border-2 border-solid dark:border-gray-600"
                  value={maxItemLevelAvg ? maxItemLevelAvg : ""}
                  onChange={(event) => {
                    try {
                      const value = Number.parseInt(event.target.value);

                      handlePropertyChange(
                        "maxItemLevelAvg",
                        Number.isNaN(value) ? null : value
                      );
                    } catch {
                      handlePropertyChange("maxItemLevelAvg", null);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-y-0 xl:space-x-4 lg:pt-2">
          <div className="flex flex-col w-1/2 md:w-full">
            <label htmlFor="max-percent">Max Percent</label>

            <div>
              <input
                type="number"
                name="maxPercent"
                min="100"
                step="1"
                max="200"
                id="max-percent"
                aria-label="Max Percent"
                placeholder="Max Percent"
                className="w-full border-2 border-solid dark:border-gray-600"
                value={maxPercent ? maxPercent : ""}
                onChange={(event) => {
                  try {
                    const value = Number.parseInt(event.target.value);

                    handlePropertyChange(
                      "maxPercent",
                      Number.isNaN(value) ? null : value
                    );
                  } catch {
                    handlePropertyChange("maxPercent", null);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex flex-col w-1/2 md:w-full">
            <label htmlFor="max-deaths">Max Deaths</label>

            <div>
              <input
                type="number"
                name="maxDeaths"
                min="0"
                step="1"
                max="50"
                id="max-deaths"
                aria-label="Max Deaths"
                placeholder="Max Deaths"
                className="w-full border-2 border-solid dark:border-gray-600"
                value={maxDeaths === null ? "" : maxDeaths}
                onChange={(event) => {
                  try {
                    const value = Number.parseInt(event.target.value);
                    console.log(value, Number.isNaN(value) ? null : value);

                    handlePropertyChange(
                      "maxDeaths",
                      Number.isNaN(value) ? null : value
                    );
                  } catch {
                    handlePropertyChange("maxDeaths", null);
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <SpecFilters
            tank={{
              tank,
              tankCovenant,
              tankLegendary1,
              tankLegendary2,
              tankSoulbind,
            }}
            heal={{
              heal,
              healCovenant,
              healLegendary1,
              healLegendary2,
              healSoulbind,
            }}
            dps1={{
              dps1,
              dps1Covenant,
              dps1Legendary1,
              dps1Legendary2,
              dps1Soulbind,
            }}
            dps2={{
              dps2,
              dps2Covenant,
              dps2Legendary1,
              dps2Legendary2,
              dps2Soulbind,
            }}
            dps3={{
              dps3,
              dps3Covenant,
              dps3Legendary1,
              dps3Legendary2,
              dps3Soulbind,
            }}
          />
        </div>

        <div className="flex justify-between w-full pt-4">
          <button
            className="px-4 font-medium text-center text-white transition-all duration-200 ease-in-out bg-red-500 rounded-lg outline-none dark:hover:bg-red-400 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:bg-red-600 dark:focus:ring-red-300"
            type="reset"
            onClick={handleReset}
          >
            reset
          </button>

          <button
            className="px-4 font-medium text-center text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-lg outline-none dark:hover:bg-blue-500 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-blue-500 dark:focus:ring-blue-300"
            type="submit"
          >
            submit
          </button>
        </div>
      </fieldset>
    </form>
  );
}

type SpecFiltersProps = {
  tank: {
    tank: number | null;
    tankCovenant: number | null;
    tankLegendary1: number | null;
    tankLegendary2: number | null;
    tankSoulbind: number | null;
  };
  heal: {
    heal: number | null;
    healCovenant: number | null;
    healLegendary1: number | null;
    healLegendary2: number | null;
    healSoulbind: number | null;
  };
  dps1: {
    dps1: number | null;
    dps1Covenant: number | null;
    dps1Legendary1: number | null;
    dps1Legendary2: number | null;
    dps1Soulbind: number | null;
  };
  dps2: {
    dps2: number | null;
    dps2Covenant: number | null;
    dps2Legendary1: number | null;
    dps2Legendary2: number | null;
    dps2Soulbind: number | null;
  };
  dps3: {
    dps3: number | null;
    dps3Covenant: number | null;
    dps3Legendary1: number | null;
    dps3Legendary2: number | null;
    dps3Soulbind: number | null;
  };
};

type SpecFiltersState = {
  tank: boolean;
  heal: boolean;
  dps1: boolean;
  dps2: boolean;
  dps3: boolean;
};

function SpecFilters({ dps1, dps2, dps3, heal, tank }: SpecFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<SpecFiltersState>({
    tank: tank.tank !== null,
    heal: heal.heal !== null,
    dps1: dps1.dps1 !== null,
    dps2: dps2.dps2 !== null,
    dps3: dps3.dps3 !== null,
  });

  const handleAddRole = (role: keyof SpecFiltersState) => {
    setActiveFilters((prev) => {
      return {
        ...prev,
        [role]: !prev[role],
      };
    });
  };

  const active = Object.values(activeFilters).filter((bool) => bool).length;

  return (
    <>
      <p>Spec Filter</p>

      {activeFilters.tank ? (
        <SpecFilter
          type="tank"
          data={{
            covenant: tank.tankCovenant,
            soulbind: tank.tankSoulbind,
            legendary1: tank.tankLegendary1,
            legendary2: tank.tankLegendary2,
            specID: tank.tank,
          }}
          remove={() => {
            handleAddRole("tank");
          }}
        />
      ) : null}
      {activeFilters.heal ? (
        <SpecFilter
          type="heal"
          data={{
            covenant: heal.healCovenant,
            soulbind: heal.healSoulbind,
            legendary1: heal.healLegendary1,
            legendary2: heal.healLegendary2,
            specID: heal.heal,
          }}
          remove={() => {
            handleAddRole("heal");
          }}
        />
      ) : null}
      {activeFilters.dps1 ? (
        <SpecFilter
          type="dps1"
          data={{
            covenant: dps1.dps1Covenant,
            soulbind: dps1.dps1Soulbind,
            legendary1: dps1.dps1Legendary1,
            legendary2: dps1.dps1Legendary2,
            specID: dps1.dps1,
          }}
          remove={() => {
            handleAddRole("dps1");
          }}
        />
      ) : null}
      {activeFilters.dps2 ? (
        <SpecFilter
          type="dps2"
          data={{
            covenant: dps2.dps2Covenant,
            soulbind: dps2.dps2Soulbind,
            legendary1: dps2.dps2Legendary1,
            legendary2: dps2.dps2Legendary2,
            specID: dps2.dps2,
          }}
          remove={() => {
            handleAddRole("dps2");
          }}
        />
      ) : null}
      {activeFilters.dps3 ? (
        <SpecFilter
          type="dps3"
          data={{
            covenant: dps3.dps3Covenant,
            soulbind: dps3.dps3Soulbind,
            legendary1: dps3.dps3Legendary1,
            legendary2: dps3.dps3Legendary2,
            specID: dps3.dps3,
          }}
          remove={() => {
            handleAddRole("dps3");
          }}
        />
      ) : null}

      {active < 5 ? (
        <AddSpecFilterButton
          onAdd={handleAddRole}
          hasTank={activeFilters.tank}
          hasHeal={activeFilters.heal}
          amountOfDps={
            (activeFilters.dps1 ? 1 : 0) +
            (activeFilters.dps2 ? 1 : 0) +
            (activeFilters.dps3 ? 1 : 0)
          }
        />
      ) : null}
    </>
  );
}

type SpecFilterProps = {
  type: keyof SpecFiltersState;
  data: {
    covenant: number | null;
    soulbind: number | null;
    legendary1: number | null;
    legendary2: number | null;
    specID: number | null;
  };
  remove: () => void;
};

function SpecFilter({ type, data, remove }: SpecFilterProps) {
  const { specID, soulbind, covenant, legendary1, legendary2 } = data;

  const handlePropertyChange = useRouteDiscovery(
    (state) => state.handlePropertyChange
  );

  const displayableType = type.includes("dps") ? type.slice(0, -1) : type;
  const availableSpecs = (
    displayableType === "dps"
      ? specIDsPerRole.dps
      : type === "heal"
      ? specIDsPerRole.heal
      : specIDsPerRole.tank
  )
    .map((id) => {
      const specData = specs.find((spec) => spec.id === id);

      if (!specData) {
        return null;
      }

      const className = classes[specData.classID].name;

      return {
        name: specData.name,
        className,
        id,
      };
    })
    .filter(
      (dataset): dataset is { name: SpecName; id: number; className: string } =>
        dataset !== null
    )
    .sort((a, b) => {
      if (a.className === b.className) {
        return a.name.localeCompare(b.name);
      }

      return a.className.localeCompare(b.className);
    });

  const availableLegendaries = Object.entries(legendariesBySpec)
    .filter(([, specIDs]) => {
      if (specID) {
        return specIDs.includes(specID);
      }

      return availableSpecs.some((spec) => specIDs.includes(spec.id));
    })
    .map(([id]) => {
      const idAsNumber = Number.parseInt(id);

      return {
        id: idAsNumber,
        name: legendaries[idAsNumber].name,
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="p-2 space-y-2 border-2 border-gray-200 border-dashed rounded-lg">
      <div className="flex space-x-4 lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-y-0 xl:space-x-4">
        <div className="flex flex-col w-1/2 md:w-full">
          <div className="flex justify-between">
            <span>Role</span>

            <b>
              {displayableType === "dps"
                ? "DPS"
                : `${displayableType
                    .slice(0, 1)
                    .toUpperCase()}${displayableType.slice(1)}`}
            </b>
          </div>

          <div className="flex justify-end w-full">
            <button
              type="button"
              onClick={() => {
                remove();
                handlePropertyChange(type, null);
                handlePropertyChange(`${type}Legendary1`, null);
                handlePropertyChange(`${type}Legendary2`, null);
                handlePropertyChange(`${type}Covenant`, null);
                handlePropertyChange(`${type}Soulbind`, null);
              }}
              aria-label="remove"
              className="px-2 text-white transition-all duration-200 bg-red-500 hover:bg-red-400 rounded-xl"
            >
              remove
            </button>
          </div>
        </div>

        <div className="flex flex-col w-1/2 md:w-full">
          <label htmlFor={`spec-selection-${type}`}>Spec</label>

          <select
            id={`spec-selection-${type}`}
            value={specID ? specID : -1}
            onChange={(event) => {
              try {
                const value = Number.parseInt(event.target.value);

                handlePropertyChange(type, value === -1 ? null : value);
              } catch {
                handlePropertyChange(type, null);
              }
            }}
            className="w-full border-2 border-solid dark:border-gray-600"
          >
            <option value={-1}>select spec</option>
            {Object.entries(
              // eslint-disable-next-line unicorn/prefer-object-from-entries
              availableSpecs.reduce<
                Record<string, { id: number; name: string }[]>
              >((acc, spec) => {
                const dataset = {
                  id: spec.id,
                  name: spec.name,
                };

                if (spec.className in acc) {
                  acc[spec.className].push(dataset);
                  return acc;
                }

                acc[spec.className] = [
                  {
                    id: spec.id,
                    name: spec.name,
                  },
                ];

                return acc;
              }, {})
            ).map(([className, specs]) => {
              return (
                <optgroup label={className} key={className}>
                  {specs.map((spec) => {
                    return (
                      <option key={spec.id} value={spec.id}>
                        {spec.name}
                      </option>
                    );
                  })}
                </optgroup>
              );
            })}
          </select>
        </div>
      </div>

      <div className="flex space-x-4 lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-y-0 xl:space-x-4">
        <div className="flex flex-col w-1/2 md:w-full">
          <label htmlFor={`covenant-selection-${type}`}>Covenant</label>

          <select
            id={`covenant-selection-${type}`}
            value={covenant ? covenant : -1}
            onChange={(event) => {
              try {
                const value = Number.parseInt(event.target.value);

                if (value === -1) {
                  handlePropertyChange(`${type}Covenant`, null);
                  return;
                }

                handlePropertyChange(`${type}Covenant`, value);

                if (soulbind && soulbinds[soulbind].covenantID !== value) {
                  handlePropertyChange(`${type}Soulbind`, null);
                }
              } catch {
                handlePropertyChange(`${type}Covenant`, null);
              }
            }}
            className="w-full border-2 border-solid dark:border-gray-600"
          >
            <option value={-1}>select covenant</option>
            {Object.entries(covenants)
              .sort((a, b) => a[1].name.localeCompare(b[1].name))
              .map(([id, { name }]) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="flex flex-col w-1/2 md:w-full">
          <label htmlFor={`soulbind-selection-${type}`}>Soulbind</label>

          <select
            id={`soulbind-selection-${type}`}
            value={soulbind ? soulbind : -1}
            onChange={(event) => {
              try {
                const value = Number.parseInt(event.target.value);

                if (value === -1) {
                  handlePropertyChange(`${type}Soulbind`, null);
                  return;
                }

                handlePropertyChange(`${type}Soulbind`, value);
                handlePropertyChange(
                  `${type}Covenant`,
                  soulbinds[value].covenantID
                );
              } catch {
                handlePropertyChange(`${type}Soulbind`, null);
              }
            }}
            className="w-full border-2 border-solid dark:border-gray-600"
          >
            <option value={-1}>select soulbind</option>

            {Object.entries(
              Object.entries(soulbinds)
                .filter((soulbind) => {
                  if (covenant) {
                    return soulbind[1].covenantID === covenant;
                  }

                  return true;
                })
                // eslint-disable-next-line unicorn/prefer-object-from-entries
                .reduce<Record<number, { id: number; name: string }[]>>(
                  (acc, [id, { covenantID, name }]) => {
                    const dataset = { id: Number.parseInt(id), name };

                    if (covenantID in acc) {
                      acc[covenantID].push(dataset);
                      return acc;
                    }

                    acc[covenantID] = [dataset];

                    return acc;
                  },
                  {}
                )
            ).map(([covenantID, soulbinds]) => {
              return (
                <optgroup
                  label={covenants[Number.parseInt(covenantID)].name}
                  key={covenantID}
                >
                  {soulbinds
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((soulbind) => {
                      return (
                        <option value={soulbind.id} key={soulbind.id}>
                          {soulbind.name}
                        </option>
                      );
                    })}
                </optgroup>
              );
            })}
          </select>
        </div>
      </div>

      <div className="flex space-x-4 lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-y-0 xl:space-x-4">
        <div className="flex flex-col w-1/2 md:w-full">
          <label htmlFor={`legendary1-selection-${type}`}>Legendary 1</label>

          <select
            id={`legendary1-selection-${type}`}
            value={legendary1 ? legendary1 : -1}
            onChange={(event) => {
              try {
                const value = Number.parseInt(event.target.value);

                if (value === -1) {
                  handlePropertyChange(`${type}Legendary1`, null);
                  return;
                }

                handlePropertyChange(`${type}Legendary1`, value);

                const specsPlayingThisLegendary = legendariesBySpec[value];

                if (specsPlayingThisLegendary.length === 1) {
                  handlePropertyChange(type, specsPlayingThisLegendary[0]);
                }
              } catch {
                handlePropertyChange(`${type}Legendary1`, null);
              }
            }}
            className="w-full border-2 border-solid dark:border-gray-600"
          >
            <option value={-1}>first legendary</option>
            {availableLegendaries
              .filter((legendary) => {
                if (!legendary2) {
                  return true;
                }

                return legendary.id !== legendary2;
              })
              .map((legendary) => {
                return (
                  <option key={legendary.id} value={legendary.id}>
                    {legendary.name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="flex flex-col w-1/2 md:w-full">
          <label htmlFor={`legendary2-selection-${type}`}>Legendary 2</label>

          <select
            id={`legendary2-selection-${type}`}
            value={legendary2 ? legendary2 : -1}
            onChange={(event) => {
              try {
                const value = Number.parseInt(event.target.value);

                handlePropertyChange(
                  `${type}Legendary2`,
                  value === -1 ? null : value
                );
              } catch {
                handlePropertyChange(`${type}Legendary2`, null);
              }
            }}
            className="w-full border-2 border-solid dark:border-gray-600"
          >
            <option value={-1}>second legendary</option>
            {availableLegendaries
              .filter((legendary) => {
                if (!legendary1) {
                  return true;
                }

                return legendary.id !== legendary1;
              })
              .map((legendary) => {
                return (
                  <option key={legendary.id} value={legendary.id}>
                    {legendary.name}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
    </div>
  );
}

type AddSpecFilterButtonProps = {
  onAdd: (role: keyof SpecFiltersState) => void;
  hasTank: boolean;
  hasHeal: boolean;
  amountOfDps: number;
};

function AddSpecFilterButton({
  onAdd,
  amountOfDps,
  hasHeal,
  hasTank,
}: AddSpecFilterButtonProps) {
  return (
    <div className="flex justify-center w-full p-4 space-x-8 transition-all duration-200 bg-gray-200 border-2 border-gray-700 border-dashed rounded-lg xl:space-x-4 dark:bg-gray-600 dark:hover:bg-gray-500">
      {hasTank ? null : (
        <button
          type="button"
          onClick={() => {
            onAdd("tank");
          }}
        >
          <img
            loading="lazy"
            alt="Tank"
            src="/static/roles/tank.png"
            className="w-12 h-12 grayscale hover:filter-none"
          />
        </button>
      )}
      {hasHeal ? null : (
        <button
          type="button"
          onClick={() => {
            onAdd("heal");
          }}
        >
          <img
            loading="lazy"
            alt="Heal"
            src="/static/roles/heal.png"
            className="w-12 h-12 grayscale hover:filter-none"
          />
        </button>
      )}
      {amountOfDps === 3 ? null : (
        <button
          type="button"
          onClick={() => {
            onAdd(
              amountOfDps === 0 ? "dps1" : amountOfDps === 1 ? "dps2" : "dps3"
            );
          }}
        >
          <img
            loading="lazy"
            alt="DPS"
            src="/static/roles/dps.png"
            className="w-12 h-12 grayscale hover:filter-none"
          />
        </button>
      )}
    </div>
  );
}
