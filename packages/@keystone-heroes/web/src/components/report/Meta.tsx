/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/anchor-is-valid */
import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import Link from "next/link";
import { Fragment } from "react";

import { useStaticData } from "../../context/StaticData";
import { icons } from "../../icons";
import { useFight } from "../../pages/report/[reportID]/[fightID]";
import { bgPrimary, greenText, redText } from "../../styles/tokens";
import {
  createWCLUrl,
  fightTimeToString,
  createWowheadUrl,
  classBorderColorMap,
} from "../../utils";
import { classnames } from "../../utils/classnames";
import { AbilityIcon } from "../AbilityIcon";
import { ExternalLink } from "../ExternalLink";
import { SpecIcon } from "../SpecIcon";

export function Meta(): JSX.Element {
  const { reportID, fightID, fight } = useFight();

  const { classes, dungeons, affixes, tormentedPowers, soulbinds, covenants } =
    useStaticData();

  if (!fight) {
    return <h1>loading</h1>;
  }

  const dungeon = dungeons[fight.dungeon];

  return (
    <section
      className="flex flex-col flex-1 h-auto"
      aria-labelledby="meta-title"
    >
      <div className={`rounded-t-lg shadow-sm ${bgPrimary}`}>
        <div className="justify-between p-4 md:flex lg:block ">
          <h1 className="text-3xl font-bold" id="meta-title">
            <ExternalLink href={createWCLUrl({ reportID, fightID })}>
              <span className="lg:hidden 2xl:inline-block">{dungeon.name}</span>
              <span className="hidden lg:inline-block 2xl:hidden">
                {dungeon.slug}
              </span>{" "}
              +{fight.meta.level}
            </ExternalLink>
            <sup className="hidden pl-2 space-x-1 sm:inline">
              {Array.from({ length: fight.meta.chests }, (_, index) => (
                <svg
                  key={index}
                  className="inline w-4 h-4 text-yellow-500 fill-current"
                >
                  <use href={`#${icons.star.id}`} />
                </svg>
              ))}
            </sup>
          </h1>

          <div className="flex pt-4 space-x-1 space-x-2 md:pt-0 lg:pt-4">
            {fight.affixes.map((affix) => (
              <ExternalLink
                href={createWowheadUrl({
                  category: "affix",
                  id: affix,
                })}
                key={affix}
                className="w-10 h-10"
              >
                <AbilityIcon
                  icon={affixes[affix].icon}
                  alt={affixes[affix].name}
                  title={affixes[affix].name}
                  className="object-cover w-full h-full rounded-full"
                />
              </ExternalLink>
            ))}
          </div>
        </div>

        {/* <-------> */}

        <div className="flex p-4 pt-0 space-x-2 text-2xl">
          <span>{fightTimeToString(fight.meta.time)}</span>
          <span
            className={`italic ${greenText}`}
            title={`${fight.meta.chests} chest${
              fight.meta.chests > 1 ? "s" : ""
            }`}
          >
            +{fightTimeToString(dungeon.time - fight.meta.time)}
          </span>
          {fight.meta.totalDeaths > 0 && (
            <span className={`italic ${redText}`}>
              -{fightTimeToString(fight.meta.totalDeaths * 5 * 1000, true)}
            </span>
          )}
        </div>

        <div className="p-4 pt-0">
          <span
            className={
              fight.meta.percent < 101
                ? greenText
                : fight.meta.percent < 103
                ? "text-yellow-600"
                : redText
            }
          >
            {fight.meta.percent.toFixed(2)}%
          </span>{" "}
          trash cleared
        </div>
      </div>

      {/* <-------> */}

      <div className="h-full p-4 rounded-b-lg shadow-sm bg-coolgray-100 dark:bg-coolgray-600">
        <style jsx>
          {`
            .paddingLessTable th,
            td {
              padding-left: 0;
              padding-right: 0;
            }
          `}
        </style>
        <table className="w-full paddingLessTable">
          <thead>
            <tr>
              <th className="text-xl text-left h-14">Composition</th>
              <th className="text-right">
                <span className="hidden xl:inline">Itemlevel</span>
                <span className="inline xl:hidden">ILVL</span>
              </th>
              <th className="text-right">DPS</th>
              <th className="text-right">HPS</th>
            </tr>
          </thead>
          <tbody>
            {fight.player.map((player) => {
              const { name, specs } = classes[player.class];
              const spec = specs.find((spec) => spec.id === player.spec);

              if (!spec) {
                return null;
              }

              const classColor = classBorderColorMap[name.toLowerCase()];

              return (
                <Fragment key={player.actorID}>
                  <tr>
                    <td className="flex h-10 space-x-2">
                      <Link
                        href={`/character/${player.region.toLowerCase()}/${player.server.toLowerCase()}/${player.name.toLowerCase()}`}
                        key={player.actorID}
                        prefetch={false}
                      >
                        <a
                          className="flex items-center w-full space-x-2"
                          onClick={(event) => {
                            event.preventDefault();
                            // eslint-disable-next-line no-alert
                            alert("not yet implemented");
                          }}
                        >
                          <span className="inline-flex items-center w-full">
                            <span className="w-8 h-8">
                              <SpecIcon class={name} spec={spec.name} />
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
                                />
                              </span>
                            ) : null}
                            <span
                              className={classnames(
                                classColor,
                                player.covenant ? "-ml-3" : "pl-2",
                                "border-b-2 dark:border-opacity-50 flex-grow"
                              )}
                            >
                              {player.name}
                            </span>
                          </span>
                        </a>
                      </Link>
                    </td>

                    <td className="text-right">
                      <span
                        className={`${classColor} border-b-2 dark:border-opacity-50 text-right flex flex-grow justify-end`}
                      >
                        {player.itemLevel}
                      </span>
                    </td>
                    <td className="text-right">
                      <span
                        className={`${classColor} border-b-2 dark:border-opacity-50 text-right flex flex-grow justify-end`}
                      >
                        {player.dps.toLocaleString("en-US")}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${classColor} border-b-2 dark:border-opacity-50 text-right flex flex-grow justify-end`}
                      >
                        {player.hps.toLocaleString("en-US")}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <div className="flex h-10 space-x-1">
                        <div
                          className={`${classColor} relative w-4 h-4 mr-4 border-b-2 dark:border-opacity-50 border-l-2 border-solid left-4`}
                        />
                        {player.legendary ? (
                          <>
                            <ExternalLink
                              href={createWowheadUrl({
                                category: "spell",
                                id: player.legendary.id,
                              })}
                              className="w-6 h-6"
                            >
                              <AbilityIcon
                                icon={player.legendary.effectIcon}
                                alt={player.legendary.effectName}
                                className="object-cover w-full h-full rounded-full"
                              />
                            </ExternalLink>
                            <span>|</span>
                          </>
                        ) : null}
                        {player.soulbind ? (
                          <>
                            <div className="w-6 h-6">
                              <img
                                // TODO: store assets locally
                                src={`https://assets.rpglogs.com/img/warcraft/soulbinds/soulbind-${player.soulbind}.jpg`}
                                alt={soulbinds[player.soulbind].name}
                                title={soulbinds[player.soulbind].name}
                                className="object-cover w-full h-full rounded-full"
                              />
                            </div>
                            <span>|</span>
                          </>
                        ) : null}
                        {player.tormented.map((id, index) => {
                          const power = tormentedPowers[id];

                          return (
                            <span
                              className="w-6 h-6"
                              // eslint-disable-next-line react/no-array-index-key
                              key={`${id}-${index}}`}
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
                                />
                              </ExternalLink>
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td>
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
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="text-right">
                Ø {fight.meta.averageItemLevel}
              </td>
              <td className="text-right">
                {fight.meta.dps.toLocaleString("en-US")}
              </td>
              <td className="text-right">
                {fight.meta.hps.toLocaleString("en-US")}
              </td>
            </tr>
          </tfoot>
        </table>
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
      />
    </ExternalLink>
  );
}

function WarcraftLogsProfileLink({
  name,
  server,
  region,
}: LinkProps): JSX.Element {
  return (
    <ExternalLink
      href={`https://www.warcraftlogs.com/character/${region}/${server}/${name}`}
      className="flex justify-center"
    >
      <img
        src="/static/icons/wcl.png"
        alt={`Visit WarcraftLogs profile of ${name}`}
        title={`Visit WarcraftLogs profile of ${name}`}
        className="w-6 h-6"
      />
    </ExternalLink>
  );
}
