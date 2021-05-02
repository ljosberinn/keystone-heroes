import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { createDungeonTimer } from "../../../prisma/dungeons";
import { Affixes } from "../../client/components/Affixes";
import { Chests } from "../../client/components/Chests";
import { Composition } from "../../client/components/Composition";
import { Conduits } from "../../client/components/Conduits";
import { ExternalLink } from "../../client/components/ExternalLink";
import { Icon } from "../../client/components/Icon";
import { Soulbinds } from "../../client/components/Soulbinds";
import { isValidReportId } from "../../server/api";
import type { ResponseFight2 } from "../../server/db/fights";
import { ReportRepo } from "../../server/db/report";
import { loadReportFromSource } from "../../server/queries/report";
import { calcRunDuration, calcTimeLeft } from "../../utils/calc";

export type NewUIReport = {
  endTime: number;
  fights: number[];
  region: string;
  report: string;
  startTime: number;
  title: string;
};

export type ReportProps = {
  report: null | NewUIReport;
};

export default function Report({ report }: ReportProps): JSX.Element | null {
  const { query, isFallback } = useRouter();
  const [fights, setFights] = useState<ResponseFight2[]>([]);

  useEffect(() => {
    if (report) {
      if (!report || report.fights.length === 0) {
        return;
      }

      const params = new URLSearchParams({
        reportId: report.report,
      });

      report.fights.forEach((id) => {
        // @ts-expect-error doesn't have to be a string
        params.append("ids", id);
      });

      const query = params.toString();

      fetch(`/api/fight?${query}`)
        // eslint-disable-next-line promise/prefer-await-to-then
        .then((response) => response.json())
        // eslint-disable-next-line promise/prefer-await-to-then
        .then(setFights)
        // eslint-disable-next-line promise/prefer-await-to-then, no-console
        .catch(console.error);
    }
  }, [report]);

  if (isFallback) {
    return <h1>fallback</h1>;
  }

  if (!report) {
    return (
      <>
        <Head>
          <title>{query.id ?? "unknown report"}</title>
        </Head>
        <h1>retrieving data</h1>
      </>
    );
  }

  if (fights.length === 0) {
    return <h1>still loading stuff</h1>;
  }

  const reportUrl = `https://www.warcraftlogs.com/reports/${report.report}`;

  return (
    <>
      <Head>
        <title>
          {report.title} from {new Date(report.startTime).toLocaleDateString()}
        </title>
      </Head>
      <table>
        <caption>
          <ExternalLink href={reportUrl}>{report.title}</ExternalLink> from{" "}
          {new Date(report.startTime).toLocaleDateString()}
        </caption>
        <thead>
          <tr>
            <th>Dungeon</th>
            <th>Key Level</th>
            <th>Affixes</th>
            <th>Chests</th>
            <th>Time</th>
            <th>Composition</th>
            <th className="text-right">Avg ItemLevel</th>
            <th className="text-right">Group DPS</th>
            <th className="text-right">Group HPS</th>
            <th className="text-right">Group DTPS</th>
            <th className="text-right">Deaths</th>
          </tr>
        </thead>
        <tbody>
          {fights.map((fight) => {
            return (
              <Row
                fight={fight}
                key={fight.fightId}
                reportBaseUrl={reportUrl}
                region={report.region}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}

type RowProps = {
  fight: ResponseFight2;
  reportBaseUrl: string;
  region: string;
};

function Row({ fight, reportBaseUrl, region }: RowProps) {
  const [open, setOpen] = useState(true);

  function handleClick() {
    setOpen(!open);
  }

  const timeLeft = calcTimeLeft(
    createDungeonTimer(fight.dungeon.time),
    fight.keystoneTime * 1000
  );
  const runTime = calcRunDuration(fight.keystoneTime);

  const fightUrl = `${reportBaseUrl}/#fight=${fight.fightId}`;

  return (
    <>
      <tr>
        <td>
          <ExternalLink href={fightUrl}>{fight.dungeon.name}</ExternalLink>
        </td>
        <td>{fight.keystoneLevel}</td>
        <td>
          <Affixes affixes={fight.affixes} chests={fight.chests} />
        </td>
        <td>
          <Chests chests={fight.chests} />
        </td>
        <td>
          {runTime} {fight.chests > 0 && <>(+{timeLeft})</>}
        </td>
        <td>
          <Composition composition={fight.composition} />
        </td>
        <td className="text-right">{fight.averageItemLevel.toFixed(2)}</td>
        <td className="text-right">
          <ExternalLink href={`${fightUrl}&type=damage-done`}>
            {fight.dps.toLocaleString()}
          </ExternalLink>
        </td>
        <td className="text-right">
          <ExternalLink href={`${fightUrl}&type=healing`}>
            {fight.hps.toLocaleString()}
          </ExternalLink>
        </td>
        <td className="text-right">
          <ExternalLink href={`${fightUrl}&type=damage-taken`}>
            {fight.dtps.toLocaleString()}
          </ExternalLink>
        </td>
        <td className="text-right">
          <ExternalLink href={`${fightUrl}&type=deaths`}>
            {fight.totalDeaths}
          </ExternalLink>
        </td>
        <td>
          <button type="button" onClick={handleClick}>
            {open ? "hide" : "show"} details
          </button>
        </td>
      </tr>
      {open && (
        <>
          <tr>
            <th>Name</th>
            <th className="text-right">ItemLevel</th>
            <th className="text-right">DPS</th>
            <th className="text-right">HPS</th>
            <th className="text-right">Deaths</th>
            <th>Legendary</th>
            <th className="text-center">Talents</th>
            <th>Covenant</th>
            <th className="text-center">Soulbinds</th>
            <th className="text-center">Conduits</th>
          </tr>
          {fight.composition.map((player) => {
            return (
              <tr key={player.character.name}>
                <td>
                  <ExternalLink
                    href={`https://www.warcraftlogs.com/character/${region}/${player.character.server.name}/${player.character.name}`}
                  >
                    {player.character.name}
                  </ExternalLink>
                </td>
                <td className="text-right">{player.itemLevel}</td>

                <td className="text-right">
                  <ExternalLink
                    href={`${fightUrl}&type=damage-done&source=TODO`}
                  >
                    {player.dps.toLocaleString()}
                  </ExternalLink>
                </td>
                <td className="text-right">
                  <ExternalLink href={`${fightUrl}&type=healing&source=TODO`}>
                    {player.hps.toLocaleString()}
                  </ExternalLink>
                </td>
                <td className="text-right">
                  <ExternalLink href={`${fightUrl}&type=deaths&source=TODO`}>
                    {player.deaths.toLocaleString()}
                  </ExternalLink>
                </td>

                <td>
                  <div className="flex justify-center">
                    {player.legendary?.id &&
                      player.legendary?.effectIcon &&
                      player.legendary?.effectName && (
                        <ExternalLink
                          href={`https://www.wowhead.com/spell=${player.legendary.id}`}
                        >
                          <Icon
                            src={player.legendary.effectIcon}
                            alt={player.legendary.effectName}
                            srcPrefix="abilities"
                          />
                        </ExternalLink>
                      )}
                  </div>
                </td>

                <td>
                  <div className="flex justify-center">
                    {player.talents.map((talent, index) => {
                      return (
                        <Icon
                          src={talent.abilityIcon}
                          alt={talent.name}
                          key={talent.id}
                          className={index > 0 && "ml-1"}
                          srcPrefix="abilities"
                        />
                      );
                    })}
                  </div>
                </td>

                <td className="text-center">
                  <div className="flex justify-center">
                    {player.covenant && (
                      <Icon
                        src={player.covenant.icon}
                        alt={player.covenant.name}
                        srcPrefix="abilities"
                      />
                    )}
                    {player.soulbind && (
                      <Icon
                        src={player.soulbind.icon}
                        alt={player.soulbind.name}
                        srcPrefix="soulbinds"
                        className="ml-1"
                      />
                    )}
                  </div>
                </td>

                <td className="text-center">
                  <Soulbinds covenantTraits={player.covenantTraits} />
                </td>

                <td className="text-center">
                  <Conduits conduits={player.conduits} />
                </td>
              </tr>
            );
          })}
        </>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: [],
  };
};

// assume a report may still be ongoing if its less than one day old
const maybeOngoingReport = (endTime: number) =>
  24 * 60 * 60 * 1000 > Date.now() - endTime;

export const getStaticProps: GetStaticProps<ReportProps> = async (ctx) => {
  if (
    !ctx.params?.id ||
    !isValidReportId(ctx.params.id) ||
    ctx.params.id.includes(".")
  ) {
    // eslint-disable-next-line no-console
    console.info('[report/gSP] missing or invalid "params.id"');

    return {
      props: {
        report: null,
      },
    };
  }

  const { id } = ctx.params;

  const report = await ReportRepo.load(id);

  if (report) {
    if (!maybeOngoingReport(report.endTime)) {
      // eslint-disable-next-line no-console
      console.info("[report/gSP] known & finished report");

      const { id, region, ...rest } = report;
      return {
        props: {
          report: {
            ...rest,
            region: region.slug,
          },
        },
      };
    }

    const rawReport = await loadReportFromSource(id);

    if (!rawReport) {
      // eslint-disable-next-line no-console
      console.info(
        "[report/gSP] known report - failed to load report from WCL"
      );

      const { id, region, ...rest } = report;

      return {
        props: {
          report: {
            ...rest,
            region: region.slug,
          },
        },
        revalidate: 15 * 60 * 60,
      };
    }

    await ReportRepo.create(id, rawReport);

    return {
      props: {
        report: {
          report: id,
          endTime: rawReport.endTime,
          startTime: rawReport.startTime,
          title: rawReport.title,
          region: rawReport.region.slug,
          fights: rawReport.fights
            .filter((fight) => fight.keystoneBonus > 0)
            .map((fight) => fight.id),
        },
      },
    };
  }

  const rawReport = await loadReportFromSource(id);

  if (!rawReport) {
    // eslint-disable-next-line no-console
    console.info(
      "[report/gSP] unknown report - failed to load report from WCL"
    );

    return {
      props: {
        report: null,
      },
      revalidate: 15 * 60 * 60,
    };
  }

  await ReportRepo.create(id, rawReport);

  return {
    props: {
      report: {
        report: id,
        endTime: rawReport.endTime,
        startTime: rawReport.startTime,
        title: rawReport.title,
        region: rawReport.region.slug,
        fights: rawReport.fights
          .filter((fight) => fight.keystoneBonus > 0)
          .map((fight) => fight.id),
      },
    },
  };
};
