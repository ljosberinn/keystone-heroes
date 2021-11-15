import type { FightSuccessResponse } from "../../../api/functions/fight";
import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import {
  spells,
  EXPLOSIVE,
  classes,
  QUAKING,
  VOLCANIC,
  STORMING,
  SPITEFUL,
  GRIEVOUS,
  SANGUINE_ICHOR_HEALING,
  SANGUINE_ICHOR_DAMAGE,
  BURSTING,
  NECROTIC,
} from "../../staticData";
import { redText, greenText } from "../../styles/tokens";
import { createWCLUrl, timeDurationToString } from "../../utils";
import type {
  ExplosiveMetrics,
  QuakingMetrics,
  VolcanicMetrics,
  StormingMetrics,
  SpitefulMetrics,
  GrievousMetrics,
  SanguineMetrics,
  BurstingMetrics,
  NecroticMetrics,
} from "../../utils/affixes";
import {
  calculateExplosiveMetrics,
  calculateQuakingMetrics,
  calculateVolcanicMetrics,
  calculateStormingMetrics,
  calculateSpitefulMetrics,
  calculateGrievousMetrics,
  calculateSanguineMetrics,
  calculateBurstingMetrics,
  calculateNecroticMetrics,
} from "../../utils/affixes";
import { AbilityIcon } from "../AbilityIcon";
import { ExternalLink } from "../ExternalLink";
import { SpecIcon } from "../SpecIcon";

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
  bursting: BurstingMetrics;
  necrotic: NecroticMetrics;
  player: FightSuccessResponse["player"];
};

const useAffixSpecificStats = (): Stats => {
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
    bursting: calculateBurstingMetrics(params),
    necrotic: calculateNecroticMetrics(params),
    player,
  };
};

export function AffixImpact(): JSX.Element {
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
    bursting,
    necrotic,
  } = useAffixSpecificStats();

  return (
    <section className="py-6">
      <div className="px-6 pb-2 bg-white lg:px-0 dark:bg-coolgray-900">
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
              <th className="pt-4 pb-2 text-xl text-left lg:text-center">
                Affix Impact
              </th>
            </tr>
          </thead>
          <tbody>
            {explosives.spawned > 0 && (
              <>
                <GenericAffixInformationRow
                  iconSrc={spells[EXPLOSIVE.ability].icon}
                  iconAlt="Explosives"
                  title="Explosives"
                  appendix={
                    <span className="border-b-2 dark:border-opacity-50 lg:border-b-0 lg:pl-4">
                      {(explosives.spawned - explosives.missed).toLocaleString(
                        "en-US"
                      )}{" "}
                      / {explosives.spawned.toLocaleString("en-US")} (
                      {(
                        ((explosives.spawned - explosives.missed) /
                          explosives.spawned) *
                        100
                      ).toFixed(2)}
                      % )
                    </span>
                  }
                />

                <ImpactRow>
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
                        <span className="md:hidden">{player.name}</span>
                        <span className={kills === 0 ? redText : greenText}>
                          {kills.toLocaleString("en-US")}
                        </span>
                      </span>
                    );
                  })}
                </ImpactRow>
              </>
            )}

            {quaking.hasQuaking && (
              <>
                <GenericAffixInformationRow
                  iconSrc={spells[QUAKING].icon}
                  iconAlt="Quaking"
                  title="Quaking"
                />

                <ImpactRow>
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
                        <span className="md:hidden">{player.name}</span>
                        <span
                          className={damageTaken === 0 ? greenText : redText}
                        >
                          {damageTakenInK}k
                        </span>
                      </ExternalLink>
                    );
                  })}
                </ImpactRow>
                <ImpactRow>
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const interrupts = quaking.interrupts[player.id] ?? 0;

                    return (
                      <ExternalLink
                        href={`https://www.warcraftlogs.com/reports/${reportID}#fight=${fightID}&type=summary&ImpactRowanslate=true&view=events&pins=2%24Off%24%23244F4B%24expression%24type%20%3D%20%22interrupt%22%20and%20target.type%20%3D%20%22player%22`}
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
                        <span className="md:hidden">{player.name}</span>
                        <span
                          className={interrupts === 0 ? greenText : redText}
                        >
                          {interrupts}
                        </span>
                      </ExternalLink>
                    );
                  })}
                </ImpactRow>
              </>
            )}

            {volcanic.hasVolcanic && (
              <>
                <GenericAffixInformationRow
                  iconSrc={spells[VOLCANIC].icon}
                  iconAlt="Volcanic"
                  title="Volcanic"
                />

                <ImpactRow>
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = volcanic.damage[player.id] ?? 0;
                    const damageTakenInK = (damageTaken / 1000).toFixed(1);
                    const hits = volcanic.hits[player.id] ?? 0;

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
                        <span className="md:hidden">{player.name}</span>
                        <span
                          className={damageTaken === 0 ? greenText : redText}
                        >
                          {damageTakenInK}k
                        </span>
                        <span>({hits})</span>
                      </ExternalLink>
                    );
                  })}
                </ImpactRow>
              </>
            )}

            {storming.hasStorming && (
              <>
                <GenericAffixInformationRow
                  iconSrc={spells[STORMING].icon}
                  iconAlt="Storming"
                  title="Storming"
                />
                <ImpactRow>
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = storming.damage[player.id] ?? 0;
                    const damageTakenInK = (damageTaken / 1000).toFixed(1);
                    const hits = storming.hits[player.id] ?? 0;

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
                        <span className="md:hidden">{player.name}</span>
                        <span
                          className={damageTaken === 0 ? greenText : redText}
                        >
                          {damageTakenInK}k
                        </span>
                        <span>({hits})</span>{" "}
                      </ExternalLink>
                    );
                  })}
                </ImpactRow>
              </>
            )}

            {spiteful.hasSpiteful && (
              <>
                <GenericAffixInformationRow
                  iconSrc="spell_holy_prayerofshadowprotection"
                  iconAlt="Spiteful"
                  title="Spiteful"
                />
                <ImpactRow>
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = spiteful.damage[player.id] ?? 0;
                    const damageTakenInK = (damageTaken / 1000).toFixed(1);
                    const hits = spiteful.hits[player.id] ?? 0;

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
                        <span className="md:hidden">{player.name}</span>
                        <span
                          className={damageTaken === 0 ? greenText : redText}
                        >
                          {damageTakenInK}k
                        </span>
                        <span>({hits})</span>{" "}
                      </ExternalLink>
                    );
                  })}
                </ImpactRow>
              </>
            )}

            {grievous.hasGrievous && (
              <>
                <GenericAffixInformationRow
                  iconSrc={spells[GRIEVOUS].icon}
                  iconAlt="Grievous"
                  title="Grievous"
                />
                <ImpactRow>
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
                        <span className="md:hidden">{player.name}</span>
                        <span>{damageTakenInK}k</span>
                      </ExternalLink>
                    );
                  })}
                </ImpactRow>
              </>
            )}

            {necrotic.hasNecrotic && (
              <>
                <GenericAffixInformationRow
                  iconSrc={spells[NECROTIC].icon}
                  iconAlt="Necrotic"
                  title="Necrotic"
                />
                <ImpactRow>
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = necrotic.damage[player.id] ?? 0;
                    const damageTakenInK = (damageTaken / 1000).toFixed(1);

                    return (
                      <ExternalLink
                        href={createWCLUrl({
                          reportID,
                          fightID,
                          source: player.actorID,
                          type: "damage-taken",
                          ability: NECROTIC,
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
                        <span className="md:hidden">{player.name}</span>
                        <span
                          className={damageTaken === 0 ? greenText : undefined}
                        >
                          {damageTakenInK}k
                        </span>
                      </ExternalLink>
                    );
                  })}
                </ImpactRow>
              </>
            )}

            {bursting.hasBursting && (
              <>
                <GenericAffixInformationRow
                  iconSrc={spells[BURSTING.damage].icon}
                  iconAlt="Bursting"
                  title="Bursting"
                />
                <ImpactRow>
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = bursting.damage[player.id] ?? 0;
                    const damageTakenInK = (damageTaken / 1000).toFixed(1);

                    return (
                      <ExternalLink
                        href={createWCLUrl({
                          reportID,
                          fightID,
                          source: player.actorID,
                          type: "damage-taken",
                          ability: BURSTING.damage,
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
                        <span className="md:hidden">{player.name}</span>
                        <span>{damageTakenInK}k</span>
                      </ExternalLink>
                    );
                  })}
                </ImpactRow>
              </>
            )}

            {sanguine.hasSanguine && (
              <>
                <GenericAffixInformationRow
                  iconSrc={spells[SANGUINE_ICHOR_HEALING].icon}
                  iconAlt="Sanguine Ichor"
                  title="Sanguine"
                />
                <ImpactRow>
                  {player.map((player) => {
                    const { name, specs } = classes[player.class];
                    const spec = specs.find((spec) => spec.id === player.spec);

                    if (!spec) {
                      return null;
                    }

                    const damageTaken = sanguine.damage[player.id] ?? 0;
                    const damageTakenInK = (damageTaken / 1000).toFixed(1);
                    const hits = sanguine.hits[player.id] ?? 0;

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
                        <span className="md:hidden">{player.name}</span>
                        <span
                          className={damageTaken === 0 ? greenText : redText}
                        >
                          {damageTakenInK}k
                        </span>
                        <span>({hits})</span>{" "}
                      </ExternalLink>
                    );
                  })}
                </ImpactRow>
                <ImpactRow>
                  <ExternalLink
                    href={createWCLUrl({
                      fightID,
                      reportID,
                      ability: SANGUINE_ICHOR_HEALING,
                      type: "healing",
                      hostility: 1,
                    })}
                  >
                    {sanguine.healing.toLocaleString("en-US")} total healing
                  </ExternalLink>{" "}
                  (est. time loss:{" "}
                  {timeDurationToString(sanguine.estTimeLoss * 1000, true)})
                </ImpactRow>
              </>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type GenericAffixInformationRowProps = {
  iconSrc: string;
  iconAlt: string;
  title: string;
  appendix?: JSX.Element;
};

function GenericAffixInformationRow({
  iconSrc,
  iconAlt,
  title,
  appendix,
}: GenericAffixInformationRowProps) {
  return (
    <tr>
      <td className="flex h-16 md:h-10">
        <span className="flex items-center w-full space-x-2">
          <span className="inline-flex items-center w-full lg:m-auto lg:w-auto">
            <span className="w-8 h-8">
              <AbilityIcon
                icon={iconSrc}
                alt={iconAlt}
                title={iconAlt}
                className="object-cover w-full h-full rounded-full"
              />
            </span>

            <span className="flex-grow ml-3 border-b-2 dark:border-opacity-50 lg:border-b-0">
              {title}
            </span>

            {appendix}
          </span>
        </span>
      </td>
    </tr>
  );
}

type ImpactRowProps = {
  children: (JSX.Element | string | null)[] | JSX.Element;
};

function ImpactRow({ children }: ImpactRowProps) {
  return (
    <tr>
      <td
        colSpan={2}
        className="flex flex-col space-y-2 text-center md:space-x-2 md:table-cell md:space-y-0"
      >
        {children}
      </td>
    </tr>
  );
}
