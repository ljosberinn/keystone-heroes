import { useState } from "react";

import type { FightSuccessResponse } from "../../../api/functions/fight";
import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import { useToggle } from "../../hooks/useToggle";
import { asc, desc, reset, sort, star } from "../../icons";
import {
  covenants,
  soulbinds,
  tormentedPowers,
  dungeons,
  legendaries,
  conduits,
  talents,
  covenantTraits,
} from "../../staticData";
import {
  bgPrimary,
  bgSecondary,
  greenText,
  hoverShadow,
  redText,
  yellowText,
} from "../../styles/tokens";
import {
  createWCLUrl,
  timeDurationToString,
  createWowheadUrl,
} from "../../utils";
import { classnames } from "../../utils/classnames";
import { getClassAndSpecName } from "../../utils/player";
import { AbilityIcon, STATIC_ICON_PREFIX } from "../AbilityIcon";
import { Affixes } from "../Affixes";
import { ErrorBoundary } from "../ErrorBoundary";
import { ExternalLink } from "../ExternalLink";
import { SpecIcon } from "../SpecIcon";

export function Meta(): JSX.Element {
  const { fight, fightID, reportID } = useFight();

  const dungeon = dungeons[fight.dungeon];

  return (
    <section
      className={`flex flex-col flex-1 h-auto ${hoverShadow} rounded-b-lg`}
      aria-labelledby="meta-title"
    >
      <div className={`rounded-t-lg ${bgSecondary}`}>
        <div className="justify-between p-4 md:flex lg:block">
          <Heading chests={fight.meta.chests} level={fight.meta.level} />

          <Affixes ids={fight.affixes} className="pt-4 md:pt-0 lg:pt-4" />
        </div>

        {/* <-------> */}

        <TimeInformation
          meta={fight.meta}
          dungeon={dungeon}
          fightID={fightID}
          reportID={reportID}
        />

        <div className="flex justify-between w-full p-4 pt-0">
          <span className="flex self-end space-x-1">
            <span
              className={
                fight.meta.percent > 102
                  ? redText
                  : fight.meta.percent > 101
                  ? yellowText
                  : fight.meta.percent >= 100
                  ? greenText
                  : redText
              }
            >
              {fight.meta.percent.toFixed(2)}%
            </span>
            <span>trash cleared</span>
          </span>

          <DungeonCovenantRequirementIndicator
            dungeon={dungeon}
            player={fight.player}
          />
        </div>
      </div>

      {/* <-------> */}

      <div className={`h-full p-4 rounded-b-lg ${bgPrimary}`}>
        <PlayerTable
          player={fight.player}
          dps={fight.meta.dps}
          hps={fight.meta.hps}
          reportID={reportID}
          fightID={fightID}
          averageItemLevel={fight.meta.averageItemLevel}
        />
      </div>
    </section>
  );
}

type LinkProps = Pick<
  FightSuccessResponse["player"][number],
  "name" | "server" | "region"
>;

function RaiderIOLink({ name, server, region }: LinkProps): JSX.Element {
  return (
    <ExternalLink
      href={`https://raider.io/characters/${region}/${server}/${name}`}
      className="flex justify-center"
    >
      <img
        src="/static/icons/rio.svg"
        alt={`Visit Raider.io profile of ${name}`}
        title={`Visit Raider.io profile of ${name}`}
        className="w-6 h-6"
        width={24}
        height={24}
        loading="lazy"
      />
    </ExternalLink>
  );
}

function WarcraftLogsProfileLink({
  name,
  server,
  region,
}: LinkProps): JSX.Element {
  const alt = `Visit Warcraft Logs profile of ${name}`;

  return (
    <ExternalLink
      href={`https://www.warcraftlogs.com/character/${region}/${server}/${name}?zone=25`}
      className="flex justify-center"
    >
      <img
        src="/static/icons/wcl.png"
        alt={alt}
        title={alt}
        className="w-6 h-6"
        width={24}
        height={24}
        loading="lazy"
      />
    </ExternalLink>
  );
}

type TimeInformationProps = {
  meta: FightSuccessResponse["meta"];
  dungeon: typeof dungeons[number];
  reportID: string;
  fightID: string;
};

function TimeInformation({
  meta,
  dungeon,
  fightID,
  reportID,
}: TimeInformationProps) {
  // threshold of +750 due to API <-> ingame inconsistencies
  const isTimed = meta.time - 750 <= dungeon.time;

  return (
    <div className="flex justify-between p-4 pt-0 text-2xl">
      <span className="space-x-2">
        <span>{timeDurationToString(meta.time)}</span>
        <span
          className={`italic ${isTimed ? greenText : redText}`}
          title={`${meta.chests} chest${meta.chests > 1 ? "s" : ""}`}
        >
          {isTimed ? "+" : "-"}
          {timeDurationToString(
            isTimed ? dungeon.time - meta.time : meta.time - dungeon.time
          )}
        </span>
      </span>
      {meta.totalDeaths > 0 && (
        <ExternalLink
          className={`flex space-x-1 ${redText}`}
          href={createWCLUrl({
            reportID,
            fightID,
            type: "deaths",
          })}
          title={`lost ${timeDurationToString(meta.totalDeaths * 5 * 1000, {
            omitMs: true,
          })} due to deaths`}
        >
          <span>{meta.totalDeaths}</span>
          <img
            src="/static/skull.png"
            height={32}
            width={32}
            loading="lazy"
            className="w-8 h-8"
            alt="deaths"
          />
        </ExternalLink>
      )}
    </div>
  );
}

type DungeonCovenantRequirementIndicatorProps = {
  dungeon: typeof dungeons[keyof typeof dungeons];
  player: FightSuccessResponse["player"];
};

function DungeonCovenantRequirementIndicator({
  dungeon,
  player,
}: DungeonCovenantRequirementIndicatorProps) {
  if (!dungeon.covenant || !(dungeon.covenant in covenants)) {
    return null;
  }

  const covenant = covenants[dungeon.covenant];

  const fulfillsRequirement = player.some(
    (player) => player.covenant === dungeon.covenant
  );

  return (
    <span>
      <img
        src={`${STATIC_ICON_PREFIX + covenant.icon}.jpg`}
        alt={covenant.name}
        loading="lazy"
        className={classnames(
          "w-8 h-8 rounded-full",
          !fulfillsRequirement && "grayscale opacity-60"
        )}
        title={
          fulfillsRequirement
            ? "dungeon covenant requirement fulfilled"
            : `missing a player affiliated with the ${covenant.name}`
        }
      />
    </span>
  );
}

type PlayerRowProps = {
  player: FightSuccessResponse["player"][number];
  reportID: string;
  fightID: string;
};

function PlayerRow({ player, fightID, reportID }: PlayerRowProps) {
  const [open, toggle] = useToggle(false);
  const { colors, specName, className } = getClassAndSpecName(player);

  const hasNoFurtherData =
    player.talents.length === 0 && player.conduits.length === 0;

  return (
    <ErrorBoundary key={player.actorID}>
      <tr>
        <td className="flex h-10 px-0 space-x-2">
          <span className="flex items-center w-full space-x-2">
            <span className="inline-flex items-center w-full">
              <span className="w-8 h-8">
                <SpecIcon
                  class={className}
                  spec={specName}
                  className={`border-2 ${colors.border}`}
                />
              </span>
              {player.covenant ? (
                <span className="w-4 h-4 ml-2">
                  <img
                    src={`https://assets.rpglogs.com/img/warcraft/abilities/${
                      covenants[player.covenant].icon
                    }.jpg`}
                    alt={covenants[player.covenant].name}
                    title={covenants[player.covenant].name}
                    className="relative object-cover w-full h-full rounded-full -top-4 -left-4"
                    width={16}
                    height={16}
                    loading="lazy"
                  />
                </span>
              ) : null}
              <button
                type="button"
                onClick={toggle}
                disabled={hasNoFurtherData}
                className={classnames(
                  colors.border,
                  player.covenant ? "-ml-3" : "pl-2",
                  "border-b-2 dark:border-opacity-50 flex-grow flex"
                )}
              >
                <span>{player.name}</span>
                {!hasNoFurtherData && (
                  <sup
                    className="hidden lg:inline"
                    title="click to toggle more info"
                  >
                    <svg className="inline w-4 h-4 ml-1 text-black dark:text-white">
                      <use href="#outline-question-circle" />
                    </svg>
                  </sup>
                )}
              </button>
            </span>
          </span>
        </td>

        <td className="px-0 text-right">
          <span
            className={`${colors.border} border-b-2 dark:border-opacity-50 text-right flex flex-grow justify-end`}
          >
            {player.itemLevel}
          </span>
        </td>
        <td className="px-0 text-right">
          <ExternalLink
            href={createWCLUrl({
              reportID,
              fightID,
              type: "damage-done",
              source: player.actorID,
            })}
            className={`${colors.border} border-b-2 dark:border-opacity-50 text-right flex flex-grow justify-end`}
          >
            {player.dps.toLocaleString("en-US")}
          </ExternalLink>
        </td>
        <td className="px-0">
          <ExternalLink
            href={createWCLUrl({
              reportID,
              fightID,
              type: "healing",
              source: player.actorID,
            })}
            className={`${colors.border} border-b-2 dark:border-opacity-50 text-right flex flex-grow justify-end`}
          >
            {player.hps.toLocaleString("en-US")}
          </ExternalLink>
        </td>
      </tr>
      <tr>
        <td colSpan={3} className="px-0">
          <div className="flex h-10 space-x-1">
            <div
              className={`${colors.border} relative w-4 h-4 mr-4 border-b-2 dark:border-opacity-50 border-l-2 border-solid left-4`}
            />
            {player.legendaries.map((id) => {
              if (!(id in legendaries)) {
                return null;
              }

              const { name, icon } = legendaries[id];

              return (
                <ExternalLink
                  href={createWowheadUrl({
                    category: "spell",
                    id,
                  })}
                  className="w-6 h-6"
                  key={id}
                >
                  <AbilityIcon
                    icon={icon}
                    alt={name}
                    className="object-cover w-full h-full rounded-full"
                    width={24}
                    height={24}
                  />
                </ExternalLink>
              );
            })}

            {player.soulbind ? (
              <>
                {player.legendaries.length > 0 ? <span>|</span> : null}
                <div className="w-6 h-6">
                  <img
                    // TODO: store assets locally
                    src={`https://assets.rpglogs.com/img/warcraft/soulbinds/soulbind-${player.soulbind}.jpg`}
                    alt={soulbinds[player.soulbind].name}
                    title={soulbinds[player.soulbind].name}
                    className="object-cover w-full h-full rounded-full"
                    width={24}
                    height={24}
                    loading="lazy"
                  />
                </div>
              </>
            ) : null}

            {player.tormented.length > 0 ? (
              <>
                {player.soulbind ? <span>|</span> : null}
                {player.tormented.map((id, index) => {
                  const power = tormentedPowers[id];

                  return (
                    <span
                      className="w-6 h-6"
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${id}-${index}`}
                    >
                      <ExternalLink
                        href={createWowheadUrl({
                          category: "spell",
                          id,
                        })}
                      >
                        <AbilityIcon
                          icon={power.icon}
                          alt={power.name ?? "Skipped"}
                          className="object-cover w-full h-full rounded-full"
                          width={24}
                          height={24}
                        />
                      </ExternalLink>
                    </span>
                  );
                })}
              </>
            ) : null}
          </div>
        </td>
        <td>
          {player.server === "Anonymous" ? null : (
            <div className="flex justify-end h-10 space-x-1">
              <span className="lg:hidden xl:inline">
                <WarcraftLogsProfileLink
                  name={player.name}
                  server={player.server}
                  region={player.region}
                />
              </span>
              <span className="lg:hidden xl:inline">
                <RaiderIOLink
                  name={player.name}
                  server={player.server}
                  region={player.region}
                />
              </span>
            </div>
          )}
        </td>
      </tr>
      {open ? (
        <>
          <tr>
            <td colSpan={4}>
              <div className="flex h-10 space-x-1">
                <div
                  className={`${colors.border} relative w-4 h-4 mr-4 border-b-2 dark:border-opacity-50 border-l-2 border-solid left-4`}
                />

                {player.talents.map((id) => {
                  if (!(id in talents)) {
                    return null;
                  }

                  const { icon, name } = talents[id];

                  return (
                    <span className="w-6 h-6" key={id}>
                      <ExternalLink
                        href={createWowheadUrl({
                          category: "spell",
                          id,
                        })}
                      >
                        <AbilityIcon
                          icon={icon}
                          alt={name}
                          className="object-cover w-full h-full rounded-full"
                          width={24}
                          height={24}
                        />
                      </ExternalLink>
                    </span>
                  );
                })}
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <div className="flex h-10 space-x-1">
                <div
                  className={`${colors.border} relative w-4 h-4 mr-4 border-b-2 dark:border-opacity-50 border-l-2 border-solid left-4`}
                />

                {player.conduits.map((conduit) => {
                  if (!(conduit.id in conduits)) {
                    return null;
                  }

                  const { icon, name } = conduits[conduit.id];

                  const url = createWowheadUrl({
                    category: "spell",
                    id: conduit.id,
                  });

                  return (
                    <span className="w-6 h-6" key={conduit.id}>
                      <ExternalLink href={`${url}&ilvl=${conduit.itemLevel}`}>
                        <AbilityIcon
                          icon={icon}
                          alt={`${name} @ ${conduit.itemLevel}`}
                          className="object-cover w-full h-full rounded-full"
                          width={24}
                          height={24}
                        />
                      </ExternalLink>
                    </span>
                  );
                })}
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <div className="flex h-10 space-x-1">
                <div
                  className={`${colors.border} relative w-4 h-4 mr-4 border-b-2 dark:border-opacity-50 border-l-2 border-solid left-4`}
                />

                {player.covenantTraits.map((id) => {
                  if (!(id in covenantTraits)) {
                    return null;
                  }

                  const { icon, name } = covenantTraits[id];

                  return (
                    <span className="w-6 h-6" key={name}>
                      <ExternalLink
                        href={createWowheadUrl({
                          category: "spell",
                          id,
                        })}
                      >
                        <AbilityIcon
                          icon={icon}
                          alt={name}
                          className="object-cover w-full h-full rounded-full"
                          width={24}
                          height={24}
                        />
                      </ExternalLink>
                    </span>
                  );
                })}
              </div>
            </td>
          </tr>
        </>
      ) : null}
    </ErrorBoundary>
  );
}

type PlayerTableProps = {
  player: FightSuccessResponse["player"];
  reportID: string;
  fightID: string;
} & Pick<FightSuccessResponse["meta"], "averageItemLevel" | "dps" | "hps">;

const isSortedColor = "text-stone-400 dark:text-stone-500";

function PlayerTable({
  fightID,
  player,
  reportID,
  averageItemLevel,
  dps,
  hps,
}: PlayerTableProps) {
  const [sortBy, setSortBy] = useState<SortIndicatorProps["sortBy"]>("role");
  const [sortOrder, setSortOrder] =
    useState<SortIndicatorProps["sortOrder"]>(null);

  const sortedPlayer = [...player].sort((a, b) => {
    if (sortBy === "dps") {
      return a.dps - b.dps;
    }
    if (sortBy === "hps") {
      return a.hps - b.hps;
    }

    if (sortBy === "ilvl") {
      return a.itemLevel - b.itemLevel;
    }

    // role sorting happens on the backend, so just pick initial state
    return 1;
  });

  const orderedPlayer = sortOrder
    ? sortOrder === "asc"
      ? sortedPlayer
      : sortedPlayer.reverse()
    : sortedPlayer;

  function createSortHandler(key: typeof sortBy) {
    return () => {
      if (key === "role") {
        setSortBy("role");
        setSortOrder(null);
        return;
      }

      if (sortBy !== key) {
        setSortBy(key);
        setSortOrder("desc");
        return;
      }

      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="px-0 text-left">
            <button
              type="button"
              className="flex w-full pb-4 space-x-2 text-xl font-semibold"
              onClick={createSortHandler("role")}
            >
              <span>Composition</span>
              <sup className="flex self-center" title="reset sorting">
                <svg
                  className={`w-2 h-2 ${
                    sortBy === "role" ? isSortedColor : "dark:text-white"
                  }`}
                >
                  <use href={`#${reset.id}`} />
                </svg>
              </sup>
            </button>
          </th>
          <th className="px-0">
            <button
              type="button"
              className="flex justify-end w-full pb-4 font-semibold"
              onClick={createSortHandler("ilvl")}
            >
              <span>
                <span className="hidden xl:inline">Itemlevel</span>
                <span className="inline xl:hidden">ILVL</span>
              </span>
              <span className="flex self-center">
                <SortIndicator
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  type="ilvl"
                />
              </span>
            </button>
          </th>
          <th className="px-0">
            <button
              type="button"
              className="flex justify-end w-full pb-4 font-semibold"
              onClick={createSortHandler("dps")}
            >
              <span>DPS</span>
              <span className="flex self-center">
                <SortIndicator
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  type="dps"
                />
              </span>
            </button>
          </th>
          <th className="px-0">
            <button
              type="button"
              className="flex justify-end w-full pb-4 font-semibold"
              onClick={createSortHandler("hps")}
            >
              <span>HPS</span>
              <span className="flex self-center">
                <SortIndicator
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  type="hps"
                />
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {orderedPlayer.map((player) => {
          return (
            <PlayerRow
              key={player.actorID}
              player={player}
              reportID={reportID}
              fightID={fightID}
            />
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={2} className="text-right">
            Ø {averageItemLevel}
          </td>
          <td className="text-right">{dps.toLocaleString("en-US")}</td>
          <td className="text-right">{hps.toLocaleString("en-US")}</td>
        </tr>
      </tfoot>
    </table>
  );
}

type SortIndicatorProps = {
  sortBy: "role" | "dps" | "hps" | "ilvl";
  sortOrder: "asc" | "desc" | null;
  type: Exclude<SortIndicatorProps["sortBy"], "role">;
};

function SortIndicator({ sortBy, sortOrder, type }: SortIndicatorProps) {
  return (
    <svg className={classnames("w-4 h-4", sortBy !== type && isSortedColor)}>
      <use
        href={`#${
          sortBy === type ? (sortOrder === "asc" ? asc.id : desc.id) : sort.id
        }`}
      />
    </svg>
  );
}

type HeadingProps = {
  chests: number;
  level: number;
};

function Heading({ chests, level }: HeadingProps) {
  const { reportID, fightID, fight } = useFight();
  const dungeon = dungeons[fight.dungeon];

  return (
    <h2 className="text-3xl font-bold" id="meta-title">
      <ExternalLink href={createWCLUrl({ reportID, fightID })}>
        <span className="lg:hidden 2xl:inline-block hover:underline">
          {dungeon.name}
        </span>
        <span className="hidden lg:inline-block 2xl:hidden hover:underline">
          {dungeon.slug}
        </span>
        <span> +{level}</span>
      </ExternalLink>
      <sup className="hidden pl-2 space-x-1 sm:inline">
        {Array.from({ length: chests }, (_, index) => (
          <svg
            key={index}
            className={`inline w-4 h-4 ${yellowText} fill-current`}
          >
            <use href={`#${star.id}`} />
          </svg>
        ))}
      </sup>
    </h2>
  );
}
