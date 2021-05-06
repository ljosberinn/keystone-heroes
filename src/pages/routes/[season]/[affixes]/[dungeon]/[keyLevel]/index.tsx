import type { Affix, Dungeon, Season } from "@prisma/client";
import type { GetStaticPaths, GetStaticProps } from "next";

import {
  getAffixById,
  affixes as allAffixes,
} from "../../../../../../../prisma/affixes";
import { dungeonMap, dungeons } from "../../../../../../../prisma/dungeons";
import { expansions } from "../../../../../../../prisma/expansions";
import { seasons } from "../../../../../../../prisma/seasons";
import { weeks as allWeeks } from "../../../../../../../prisma/weeks";
import {
  MAX_KEYSTONE_LEVEL,
  MIN_KEYSTONE_LEVEL,
} from "../../../../../../constants";

type KeyLevelProps = {
  keyLevel: number;
  dungeon: Dungeon;
  season: Omit<Season, "startTime" | "endTime" | "affixId" | "expansionId">;
  affixes: Affix[];
};

export default function KeyLevel({
  dungeon,
  keyLevel,
  season,
  affixes,
}: KeyLevelProps): JSX.Element {
  return (
    <h1>
      {season.name} - {dungeon.name} @ {keyLevel} with{" "}
      {affixes.map((affix) => affix.name).join(" / ")}
    </h1>
  );
}

type StaticParams = {
  dungeon: string;
  season: string;
  keyLevel: string;
  affixes: string;
};

export const getStaticPaths: GetStaticPaths<StaticParams> = async () => {
  const paths = Array.from(
    { length: MAX_KEYSTONE_LEVEL },
    (_, index) => index + 1
  )
    .filter((keyLevel) => keyLevel >= MIN_KEYSTONE_LEVEL)
    .flatMap((keyLevel) => {
      return seasons.flatMap((season) => {
        const weeks = allWeeks.filter(
          (week) => week.seasonId === season.seasonId
        );

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
                  keyLevel: `${keyLevel}`,
                },
              };
            });
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
  KeyLevelProps,
  StaticParams
> = async (ctx) => {
  if (
    !ctx.params?.affixes ||
    !ctx.params?.dungeon ||
    !ctx.params?.season ||
    !ctx.params?.keyLevel ||
    Array.isArray(ctx.params.dungeon) ||
    Array.isArray(ctx.params.season) ||
    Array.isArray(ctx.params.keyLevel) ||
    Array.isArray(ctx.params.affixes) ||
    !ctx.params.affixes.includes("-")
  ) {
    throw new Error("nope");
  }

  const keyLevel = Number.parseInt(ctx.params.keyLevel);

  if (Number.isNaN(keyLevel)) {
    throw new TypeError("invalid key level");
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

  const dataset: Dungeon = {
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
      keyLevel,
    },
  };
};
