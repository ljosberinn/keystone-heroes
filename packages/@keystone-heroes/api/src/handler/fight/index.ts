import { FightRepo, ReportRepo } from "@keystone-heroes/db/repos";
import { wcl } from "@keystone-heroes/wcl/src/queries";
import nc from "next-connect";

import { createValidReportIdMiddleware } from "../../middleware/validReportId";
import { BAD_GATEWAY, INTERNAL_SERVER_ERROR } from "../../utils/statusCodes";
import {
  calcMetricAverage,
  createConduits,
  createCovenantTraits,
  createFights,
  createLegendaries,
  createTalents,
  enhanceFightsWithTable,
  extendPlayersWithServerAndCharacterId,
  extractPlayerData,
  linkPlayerToConduits,
  linkPlayerToCovenantTraits,
  linkPlayerToTalents,
} from "./utils";

import type { RequestHandler } from "../../utils/types";
import type { InsertableFight } from "./utils";
import type { Talent } from "@keystone-heroes/wcl/src/queries";
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
  | "fightId"
> & {
  dungeon: Dungeon & {
    zones: Omit<Zone, "dungeonId" | "order">[];
  };
  affixes: Omit<Affix, "seasonal">[];
  composition: Composition;
  pulls: {
    startTime: number;
    endTime: number;
    events: unknown[];
  }[];
};

type Composition = (Pick<
  PrismaPlayer,
  "dps" | "hps" | "deaths" | "itemLevel"
> & {
  actorId: number;
  legendary: Legendary | null;
  covenant: Pick<Covenant, "icon" | "name"> | null;
  soulbind: Pick<Soulbind, "icon" | "name"> | null;
  character: Pick<Character, "name"> & {
    class: Class;
    spec: Pick<Spec, "id" | "name">;
    server: Pick<Server, "name">;
  };
  talents: (Omit<Talent, "guid" | "type"> & { id: number })[];
  covenantTraits: Omit<CovenantTrait, "covenantId">[];
  conduits: (Omit<Conduit, "guid" | "total"> & {
    itemLevel: number;
    id: number;
  })[];
})[];

const fightHandler: RequestHandler<Request, FightResponse[]> = async (
  req,
  res
) => {
  if (!req.query.fightIDs) {
    res.status(BAD_GATEWAY).end();
    return;
  }

  const { reportID, fightIDs } = req.query;
  const ids = Array.isArray(fightIDs) ? fightIDs : [fightIDs];
  const fightIds = ids.map((id) => Number.parseInt(id));

  try {
    const report = await ReportRepo.load(reportID);

    if (!report) {
      res.status(INTERNAL_SERVER_ERROR).end();
      return;
    }

    // const ongoing = maybeOngoingReport(report.endTime);

    const persistedFights = await FightRepo.loadFull(reportID, fightIds);
    const unseenFightIds = fightIds.filter(
      (id) => !persistedFights.some((fight) => fight.fightId === id)
    );

    if (unseenFightIds.length === 0) {
      //   setCacheControl(
      //     res,
      //     ongoing ? CacheControl.ONE_MONTH : CacheControl.ONE_HOUR
      //   );
      res.json(persistedFights);
      return;
    }

    const newFights = await wcl.fights({
      reportID,
      fightIDs: unseenFightIds,
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

    const sanitizedFights = await enhanceFightsWithTable(reportID, newFights);

    const insertableFights = sanitizedFights.map<InsertableFight>((fight) => {
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

    // try {
    //   const [firstFight] = insertableFights;
    //   const raw = newFights.find((fight) => fight.id === firstFight.id);

    //   if (raw) {
    //     const actorIds = firstFight.composition.map((player) => player.actorId);

    //     const events = await loadRecursiveEventsFromSource(
    //       reportId,
    //       raw.startTime,
    //       raw.endTime,
    //       actorIds
    //     );
    //     console.log(events);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }

    const insertableFightsWithCharacterId =
      await extendPlayersWithServerAndCharacterId(
        report.region,
        insertableFights
      );

    const allPlayers = insertableFightsWithCharacterId.flatMap(
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

    const playersWithFightAndPlayerId = await createFights(
      report,
      allPlayers,
      insertableFightsWithCharacterId
    );

    await Promise.all(
      [
        linkPlayerToConduits,
        linkPlayerToTalents,
        linkPlayerToCovenantTraits,
      ].map((fn) => fn(playersWithFightAndPlayerId))
    );

    const fullPersistedFights = await FightRepo.loadFull(
      reportID,
      unseenFightIds
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
  .get(createValidReportIdMiddleware("reportID"))
  .get(fightHandler);
