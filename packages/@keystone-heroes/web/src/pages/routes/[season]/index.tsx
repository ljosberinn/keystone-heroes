import {
  seasons,
  getAffixById,
  weeks as allWeeks,
} from "@keystone-heroes/db/data";
import type { Season as SeasonType } from "@prisma/client";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

type SeasonProps = {
  season: Omit<SeasonType, "startTime" | "endTime" | "affixID" | "expansionID">;
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
    .filter((week) => week.seasonID === season.id)
    .map((week) => {
      const affixSlug = [
        getAffixById(week.affix1ID),
        getAffixById(week.affix2ID),
        getAffixById(week.affix3ID),
        getAffixById(season.affixID),
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
