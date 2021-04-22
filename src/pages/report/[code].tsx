import type { GetStaticPathsResult, GetStaticPropsContext } from "next";
import { useRouter } from "next/router";

import { getFightsUrl } from "../../server/wclUrls";
import type {
  CompletedKeystoneFight,
  FailedKeystoneFight,
  InitialFightInformation,
  UIFightsResponse,
  WCLFight,
  WCLFightResponse,
} from "../../types";

type CodeProps =
  | {
      error: null;
      report: UIFightsResponse;
    }
  | {
      error: string;
      report: null;
    };

export default function Code({ report, error }: CodeProps): JSX.Element | null {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <h1>retrieving data</h1>;
  }

  if (error || !report) {
    return <h1>{error}</h1>;
  }

  return (
    <table>
      <caption>
        {report.title} from {new Date(report.start).toLocaleDateString()}
      </caption>
      <thead>
        <tr>
          <th>Dungeon</th>
          <th>Key Level</th>
          <th>Affixes</th>
          <th>Finished</th>
          <th>Time</th>
          <th>Composition</th>
        </tr>
      </thead>
      <tbody>
        {report.fights.map((fight) => {
          return (
            <tr key={fight.id}>
              <td>{fight.boss}</td>
              <td>{fight.keystoneLevel}</td>
              <td>{JSON.stringify(fight.affixes)}</td>
              <td>{fight.kill ? "yes" : "no"}</td>
              <td>
                {Math.round((fight.end_time - fight.start_time) / 1000 / 60)}
              </td>
              <td>NYI</td>
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
  context: GetStaticPropsContext<{ code?: string }>
): Promise<{ props: CodeProps }> => {
  if (!context.params?.code) {
    return {
      props: {
        error: "missing query param: code",
        report: null,
      },
    };
  }

  const { code } = context.params;

  const url = getFightsUrl(code);

  try {
    const response = await fetch(url);

    if (response.ok) {
      const json: WCLFightResponse = await response.json();

      const { start, end, title } = json;

      const fights = getKeystoneFights(json.fights);

      const report = {
        code,
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
      };
    }
  } catch {
    return {
      props: {
        error: "no report found",
        report: null,
      },
    };
  }

  return {
    props: {
      error: "unknown error",
      report: null,
    },
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

const getKeystoneFights = (fights: WCLFight[]) => {
  return fights.reduce<InitialFightInformation[]>((acc, fight) => {
    if (isKeystoneFight(fight)) {
      const {
        name,
        zoneID,
        zoneDifficulty,
        size,
        lastPhaseForPercentageDisplay,
        difficulty,
        maps,
        fightPercentage,
        bossPercentage,
        zoneName,
        dungeonPulls,
        partial,
        medal,
        ...rest
      } = fight;
      return [...acc, rest];
    }

    return acc;
  }, []);
};
