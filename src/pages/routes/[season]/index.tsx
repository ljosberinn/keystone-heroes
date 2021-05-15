import Head from "next/head";
import Link from "next/link";

import { getAffixById } from "../../../../prisma/affixes";
import { seasons } from "../../../../prisma/seasons";
import { weeks as allWeeks } from "../../../../prisma/weeks";

import type { Season as SeasonType } from "@prisma/client";
import type { GetStaticPaths, GetStaticProps } from "next";

type SeasonProps = {
  season: Omit<SeasonType, "startTime" | "endTime" | "affixId" | "expansionId">;
  weeks: { id: number; slug: string }[];
};

export default function Season({ season, weeks }: SeasonProps): JSX.Element {
  return (
    <>
      <Head>
        <title>{season.name}</title>
      </Head>

      <h1>{season.name}</h1>

      <hr />

      {weeks.map((week) => {
        return (
          <div key={week.id}>
            <Link href={`/routes/${season.slug}/${week.slug}`}>
              <a>{week.slug}</a>
            </Link>
          </div>
        );
      })}
    </>
  );
}

type StaticPaths = { season: string };

export const getStaticPaths: GetStaticPaths<StaticPaths> = async () => {
  return {
    fallback: false,
    paths: seasons.flatMap((season) => {
      return {
        params: {
          season: season.slug,
        },
      };
    }),
  };
};

export const getStaticProps: GetStaticProps<SeasonProps, StaticPaths> = async ({
  params,
}) => {
  if (!params?.season || Array.isArray(params.season)) {
    throw new Error("nope");
  }

  const seasonSlug = params.season;
  const season = seasons.find((season) => season.slug === seasonSlug);

  if (!season) {
    throw new Error("nope");
  }

  const weeks = allWeeks
    .filter((week) => week.seasonId === season.id)
    .map((week) => {
      const affixSlug = [
        getAffixById(week.affix1Id),
        getAffixById(week.affix2Id),
        getAffixById(week.affix3Id),
        getAffixById(season.affixId),
      ]
        .map((affix) => affix.name.toLowerCase())
        .join("-");

      return {
        ...week,
        slug: affixSlug,
      };
    })
    .map((week) => {
      return {
        slug: week.slug,
        id: week.id,
      };
    });

  return {
    props: {
      season: {
        id: season.id,
        name: season.name,
        slug: season.slug,
      },
      weeks,
    },
  };
};
