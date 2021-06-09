import type { ReportResponse } from "@keystone-heroes/api/functions";
import { isValidReportId } from "@keystone-heroes/wcl/utils";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { LinkBox, LinkOverlay } from "src/components/LinkBox";

type ReportProps = {
  cache?: {
    report: ReportResponse | null;
  };
};

export default function Report({ cache }: ReportProps): JSX.Element | null {
  const { query, isFallback } = useRouter();
  const [report, setReport] = useState<ReportResponse | null>(
    cache?.report ?? null
  );

  const validReportID = cache
    ? true
    : !!(query.reportID && isValidReportId(query.reportID));

  useEffect(() => {
    if (
      isFallback ||
      !query.reportID ||
      !validReportID ||
      Array.isArray(query.reportID)
    ) {
      return;
    }

    fetch(`/api/report?reportID=${query.reportID}`)
      .then((response) => response.json())
      .then(setReport)
      .catch(console.error);
  }, [isFallback, query, validReportID]);

  const fights = report?.fights ?? Array.from({ length: 4 });

  return (
    <>
      <Head>
        <title>Keystone Heroes - {report?.title ?? "unknown report"}</title>
      </Head>
      <h1>{report?.title ?? "unknown report"}</h1>
      <div>
        {report?.affixes?.map((affix) => (
          <img
            loading="lazy"
            alt={affix.name}
            key={affix.name}
            src={`https://assets.rpglogs.com/img/warcraft/abilities/${affix.icon}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-3 2xl:gap-8">
        {fights.map((fight, index) => {
          return (
            <FightCard
              reportID={
                Array.isArray(query.reportID) || !query.reportID
                  ? ""
                  : query.reportID
              }
              fight={fight}
              key={index}
            />
          );
        })}
      </div>
    </>
  );
}

type FightCardProps = {
  fight?: ReportResponse["fights"][number];
  reportID: string;
};

function FightCard({ fight, reportID }: FightCardProps) {
  if (!fight) {
    return (
      <div className="bg-pink-200 h-12 rounded-md flex items-center justify-center text-red-900 text-2xl font-extrabold">
        fallback
      </div>
    );
  }

  return (
    <LinkBox
      className="bg-pink-200 h-12 rounded-md flex items-center justify-center text-red-900 text-2xl font-extrabold h-64 relative"
      // style={{
      //   backgroundImage: fight.dungeon
      //     ? `url(/static/dungeons/${fight.dungeon.id}.jpg)`
      //     : undefined,
      // }}
    >
      <LinkOverlay href={`/report/${reportID}/${fight.id}`}>
        {fight.id}
      </LinkOverlay>

      {/* <table>
        <tbody>
          <tr>
            {fight.player.map((player, index) => (
              <td key={index}>
                {player.class}-{player.spec}
              </td>
            ))}
          </tr>
          <tr>
            {fight.player.map((player, index) => (
              <td key={index}>
                {player.legendary ? (
                  <img
                    src={`https://assets.rpglogs.com/img/warcraft/abilities/${player.legendary.effectIcon}`}
                    alt={player.legendary.effectName}
                    loading="lazy"
                    className="w-6 h-6"
                  />
                ) : null}
              </td>
            ))}
          </tr>
          <tr>
            {fight.player.map((player, index) => (
              <td key={index}>
                {player.soulbindID ? (
                  <img
                    src={`https://assets.rpglogs.com/img/warcraft/soulbinds/soulbind-${player.soulbindID}.jpg`}
                    alt={player.soulbindID}
                    loading="lazy"
                    className="w-6 h-6"
                  />
                ) : null}
              </td>
            ))}
          </tr>
        </tbody>
      </table> */}
    </LinkBox>
  );
}

export const getStaticPaths: GetStaticPaths<{
  reportID: string;
}> = async () => {
  return {
    fallback: true,
    paths: [],
  };
};

export const getStaticProps: GetStaticProps<ReportProps, { reportID: string }> =
  async () => {
    return {
      props: {
        cache: {
          report: null,
        },
      },
    };
  };
