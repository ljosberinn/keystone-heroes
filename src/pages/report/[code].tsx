import { existsSync, writeFileSync, readFileSync } from "fs";
import type { GetStaticPathsResult, GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { resolve } from "path";

import { Affixes } from "../../client/components/Affixes";
import { Chests } from "../../client/components/Chests";
import { Composition } from "../../client/components/Composition";
import { IS_PROD } from "../../constants";
import { getFightsUrl } from "../../server/wclUrls";
import type {
  CompletedKeystoneFight,
  FailedKeystoneFight,
  InitialFightInformation,
  UIFightsResponse,
  WCLFight,
  WCLFightResponse,
} from "../../types";
import { dungeons, getRunTime } from "../../utils/dungeons";
import { healSpecs, tankSpecs } from "../../utils/specs";

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
          <th>Chests</th>
          <th>Time</th>
          <th>Composition</th>
          <th>Deaths</th>
        </tr>
      </thead>
      <tbody>
        {report.fights.map((fight) => {
          const dungeon = dungeons.find((dungeon) => dungeon.id === fight.boss);

          if (!dungeon) {
            return null;
          }

          const chests =
            fight.completionTime === 0
              ? 0
              : dungeon.timer.findIndex(
                  (timer) => fight.completionTime > timer
                );

          const runTime = getRunTime(fight);

          return (
            <tr key={fight.id}>
              <td>{dungeon.name}</td>
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
  if (!context.params?.code || context.params.code.length < 16) {
    return {
      props: {
        error: "missing or invalid query param: code",
        report: null,
      },
    };
  }

  const { code } = context.params;

  const retrieveCacheOrSource = async (): Promise<WCLFightResponse | null> => {
    const resolvedCachePath = resolve(`cache/${code}.json`);

    if (!IS_PROD && existsSync(resolvedCachePath)) {
      // eslint-disable-next-line no-console
      console.info("[code/getStaticProps] reading from cache");
      const raw = readFileSync(resolvedCachePath, {
        encoding: "utf-8",
      });

      return JSON.parse(raw);
    }

    const url = getFightsUrl(code);

    try {
      // eslint-disable-next-line no-console
      console.info("[code/getStaticProps] fetching from WCL");

      const response = await fetch(url);

      if (response.ok) {
        const json = await response.json();

        if (!IS_PROD) {
          writeFileSync(resolvedCachePath, JSON.stringify(json));
        }

        return json;
      }
    } catch {
      return null;
    }

    return null;
  };

  const json = await retrieveCacheOrSource();

  if (!json) {
    return {
      props: {
        report: null,
        error: "no report found",
      },
    };
  }

  const fights = getKeystoneFights(json);
  const { start, end, title } = json;

  return {
    props: {
      report: {
        code,
        end,
        start,
        title,
        fights,
      },
      error: null,
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

const getKeystoneFights = ({ fights, friendlies }: WCLFightResponse) => {
  return fights.reduce<InitialFightInformation[]>((acc, fight) => {
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
        return acc;
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
        return acc;
      }

      return [
        ...acc,
        {
          affixes,
          id,
          end_time,
          start_time,
          boss,
          composition,
          keystoneLevel,
          kill,
          completionTime: kill ? completionTime : 0,
        },
      ];
    }

    return acc;
  }, []);
};
