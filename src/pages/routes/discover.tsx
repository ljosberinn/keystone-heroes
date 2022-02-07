import type { Affix } from "@prisma/client";
import type { GetStaticProps } from "next";
import type { FormEventHandler } from "react";
import { useState } from "react";

import type { DiscoveryResponse } from "../../api/functions/discovery";
import { affixMap } from "../../db/data/affixes";
import { prisma } from "../../db/prisma";
import { Seo } from "../../web/components/Seo";
import { useAbortableFetch } from "../../web/hooks/useAbortableFetch";
import { affixes as staticAffixMap, dungeons } from "../../web/staticData";
import type { LivingDiscoveryQueryParams } from "../../web/store";
import { useRouteDiscovery } from "../../web/store";
import { widthConstraint } from "../../web/styles/tokens";
import { classnames } from "../../web/utils/classnames";

type DiscoverProps = {
  dungeons: (Pick<typeof dungeons[keyof typeof dungeons], "slug" | "name"> & {
    id: number;
  })[];
  specs: {
    tank: number[];
    heal: number[];
    dps: number[];
  };
  affixes: (Pick<Affix, "id"> & { level: 2 | 4 | 7 | 10 })[];
  weeks: [number, number, number, number][];
  legendaries: Record<number, number[]>;
};

export default function Discover({
  dungeons,
  specs,
  affixes,
  weeks,
  legendaries,
}: DiscoverProps): JSX.Element {
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

      <div className={classnames(widthConstraint, "flex")}>
        <Form
          onSubmit={handleSubmit}
          onReset={handleReset}
          dungeons={dungeons}
          affixes={affixes}
          specs={specs}
          loading={loading}
          legendaries={legendaries}
          weeks={weeks}
        />

        <div>
          {data.map((dataset) => `${dataset.report}-${dataset.fightID}`)}
        </div>
      </div>
    </>
  );
}

type FormProps = {
  onSubmit: (query: LivingDiscoveryQueryParams) => void;
  onReset: () => void;
  loading: boolean;
} & DiscoverProps;

function Form({
  onSubmit,
  onReset,
  dungeons,
  loading,
  affixes,
  // specs,
  weeks,
}: FormProps) {
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
    maxKeyLevel,
    minItemLevel,
    minKeyLevel,
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
      maxKeyLevel,
      minItemLevel,
      minKeyLevel,
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
    });
  };

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        {affixes
          .filter((affix) => affix.level === 2)
          .map((affix) => {
            const { name } = staticAffixMap[affix.id];

            return (
              <label key={affix.id}>
                <input
                  name="affix1"
                  type="radio"
                  onChange={(event) => {
                    handlePropertyChange(
                      "affix1",
                      event.target.checked ? affix.id : null
                    );
                  }}
                  checked={affix1 === affix.id}
                />{" "}
                {name}
              </label>
            );
          })}
        <hr />
        {affixes
          .filter((affix) => affix.level === 4)
          .map((affix) => {
            const { name } = staticAffixMap[affix.id];
            const disabled = affix1
              ? !weeks.some((week) => {
                  return week[0] === affix1 && week[1] === affix.id;
                })
              : false;

            return (
              <label key={affix.id}>
                <input
                  name="affix2"
                  type="radio"
                  disabled={disabled}
                  onChange={(event) => {
                    handlePropertyChange(
                      "affix2",
                      event.target.checked ? affix.id : null
                    );
                  }}
                  checked={affix2 === affix.id}
                />{" "}
                {name}
              </label>
            );
          })}
        <hr />
        {affixes
          .filter((affix) => affix.level === 7)
          .map((affix) => {
            const { name } = staticAffixMap[affix.id];

            const disabled =
              affix1 || affix2
                ? !weeks.some((week) => {
                    if (affix1 && affix2) {
                      return (
                        week[0] === affix1 &&
                        week[1] === affix2 &&
                        week[2] === affix.id
                      );
                    }

                    if (affix1 && !affix2) {
                      return week[0] === affix1 && week[2] === affix.id;
                    }

                    if (!affix1 && affix2) {
                      return week[1] === affix2 && week[2] === affix.id;
                    }

                    return false;
                  })
                : false;

            return (
              <label key={affix.id}>
                <input
                  name="affix3"
                  type="radio"
                  disabled={disabled}
                  onChange={(event) => {
                    handlePropertyChange(
                      "affix3",
                      event.target.checked ? affix.id : null
                    );
                  }}
                  checked={affix3 === affix.id}
                />{" "}
                {name}
              </label>
            );
          })}
        <hr />
        {affixes
          .filter((affix) => affix.level === 10)
          .map((affix) => {
            const { name } = staticAffixMap[affix.id];

            return (
              <label key={affix.id}>
                <input
                  name="affix4"
                  type="radio"
                  onChange={(event) => {
                    handlePropertyChange(
                      "seasonAffix",
                      event.target.checked ? affix.id : null
                    );
                  }}
                  checked={seasonAffix === affix.id}
                />{" "}
                {name}
              </label>
            );
          })}

        <hr />
        <select
          value={dungeonID}
          onChange={(event) => {
            try {
              const value = Number.parseInt(event.target.value);
              handlePropertyChange("dungeonID", value);
            } catch {}
          }}
        >
          <option value={-1}>select dungeon</option>
          {dungeons.map((dungeon) => {
            return (
              <option key={dungeon.id} value={dungeon.id}>
                {dungeon.name}
              </option>
            );
          })}
        </select>

        <div>
          <button type="submit" disabled={dungeonID === -1}>
            submit
          </button>
          <button type="reset" onClick={handleReset}>
            reset
          </button>
        </div>
      </fieldset>
    </form>
  );
}

export const getStaticProps: GetStaticProps<DiscoverProps> = async () => {
  const specs = await prisma.spec.findMany({
    select: {
      role: true,
      id: true,
    },
  });

  const currentSeason = await prisma.season.findFirst({
    select: {
      affixID: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  if (!currentSeason) {
    throw new Error(`missing season`);
  }

  const affixes: DiscoverProps["affixes"] = Object.entries(affixMap)
    .map(([key, data]) => {
      return {
        id: Number.parseFloat(key),
        level: data.level,
      };
    })
    .filter((affix) => {
      if (affix.level !== 10) {
        return true;
      }

      return affix.id === currentSeason.affixID;
    });

  const rawWeeks = await prisma.week.findMany({
    select: {
      affix1ID: true,
      affix2ID: true,
      affix3ID: true,
      season: {
        select: {
          affixID: true,
        },
      },
    },
    where: {
      season: {
        affixID: currentSeason.affixID,
      },
    },
  });

  const weeks = rawWeeks.map<[number, number, number, number]>((week) => {
    return [week.affix1ID, week.affix2ID, week.affix3ID, week.season.affixID];
  });

  const rawLegendaries = await prisma.legendary.findMany({
    select: {
      id: true,
      PlayerLegendary: {
        select: {
          player: {
            select: {
              specID: true,
            },
          },
        },
      },
    },
  });

  // eslint-disable-next-line unicorn/prefer-object-from-entries
  const legendaries = rawLegendaries.reduce<DiscoverProps["legendaries"]>(
    (acc, legendary) => {
      if (legendary.PlayerLegendary.length === 0) {
        return acc;
      }

      if (!(legendary.id in acc)) {
        acc[legendary.id] = [];
      }

      legendary.PlayerLegendary.forEach((playerLegendary) => {
        if (!acc[legendary.id].includes(playerLegendary.player.specID)) {
          acc[legendary.id].push(playerLegendary.player.specID);
        }
      });

      return acc;
    },
    {}
  );

  return {
    props: {
      dungeons: Object.entries(dungeons).map(([id, data]) => {
        return {
          id: Number.parseInt(id),
          name: data.name,
          slug: data.slug,
        };
      }),
      specs: {
        dps: specs.filter((spec) => spec.role === "dps").map((spec) => spec.id),
        heal: specs
          .filter((spec) => spec.role === "healer")
          .map((spec) => spec.id),
        tank: specs
          .filter((spec) => spec.role === "tank")
          .map((spec) => spec.id),
      },
      affixes,
      weeks,
      legendaries,
    },
    revalidate: 24 * 60 * 60,
  };
};
