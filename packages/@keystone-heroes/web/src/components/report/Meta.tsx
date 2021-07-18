import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import Link from "next/link";
// import { useFightIDContext } from "src/pages/report/[reportID]/[fightID]";
import { fightTimeToString } from "src/utils";

import { TormentedPowers } from "./TormentedPowers";
import { findTormentedLieutenantPull } from "./utils";

type MetaProps = Pick<
  FightSuccessResponse,
  "dungeon" | "meta" | "player" | "pulls"
>;

export function Meta({ dungeon, meta, player, pulls }: MetaProps): JSX.Element {
  return (
    <div className="w-full lg:w-2/6">
      <h1 className="text-4xl font-bold">
        {dungeon.name} +{meta.level}
      </h1>
      <h2 className="pt-2 text-3xl">
        {fightTimeToString(meta.time)}{" "}
        <span className="italic text-green-400 dark:text-green-500">
          +{fightTimeToString(dungeon.time - meta.time)}
        </span>
      </h2>
      <div className="flex justify-between pt-4">
        <div className="flex space-x-1">
          {player.map((player) => (
            <div key={player.actorID} className="w-8 h-8">
              <Link
                href={`/character/${player.region.toLowerCase()}/${player.server.toLowerCase()}/${player.name.toLowerCase()}`}
              >
                <a>
                  <img
                    src={`/static/specs/${player.class}-${player.spec.name}.jpg`}
                    alt={`${player.spec.name} ${player.class}`}
                    className="object-cover w-full h-full rounded-full"
                  />
                </a>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex">
          <span>{meta.totalDeaths}</span>
          <div className="w-8 h-8 ml-2">
            <img
              src="/static/icons/ability_rogue_feigndeath.jpg"
              className="object-cover w-full h-full rounded-full"
              alt="Total Deaths"
              title="Total Deaths"
            />
          </div>
        </div>
      </div>

      <div>
        <p>Total Percent - {meta.percent}%</p>
        <p>Chests - {meta.chests}</p>
        <p>DPS - {meta.dps.toLocaleString("en-US")}</p>
        <p>HPS - {meta.hps.toLocaleString("en-US")}</p>
        <p>DTPS - {meta.dtps.toLocaleString("en-US")}</p>
        <p>Avg ItemLevel - {meta.averageItemLevel}</p>
        <p>Rating - {meta.rating}</p>
      </div>

      <TormentedPowers
        player={player}
        lieutenantOrder={pulls.reduce<{ name: string; pullID: number }[]>(
          (acc, pull) => {
            const lieutenant = findTormentedLieutenantPull(pull);

            if (lieutenant) {
              return [...acc, { name: lieutenant.name, pullID: pull.id }];
            }

            return acc;
          },
          []
        )}
      />
      {/* <Foo pulls={pulls} /> */}
    </div>
  );
}

// type FooProps = Pick<FightSuccessResponse, "pulls">;

// function Foo({ pulls }: FooProps) {
//   const { selectedPull } = useFightIDContext();

//   return JSON.stringify(
//     pulls[selectedPull > 0 ? selectedPull - 1 : selectedPull]
//   );
// }
