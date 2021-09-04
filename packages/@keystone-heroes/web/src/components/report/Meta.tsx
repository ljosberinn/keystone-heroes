/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/anchor-is-valid */
import Link from "next/link";
import { useFight } from "src/pages/report/[reportID]/[fightID]";
import { createWCLUrl, fightTimeToString } from "src/utils";

import { AbilityIcon, WCL_ASSET_URL } from "../AbilityIcon";
import { ExternalLink } from "../ExternalLink";

export function Meta(): JSX.Element {
  const { reportID, fightID, fight } = useFight();

  if (!fight) {
    return <h1>loading</h1>;
  }

  return (
    <div className="w-full lg:w-2/6">
      <div className="justify-between md:flex lg:block">
        <h1 className="text-4xl font-bold">
          <ExternalLink href={createWCLUrl({ reportID, fightID })}>
            <span className="lg:hidden 2xl:inline-block">
              {fight.dungeon.name}
            </span>
            <span className="hidden lg:inline-block 2xl:hidden">
              {fight.dungeon.slug}
            </span>{" "}
            +{fight.meta.level}
          </ExternalLink>
        </h1>
        <div className="flex pt-2 space-x-1 md:pt-0 lg:pt-2">
          {fight.affixes.map((affix) => (
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
        <span>{fightTimeToString(fight.meta.time)}</span>
        <span className="italic text-green-500 dark:text-green-500">
          +{fightTimeToString(fight.dungeon.time - fight.meta.time)}
        </span>
        {fight.meta.totalDeaths > 0 && (
          <span
            className="italic text-red-500 dark:text-red-500"
            title={`${fight.meta.totalDeaths} deaths`}
          >
            -{fightTimeToString(fight.meta.totalDeaths * 5 * 1000, true)}
          </span>
        )}
      </div>
      {/* <-------> */}
      <div className="flex flex-col justify-between py-8 sm:flex-row lg:flex-col lg:space-y-2 lg:pb-0">
        {fight.player.map((player) => {
          return (
            <div
              className="flex justify-between sm:flex-col lg:flex-row"
              key={player.actorID}
            >
              <div className="flex space-x-2">
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
                {/* <WarcraftLogsProfileLink
                  name={player.name}
                  server={player.server}
                  region={player.region}
                />
                <RaiderIOLink
                  name={player.name}
                  server={player.server}
                  region={player.region}
                /> */}
              </div>
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

// type LinkProps = Pick<
//   MetaProps["player"][number],
//   "name" | "server" | "region"
// >;

// function RaiderIOLink({ name, server, region }: LinkProps): JSX.Element {
//   return (
//     <ExternalLink
//       href={`https://raider.io/characters/${region}/${server}/${name}`}
//     >
//       <img
//         src="/static/icons/rio.svg"
//         alt="Raider.io profile"
//         className="w-4 h-4"
//       />
//     </ExternalLink>
//   );
// }

// function WarcraftLogsProfileLink({
//   name,
//   server,
//   region,
// }: LinkProps): JSX.Element {
//   return (
//     <ExternalLink
//       href={`https://www.warcraftlogs.com/character/${region}/${server}/${name}`}
//     >
//       <img
//         src="/static/icons/wcl.png"
//         alt="WarcraftLogs profile"
//         className="w-4 h-4"
//       />
//     </ExternalLink>
//   );
// }
