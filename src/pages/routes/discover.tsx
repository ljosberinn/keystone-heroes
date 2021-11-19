import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { dungeons as allDungeons } from "../../db/data/dungeons";
import { prisma } from "../../db/prisma";
import { MIN_KEYSTONE_LEVEL } from "../../web/env";

type DiscoverProps = {
  dungeons: { name: string; slug: string; id: number }[];
  itemLevelBrackets: { from: number; to: number }[];
  keyLevels: number[];
};

export const url = "/routes/discover";

export const defaultQueryParams = {
  itemLevelBracket: "any",
  level: 15,
};

export default function Discover({
  dungeons,
  itemLevelBrackets,
  keyLevels,
}: DiscoverProps): JSX.Element {
  const { push, query } = useRouter();

  useEffect(() => {
    if (Object.keys(query).length === 0) {
      // eslint-disable-next-line no-void
      void push({
        pathname: url,
        query: defaultQueryParams,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shallowRoute = (
    key: string,
    value: string | number,
    unset?: boolean
  ) => {
    const nextQuery = {
      ...query,
      [key]: value,
    };

    if (unset && key in nextQuery) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete nextQuery[key];
    }

    // eslint-disable-next-line no-void
    void push(
      {
        pathname: url,
        query: nextQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div>
      <div>
        {dungeons.map((dungeon) => {
          return (
            <div
              key={dungeon.slug}
              className={`bg-${dungeon.slug} p-4 bg-cover bg-no-repeat`}
            >
              <style jsx>
                {`
                  .bg-${dungeon.slug} {
                    background-image: url(/static/dungeons/${dungeon.slug}.jpg);
                  }
                `}
              </style>
              <input
                type="checkbox"
                checked={query.dungeon === dungeon.slug}
                onChange={() => {
                  shallowRoute(
                    "dungeon",
                    dungeon.slug,
                    query.dungeon === dungeon.slug
                  );
                }}
                id={dungeon.slug}
                aria-labelledby={`label-${dungeon.slug}`}
              />{" "}
              <label id={`label-${dungeon.slug}`} htmlFor={dungeon.slug}>
                {dungeon.name}
              </label>
            </div>
          );
        })}
      </div>

      <hr />

      <div>
        {keyLevels.map((keyLevel) => {
          return (
            <div key={keyLevel}>
              <input
                type="checkbox"
                checked={query.level === `${keyLevel}`}
                onChange={() => {
                  shallowRoute("level", keyLevel);
                }}
                id={`level-${keyLevel}`}
                aria-labelledby={`label-${keyLevel}`}
              />{" "}
              <label id={`label-${keyLevel}`} htmlFor={`level-${keyLevel}`}>
                {keyLevel}
              </label>
            </div>
          );
        })}
      </div>

      <hr />

      <div>
        <div>
          <input
            type="checkbox"
            checked={query.itemLevelBracket === "any"}
            onChange={() => {
              shallowRoute("itemLevelBracket", "any");
            }}
            id="bracket-any"
            aria-labelledby="label-bracket-any"
          />{" "}
          <label htmlFor="bracket-any" id="label-bracket-any">
            any
          </label>
        </div>
        {itemLevelBrackets.map((bracket) => {
          return (
            <div key={bracket.from}>
              <input
                type="checkbox"
                checked={
                  query.itemLevelBracket !== "any" &&
                  query.itemLevelBracket === `${bracket.from}`
                }
                onChange={() => {
                  shallowRoute("itemLevelBracket", bracket.from);
                }}
                id={`bracket-${bracket.from}`}
                aria-labelledby={`label-${bracket.from}`}
              />{" "}
              <label
                id={`label-${bracket.from}`}
                htmlFor={`bracket-${bracket.from}`}
              >
                {bracket.from} - {bracket.to}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<DiscoverProps> = async () => {
  const dungeons = allDungeons.map((dungeon) => {
    return {
      name: dungeon.name,
      slug: dungeon.slug.toLowerCase(),
      id: dungeon.id,
    };
  });

  const min = await prisma.fight.findFirst({
    take: 1,
    orderBy: {
      averageItemLevel: "asc",
    },
    select: {
      averageItemLevel: true,
    },
  });

  const max = await prisma.fight.findFirst({
    take: 1,
    orderBy: {
      averageItemLevel: "desc",
    },
    select: {
      averageItemLevel: true,
    },
  });

  const itemLevelBrackets =
    min && max
      ? createItemlevelBrackets(min.averageItemLevel, max.averageItemLevel)
      : [];

  const maxKeyLevel = await prisma.fight.findFirst({
    take: 1,
    orderBy: {
      keystoneLevel: "desc",
    },
    select: {
      keystoneLevel: true,
    },
  });

  const keyLevels = maxKeyLevel
    ? Array.from({
        length: maxKeyLevel.keystoneLevel - (MIN_KEYSTONE_LEVEL - 1),
      }).map((_, index) => MIN_KEYSTONE_LEVEL + index)
    : [];

  return {
    props: {
      dungeons,
      itemLevelBrackets,
      keyLevels,
    },
    revalidate: 24 * 60 * 60,
  };
};

const createItemlevelBrackets = (min: number, max: number) => {
  const nearestMultipleOf5Min = 5 * Math.ceil(Math.abs(min / 5));
  const nearestMultipleOf5Max = 5 * Math.ceil(Math.abs(max / 5));

  return Array.from({
    length: (nearestMultipleOf5Max - nearestMultipleOf5Min) / 5,
  }).reduce<{ from: number; to: number }[]>((acc, _, index) => {
    return [
      ...acc,
      {
        from: nearestMultipleOf5Min + 5 * index,
        to: nearestMultipleOf5Min + 5 * index + 5,
      },
    ];
  }, []);
};
