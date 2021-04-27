import type { GetStaticPropsContext, GetStaticPropsResult } from "next";

import type { AffixesProps } from "../../client/components/Affixes";
import type { PlayableClass } from "../../types/classes";
import { Roles } from "../../types/roles";
import { calcMetricAverage } from "../../utils/calc";
import type { Covenants, Soulbinds } from "../../utils/covenants";
import type { Dungeons } from "../../utils/dungeons";
import { createReportCache, readLocalReportCache } from "../cache/report";
import { createTableCache, readTableCache } from "../cache/table";
import { createFights } from "../db/fights";
import { loadReport, createReport, getDbReportId } from "../db/report";
import type { Fight, Report } from "../queries/report";
import { loadReportFromSource } from "../queries/report";
import type {
  Table,
  InDepthCharacterInformation,
  Item,
  SoulbindTalent,
  Conduit,
  Talent,
} from "../queries/table";
import { ItemQuality, loadTableFromSource } from "../queries/table";

export type UIFight = Pick<Fight, "keystoneLevel" | "id" | "keystoneTime"> & {
  affixes: AffixesProps["affixes"];
  dungeonId: keyof Dungeons;
  chests: Fight["keystoneBonus"];
  dps: number;
  hps: number;
  dtps: number;
  totalDeaths: number;
  averageItemlevel: string;
  composition: Player[];
};

export type UIFightsResponse = Pick<
  Report,
  "title" | "endTime" | "startTime"
> & {
  id: string;
  fights: UIFight[];
  region: string;
};

export type ReportProps = { refreshIndicator: number } & (
  | {
      error: null;
      report: UIFightsResponse;
    }
  | {
      error: Errors;
      report: null;
    }
);

const REPORT_ID_LENGTH = 16;
const SECONDS_TO_REVALIDATE_AFTER = 15 * 60;

// assume a report may still be ongoing if its less than one day old
const mayBeOngoingReport = (endTime: number) =>
  Date.now() - endTime > 24 * 60 * 60 * 1000;

enum Errors {
  noReportFound = 1,
  invalidParam = 2,
}

export const getStaticReportProps = async (
  context: GetStaticPropsContext<{ reportId?: string }>
): Promise<GetStaticPropsResult<ReportProps>> => {
  if (
    !context.params?.reportId ||
    context.params.reportId.length !== REPORT_ID_LENGTH ||
    context.params.reportId.includes(".")
  ) {
    return {
      props: {
        error: Errors.invalidParam,
        report: null,
        refreshIndicator: 0,
      },
    };
  }

  const { reportId } = context.params;
  const refreshIndicator = Date.now() + SECONDS_TO_REVALIDATE_AFTER * 1000;

  // report from db is already an entire dataset
  const report = await loadReport(reportId);

  if (!report) {
    const reportCache = readLocalReportCache(reportId);
    const rawReport = reportCache ?? (await loadReportFromSource(reportId));
    createReportCache(reportId, rawReport);

    if (!rawReport) {
      return {
        props: {
          error: Errors.noReportFound,
          report: null,
          refreshIndicator: 60,
        },
        revalidate: 60,
      };
    }

    const validFights = getValidFights(rawReport.fights);
    const fights = await enrichReport(reportId, validFights);

    const dbReportId = await createReport(reportId, rawReport);
    await createFights(dbReportId, fights, rawReport);

    return {
      props: {
        report: {
          id: reportId,
          endTime: rawReport.endTime,
          startTime: rawReport.startTime,
          title: rawReport.title,
          region: rawReport.region.slug,
          fights,
        },
        error: null,
        refreshIndicator,
      },
      revalidate: mayBeOngoingReport(rawReport.endTime)
        ? SECONDS_TO_REVALIDATE_AFTER
        : undefined,
    };
  }

  if (!mayBeOngoingReport(report.endTime)) {
    return {
      props: {
        report,
        error: null,
        refreshIndicator: 0,
      },
    };
  }

  const rawReport = await loadReportFromSource(reportId);

  if (!rawReport) {
    return {
      props: {
        report,
        error: null,
        refreshIndicator: SECONDS_TO_REVALIDATE_AFTER,
      },
      revalidate: SECONDS_TO_REVALIDATE_AFTER,
    };
  }

  const newValidFights = getValidFights(
    rawReport.fights,
    report.fights.map((fight) => fight.id)
  );

  if (newValidFights.length === 0) {
    return {
      props: {
        report,
        error: null,
        refreshIndicator,
      },
      revalidate: SECONDS_TO_REVALIDATE_AFTER,
    };
  }

  const fights = await enrichReport(reportId, newValidFights, true);
  const dbReportId = await getDbReportId(reportId);

  if (!dbReportId) {
    return {
      props: {
        report,
        error: null,
        refreshIndicator,
      },
      revalidate: SECONDS_TO_REVALIDATE_AFTER,
    };
  }

  // attach fights
  await createFights(dbReportId, fights, rawReport);

  return {
    props: {
      report: {
        id: reportId,
        endTime: rawReport.endTime,
        startTime: rawReport.startTime,
        title: rawReport.title,
        region: rawReport.region.slug,
        fights,
      },
      error: null,
      refreshIndicator,
    },
    revalidate: SECONDS_TO_REVALIDATE_AFTER,
  };
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
      id: keyof Soulbinds;
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

const enrichReport = async (
  reportId: string,
  fights: Fight[],
  skipCache = false
): Promise<UIFight[]> => {
  const tables = await Promise.all(
    fights.map(async (fight) => {
      if (!skipCache) {
        const cache = readTableCache(reportId, fight.id);

        if (cache) {
          return [fight.id, cache];
        }
      }

      const table = await loadTableFromSource(reportId, fight);

      createTableCache(reportId, fight.id, table);

      return [fight.id, table];
    })
  );

  const tablesAsMap = Object.fromEntries<Table>(
    tables.filter((data): data is [number, Table] => data[1] !== null)
  );

  return (
    fights
      // ignore keys with more than 5 participants; broken log
      .filter(({ id }) => {
        const { playerDetails } = tablesAsMap[id];

        return (
          [
            ...playerDetails.dps,
            ...playerDetails.healers,
            ...playerDetails.tanks,
          ].length === 5
        );
      })
      .map<UIFight>(
        ({
          id,
          keystoneAffixes: affixes,
          gameZone: { id: dungeonId },
          keystoneBonus: chests,
          keystoneTime,
          keystoneLevel,
          averageItemLevel,
        }) => {
          const table = tablesAsMap[id];

          const { damageDone, damageTaken, deathEvents, healingDone } = table;

          const composition = getComposition(table, keystoneTime);

          return {
            composition,
            dps: calcMetricAverage(keystoneTime, damageDone),
            dtps: calcMetricAverage(keystoneTime, damageTaken),
            hps: calcMetricAverage(keystoneTime, healingDone),
            totalDeaths: deathEvents.length,
            averageItemlevel: averageItemLevel.toFixed(2),
            affixes,
            chests,
            dungeonId,
            id,
            keystoneLevel,
            keystoneTime,
          };
        }
      )
  );
};

const getValidFights = (
  fights: Fight[],
  previousFightIds: number[] = []
): Fight[] => {
  const knownFights = new Set(previousFightIds);

  return fights.filter((fight) => {
    const isTimed = fight.keystoneBonus > 0;
    const isKnown = knownFights.has(fight.id);

    return isTimed && !isKnown;
  });
};

const getComposition = (table: Table, keystoneTime: number): Player[] => {
  const tank = transformPlayer(
    table.playerDetails.tanks[0],
    Roles.tank,
    table,
    keystoneTime
  );

  const healer = transformPlayer(
    table.playerDetails.healers[0],
    Roles.healer,
    table,
    keystoneTime
  );

  const dps = table.playerDetails.dps.map((player) =>
    transformPlayer(player, Roles.dps, table, keystoneTime)
  );

  return [tank, healer, ...dps];
};
