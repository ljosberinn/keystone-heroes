import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import type { AffixesProps } from "../../client/components/Affixes";
import { Affixes } from "../../client/components/Affixes";
import { Chests } from "../../client/components/Chests";
import { Composition } from "../../client/components/Composition";
import { ExternalLink } from "../../client/components/ExternalLink";
import type { Table } from "../../server/queries/fights";
import { retrieveFightTableCacheOrSource } from "../../server/queries/fights";
import type { Report as ReportType } from "../../server/queries/report";
import { retrieveReportCacheOrSource } from "../../server/queries/report";
import {
  calcChests,
  calcGroupDps,
  calcRunDuration,
  calcTimeLeftOrOver,
} from "../../utils/calc";
import type { Dungeon } from "../../utils/dungeons";
import { dungeons } from "../../utils/dungeons";
import { healSpecs, tankSpecs } from "../../utils/specs";

type InitialFightInformation = {
  composition: string[];
  deaths: number;
  groupDps: number;
  affixes: AffixesProps["affixes"];
  startTime: number;
  endTime: number;
  dungeon: number;
  keystoneTime: number;
  id: number;
  keystoneLevel: number;
};

type UIFightsResponse = Pick<ReportType, "title"> & {
  id: string;
  fights: InitialFightInformation[];
  startTime: number;
  endTime: number;
};

type ReportProps =
  | {
      error: null;
      report: UIFightsResponse;
    }
  | {
      error: string;
      report: null;
    };

export default function Report({
  report,
  error,
}: ReportProps): JSX.Element | null {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <h1>retrieving data</h1>;
  }

  if (error || !report) {
    return <h1>{error}</h1>;
  }

  const url = `//warcraftlogs.com/reports/${report.id}`;

  return (
    <table className="table-auto">
      <caption>
        <ExternalLink href={url}>{report.title}</ExternalLink> from{" "}
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
          <th>Group DPS</th>
          <th>Deaths</th>
        </tr>
      </thead>
      <tbody>
        {report.fights.map((fight) => {
          const dungeon = dungeons.find(
            (dungeon) => dungeon.id === fight.dungeon
          );

          if (!dungeon) {
            return null;
          }

          return (
            <Row fight={fight} dungeon={dungeon} key={fight.id} baseUrl={url} />
          );
        })}
      </tbody>
    </table>
  );
}

type RowProps = {
  fight: InitialFightInformation;
  dungeon: Dungeon;
  baseUrl: string;
};

function Row({ fight, dungeon, baseUrl }: RowProps) {
  const [open, setOpen] = useState(false);

  function handleClick() {
    setOpen(!open);
  }

  const chests = calcChests(dungeon, fight.keystoneTime);
  const timeLeft = calcTimeLeftOrOver(dungeon, fight.keystoneTime);
  const runTime = calcRunDuration(
    fight.keystoneTime,
    fight.startTime,
    fight.endTime
  );

  return (
    <>
      <tr>
        <td>
          <ExternalLink href={`${baseUrl}/#fight=${fight.id}`}>
            {dungeon.name}
          </ExternalLink>
        </td>
        <td>{fight.keystoneLevel}</td>
        <td>
          <Affixes affixes={fight.affixes} chests={chests} />
        </td>
        <td>
          <Chests chests={chests} />
        </td>
        <td>
          {runTime} {chests > 0 && <>(+{timeLeft})</>}
        </td>
        <td>
          <Composition composition={fight.composition} />
        </td>
        <td>{fight.groupDps.toLocaleString()}</td>
        <td>{fight.deaths}</td>
        <td>
          <button type="button" onClick={handleClick}>
            {open ? "hide" : "show"} details
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td>hi</td>
        </tr>
      )}
    </>
  );
}

export const getStaticPaths = (): GetStaticPathsResult => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ reportId?: string }>
): Promise<GetStaticPropsResult<ReportProps>> => {
  if (!context.params?.reportId || context.params.reportId.length < 16) {
    return {
      props: {
        error: "missing or invalid query param: code",
        report: null,
      },
    };
  }

  const { reportId } = context.params;

  const report = await retrieveReportCacheOrSource(reportId);

  if (!report) {
    return {
      props: {
        report: null,
        error: "no report found",
      },
      revalidate: 60,
    };
  }

  const fightTables = await retrieveFightTableCacheOrSource(
    reportId,
    report.fights
  );

  const { startTime, endTime, title } = report;

  return {
    props: {
      report: {
        id: reportId,
        endTime,
        startTime,
        title,
        fights: transformReportData(report, fightTables),
      },
      error: null,
    },
    revalidate: 5 * 60,
  };
};

const transformReportData = (
  report: ReportType,
  fightTables: Record<string, Table>
): InitialFightInformation[] => {
  return report.fights
    .filter((fight) => fight.endTime - fight.startTime < 60 * 60 * 1000)
    .map((fight) => {
      const composition = fightTables[fight.id].composition
        .map(({ specs, type }) => `${type}-${specs[0].spec}`)
        .sort((a, b) => {
          if (tankSpecs.has(a)) {
            return -1;
          }

          if (tankSpecs.has(b)) {
            return 1;
          }

          if (healSpecs.has(a)) {
            return -1;
          }

          if (healSpecs.has(b)) {
            return 1;
          }

          return 0;
        });

      return {
        affixes: fight.keystoneAffixes,
        dungeon: fight.encounterID,
        id: fight.id,
        keystoneLevel: fight.keystoneLevel,
        keystoneTime: fight.keystoneTime,
        startTime: fight.startTime,
        endTime: fight.endTime,
        composition,
        deaths: fightTables[fight.id]?.deathEvents.length ?? 0,
        groupDps: calcGroupDps(
          fight.keystoneTime,
          fightTables[fight.id]?.damageDone
        ),
      };
    });
};
