import type { FormEventHandler } from "react";
import { useState } from "react";

import type { DiscoveryResponse } from "../../api/functions/discovery";
import { Seo } from "../../web/components/Seo";
import { useAbortableFetch } from "../../web/hooks/useAbortableFetch";
import { dungeons, weeks } from "../../web/staticData";
import type { LivingDiscoveryQueryParams } from "../../web/store";
import { useRouteDiscovery } from "../../web/store";
import {
  bgPrimary,
  bgSecondary,
  hoverShadow,
  widthConstraint,
} from "../../web/styles/tokens";

// export type DiscoverProps = {
//   dungeons: (Pick<typeof dungeons[keyof typeof dungeons], "slug" | "name"> & {
//     id: number;
//   })[];
//   specs: {
//     tank: number[];
//     heal: number[];
//     dps: number[];
//   };
//   weeks: { ids: [number, number, number]; name: string }[];
//   legendaries: Record<number, number[]>;
// };

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

      if (sanitized.dungeonID === "-1") {
        setUrl(null);
        return;
      }

      setUrl(`/api/discovery?${new URLSearchParams(sanitized).toString()}`);
    } catch {}
  };

  return (
    <>
      <Seo title="Route Discovery" />

      <div className={`${widthConstraint} py-6`}>
        <div className="flex flex-col mx-auto space-x-0 lg:flex-row max-w-screen-2xl lg:space-x-4">
          <div className={`"flex-1 rounded-b-lg ${hoverShadow}`}>
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
            <div className={`p-2 rounded-b-lg ${bgPrimary} ${hoverShadow}`}>
              {data.map((dataset) => (
                <div key={`${dataset.report}-${dataset.fightID}`}>
                  {dataset.report}-{dataset.fightID}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
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
    maxItemLevel,
    minItemLevel,
    keyLevel,
    seasonAffix,
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
      maxItemLevel,
      keyLevel,
      minItemLevel,
      seasonAffix,
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
            <label htmlFor="dungeon-selection" title="required">
              Dungeon<sup className="text-red-500">*</sup>
            </label>

            <select
              id="dungeon-selection"
              required
              value={dungeonID}
              onChange={(event) => {
                try {
                  const value = Number.parseInt(event.target.value);
                  handlePropertyChange("dungeonID", value);
                } catch {
                  handlePropertyChange("dungeonID", -1);
                }
              }}
              className="w-full"
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

          <div className="flex flex-col w-1/2 md:w-full">
            <label htmlFor="key-level">Key Level</label>

            <div>
              <input
                type="number"
                name="keyLevel"
                min="10"
                max="40"
                step="1"
                id="key-level"
                aria-label="Key Level"
                placeholder="Key Level"
                className="w-full"
                value={keyLevel ? keyLevel : ""}
                onChange={(event) => {
                  try {
                    const value = Number.parseInt(event.target.value);

                    handlePropertyChange(
                      "keyLevel",
                      Number.isNaN(value) ? null : value
                    );
                  } catch {
                    handlePropertyChange("keyLevel", null);
                  }
                }}
              />
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
              className="w-full"
            >
              <option value={-1}>select week</option>
              {[...weeks]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((week) => {
                  const key = week.ids.join("-");

                  return (
                    <option key={key} value={key}>
                      {week.name}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="flex flex-row w-1/2 space-x-2 lg:w-full lg:flex-col lg:space-x-0 lg:space-y-2 xl:flex-row xl:space-x-4 xl:space-y-0">
            <div className="w-1/2 lg:w-full xl:w-1/2">
              <label htmlFor="min-item-level">Min ILVL</label>

              <div>
                <input
                  type="number"
                  name="minItemlevel"
                  min="180"
                  max="300"
                  step="1"
                  id="min-item-level"
                  aria-label="Min ILVL"
                  placeholder="Min ILVL"
                  className="w-full"
                  value={minItemLevel ? minItemLevel : ""}
                  onChange={(event) => {
                    try {
                      const value = Number.parseInt(event.target.value);

                      handlePropertyChange(
                        "minItemLevel",
                        Number.isNaN(value) ? null : value
                      );
                    } catch {
                      handlePropertyChange("minItemLevel", null);
                    }
                  }}
                />
              </div>
            </div>

            <div className="w-1/2 lg:w-full xl:w-1/2">
              <label htmlFor="max-item-level">Max ILVL</label>

              <div>
                <input
                  type="number"
                  name="maxItemlevel"
                  min="180"
                  max="300"
                  step="1"
                  id="max-item-level"
                  aria-label="Max ILVL"
                  placeholder="Max ILVL"
                  className="w-full"
                  value={maxItemLevel ? maxItemLevel : ""}
                  onChange={(event) => {
                    try {
                      const value = Number.parseInt(event.target.value);

                      handlePropertyChange(
                        "maxItemLevel",
                        Number.isNaN(value) ? null : value
                      );
                    } catch {
                      handlePropertyChange("maxItemLevel", null);
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
                id="max-percent"
                aria-label="Max Percent"
                placeholder="Max Percent"
                className="w-full"
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
                id="max-deaths"
                aria-label="Max Deaths"
                placeholder="Max Deaths"
                className="w-full"
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

        <div className="flex justify-between w-full pt-4">
          <button
            className="px-4 font-medium text-center text-white transition-all duration-200 ease-in-out bg-red-500 rounded-lg outline-none dark:hover:bg-red-600 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:bg-red-600 dark:focus:ring-red-300"
            type="reset"
            onClick={handleReset}
          >
            reset
          </button>

          <button
            className="px-4 font-medium text-center text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-lg outline-none dark:hover:bg-blue-500 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-blue-500 dark:focus:ring-blue-300"
            type="submit"
            onClick={(event) => {
              if (dungeonID === -1) {
                event.preventDefault();
                // eslint-disable-next-line no-alert
                alert(`Please select a dungeon first.`);
              }
            }}
          >
            submit
          </button>
        </div>
      </fieldset>
    </form>
  );
}
