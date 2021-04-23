import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { useRouter } from "next/router";

import { Affixes } from "../../client/components/Affixes";
import { Chests } from "../../client/components/Chests";
import { Composition } from "../../client/components/Composition";
import { ExternalLink } from "../../client/components/ExternalLink";
import {
  retrieveFightSummaryCacheOrSource,
  retrieveReportCacheOrSource,
} from "../../server/wclUrls";
import type {
  CompletedKeystoneFight,
  FailedKeystoneFight,
} from "../../types/keystone";
import type { Friendly, WCLFight, WCLReport } from "../../types/report";
import { calcChests, calcGroupDps, calcRunDuration } from "../../utils/calc";
import { dungeons } from "../../utils/dungeons";
import { healSpecs, tankSpecs } from "../../utils/specs";

type InitialFightInformation = Omit<
  CompletedKeystoneFight | FailedKeystoneFight,
  "dungeonPulls"
> & {
  composition: Friendly["icon"][];
  deaths: number;
  groupDps: number;
};

type UIFightsResponse = Pick<WCLReport, "start" | "end" | "title"> & {
  reportId: string;
  fights: InitialFightInformation[];
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

  const url = `//warcraftlogs.com/reports/${report.reportId}`;

  return (
    <table>
      <caption>
        <ExternalLink href={url}>{report.title}</ExternalLink> from{" "}
        {new Date(report.start).toLocaleDateString()}
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
          const dungeon = dungeons.find((dungeon) => dungeon.id === fight.boss);

          if (!dungeon) {
            return null;
          }

          const chests = calcChests(fight.completionTime, dungeon);
          const runTime = calcRunDuration(
            fight.completionTime,
            fight.start_time,
            fight.end_time
          );

          return (
            <tr key={fight.id}>
              <td>
                <ExternalLink href={`${url}/#fight=${fight.id}`}>
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
              <td>{runTime}</td>
              <td>
                <Composition composition={fight.composition} />
              </td>
              <td>{fight.groupDps.toLocaleString()}</td>
              <td>{fight.deaths}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
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

  const json = await retrieveReportCacheOrSource(reportId);

  if (!json) {
    return {
      props: {
        report: null,
        error: "no report found",
      },
      revalidate: 1 * 60,
    };
  }

  const fights = await getKeystoneFights(reportId, json);

  const { start, end, title } = json;

  const report: ReportProps["report"] = {
    reportId,
    end,
    start,
    title,
    fights,
  };

  return {
    props: {
      report,
      error: null,
    },
    revalidate: 5 * 60,
  };
};

const isKeystoneFight = (
  fight: WCLFight
): fight is (CompletedKeystoneFight | FailedKeystoneFight) &
  Pick<
    WCLFight,
    | "boss"
    | "name"
    | "zoneID"
    | "zoneDifficulty"
    | "size"
    | "lastPhaseForPercentageDisplay"
    | "difficulty"
    | "maps"
    | "fightPercentage"
    | "bossPercentage"
    | "zoneName"
    | "partial"
    | "medal"
  > => {
  return (
    "keystoneLevel" in fight && "dungeonPulls" in fight && "affixes" in fight
  );
};

const getKeystoneFights = async (
  reportId: string,
  { fights, friendlies }: WCLReport
): Promise<InitialFightInformation[]> => {
  const fightsWithSummary = await Promise.all(
    fights.map(async (fight) => {
      if (isKeystoneFight(fight)) {
        const {
          affixes,
          id,
          end_time,
          keystoneLevel,
          boss,
          start_time,
          kill,
          completionTime,
        } = fight;

        // skip fights where keys were dropped intentionally or very early on
        if (end_time - start_time < 10 * 60 * 1000) {
          return null;
        }

        const composition = friendlies
          // only include units that were present for this fight
          .filter((friendly) =>
            friendly.fights.some(({ id: fightId }) => fightId === id)
          )
          // filter out Pets and NPCs
          .filter(
            (friendly) => friendly.type !== "NPC" && friendly.type !== "Pet"
          )
          .map(({ icon }) => icon)
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

        // some logs are broken, showing the start or the end of some other key
        // apart from unusually long logs, its only detecteable if more than 5 players are present
        if (composition.length > 5) {
          return null;
        }

        const fightSummary = await retrieveFightSummaryCacheOrSource(
          reportId,
          fight
        );

        const deaths = fightSummary?.deathEvents.length ?? 0;

        const groupDps = calcGroupDps(
          kill ? completionTime : end_time - start_time,
          fightSummary?.damageDone
        );

        return {
          affixes,
          id,
          end_time,
          start_time,
          boss,
          composition,
          keystoneLevel,
          kill,
          deaths,
          completionTime: kill ? completionTime : 0,
          groupDps,
        };
      }

      return null;
    })
  );

  return fightsWithSummary.filter(
    (fight): fight is InitialFightInformation => fight !== null
  );
};
