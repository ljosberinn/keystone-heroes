import type { PlayableClass, Spec } from "@prisma/client";
import nc from "next-connect";

import { isValidReportId, setCacheControl } from "../../server/api";
import {
  readLocalReportCache,
  createReportCache,
} from "../../server/cache/report";
import { readTableCache, createTableCache } from "../../server/cache/table";
import { FightsRepo } from "../../server/db/fights";
import { ReportsRepo } from "../../server/db/report";
import type { Fight } from "../../server/queries/report";
import { loadReportFromSource } from "../../server/queries/report";
import type {
  Conduit,
  InDepthCharacterInformation,
  Item,
  SoulbindTalent,
  Table,
  Talent,
} from "../../server/queries/table";
import { loadTableFromSource, ItemQuality } from "../../server/queries/table";
import type { RequestHandler } from "../../server/types";
import { calcMetricAverage } from "../../utils/calc";
import type { Covenants, Soulbinds } from "../../utils/covenants";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/statusCodes";
import type { UIFight, UIFightsResponse } from "../report/[id]";

type Request = {
  query: {
    id?: string;
  };
};

type Response = UIFightsResponse;

const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60;
const FOURTEEN_DAYS_IN_SECONDS = 14 * 24 * 60 * 60;

// assume a report may still be ongoing if its less than one day old
const maybeOngoingReport = (endTime: number) =>
  24 * 60 * 60 * 1000 > Date.now() - endTime;

const reportHandler: RequestHandler<Request, Response> = async (req, res) => {
  if (!isValidReportId(req.query.id)) {
    res.status(BAD_REQUEST).end();
    return;
  }

  try {
    const { id } = req.query;

    const report = await ReportsRepo.loadReport(id);

    if (!report) {
      const reportCache = readLocalReportCache(id);
      const rawReport = reportCache ?? (await loadReportFromSource(id));
      createReportCache(id, rawReport);

      if (!rawReport) {
        res.status(BAD_REQUEST).end();
        return;
      }

      const validFights = getValidFights(rawReport.fights);
      const fights = await enrichReport(id, validFights);

      const dbReportId = await ReportsRepo.createReport(id, rawReport);
      await FightsRepo.createFights(dbReportId, fights, rawReport);

      setCacheControl(
        res,
        maybeOngoingReport(rawReport.endTime)
          ? FIFTEEN_MINUTES_IN_SECONDS
          : undefined
      );

      res.json({
        id,
        endTime: rawReport.endTime,
        startTime: rawReport.startTime,
        title: rawReport.title,
        region: rawReport.region.slug,
        fights,
      });
      return;
    }

    if (!maybeOngoingReport(report?.endTime)) {
      setCacheControl(res, FOURTEEN_DAYS_IN_SECONDS);
      res.json(report);
      return;
    }

    const rawReport = await loadReportFromSource(id);

    if (!rawReport) {
      setCacheControl(res, FIFTEEN_MINUTES_IN_SECONDS);
      res.json(report);
      return;
    }

    const newValidFights = getValidFights(
      rawReport.fights,
      report.fights.map((fight) => fight.id)
    );

    if (newValidFights.length === 0) {
      setCacheControl(res, FIFTEEN_MINUTES_IN_SECONDS);
      res.json(report);
      return;
    }

    const fights = await enrichReport(id, newValidFights, true);
    const dbId = await ReportsRepo.searchReportId(id);

    if (!dbId) {
      setCacheControl(res, FIFTEEN_MINUTES_IN_SECONDS);
      res.json(report);
      return;
    }

    await FightsRepo.createFights(dbId, fights, rawReport);

    setCacheControl(res, FIFTEEN_MINUTES_IN_SECONDS);

    res.json({
      id,
      endTime: rawReport.endTime,
      startTime: rawReport.endTime,
      title: rawReport.title,
      region: rawReport.region.slug,
      fights,
    });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).end();
  }
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
      .filter(({ id, gameZone }) => tablesAsMap[id] && gameZone)
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
          // @ts-expect-error filtered above
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
            averageItemLevel,
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

const getComposition = (table: Table, keystoneTime: number): Player[] => {
  const tank = transformPlayer(
    table.playerDetails.tanks[0],
    table,
    keystoneTime
  );

  const healer = transformPlayer(
    table.playerDetails.healers[0],
    table,
    keystoneTime
  );

  const dps = table.playerDetails.dps.map((player) =>
    transformPlayer(player, table, keystoneTime)
  );

  return [tank, healer, ...dps];
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

export type Player = Pick<
  InDepthCharacterInformation,
  "server" | "name" | "guid"
> & {
  id: number;
  guid: number;
  dps: number;
  hps: number;
  deaths: number;
  server: string;
  name: string;
  className: PlayableClass;
  spec: Spec;
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
    className,
    spec: `${className}_${spec}` as Spec,
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

export default nc().get(reportHandler);
