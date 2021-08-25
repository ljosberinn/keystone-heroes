/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/anchor-is-valid */
import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import Link from "next/link";
import { fightTimeToString } from "src/utils";

import { AbilityIcon, WCL_ASSET_URL } from "../AbilityIcon";
import { ExternalLink } from "../ExternalLink";

type MetaProps = Pick<
  FightSuccessResponse,
  "dungeon" | "meta" | "player" | "affixes"
> & {
  reportID: string;
  fightID: string;
};

export function Meta({
  dungeon,
  meta,
  player,
  affixes,
  reportID,
  fightID,
}: MetaProps): JSX.Element {
  return (
    <div className="w-full lg:w-2/6">
      <div className="justify-between md:flex lg:block">
        <h1 className="text-4xl font-bold">
          <ExternalLink
            href={`https://warcraftlogs.com/reports/${reportID}#fight=${fightID}`}
          >
            <span className="lg:hidden 2xl:inline-block">{dungeon.name}</span>
            <span className="hidden lg:inline-block 2xl:hidden">
              {dungeon.slug}
            </span>{" "}
            +{meta.level}
          </ExternalLink>
        </h1>
        <div className="flex pt-2 space-x-1 md:pt-0 lg:pt-2">
          {affixes.map((affix) => (
            <div key={affix.name} className="w-10 h-10">
              <img
                src={`${WCL_ASSET_URL}${affix.icon}`}
                alt={affix.name}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          ))}
        </div>
      </div>
      {/* <-------> */}
      <div className="flex pt-2 space-x-2 text-2xl lg:flex-col lg:space-x-0">
        <span>{fightTimeToString(meta.time)}</span>
        <span className="italic text-green-500 dark:text-green-500">
          +{fightTimeToString(dungeon.time - meta.time)}
        </span>
        {meta.totalDeaths > 0 && (
          <span
            className="italic text-red-500 dark:text-red-500"
            title={`${meta.totalDeaths} deaths`}
          >
            -{fightTimeToString(meta.totalDeaths * 5 * 1000, true)}
          </span>
        )}
      </div>
      {/* <-------> */}
      <div className="flex flex-col justify-between py-8 sm:flex-row lg:flex-col lg:space-y-2 lg:pb-0">
        {player.map((player) => {
          return (
            <div
              className="flex justify-between sm:flex-col lg:flex-row"
              key={player.actorID}
            >
              <Link
                href={`/character/${player.region.toLowerCase()}/${player.server.toLowerCase()}/${player.name.toLowerCase()}`}
                key={player.actorID}
                prefetch={false}
              >
                <a
                  className="flex items-center space-x-2"
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line no-alert
                    alert("not yet implemented");
                  }}
                >
                  <div className="w-8 h-8">
                    <img
                      src={`/static/specs/${player.class}-${player.spec.name}.jpg`}
                      alt={`${player.spec.name} ${player.class}`}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>{" "}
                  <span>{player.name}</span>{" "}
                </a>
              </Link>
              <div className="flex pt-2">
                {player.tormented.map((powerPickupEvent) => {
                  return (
                    <div key={powerPickupEvent?.timestamp} className="w-8 h-8">
                      <AbilityIcon
                        icon={powerPickupEvent?.ability?.icon}
                        alt={powerPickupEvent?.ability?.name ?? "Skipped"}
                        className="object-cover w-full h-full rounded-full"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* <div>
        <p>Total Percent - {meta.percent}%</p>
        <p>Chests - {meta.chests}</p>
        <p>DPS - {meta.dps.toLocaleString("en-US")}</p>
        <p>HPS - {meta.hps.toLocaleString("en-US")}</p>
        <p>DTPS - {meta.dtps.toLocaleString("en-US")}</p>
        <p>Avg ItemLevel - {meta.averageItemLevel}</p>
        <p>Rating - {meta.rating}</p>
      </div> */}
    </div>
  );
}
