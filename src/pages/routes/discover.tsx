/* eslint-disable sonarjs/no-identical-functions */
import type { SpecName } from "@prisma/client";
import Link from "next/link";
import type { FormEventHandler } from "react";
import { useRef, useCallback, useState, useEffect } from "react";

import type { PublicDiscoveryResponse } from "../../api/functions/discovery";
import { dungeonMap } from "../../db/data/dungeons";
import { specs } from "../../db/data/specs";
import { Affixes } from "../../web/components/Affixes";
import { ExternalLink } from "../../web/components/ExternalLink";
import { Seo } from "../../web/components/Seo";
import { SpecIcon } from "../../web/components/SpecIcon";
import { MIN_KEYSTONE_LEVEL } from "../../web/env";
import { useAbortableFetch } from "../../web/hooks/useAbortableFetch";
import { star } from "../../web/icons";
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
import type {
  LivingDiscoveryQueryParams,
  RouteDiscovery,
} from "../../web/store";
import { useRouteDiscovery } from "../../web/store";
import {
  bgPrimary,
  bgSecondary,
  greenText,
  hoverShadow,
  widthConstraint,
  yellowText,
} from "../../web/styles/tokens";
import { createWCLUrl, timeDurationToString } from "../../web/utils";
import { getClassAndSpecName } from "../../web/utils/player";

const discoverySelector = ({
  restoreFromUrl,
  persistToUrl,
}: RouteDiscovery) => {
  return {
    persistToUrl,
    restoreFromUrl,
  };
};

export default function Discover(): JSX.Element {
  const [url, setUrl] = useState<string | null>(null);
  const [data, loading] = useAbortableFetch<PublicDiscoveryResponse>({
    url,
    initialState: [],
  });
  const resultsContainerRef = useRef<HTMLDivElement | null>(null);

  const { persistToUrl, restoreFromUrl } = useRouteDiscovery(discoverySelector);

  const handleReset = () => {
    setUrl(null);
  };

  useEffect(() => {
    if (resultsContainerRef.current && (data.length > 0 || loading)) {
      try {
        const currentScrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const containerPosition = resultsContainerRef.current.offsetTop;

        if (currentScrollPosition + windowHeight < containerPosition) {
          resultsContainerRef.current.scrollIntoView({ behavior: "smooth" });
        }
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }, [data, loading]);

  const handleSubmit = useCallback(
    (query: LivingDiscoveryQueryParams) => {
      try {
        const sanitized = Object.fromEntries(
          Object.entries(query)
            .filter((arr): arr is [string, number] => arr[1] !== null)
            .map(([key, value]) => [key, `${value}`])
        );

        persistToUrl(sanitized);

        setUrl(`/api/discovery?${new URLSearchParams(sanitized).toString()}`);
        // eslint-disable-next-line no-empty
      } catch {}
    },
    [persistToUrl]
  );

  useEffect(() => {
    const restored = restoreFromUrl();

    if (restored) {
      handleSubmit(restored);
    }
  }, [restoreFromUrl, handleSubmit]);

  return (
    <>
      <Seo
        title="Route Discovery"
        description="Explore previously imported Mythic+ Logs based on custom filters tailored to your group."
      />

      <div className={`${widthConstraint} py-6`}>
        <div className="flex flex-col mx-auto space-x-0 lg:flex-row max-w-screen-2xl lg:space-x-4">
          <div
            className={`flex-1 rounded-b-lg ${hoverShadow} lg:w-2/6 lg:max-w-1/3`}
          >
            <div className={`p-4 rounded-t-lg ${bgSecondary}`}>
              <h1 className="text-3xl font-bold">Route Discovery</h1>
            </div>
            <div className={`h-auto p-4 rounded-b-lg ${bgPrimary}`}>
              <Form
                onSubmit={handleSubmit}
                onReset={handleReset}
                loading={loading}
              />

              <details
                className={`rounded-lg ${bgSecondary} p-2 mt-4 cursor-pointer`}
              >
                <summary>FAQ</summary>

                <ul className="cursor-default">
                  <li>A maximum of 25 results will be shown.</li>
                  <li>Results are ordered by level, then by speed.</li>
                  <li>
                    Runs must be timed and imported on KSH to appear here.
                  </li>
                  <li>
                    Secondary legendaries will only work once people actually
                    obtained them.
                  </li>
                </ul>
              </details>
            </div>
          </div>

          <div
            className="flex flex-col flex-1 w-full h-auto max-w-screen-xl pt-4 lg:w-4/6 lg:pt-0"
            ref={resultsContainerRef}
          >
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
  data: PublicDiscoveryResponse;
  loading: boolean;
};

function DiscoveryResults({ data, loading }: DiscoveryResultsProps) {
  return (
    <div
      className={`p-2 rounded-b-lg ${bgPrimary} ${hoverShadow} space-y-4 lg:space-y-2 h-full`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div>
            <style jsx>
              {`
                .rotate-y-180 {
                  transform: rotateY(180deg);
                }
              `}
            </style>
            <img
              src="/static/bear/orb.gif"
              height="256"
              width="256"
              alt="Loading"
              loading="lazy"
              className="rotate-y-180"
            />
          </div>

          <p className="px-2 mt-2 text-center">processing your query...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div>
            <img
              src="/static/bear/shrug.png"
              height="256"
              width="256"
              alt="Loading"
              loading="lazy"
            />
          </div>

          <p className="px-2 mt-2 text-center">
            no results (yet?)
            <br />
            consider importing some from{" "}
            <ExternalLink
              className="underline"
              href="https://www.warcraftlogs.com/zone/rankings/30#leaderboards=1"
            >
              Warcraft Logs
            </ExternalLink>
          </p>
        </div>
      ) : (
        data.map((dataset) => {
          const dungeon = dungeonMap[dataset.dungeonID];

          return (
            <div
              key={`${dataset.report}-${dataset.fightID}`}
              className={`bg-maincolor bg-cover rounded-md bg-${dungeon.slug.toLowerCase()} bg-blend-multiply hover:bg-blend-soft-light px-4 py-6 hover:-translate-y-1 transition-transform duration-200`}
            >
              <div className="flex items-center justify-between pb-4">
                <Link href={`/report/${dataset.report}/${dataset.fightID}`}>
                  <a>
                    <h2 className="text-xl font-extrabold">
                      <span className="hidden underline lg:inline">
                        {dungeon.name}
                      </span>
                      <span className="inline underline lg:hidden">
                        {dungeon.slug}
                      </span>
                      <span className="pl-2">+{dataset.keystoneLevel}</span>
                      <sup className="hidden pl-2 space-x-1 sm:inline">
                        {Array.from({ length: dataset.chests }, (_, index) => (
                          <svg
                            key={index}
                            className={`inline w-4 h-4 ${yellowText} fill-current`}
                          >
                            <use href={`#${star.id}`} />
                          </svg>
                        ))}
                      </sup>
                    </h2>
                  </a>
                </Link>

                <div>
                  <Affixes ids={dataset.affixes} iconSize={32} />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="space-x-2">
                  <TimeInformation
                    dungeonTimer={dungeon.timer[0]}
                    keystoneTime={dataset.keystoneTime}
                    chests={dataset.chests}
                  />
                  <span> | </span>
                  <span>{dataset.percent.toFixed(2)}%</span>
                </div>

                <div>
                  <ExternalLink
                    href={createWCLUrl({
                      reportID: dataset.report,
                      fightID: `${dataset.fightID}`,
                    })}
                  >
                    <img
                      src="/static/icons/wcl.png"
                      alt="See on Warcraft Logs"
                      title="See on Warcraft Logs"
                      className="w-6 h-6"
                      width={24}
                      height={24}
                      loading="lazy"
                    />
                  </ExternalLink>
                </div>
              </div>

              <div className="flex justify-center w-full pt-4 space-x-2">
                {dataset.player.map((player, index) => {
                  const { className, colors, specName } = getClassAndSpecName({
                    spec: player.specID,
                    class: player.classID,
                  });

                  return (
                    <div
                      className="w-8 h-8"
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${player.classID}-${player.specID}-${index}`}
                    >
                      <SpecIcon
                        class={className}
                        spec={specName}
                        className={`${colors.border} border-2`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center w-full pt-4 space-x-2">
                <span>
                  DPS{" "}
                  <span className="italic font-bold">
                    {dataset.dps.toLocaleString("en-US")}
                  </span>
                </span>
                <span>
                  HPS{" "}
                  <span className="italic font-bold">
                    {dataset.hps.toLocaleString("en-US")}
                  </span>
                </span>
              </div>

              <div className="flex justify-center w-full space-x-2">
                <span>
                  Deaths{" "}
                  <span className="italic font-bold">
                    {dataset.totalDeaths.toLocaleString("en-US")}
                  </span>
                </span>

                <span>
                  Ø{" "}
                  <span className="italic font-bold">
                    {dataset.averageItemLevel.toLocaleString("en-US")}
                  </span>
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

type TimeInformationProps = {
  keystoneTime: number;
  dungeonTimer: number;
  chests: number;
};

function TimeInformation({
  dungeonTimer,
  keystoneTime,
  chests,
}: TimeInformationProps) {
  return (
    <span>
      <span className="space-x-2">
        <span>{timeDurationToString(keystoneTime)}</span>
        <span
          className={`italic ${greenText}`}
          title={`${chests} chest${chests > 1 ? "s" : ""}`}
        >
          {timeDurationToString(dungeonTimer - keystoneTime)}
        </span>
      </span>
    </span>
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
          <div className="flex flex-col w-1/3 lg:w-full xl:w-1/3">
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
              className="w-full px-1 border-2 border-solid dark:border-gray-600"
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

          <div className="flex flex-row w-2/3 space-x-2 lg:w-full xl:w-2/3 lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-x-4 xl:space-y-0">
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
                  className="w-full px-1 border-2 border-solid dark:border-gray-600"
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
                  className="w-full px-1 border-2 border-solid dark:border-gray-600"
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
          <div className="flex flex-col w-1/3 lg:w-full xl:w-1/3">
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
              className="w-full px-1 border-2 border-solid dark:border-gray-600"
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

          <div className="flex flex-row w-2/3 space-x-2 xl:w-2/3 lg:w-full lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-x-4 xl:space-y-0">
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
                  className="w-full px-1 border-2 border-solid dark:border-gray-600"
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
                  className="w-full px-1 border-2 border-solid dark:border-gray-600"
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
                className="w-full px-1 border-2 border-solid dark:border-gray-600"
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
                className="w-full px-1 border-2 border-solid dark:border-gray-600"
                value={maxDeaths === null ? "" : maxDeaths}
                onChange={(event) => {
                  try {
                    const value = Number.parseInt(event.target.value);

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

        <div className="mt-4">
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

  useEffect(() => {
    setActiveFilters((prev) => {
      return {
        tank: prev.tank ? prev.tank : tank.tank !== null,
        heal: prev.heal ? prev.heal : heal.heal !== null,
        dps1: prev.dps1 ? prev.dps1 : dps1.dps1 !== null,
        dps2: prev.dps2 ? prev.dps2 : dps2.dps2 !== null,
        dps3: prev.dps3 ? prev.dps3 : dps3.dps3 !== null,
      };
    });
  }, [dps1, dps2, dps3, heal, tank]);

  const handleAddRole = (role: keyof SpecFiltersState) => {
    setActiveFilters((prev) => {
      return {
        ...prev,
        [role]: !prev[role],
      };
    });
  };

  const active = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div>
      <p className="pb-2">Spec Filter</p>

      <div className="space-y-4">
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
      </div>
    </div>
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
            className="w-full px-1 border-2 border-solid dark:border-gray-600"
          >
            <option value={-1}>select spec</option>
            {Object.entries(
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

        <div className="flex flex-col w-1/2 md:w-full">
          <div className="flex flex-col items-end w-full">
            <div className="flex space-x-2">
              <b>
                {displayableType === "dps"
                  ? "DPS"
                  : `${displayableType
                      .slice(0, 1)
                      .toUpperCase()}${displayableType.slice(1)}`}
              </b>

              <img
                src={`/static/roles/${displayableType}.png`}
                width="20"
                height="20"
                className="w-5 h-5"
                alt=""
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  remove();

                  handlePropertyChange({
                    [type]: null,
                    [`${type}Legendary1`]: null,
                    [`${type}Legendary2`]: null,
                    [`${type}Covenant`]: null,
                    [`${type}Soulbind`]: null,
                  });
                }}
                aria-label="remove"
                className="px-2 text-white transition-all duration-200 bg-red-500 hover:bg-red-400 rounded-xl"
              >
                remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <details>
        <summary className="cursor-pointer">more</summary>

        <div className="flex space-x-4 lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-y-0 xl:space-x-4">
          <div className="flex flex-col w-1/2 md:w-full">
            <label htmlFor={`covenant-selection-${type}`}>Covenant</label>

            <select
              id={`covenant-selection-${type}`}
              value={covenant ? covenant : -1}
              onChange={(event) => {
                const key = `${type}Covenant`;

                try {
                  const value = Number.parseInt(event.target.value);

                  if (value === -1) {
                    handlePropertyChange(key, null);
                    return;
                  }

                  const next: Record<string, null | number> = {
                    [key]: value,
                  };

                  if (soulbind && soulbinds[soulbind].covenantID !== value) {
                    next[`${type}Soulbind`] = null;
                  }

                  handlePropertyChange(next);
                } catch {
                  handlePropertyChange(key, null);
                }
              }}
              className="w-full px-1 border-2 border-solid dark:border-gray-600"
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
                const key = `${type}Soulbind`;
                try {
                  const value = Number.parseInt(event.target.value);

                  if (value === -1) {
                    handlePropertyChange(key, null);
                    return;
                  }

                  handlePropertyChange({
                    [key]: value,
                    [`${type}Covenant`]: soulbinds[value].covenantID,
                  });
                } catch {
                  handlePropertyChange(key, null);
                }
              }}
              className="w-full px-1 border-2 border-solid dark:border-gray-600"
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
                const key = `${type}Legendary1`;
                try {
                  const value = Number.parseInt(event.target.value);

                  if (value === -1) {
                    handlePropertyChange(key, null);
                    return;
                  }

                  const next: Record<string, null | number> = {
                    [key]: value,
                  };

                  const specsPlayingThisLegendary = legendariesBySpec[value];

                  if (specsPlayingThisLegendary.length === 1) {
                    // eslint-disable-next-line prefer-destructuring
                    next[type] = specsPlayingThisLegendary[0];
                  }

                  handlePropertyChange(next);
                } catch {
                  handlePropertyChange(key, null);
                }
              }}
              className="w-full px-1 border-2 border-solid dark:border-gray-600"
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
                const key = `${type}Legendary2`;

                try {
                  const value = Number.parseInt(event.target.value);

                  handlePropertyChange(key, value === -1 ? null : value);
                } catch {
                  handlePropertyChange(key, null);
                }
              }}
              className="w-full px-1 border-2 border-solid dark:border-gray-600"
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
      </details>
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
    <div
      className="flex justify-center w-full p-4 space-x-8 transition-all duration-200 bg-gray-200 border-2 border-gray-700 border-dashed rounded-lg xl:space-x-4 dark:bg-gray-600 dark:hover:bg-gray-500"
      title="Click an icon to add a role to filter for."
    >
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
            width={48}
            height={48}
            title="Tank"
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
            width={48}
            height={48}
            title="Heal"
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
            width={48}
            height={48}
            title="DPS"
          />
        </button>
      )}
    </div>
  );
}
