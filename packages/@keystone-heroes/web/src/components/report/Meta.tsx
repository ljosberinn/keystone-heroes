import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import { Fragment } from "react";

import { star } from "../../icons";
import { useFight } from "../../pages/report/[reportID]/[fightID]";
import {
  affixes,
  classes,
  covenants,
  soulbinds,
  tormentedPowers,
  dungeons,
  EXPLOSIVE,
  spells,
  QUAKING,
  VOLCANIC,
  STORMING,
  SPITEFUL,
  GRIEVOUS,
  SANGUINE_ICHOR_HEALING,
  SANGUINE_ICHOR_DAMAGE,
} from "../../staticData";
import {
  bgPrimary,
  bgSecondary,
  greenText,
  redText,
} from "../../styles/tokens";
import {
  createWCLUrl,
  timeDurationToString,
  createWowheadUrl,
  classBorderColorMap,
} from "../../utils";
import {
  calculateExplosiveMetrics,
  calculateQuakingMetrics,
  calculateSpitefulMetrics,
  calculateStormingMetrics,
  calculateVolcanicMetrics,
  calculateGrievousMetrics,
  calculateSanguineMetrics,
} from "../../utils/affixes";
import type {
  ExplosiveMetrics,
  GrievousMetrics,
  QuakingMetrics,
  SanguineMetrics,
  SpitefulMetrics,
  StormingMetrics,
  VolcanicMetrics,
} from "../../utils/affixes";
import { classnames } from "../../utils/classnames";
import { AbilityIcon } from "../AbilityIcon";
import { ExternalLink } from "../ExternalLink";
import { SpecIcon } from "../SpecIcon";

export function Meta(): JSX.Element {
  const { reportID, fightID, fight } = useFight();

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
              <span className="lg:hidden 2xl:inline-block hover:underline">
                {dungeon.name}
              </span>
              <span className="hidden lg:inline-block 2xl:hidden hover:underline">
                {dungeon.slug}
              </span>
              <span> +{fight.meta.level}</span>
            </ExternalLink>
            <sup className="hidden pl-2 space-x-1 sm:inline">
              {Array.from({ length: fight.meta.chests }, (_, index) => (
                <svg
                  key={index}
                  className="inline w-4 h-4 text-yellow-500 fill-current"
                >
                  <use href={`#${star.id}`} />
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
                  width={40}
                  height={40}
                />
              </ExternalLink>
            ))}
          </div>
        </div>

        {/* <-------> */}

        <div className="flex p-4 pt-0 space-x-2 text-2xl">
          <span>{timeDurationToString(fight.meta.time)}</span>
          <span
            className={`italic ${greenText}`}
            title={`${fight.meta.chests} chest${
              fight.meta.chests > 1 ? "s" : ""
            }`}
          >
            +{timeDurationToString(dungeon.time - fight.meta.time)}
          </span>
          {fight.meta.totalDeaths > 0 && (
            <span className={`italic ${redText}`}>
              -{timeDurationToString(fight.meta.totalDeaths * 5 * 1000, true)}
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

      <div className={`h-full p-4 rounded-b-lg shadow-sm ${bgSecondary}`}>
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
                      <span className="flex items-center w-full space-x-2">
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
                                width={16}
                                height={16}
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
                      </span>
                    </td>

                    <td className="text-right">
                      <span
                        className={`${classColor} border-b-2 dark:border-opacity-50 text-right flex flex-grow justify-end`}
                      >
                        {player.itemLevel}
                      </span>
                    </td>
                    <td className="text-right">
                      <ExternalLink
                        href={createWCLUrl({
                          reportID,
                          fightID,
                          type: "damage-done",
                          source: player.actorID,
                        })}
                        className={`${classColor} border-b-2 dark:border-opacity-50 text-right flex flex-grow justify-end`}
                      >
                        {player.dps.toLocaleString("en-US")}
                      </ExternalLink>
                    </td>
                    <td>
                      <ExternalLink
                        href={createWCLUrl({
                          reportID,
                          fightID,
                          type: "healing",
                          source: player.actorID,
                        })}
                        className={`${classColor} border-b-2 dark:border-opacity-50 text-right flex flex-grow justify-end`}
                      >
                        {player.hps.toLocaleString("en-US")}
                      </ExternalLink>
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
                                width={24}
                                height={24}
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
                                width={24}
                                height={24}
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
                                  width={24}
                                  height={24}
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

        <QuickStats />
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
        width={24}
        height={24}
      />
    </ExternalLink>
  );
}

type Stats = {
  fightID: string;
  reportID: string;
  explosives: ExplosiveMetrics;
  quaking: QuakingMetrics;
  volcanic: VolcanicMetrics;
  storming: StormingMetrics;
  spiteful: SpitefulMetrics;
  grievous: GrievousMetrics;
  sanguine: SanguineMetrics;
  player: FightSuccessResponse["player"];
};

const useAffixSpecificQuickStats = (): Stats => {
  const { fight, fightID, reportID } = useFight();
  const allEvents = fight ? fight.pulls.flatMap((pull) => pull.events) : [];
  const player = fight ? fight.player : [];
  const affixes = fight ? fight.affixes : [];
  const groupDPS = fight ? fight.meta.dps : 1;

  const params = {
    affixes,
    events: allEvents,
    groupDPS,
  };

  return {
    fightID,
    reportID,
    explosives: calculateExplosiveMetrics(params),
    quaking: calculateQuakingMetrics(params),
    volcanic: calculateVolcanicMetrics(params),
    storming: calculateStormingMetrics(params),
    spiteful: calculateSpitefulMetrics(params),
    grievous: calculateGrievousMetrics(params),
    sanguine: calculateSanguineMetrics(params),
    player,
  };
};

function QuickStats() {
  const {
    explosives,
    player,
    quaking,
    fightID,
    reportID,
    volcanic,
    storming,
    spiteful,
    grievous,
    sanguine,
  } = useAffixSpecificQuickStats();

  return (
    <>
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
            <th className="text-xl text-left h-14">Quick Stats</th>
          </tr>
        </thead>
        <tbody>
          {explosives.spawned > 0 && (
            <>
              <tr>
                <td className="flex h-10">
                  <span className="flex items-center w-full space-x-2">
                    <span className="inline-flex items-center w-full">
                      <span className="w-8 h-8">
                        <AbilityIcon
                          icon={spells[EXPLOSIVE.ability].icon}
                          alt="Explosives"
                          className="object-cover w-full h-full rounded-full"
                        />
                      </span>

                      <span className="flex-grow ml-3 border-b-2 dark:border-opacity-50">
                        Explosives
                      </span>

                      <span className="border-b-2 dark:border-opacity-50">
                        {(
                          explosives.spawned - explosives.missed
                        ).toLocaleString("en-US")}{" "}
                        / {explosives.spawned.toLocaleString("en-US")} (
                        {(
                          ((explosives.spawned - explosives.missed) /
                            explosives.spawned) *
                          100
                        ).toFixed(2)}
                        % )
                      </span>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="space-x-2 text-center">
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const kills = explosives.kills[player.id] ?? 0;

                    return (
                      <span
                        key={player.actorID}
                        className="inline-flex space-x-2"
                      >
                        <span className="w-6 h-6">
                          <SpecIcon
                            size={6}
                            class={name}
                            spec={spec.name}
                            alt={player.name}
                          />
                        </span>
                        <span className={kills === 0 ? redText : greenText}>
                          {kills.toLocaleString("en-US")}
                        </span>
                      </span>
                    );
                  })}
                </td>
              </tr>
            </>
          )}

          {quaking.hasQuaking && (
            <>
              <tr>
                <td className="flex h-10">
                  <span className="flex items-center w-full space-x-2">
                    <span className="inline-flex items-center w-full">
                      <span className="w-8 h-8">
                        <AbilityIcon
                          icon={spells[QUAKING].icon}
                          alt="Explosives"
                          className="object-cover w-full h-full rounded-full"
                        />
                      </span>

                      <span className="flex-grow ml-3 border-b-2 dark:border-opacity-50">
                        Quaking (Damage Taken & Interrupts)
                      </span>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="space-x-2 text-center">
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = quaking.damage[player.id] ?? 0;

                    const damageTakenInK = (damageTaken / 1000).toFixed(1);

                    return (
                      <ExternalLink
                        href={createWCLUrl({
                          fightID,
                          reportID,
                          // eslint-disable-next-line sonarjs/no-duplicate-string
                          type: "damage-taken",
                          source: player.actorID,
                          ability: QUAKING,
                        })}
                        key={player.actorID}
                        className="inline-flex space-x-2"
                      >
                        <span className="w-6 h-6">
                          <SpecIcon
                            size={6}
                            class={name}
                            spec={spec.name}
                            alt={player.name}
                          />
                        </span>
                        <span
                          className={damageTaken === 0 ? greenText : redText}
                        >
                          {damageTakenInK}k
                        </span>
                      </ExternalLink>
                    );
                  })}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="space-x-2 text-center">
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const interrupts = quaking.interrupts[player.id] ?? 0;

                    return (
                      <ExternalLink
                        href={`https://www.warcraftlogs.com/reports/${reportID}#fight=${fightID}&type=summary&translate=true&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22interrupt%22%20and%20target.type%20%3D%20%22player%22`}
                        key={player.actorID}
                        className="inline-flex space-x-2"
                      >
                        <span className="w-6 h-6">
                          <SpecIcon
                            size={6}
                            class={name}
                            spec={spec.name}
                            alt={player.name}
                          />
                        </span>
                        <span
                          className={interrupts === 0 ? greenText : redText}
                        >
                          {interrupts}
                        </span>
                      </ExternalLink>
                    );
                  })}
                </td>
              </tr>
            </>
          )}

          {volcanic.hasVolcanic && (
            <>
              <tr>
                <td className="flex h-10">
                  <span className="flex items-center w-full space-x-2">
                    <span className="inline-flex items-center w-full">
                      <span className="w-8 h-8">
                        <AbilityIcon
                          icon={spells[VOLCANIC].icon}
                          alt="Explosives"
                          className="object-cover w-full h-full rounded-full"
                        />
                      </span>

                      <span className="flex-grow ml-3 border-b-2 dark:border-opacity-50">
                        Volcanic (Damage Taken)
                      </span>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="space-x-2 text-center">
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = volcanic.damage[player.id] ?? 0;

                    const damageTakenInK = (damageTaken / 1000).toFixed(1);

                    return (
                      <ExternalLink
                        href={createWCLUrl({
                          reportID,
                          fightID,
                          source: player.actorID,
                          type: "damage-taken",
                          ability: VOLCANIC,
                        })}
                        key={player.actorID}
                        className="inline-flex space-x-2"
                      >
                        <span className="w-6 h-6">
                          <SpecIcon
                            size={6}
                            class={name}
                            spec={spec.name}
                            alt={player.name}
                          />
                        </span>
                        <span
                          className={damageTaken === 0 ? greenText : redText}
                        >
                          {damageTakenInK}k
                        </span>
                      </ExternalLink>
                    );
                  })}
                </td>
              </tr>
            </>
          )}

          {storming.hasStorming && (
            <>
              <tr>
                <td className="flex h-10">
                  <span className="flex items-center w-full space-x-2">
                    <span className="inline-flex items-center w-full">
                      <span className="w-8 h-8">
                        <AbilityIcon
                          icon={spells[STORMING].icon}
                          alt="Explosives"
                          className="object-cover w-full h-full rounded-full"
                        />
                      </span>

                      <span className="flex-grow ml-3 border-b-2 dark:border-opacity-50">
                        Storming (Damage Taken)
                      </span>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="space-x-2 text-center">
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = storming.damage[player.id] ?? 0;

                    const damageTakenInK = (damageTaken / 1000).toFixed(1);

                    return (
                      <ExternalLink
                        href={createWCLUrl({
                          reportID,
                          fightID,
                          source: player.actorID,
                          type: "damage-taken",
                          ability: STORMING,
                        })}
                        key={player.actorID}
                        className="inline-flex space-x-2"
                      >
                        <span className="w-6 h-6">
                          <SpecIcon
                            size={6}
                            class={name}
                            spec={spec.name}
                            alt={player.name}
                          />
                        </span>

                        <span
                          className={damageTaken === 0 ? greenText : redText}
                        >
                          {damageTakenInK}k
                        </span>
                      </ExternalLink>
                    );
                  })}
                </td>
              </tr>
            </>
          )}

          {spiteful.hasSpiteful && (
            <>
              <tr>
                <td className="flex h-10">
                  <span className="flex items-center w-full space-x-2">
                    <span className="inline-flex items-center w-full">
                      <span className="w-8 h-8">
                        <AbilityIcon
                          icon={spells[SPITEFUL].icon}
                          alt="Explosives"
                          className="object-cover w-full h-full rounded-full"
                        />
                      </span>

                      <span className="flex-grow ml-3 border-b-2 dark:border-opacity-50">
                        Spiteful (Damage Taken)
                      </span>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="space-x-2 text-center">
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = spiteful.damage[player.id] ?? 0;

                    const damageTakenInK = (damageTaken / 1000).toFixed(1);

                    return (
                      <ExternalLink
                        href={createWCLUrl({
                          reportID,
                          fightID,
                          source: player.actorID,
                          type: "damage-taken",
                          ability: SPITEFUL,
                        })}
                        key={player.actorID}
                        className="inline-flex space-x-2"
                      >
                        <span className="w-6 h-6">
                          <SpecIcon
                            size={6}
                            class={name}
                            spec={spec.name}
                            alt={player.name}
                          />
                        </span>
                        <span
                          className={damageTaken === 0 ? greenText : redText}
                        >
                          {damageTakenInK}k
                        </span>
                      </ExternalLink>
                    );
                  })}
                </td>
              </tr>
            </>
          )}

          {grievous.hasGrievous && (
            <>
              <tr>
                <td className="flex h-10">
                  <span className="flex items-center w-full space-x-2">
                    <span className="inline-flex items-center w-full">
                      <span className="w-8 h-8">
                        <AbilityIcon
                          icon={spells[GRIEVOUS].icon}
                          alt="Explosives"
                          className="object-cover w-full h-full rounded-full"
                        />
                      </span>

                      <span className="flex-grow ml-3 border-b-2 dark:border-opacity-50">
                        Grievous (Damage Taken)
                      </span>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="space-x-2 text-center">
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = grievous.damage[player.id] ?? 0;
                    const damageTakenInK = (damageTaken / 1000).toFixed(1);

                    return (
                      <ExternalLink
                        href={createWCLUrl({
                          reportID,
                          fightID,
                          source: player.actorID,
                          type: "damage-taken",
                          ability: GRIEVOUS,
                        })}
                        key={player.actorID}
                        className="inline-flex space-x-2"
                      >
                        <span className="w-6 h-6">
                          <SpecIcon
                            size={6}
                            class={name}
                            spec={spec.name}
                            alt={player.name}
                          />
                        </span>
                        <span>{damageTakenInK}k</span>
                      </ExternalLink>
                    );
                  })}
                </td>
              </tr>
            </>
          )}

          {sanguine.hasSanguine && (
            <>
              <tr>
                <td className="flex h-10">
                  <span className="flex items-center w-full space-x-2">
                    <span className="inline-flex items-center w-full">
                      <span className="w-8 h-8">
                        <AbilityIcon
                          icon={spells[SANGUINE_ICHOR_HEALING].icon}
                          alt="Explosives"
                          className="object-cover w-full h-full rounded-full"
                        />
                      </span>

                      <span className="flex-grow ml-3 border-b-2 dark:border-opacity-50">
                        Sanguine (Damage Taken | Healing Done)
                      </span>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="space-x-2 text-center">
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = sanguine.damage[player.id] ?? 0;
                    const damageTakenInK = (damageTaken / 1000).toFixed(1);

                    return (
                      <ExternalLink
                        href={createWCLUrl({
                          reportID,
                          fightID,
                          source: player.actorID,
                          type: "damage-taken",
                          ability: SANGUINE_ICHOR_DAMAGE,
                        })}
                        key={player.actorID}
                        className="inline-flex space-x-2"
                      >
                        <span className="w-6 h-6">
                          <SpecIcon
                            size={6}
                            class={name}
                            spec={spec.name}
                            alt={player.name}
                          />
                        </span>
                        <span
                          className={damageTaken === 0 ? greenText : redText}
                        >
                          {damageTakenInK}k
                        </span>
                      </ExternalLink>
                    );
                  })}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="space-x-2 text-center">
                  <ExternalLink
                    href={createWCLUrl({
                      fightID,
                      reportID,
                      ability: SANGUINE_ICHOR_HEALING,
                      type: "healing",
                      hostility: 1,
                    })}
                  >
                    {sanguine.healing.toLocaleString("en-US")}
                  </ExternalLink>{" "}
                  (est. time loss:{" "}
                  {timeDurationToString(sanguine.estTimeLoss * 1000, true)})
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </>
  );
}
