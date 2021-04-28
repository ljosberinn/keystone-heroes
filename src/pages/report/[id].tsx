import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import type { AffixesProps } from "../../client/components/Affixes";
import { Affixes } from "../../client/components/Affixes";
import { Chests } from "../../client/components/Chests";
import { Composition } from "../../client/components/Composition";
import { Conduits } from "../../client/components/Conduits";
import { ExternalLink } from "../../client/components/ExternalLink";
import { Icon } from "../../client/components/Icon";
import { Soulbinds } from "../../client/components/Soulbinds";
import { isValidReportId } from "../../server/api";
import type { Fight, Report as ReportType } from "../../server/queries/report";
import { calcRunDuration, calcTimeLeft } from "../../utils/calc";
import { soulbindMap, covenantMap } from "../../utils/covenants";
import type { Dungeon, Dungeons } from "../../utils/dungeons";
import { dungeons } from "../../utils/dungeons";
import type { Player } from "../api/report";

export type UIFight = Pick<Fight, "keystoneLevel" | "id" | "keystoneTime"> & {
  affixes: AffixesProps["affixes"];
  dungeonId: keyof Dungeons;
  chests: Fight["keystoneBonus"];
  dps: number;
  hps: number;
  dtps: number;
  totalDeaths: number;
  averageItemLevel: number;
  composition: Player[];
};

export type UIFightsResponse = Pick<
  ReportType,
  "title" | "endTime" | "startTime"
> & {
  id: string;
  fights: UIFight[];
  region: string;
};

export default function Report(): JSX.Element | null {
  const [report, setReport] = useState<null | UIFightsResponse>(null);
  const { query } = useRouter();

  useEffect(() => {
    if (isValidReportId(query.id)) {
      fetch(`/api/report?id=${query.id}`)
        .then((response) => response.json())
        .then(setReport)
        .catch(console.error);
    }
  }, [query]);

  if (!report) {
    return (
      <>
        <Head>
          <title>{query.reportId ?? "unknown report"}</title>
        </Head>
        <h1>retrieving data</h1>
      </>
    );
  }

  const reportUrl = `https://www.warcraftlogs.com/reports/${report.id}`;

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
  fight: UIFight;
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
              <tr key={player.guid}>
                <td>
                  <ExternalLink
                    href={`https://www.warcraftlogs.com/character/${region}/${player.server}/${player.name}`}
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
                          href={`https://www.wowhead.com/spell=${player.legendary.effectID}`}
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
