import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import type { AffixesProps } from "../../client/components/Affixes";
import { Affixes } from "../../client/components/Affixes";
import { Chests } from "../../client/components/Chests";
import { Composition } from "../../client/components/Composition";
import { Conduits } from "../../client/components/Conduits";
import { ExternalLink } from "../../client/components/ExternalLink";
import { Icon } from "../../client/components/Icon";
import { Soulbinds } from "../../client/components/Soulbinds";
import type {
  Conduit,
  InDepthCharacterInformation,
  Item,
  SoulbindTalent,
  Table,
  Talent,
} from "../../server/queries/fights";
import {
  retrieveFightTableCacheOrSource,
  ItemQuality,
} from "../../server/queries/fights";
import type { Fight, Report as ReportType } from "../../server/queries/report";
import { retrieveReportCacheOrSource } from "../../server/queries/report";
import type { PlayableClass } from "../../types/classes";
import { Roles } from "../../types/roles";
import {
  calcMetricAverage,
  calcRunDuration,
  calcTimeLeft,
} from "../../utils/calc";
import type {
  Soulbinds as SoulbindsType,
  Covenants,
} from "../../utils/covenants";
import { soulbindMap, covenantMap } from "../../utils/covenants";
import type { Dungeon, Dungeons } from "../../utils/dungeons";
import { dungeons } from "../../utils/dungeons";

type InitialFightInformation = Pick<
  Fight,
  "keystoneLevel" | "id" | "keystoneTime" | "startTime" | "endTime"
> & {
  affixes: AffixesProps["affixes"];
  dungeonId: keyof Dungeons;
  chests: Fight["keystoneBonus"];
  group: {
    metrics: {
      dps: number;
      hps: number;
      dtps: number;
    };
    totalDeaths: number;
    composition: Player[];
    averageItemlevel: string;
  };
};

type UIFightsResponse = Pick<ReportType, "title" | "endTime" | "startTime"> & {
  id: string;
  fights: InitialFightInformation[];
  region: string;
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

  const reportUrl = `//warcraftlogs.com/reports/${report.id}`;

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
          {report.fights.map((fight) => {
            const dungeon = dungeons[fight.dungeonId];

            if (!dungeon) {
              return null;
            }

            return (
              <Row
                fight={fight}
                dungeon={dungeon}
                key={fight.id}
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
  fight: InitialFightInformation;
  dungeon: Dungeon;
  reportBaseUrl: string;
  region: string;
};

function Row({ fight, dungeon, reportBaseUrl, region }: RowProps) {
  const [open, setOpen] = useState(true);

  function handleClick() {
    setOpen(!open);
  }

  const timeLeft = calcTimeLeft(dungeon, fight.keystoneTime);
  const runTime = calcRunDuration(fight.keystoneTime);

  const fightUrl = `${reportBaseUrl}/#fight=${fight.id}`;

  return (
    <>
      <tr>
        <td>
          <ExternalLink href={fightUrl}>{dungeon.name}</ExternalLink>
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
          <Composition composition={fight.group.composition} />
        </td>
        <td className="text-right">{fight.group.averageItemlevel}</td>
        <td className="text-right">
          {fight.group.metrics.dps.toLocaleString()}
        </td>
        <td className="text-right">
          {fight.group.metrics.hps.toLocaleString()}
        </td>
        <td className="text-right">
          {fight.group.metrics.dtps.toLocaleString()}
        </td>
        <td className="text-right">{fight.group.totalDeaths}</td>
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
          {fight.group.composition.map((player) => {
            return (
              <tr key={player.guid}>
                <td>
                  <ExternalLink
                    href={`//warcraftlogs.com/character/${region}/${player.server}/${player.name}`}
                  >
                    {player.name}
                  </ExternalLink>
                </td>
                <td className="text-right">{player.itemLevel}</td>

                <td className="text-right">
                  <ExternalLink
                    href={`${fightUrl}&type=damage-done&source=${player.id}`}
                  >
                    {player.dps.toLocaleString()}
                  </ExternalLink>
                </td>
                <td className="text-right">
                  <ExternalLink
                    href={`${fightUrl}&type=healing&source=${player.id}`}
                  >
                    {player.hps.toLocaleString()}
                  </ExternalLink>
                </td>
                <td className="text-right">
                  <ExternalLink
                    href={`${fightUrl}&type=deaths&source=${player.id}`}
                  >
                    {player.deaths.toLocaleString()}
                  </ExternalLink>
                </td>

                <td>
                  <div className="flex justify-center">
                    {player.legendary?.effectID &&
                      player.legendary?.effectIcon &&
                      player.legendary?.effectName && (
                        <ExternalLink
                          href={`//www.wowhead.com/spell=${player.legendary.effectID}`}
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
                          key={talent.guid}
                          className={index > 0 && "ml-1"}
                          srcPrefix="abilities"
                        />
                      );
                    })}
                  </div>
                </td>

                <td className="text-center">
                  <div className="flex justify-center">
                    <Icon
                      src={covenantMap[player.covenant.id].icon}
                      alt={covenantMap[player.covenant.id].name}
                      srcPrefix="abilities"
                    />
                    <Icon
                      src={soulbindMap[player.covenant.soulbind.id].icon}
                      alt={soulbindMap[player.covenant.soulbind.id].name}
                      srcPrefix="soulbinds"
                      className="ml-1"
                    />
                  </div>
                </td>

                <td className="text-center">
                  <Soulbinds soulbinds={player.covenant.soulbind.talents} />
                </td>

                <td className="text-center">
                  <Conduits conduits={player.covenant.soulbind.conduits} />
                </td>
              </tr>
            );
          })}
        </>
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

  // ignore fights that weren't timed
  const validFights = report.fights.filter((fight) => fight.keystoneBonus > 0);

  const fightTables = await retrieveFightTableCacheOrSource(
    reportId,
    validFights
  );

  const { startTime, endTime, title, region } = report;

  return {
    props: {
      report: {
        id: reportId,
        endTime,
        startTime,
        title,
        region: region.slug,
        fights: transformReportData(validFights, fightTables),
      },
      error: null,
    },
    revalidate: 5 * 60,
  };
};

const transformReportData = (
  fights: ReportType["fights"],
  fightTables: Record<string, Table>
): InitialFightInformation[] => {
  return (
    fights
      // ignore keys with more than 5 participants; broken log
      .filter(({ id }) => {
        const { playerDetails } = fightTables[id];

        return (
          [
            ...playerDetails.dps,
            ...playerDetails.healers,
            ...playerDetails.tanks,
          ].length === 5
        );
      })
      .map<InitialFightInformation>(
        ({
          id,
          keystoneAffixes: affixes,
          gameZone: { id: dungeonId },
          keystoneBonus: chests,
          endTime,
          startTime,
          keystoneTime,
          keystoneLevel,
          averageItemLevel,
        }) => {
          const table = fightTables[id];

          const {
            damageDone,
            damageTaken,
            deathEvents,
            healingDone,
            playerDetails,
          } = table;

          const tank = transformPlayer(
            playerDetails.tanks[0],
            Roles.tank,
            table,
            keystoneTime
          );
          const healer = transformPlayer(
            playerDetails.healers[0],
            Roles.healer,
            table,
            keystoneTime
          );
          const dps = playerDetails.dps.map((player) => {
            return transformPlayer(player, Roles.dps, table, keystoneTime);
          });

          return {
            group: {
              metrics: {
                dps: calcMetricAverage(keystoneTime, damageDone),
                dtps: calcMetricAverage(keystoneTime, damageTaken),
                hps: calcMetricAverage(keystoneTime, healingDone),
              },
              composition: [tank, healer, ...dps],
              totalDeaths: deathEvents.length,
              averageItemlevel: averageItemLevel.toFixed(2),
            },
            affixes,
            chests,
            dungeonId,
            id,
            keystoneLevel,
            keystoneTime,
            startTime,
            endTime,
          };
        }
      )
  );
};

export type Player = Pick<
  InDepthCharacterInformation,
  "server" | "name" | "guid"
> & {
  id: number;
  dps: number;
  hps: number;
  deaths: number;
  server: string;
  guid: number;
  name: string;
  role: Roles;
  className: PlayableClass;
  spec: string;
  itemLevel: number;
  legendary: Pick<Item, "effectID" | "effectIcon" | "effectName"> | null;
  covenant: {
    id: keyof Covenants;
    soulbind: {
      id: keyof SoulbindsType;
      talents: SoulbindTalent[];
      conduits: Conduit[];
    };
  };
  talents: Omit<Talent, "type">[];
};

const transformPlayer = (
  {
    id,
    name,
    guid,
    type: className,
    server,
    minItemLevel: itemLevel,
    specs: [spec],
    combatantInfo,
  }: InDepthCharacterInformation,
  role: Roles,
  table: Table,
  keystoneTime: number
): Player => {
  const legendary = extractLegendary(combatantInfo.gear);

  const covenant = {
    id: combatantInfo.covenantID,
    soulbind: {
      id: combatantInfo.soulbindID,
      talents: combatantInfo.artifact
        .filter((talent) => talent.guid !== 0)
        .map(({ name, abilityIcon, guid }) => ({ name, abilityIcon, guid })),
      conduits: combatantInfo.heartOfAzeroth.map(
        ({ name, guid, abilityIcon, total }) => ({
          name,
          abilityIcon,
          guid,
          total,
        })
      ),
    },
  };

  const talents = combatantInfo.talents.map(({ name, abilityIcon, guid }) => ({
    name,
    abilityIcon,
    guid,
  }));

  const deaths = table.deathEvents.filter((event) => event.guid === guid)
    .length;
  const dps = calcMetricAverage(keystoneTime, table.damageDone, guid);
  const hps = calcMetricAverage(keystoneTime, table.healingDone, guid);

  return {
    id,
    name,
    guid,
    deaths,
    dps,
    hps,
    server,
    role,
    className,
    spec,
    itemLevel,
    legendary,
    covenant,
    talents,
  };
};

const extractLegendary = (
  items: Item[]
): Required<Pick<Item, "effectID" | "effectIcon" | "effectName">> | null => {
  const legendary = items.find(
    (item) => item.quality === ItemQuality.LEGENDARY
  );

  if (legendary?.effectID && legendary?.effectIcon && legendary?.effectName) {
    const { effectID, effectIcon, effectName } = legendary;

    return {
      effectID,
      effectIcon,
      effectName,
    };
  }

  return null;
};
