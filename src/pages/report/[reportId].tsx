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
import type {
  Conduit,
  DamageDone,
  DamageTaken,
  HealingDone,
  InDepthCharacterInformation,
  Item,
  SoulbindTalent,
  Table,
  Talent,
} from "../../server/queries/fights";
import { retrieveFightTableCacheOrSource } from "../../server/queries/fights";
import type { Fight, Report as ReportType } from "../../server/queries/report";
import { retrieveReportCacheOrSource } from "../../server/queries/report";
import type { PlayableClass } from "../../types/classes";
import { Roles } from "../../types/roles";
import {
  calcMetricAverage,
  calcRunDuration,
  calcTimeLeft,
} from "../../utils/calc";
import { classnames } from "../../utils/classNames";
import type { Covenants, Soulbinds } from "../../utils/covenants";
import { soulbindMap, covenantMap } from "../../utils/covenants";
import type { Dungeon } from "../../utils/dungeons";
import { dungeons } from "../../utils/dungeons";

type InitialFightInformation = Pick<
  Fight,
  "keystoneLevel" | "id" | "keystoneTime" | "startTime" | "endTime"
> & {
  deaths: number;
  affixes: AffixesProps["affixes"];
  dungeonId: number;
  chests: Fight["keystoneBonus"];
  groupMetrics: {
    dps: number;
    hps: number;
    dtps: number;
  };
  group: Player[];
  averageItemlevel: string;
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
          const dungeon = dungeons.find(
            (dungeon) => dungeon.id === fight.dungeonId
          );

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
          <Composition composition={fight.group} />
        </td>
        <td className="text-right">{fight.averageItemlevel}</td>
        <td className="text-right">
          {fight.groupMetrics.dps.toLocaleString()}
        </td>
        <td className="text-right">
          {fight.groupMetrics.hps.toLocaleString()}
        </td>
        <td className="text-right">
          {fight.groupMetrics.dtps.toLocaleString()}
        </td>
        <td className="text-right">{fight.deaths}</td>
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
            <th className="text-right">Legendary</th>
            <th className="text-right">DPS</th>
            <th className="text-right">HPS</th>
            <th className="text-right">Deaths</th>
            <th className="text-center">Talents</th>
            <th>Covenant</th>
            <th className="text-center">Soulbinds</th>
            <th className="text-center">Conduits</th>
          </tr>
          {fight.group.map((player) => {
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
                <td className="text-right">{player.legendary?.id ?? "none"}</td>

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
                    {player.talents.map((talent, index) => {
                      return (
                        <Icon
                          src={`//assets.rpglogs.com/img/warcraft/abilities/${talent.abilityIcon}`}
                          alt={talent.name}
                          title={talent.name}
                          key={talent.guid}
                          className={index > 0 && "ml-1"}
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
                      title={covenantMap[player.covenant.id].name}
                    />
                    <Icon
                      src={soulbindMap[player.covenant.soulbind.id].icon}
                      alt={soulbindMap[player.covenant.soulbind.id].name}
                      title={soulbindMap[player.covenant.soulbind.id].name}
                      className="ml-1"
                    />
                  </div>
                </td>

                <td className="text-center">
                  <div className="flex justify-center">
                    {player.covenant.soulbind.talents.map((talent, index) => {
                      return (
                        <Icon
                          src={`//assets.rpglogs.com/img/warcraft/abilities/${talent.abilityIcon}`}
                          alt={talent.name}
                          title={talent.name}
                          className={index > 0 && "ml-1"}
                          key={talent.guid}
                        />
                      );
                    })}
                  </div>
                </td>

                <td className="text-center">
                  <div className="flex justify-center">
                    {player.covenant.soulbind.conduits.map((conduit, index) => {
                      return (
                        <Icon
                          src={`//assets.rpglogs.com/img/warcraft/abilities/${conduit.abilityIcon}`}
                          alt={conduit.name}
                          title={conduit.name}
                          className={index > 0 && "ml-1"}
                          key={conduit.guid}
                        />
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </>
      )}
    </>
  );
}

type IconProps = {
  src: string;
  alt: string;
  title?: string;
  className?: Parameters<typeof classnames>[0];
};

function Icon({ className, ...rest }: IconProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      loading="lazy"
      className={classnames("w-6 h-6", className)}
      {...rest}
    />
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

  const { startTime, endTime, title, region } = report;

  return {
    props: {
      report: {
        id: reportId,
        endTime,
        startTime,
        title,
        region: region.slug,
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
  return (
    report.fights
      // ignore keys out of time
      .filter((fight) => fight.keystoneBonus > 0)
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
            averageItemlevel: averageItemLevel.toFixed(2),
            group: [tank, healer, ...dps],
            affixes,
            chests,
            dungeonId,
            id,
            keystoneLevel,
            keystoneTime,
            startTime,
            endTime,
            deaths: deathEvents.length,
            groupMetrics: {
              dps: calcMetricAverage(keystoneTime, damageDone),
              dtps: calcMetricAverage(keystoneTime, damageTaken),
              hps: calcMetricAverage(keystoneTime, healingDone),
            },
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
  legendary: Item | null;
  covenant: {
    id: keyof Covenants;
    soulbind: {
      id: keyof Soulbinds;
      talents: Omit<SoulbindTalent, "type" | "total">[];
      conduits: Omit<Conduit, "type">[];
    };
  };
  talents: Omit<Talent, "type">[];
};

const transformPlayer = (
  player: InDepthCharacterInformation,
  role: Roles,
  table: Table,
  keystoneTime: number
): Player => {
  const filter = <
    T extends Pick<DamageDone | HealingDone | DamageTaken, "guid">
  >(
    event: T
  ) => event.guid === player.guid;

  return {
    id: player.id,
    name: player.name,
    guid: player.guid,
    deaths: table.deathEvents.filter(filter).length,
    dps: calcMetricAverage(keystoneTime, table.damageDone, player.guid),
    hps: calcMetricAverage(keystoneTime, table.healingDone, player.guid),
    server: player.server,
    role,
    className: player.type,
    spec: player.specs[0],
    itemLevel: player.minItemLevel,
    legendary:
      player.combatantInfo.gear.find((item) => item.quality === 5) ?? null,
    covenant: {
      id: player.combatantInfo.covenantID,
      soulbind: {
        id: player.combatantInfo.soulbindID,
        talents: player.combatantInfo.artifact
          .filter((talent) => talent.guid !== 0)
          .map(({ name, abilityIcon, guid }) => ({ name, abilityIcon, guid })),
        conduits: player.combatantInfo.heartOfAzeroth.map(
          ({ name, guid, abilityIcon, total }) => ({
            name,
            abilityIcon,
            guid,
            total,
          })
        ),
      },
    },
    talents: player.combatantInfo.talents.map(
      ({ name, abilityIcon, guid }) => ({ name, abilityIcon, guid })
    ),
  };
};
