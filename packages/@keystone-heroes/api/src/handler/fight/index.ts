import { FightRepo, PullRepo, ReportRepo } from "@keystone-heroes/db/repos";
import { wcl } from "@keystone-heroes/wcl/src/queries";
import nc from "next-connect";

import { createValidReportIDMiddleware } from "../../middleware/validReportID";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/statusCodes";
import {
  calcMetricAverage,
  createConduits,
  createCovenantTraits,
  createFights,
  createLegendaries,
  createTalents,
  enhanceFightsWithEvents,
  enhanceFightsWithTable,
  extendPlayersWithServerAndCharacterID,
  extractPlayerData,
  linkPlayerToConduits,
  linkPlayerToCovenantTraits,
  linkPlayerToTalents,
} from "./utils";

import type { RequestHandler } from "../../utils/types";
import type { InsertableFight } from "./utils";
import type { Talent, DungeonPull } from "@keystone-heroes/wcl/src/queries";
import type {
  Fight,
  Dungeon,
  Zone,
  Affix,
  Covenant,
  Soulbind,
  Character,
  CovenantTrait,
  Conduit,
  Player as PrismaPlayer,
  Legendary,
  Class,
  Server,
  Spec,
  Event,
} from "@prisma/client";

type Request = {
  query: {
    reportID: string;
    fightIDs?: string[] | string;
  };
};

export type FightResponse = Pick<
  Fight,
  | "averageItemLevel"
  | "chests"
  | "dps"
  | "dtps"
  | "hps"
  | "keystoneLevel"
  | "keystoneTime"
  | "totalDeaths"
  | "fightID"
> & {
  dungeon: Dungeon & {
    zones: Omit<Zone, "dungeonID" | "order">[];
  };
  affixes: Omit<Affix, "seasonal">[];
  composition: Composition;
  pulls: Pull[];
};

type Pull = Pick<
  DungeonPull,
  "x" | "y" | "startTime" | "endTime" | "maps" | "boundingBox"
> & {
  events: Event[];
};

type Composition = (Pick<
  PrismaPlayer,
  "dps" | "hps" | "deaths" | "itemLevel"
> & {
  actorID: number;
  legendary: Legendary | null;
  covenant: Pick<Covenant, "icon" | "name"> | null;
  soulbind: Pick<Soulbind, "icon" | "name"> | null;
  character: Pick<Character, "name"> & {
    class: Class;
    spec: Pick<Spec, "id" | "name">;
    server: Pick<Server, "name">;
  };
  talents: (Omit<Talent, "guid" | "type"> & { id: number })[];
  covenantTraits: Omit<CovenantTrait, "covenantID">[];
  conduits: (Omit<Conduit, "guid" | "total"> & {
    itemLevel: number;
    id: number;
  })[];
})[];

const extractQueryParams = (query: Required<Request["query"]>) => {
  const { reportID, fightIDs } = query;

  const ids = Array.isArray(fightIDs) ? fightIDs : [fightIDs];

  return {
    reportID,
    fightIDs: ids.map((id) => Number.parseInt(id)),
  };
};

const fightHandler: RequestHandler<Request, FightResponse[]> = async (
  req,
  res
) => {
  if (!req.query.fightIDs) {
    res.status(BAD_REQUEST).end();
    return;
  }

  const { reportID, fightIDs } = extractQueryParams({
    reportID: req.query.reportID,
    fightIDs: req.query.fightIDs,
  });

  try {
    const report = await ReportRepo.load(reportID);

    if (!report) {
      res.status(INTERNAL_SERVER_ERROR).end();
      return;
    }

    // const ongoing = maybeOngoingReport(report.endTime);

    const persistedFights = await FightRepo.loadFull(reportID, fightIDs);
    const unseenFightIDs = fightIDs.filter(
      (id) => !persistedFights.some((fight) => fight.fightID === id)
    );

    if (unseenFightIDs.length === 0) {
      //   setCacheControl(
      //     res,
      //     ongoing ? CacheControl.ONE_MONTH : CacheControl.ONE_HOUR
      //   );
      res.json(persistedFights);
      return;
    }

    const newFights = await wcl.fights({
      reportID,
      fightIDs: unseenFightIDs,
    });

    if (!newFights) {
      // eslint-disable-next-line no-console
      console.info(
        `[api/fight] failed to load new fights from wcl for "${reportID}`
      );

      //   setCacheControl(res, CacheControl.ONE_HOUR);
      res.json(persistedFights);
      return;
    }

    if (newFights.length === 0) {
      // eslint-disable-next-line no-console
      console.info(`[api/fight] no new fights present for "${reportID}"`);

      //   setCacheControl(
      //     res,
      //     ongoing ? CacheControl.ONE_HOUR : CacheControl.ONE_MONTH
      //   );
      res.json(persistedFights);
      return;
    }

    const fightsWithTable = await enhanceFightsWithTable(reportID, newFights);
    const fightsWithEvents = await enhanceFightsWithEvents(
      reportID,
      fightsWithTable
    );

    const insertableFights = fightsWithEvents.map<InsertableFight>((fight) => {
      return {
        id: fight.id,
        keystoneLevel: fight.keystoneLevel,
        keystoneTime: fight.keystoneTime,
        chests: fight.keystoneBonus,
        averageItemLevel: fight.averageItemLevel,
        affixes: fight.keystoneAffixes,
        dungeon: fight.gameZone.id,
        totalDeaths: fight.table.deathEvents.length,
        dps: calcMetricAverage(fight.keystoneTime, fight.table.damageDone),
        dtps: calcMetricAverage(fight.keystoneTime, fight.table.damageTaken),
        hps: calcMetricAverage(fight.keystoneTime, fight.table.healingDone),
        pulls: fight.dungeonPulls.map<InsertableFight["pulls"][number]>(
          (pull) => {
            const eventsOfThisPull = fight.events.filter(
              (event) =>
                event.timestamp >= pull.startTime &&
                event.timestamp <= pull.endTime
            );

            return {
              startTime: pull.startTime,
              endTime: pull.endTime,
              x: pull.x,
              y: pull.y,
              maps: pull.maps,
              events: eventsOfThisPull,
              boundingBox: pull.boundingBox,
              npcs: pull.enemyNPCs,
            };
          }
        ),
        composition: [
          extractPlayerData(
            fight.table.playerDetails.tanks[0],
            fight.table,
            fight.keystoneTime
          ),
          extractPlayerData(
            fight.table.playerDetails.healers[0],
            fight.table,
            fight.keystoneTime
          ),
          extractPlayerData(
            fight.table.playerDetails.dps[0],
            fight.table,
            fight.keystoneTime
          ),
          extractPlayerData(
            fight.table.playerDetails.dps[1],
            fight.table,
            fight.keystoneTime
          ),
          extractPlayerData(
            fight.table.playerDetails.dps[2],
            fight.table,
            fight.keystoneTime
          ),
        ],
      };
    });

    if (insertableFights.length === 0) {
      // eslint-disable-next-line no-console
      console.info("[api/fight] no insertable fights found");

      //   setCacheControl(
      //     res,
      //     ongoing ? CacheControl.ONE_HOUR : CacheControl.ONE_MONTH
      //   );
      res.json(persistedFights);
      return;
    }

    const insertableFightsWithCharacterID =
      await extendPlayersWithServerAndCharacterID(
        report.region,
        insertableFights
      );

    const allPlayers = insertableFightsWithCharacterID.flatMap(
      (fight) => fight.composition
    );

    await Promise.all(
      [
        createLegendaries,
        createConduits,
        createTalents,
        createCovenantTraits,
      ].map((fn) => fn(allPlayers))
    );

    const fightsWithExtendedPlayers = await createFights(
      report,
      allPlayers,
      insertableFightsWithCharacterID
    );

    const playersTODO_REFACTOR = fightsWithExtendedPlayers.flatMap(
      (fight) => fight.composition
    );

    await PullRepo.createMany(fightsWithExtendedPlayers);

    await Promise.all(
      [
        linkPlayerToConduits,
        linkPlayerToTalents,
        linkPlayerToCovenantTraits,
      ].map((fn) => fn(playersTODO_REFACTOR))
    );

    const fullPersistedFights = await FightRepo.loadFull(
      reportID,
      unseenFightIDs
    );

    // setCacheControl(
    //   res,
    //   ongoing ? CacheControl.ONE_HOUR : CacheControl.ONE_MONTH
    // );
    res.json([...persistedFights, ...fullPersistedFights]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.json([]);
  }
};

export const handler = nc()
  .get(createValidReportIDMiddleware("reportID"))
  .get(fightHandler);
