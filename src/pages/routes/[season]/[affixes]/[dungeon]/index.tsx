import type { Affix, Dungeon as DungeonType, Season } from "@prisma/client";
import type { GetStaticPaths, GetStaticProps } from "next";

import {
  affixes as allAffixes,
  getAffixById,
} from "../../../../../../prisma/affixes";
import { dungeonMap, dungeons } from "../../../../../../prisma/dungeons";
import { expansions } from "../../../../../../prisma/expansions";
import { seasons } from "../../../../../../prisma/seasons";
import { weeks as allWeeks } from "../../../../../../prisma/weeks";

type DungeonProps = {
  dungeon: DungeonType;
  season: Omit<Season, "startTime" | "endTime" | "affixId" | "expansionId">;
  affixes: Affix[];
};

export default function Dungeon({
  dungeon,
  season,
  affixes,
}: DungeonProps): JSX.Element {
  return (
    <>
      <h1>{season.name}</h1>

      <h2>Current Affixes</h2>
      {affixes.map((affix) => {
        return <div key={affix.id}>{affix.name}</div>;
      })}

      <h2>Dungeon</h2>
      {dungeon.name}
    </>
  );
}

type StaticParams = {
  dungeon: string;
  season: string;
  affixes: string;
};

export const getStaticPaths: GetStaticPaths<StaticParams> = async () => {
  const paths = seasons.flatMap((season) => {
    const weeks = allWeeks.filter((week) => week.seasonId === season.seasonId);

    return weeks.flatMap((week) => {
      const affixSlug = [
        getAffixById(week.affix1Id),
        getAffixById(week.affix2Id),
        getAffixById(week.affix3Id),
        getAffixById(season.affixId),
      ]
        .map((affix) => affix.name.toLowerCase())
        .join("-");

      return expansions.flatMap((expansion) => {
        return expansion.dungeonIds.map((id) => {
          const dungeon = dungeonMap[id];

          if (!dungeon) {
            throw new Error("unknown dungeon id");
          }

          return {
            params: {
              affixes: affixSlug,
              season: season.slug,
              dungeon: dungeon.slug.toLocaleLowerCase(),
            },
          };
        });
      });
    });
  });

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<
  DungeonProps,
  StaticParams
> = async (ctx) => {
  if (
    !ctx.params?.affixes ||
    !ctx.params?.dungeon ||
    !ctx.params?.season ||
    Array.isArray(ctx.params.affixes) ||
    Array.isArray(ctx.params.dungeon) ||
    Array.isArray(ctx.params.season) ||
    !ctx.params.affixes.includes("-")
  ) {
    throw new Error("nope");
  }

  const seasonSlug = ctx.params.season;
  const season = seasons.find((season) => season.slug === seasonSlug);

  if (!season) {
    throw new Error("nope");
  }

  const dungeonSlug = ctx.params.dungeon;

  const dungeon = dungeons.find(
    (dungeon) => dungeon.slug.toLowerCase() === dungeonSlug
  );

  if (!dungeon) {
    throw new Error("unknown dungeon slug");
  }

  const dataset: DungeonType = {
    id: dungeon.id,
    name: dungeon.name,
    slug: dungeon.slug,
    time: dungeon.timer[0],
  };

  const affixSlug = ctx.params.affixes;
  const affixSlugs = affixSlug.split("-");
  const affixes = allAffixes.filter((affix) =>
    affixSlugs.includes(affix.name.toLowerCase())
  );

  return {
    props: {
      affixes,
      dungeon: dataset,
      season: {
        id: season.id,
        name: season.name,
        slug: season.slug,
      },
    },
  };
};
