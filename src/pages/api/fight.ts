import type { PlayableClass } from "@prisma/client";
import nc from "next-connect";

import { classMapByName } from "../../../prisma/classes";
import { specMapByName } from "../../../prisma/specs";
import { isValidReportId } from "../../server/api";
import { CharacterRepo } from "../../server/db/characters";
import { ConduitRepo } from "../../server/db/conduit";
import { CovenantTraitRepo } from "../../server/db/covenantTrait";
import { FightRepo } from "../../server/db/fights";
import { LegendaryRepo } from "../../server/db/legendary";
import { PlayerConduitRepo } from "../../server/db/playerConduit";
import { PlayerCovenantTraitRepo } from "../../server/db/playerCovenantTrait";
import { PlayerTalentRepo } from "../../server/db/playerTalent";
import type { PlayerInsert } from "../../server/db/players";
import { PlayerRepo } from "../../server/db/players";
import { ReportRepo } from "../../server/db/report";
import { ServerRepo } from "../../server/db/server";
import { TalentRepo } from "../../server/db/talent";
import { WeekRepo } from "../../server/db/weeks";
import type { ValidRawFight } from "../../server/queries/report";
import { loadFightsFromSource } from "../../server/queries/report";
import type {
  Conduit,
  InDepthCharacterInformation,
  LegendaryItem,
  SoulbindTalent,
  Table,
  Talent,
} from "../../server/queries/table";
import { ItemQuality, loadTableFromSource } from "../../server/queries/table";
import type { RequestHandler } from "../../server/types";
import { toUniqueArray } from "../../utils/array";
import { calcMetricAverage } from "../../utils/calc";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/statusCodes";

type Request = {
  query: {
    reportId?: string;
    ids?: string[];
  };
};

type Response = {};

const getData = (
  details: InDepthCharacterInformation,
  table: Table,
  keystoneTime: number
): FooFight["composition"][number] => {
  const legendary = details.combatantInfo.gear.find(
    (item): item is LegendaryItem => item.quality === ItemQuality.LEGENDARY
  );

  const specId = specMapByName[details.specs[0]];

  return {
    server: details.server,
    name: details.name,
    className: details.type,
    itemLevel: details.minItemLevel,
    covenantId: details.combatantInfo.covenantID,
    soulbindId: details.combatantInfo.soulbindID,
    specId,
    legendary: legendary
      ? {
          id: legendary.id,
          effectId: legendary.effectID,
          effectName: legendary.effectName,
          effectIcon: legendary.effectIcon,
        }
      : null,
    conduits: details.combatantInfo.heartOfAzeroth.map((conduit) => {
      return {
        name: conduit.name,
        abilityIcon: conduit.abilityIcon,
        id: conduit.guid,
        itemLevel: conduit.total,
      };
    }),
    covenantTraits: details.combatantInfo.artifact
      .filter((talent) => talent.guid !== 0)
      .map((talent) => {
        return {
          name: talent.name,
          abilityIcon: talent.abilityIcon,
          id: talent.guid,
          covenantId: details.combatantInfo.covenantID,
        };
      }),
    talents: details.combatantInfo.talents.map((talent) => {
      return {
        name: talent.name,
        abilityIcon: talent.abilityIcon,
        id: talent.guid,
        specId,
        classId: classMapByName[details.type],
      };
    }),
    deaths: table.deathEvents.filter((event) => event.guid === details.guid)
      .length,
    dps: calcMetricAverage(keystoneTime, table.damageDone, details.guid),
    hps: calcMetricAverage(keystoneTime, table.healingDone, details.guid),
  };
};

const fightsHandler: RequestHandler<Request, Response> = async (req, res) => {
  if (
    !isValidReportId(req.query.reportId) ||
    !req.query.ids ||
    !Array.isArray(req.query.ids)
  ) {
    res.status(BAD_REQUEST).end();
    return;
  }

  const { reportId, ids } = req.query;
  const fightIds = ids.map((id) => Number.parseInt(id));

  try {
    const report = await ReportRepo.load(reportId);

    if (!report) {
      res.status(INTERNAL_SERVER_ERROR).end();
      return;
    }

    const persistedFights = await FightRepo.loadFull(reportId, fightIds);
    const unseenFightIds = fightIds.filter(
      (id) => !persistedFights.some((fight) => fight.fightId === id)
    );

    if (unseenFightIds.length === 0) {
      res.json(persistedFights);
      return;
    }

    const newFights = await loadFightsFromSource(reportId, unseenFightIds);

    if (!newFights) {
      res.status(INTERNAL_SERVER_ERROR).end();
      return;
    }

    if (newFights.length === 0) {
      res.json(persistedFights);
      return;
    }

    const fightTables = await Promise.all(
      newFights.map(async (fight) => {
        const table = await loadTableFromSource(reportId, fight);

        return [fight.id, table];
      })
    );

    const tablesAsMap = Object.fromEntries<Table>(
      fightTables.filter((data): data is [number, Table] => data[1] !== null)
    );

    const processedFights = newFights
      .filter((fight): fight is ValidRawFight => {
        const hasSuccessfulTableRequest = fight.id in tablesAsMap;
        const hasGameZone = Boolean(fight.gameZone);
        const isBrokenLog = hasSuccessfulTableRequest
          ? Object.values(tablesAsMap[fight.id].playerDetails).flat().length !==
            5
          : true;

        return hasSuccessfulTableRequest && hasGameZone && !isBrokenLog;
      })
      .map<FooFight>((fight) => {
        const table = tablesAsMap[fight.id];
        const {
          damageDone,
          damageTaken,
          deathEvents,
          healingDone,
          playerDetails,
        } = table;

        return {
          id: fight.id,
          keystoneLevel: fight.keystoneLevel,
          keystoneTime: fight.keystoneTime,
          chests: fight.keystoneBonus,
          averageItemLevel: fight.averageItemLevel,
          affixes: fight.keystoneAffixes,
          dungeon: fight.gameZone.id,
          totalDeaths: deathEvents.length,
          dps: calcMetricAverage(fight.keystoneTime, damageDone),
          dtps: calcMetricAverage(fight.keystoneTime, damageTaken),
          hps: calcMetricAverage(fight.keystoneTime, healingDone),
          composition: [
            getData(playerDetails.tanks[0], table, fight.keystoneTime),
            getData(playerDetails.healers[0], table, fight.keystoneTime),
            getData(playerDetails.dps[0], table, fight.keystoneTime),
            getData(playerDetails.dps[1], table, fight.keystoneTime),
            getData(playerDetails.dps[2], table, fight.keystoneTime),
          ],
        };
      });

    if (processedFights.length === 0) {
      res.json(persistedFights);
      return;
    }

    const serverMap = await ServerRepo.createMany(
      report.region,
      toUniqueArray(
        processedFights.flatMap((fight) =>
          fight.composition.map((player) => player.server)
        )
      )
    );

    const characters = await CharacterRepo.createMany(
      processedFights.flatMap((fight) => fight.composition),
      report.region,
      serverMap
    );

    await LegendaryRepo.createMany(
      processedFights
        .flatMap<FooFight["composition"][number]["legendary"] | null>((fight) =>
          fight.composition.map((player) => player.legendary)
        )
        .filter(
          (
            item
          ): item is NonNullable<
            FooFight["composition"][number]["legendary"]
          > => item !== null
        )
    );

    await ConduitRepo.createMany(
      processedFights
        .map((fight) => fight.composition.map((player) => player.conduits))
        .flat(2)
    );

    await TalentRepo.createMany(
      processedFights
        .map((fight) => fight.composition.map((player) => player.talents))
        .flat(2)
    );

    await CovenantTraitRepo.createMany(
      processedFights
        .map((fight) =>
          fight.composition.map((player) => player.covenantTraits)
        )
        .flat(2)
    );

    const processed2 = processedFights.map((fight) => {
      return {
        ...fight,
        composition: fight.composition.map((player) => {
          return {
            ...player,
            serverId: serverMap[player.server],
            characterId: characters.find(
              (character) => character.name === player.name
            )!.id,
          };
        }),
      };
    });

    const playerIdMap = await PlayerRepo.createMany(
      processed2.flatMap<PlayerInsert>((fight) => fight.composition),
      report.id
    );

    const week = await WeekRepo.findWeekByAffixes(
      report.startTime,
      processedFights[0].affixes
    );

    await FightRepo.createMany(report.id, week.id, processed2, playerIdMap);

    const newPersistedFights = await FightRepo.loadMany(
      reportId,
      processed2.map((fight) => fight.id)
    );

    await PlayerConduitRepo.createMany(
      processed2.flatMap((fight) =>
        fight.composition.map((player) => {
          return {
            playerId: playerIdMap[player.characterId],
            conduits: player.conduits,
            fightId: newPersistedFights.find(
              (newFight) => fight.id === newFight.fightId
            )!.id,
          };
        })
      )
    );

    await PlayerTalentRepo.createMany(
      processed2.flatMap((fight) =>
        fight.composition.map((player) => {
          return {
            playerId: playerIdMap[player.characterId],
            talents: player.talents,
            fightId: newPersistedFights.find(
              (newFight) => fight.id === newFight.fightId
            )!.id,
          };
        })
      )
    );

    await PlayerCovenantTraitRepo.createMany(
      processed2.flatMap((fight) =>
        fight.composition.map((player) => {
          return {
            playerId: playerIdMap[player.characterId],
            fightId: newPersistedFights.find(
              (newFight) => fight.id === newFight.fightId
            )!.id,
            covenantTraits: player.covenantTraits,
            covenantId: player.covenantId,
          };
        })
      )
    );

    const fullPersistedFights = await FightRepo.loadFull(
      reportId,
      unseenFightIds
    );

    res.json([...persistedFights, ...fullPersistedFights]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.json([]);
  }
};

export default nc().get(fightsHandler);

export type FooFight = Omit<
  ValidRawFight,
  | "keystoneBonus"
  | "keystoneAffixes"
  | "startTime"
  | "endTime"
  | "keystoneTime"
  | "gameZone"
  | "dungeonPulls"
> & {
  chests: ValidRawFight["keystoneBonus"];
  dps: number;
  dtps: number;
  totalDeaths: number;
  hps: number;
  dungeon: number;
  keystoneTime: number;
  affixes: ValidRawFight["keystoneAffixes"];
  composition: {
    server: string;
    name: string;
    className: PlayableClass;
    // spec: SpecName;
    specId: number;
    covenantId: number;
    soulbindId: number;
    itemLevel: number;
    deaths: number;
    hps: number;
    dps: number;
    legendary:
      | null
      | (Pick<LegendaryItem, "id" | "effectIcon" | "effectName"> & {
          effectId: number;
        });
    conduits: (Omit<Conduit, "total" | "guid"> & {
      id: Conduit["guid"];
      itemLevel: Conduit["total"];
    })[];
    talents: (Omit<Talent, "type" | "guid"> & {
      id: Talent["guid"];
      classId: number;
      specId: number;
    })[];
    covenantTraits: (Omit<SoulbindTalent, "guid"> & {
      id: SoulbindTalent["guid"];
      covenantId: number;
    })[];
  }[];
};
