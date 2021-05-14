import type { Character, Fight, Server } from "@prisma/client";
import nc from "next-connect";

import { classMapByName } from "../../../prisma/classes";
import { dungeons } from "../../../prisma/dungeons";
import { specMapByName } from "../../../prisma/specs";
import {
  CacheControl,
  isValidReportId,
  maybeOngoingReport,
  setCacheControl,
} from "../../server/api";
import { CharacterRepo } from "../../server/db/characters";
import { ConduitRepo } from "../../server/db/conduit";
import { CovenantTraitRepo } from "../../server/db/covenantTrait";
import type { ResponseFight2 } from "../../server/db/fights";
import { FightRepo } from "../../server/db/fights";
import { LegendaryRepo } from "../../server/db/legendary";
import { PlayerConduitRepo } from "../../server/db/playerConduit";
import { PlayerCovenantTraitRepo } from "../../server/db/playerCovenantTrait";
import { PlayerTalentRepo } from "../../server/db/playerTalent";
import { PlayerRepo } from "../../server/db/players";
import { ReportRepo } from "../../server/db/report";
import { ServerRepo } from "../../server/db/server";
import { TalentRepo } from "../../server/db/talent";
import { WeekRepo } from "../../server/db/weeks";
// import { loadRecursiveEventsFromSource } from "../../server/queries/events";
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

const getData = (
  details: InDepthCharacterInformation,
  table: Table,
  keystoneTime: number
): FooFight["composition"][number] => {
  const legendary = details.combatantInfo.gear.find(
    (item): item is LegendaryItem => item.quality === ItemQuality.LEGENDARY
  );

  const specId = specMapByName[details.specs[0]];
  const covenantId = details.combatantInfo.covenantID ?? null;

  return {
    actorId: details.id,
    server: details.server,
    name: details.name,
    classId: classMapByName[details.type],
    itemLevel: details.minItemLevel,
    covenantId,
    soulbindId: details.combatantInfo.soulbindID ?? null,
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
    covenantTraits: covenantId
      ? details.combatantInfo.artifact
          .filter((talent) => talent.guid !== 0)
          .map((talent) => {
            return {
              name: talent.name,
              abilityIcon: talent.abilityIcon,
              id: talent.guid,
              covenantId,
            };
          })
      : [],
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

const fightsHandler: RequestHandler<Request, ResponseFight2[]> = async (
  req,
  res
) => {
  if (!isValidReportId(req.query.reportId) || !req.query.ids) {
    res.status(BAD_REQUEST).end();
    return;
  }

  const { reportId } = req.query;
  const ids = Array.isArray(req.query.ids) ? req.query.ids : [req.query.ids];
  const fightIds = ids.map((id) => Number.parseInt(id));

  try {
    const report = await ReportRepo.load(reportId);

    if (!report) {
      res.status(INTERNAL_SERVER_ERROR).end();
      return;
    }

    const ongoing = maybeOngoingReport(report.endTime);

    const persistedFights = await FightRepo.loadFull(reportId, fightIds);
    const unseenFightIds = fightIds.filter(
      (id) => !persistedFights.some((fight) => fight.fightId === id)
    );

    if (unseenFightIds.length === 0) {
      setCacheControl(
        res,
        ongoing ? CacheControl.ONE_MONTH : CacheControl.ONE_HOUR
      );
      res.json(persistedFights);
      return;
    }

    const newFights = await loadFightsFromSource(reportId, unseenFightIds);

    if (!newFights) {
      // eslint-disable-next-line no-console
      console.info(
        `[api/fight] failed to load new fights from wcl for "${reportId}`
      );

      setCacheControl(res, CacheControl.ONE_HOUR);
      res.json(persistedFights);
      return;
    }

    if (newFights.length === 0) {
      // eslint-disable-next-line no-console
      console.info(`[api/fight] no new fights present for "${reportId}"`);

      setCacheControl(
        res,
        ongoing ? CacheControl.ONE_HOUR : CacheControl.ONE_MONTH
      );
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

    const insertableFights = newFights
      .map((fight) => {
        const allNpcIds = new Set(
          fight.dungeonPulls.flatMap((pull) =>
            pull.enemyNPCs.map((npc) => npc.gameID)
          )
        );

        const matchingDungeon = dungeons.find((dungeon) =>
          dungeon.bossIds.every((bossId) => allNpcIds.has(bossId))
        );

        if (matchingDungeon) {
          // some fights report the wrong zone
          // e.g. PhjZq1LBkf98bvx3/#fight=7 being NW showing up as SoA
          if (fight.gameZone?.id === matchingDungeon.id) {
            return fight;
          }

          // some fights do not have a gameZone at all due to the log missing
          // the `zone_change` event
          // see https://discord.com/channels/180033360939319296/427632146019123201/836585255930429460
          return {
            ...fight,
            gameZone: {
              id: matchingDungeon.id,
            },
          };
        }

        return fight;
      })
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

    if (insertableFights.length === 0) {
      // eslint-disable-next-line no-console
      console.info("[api/fight] no insertable fights found");

      setCacheControl(
        res,
        ongoing ? CacheControl.ONE_HOUR : CacheControl.ONE_MONTH
      );
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

    const serverMap = await ServerRepo.createMany(
      report.region,
      toUniqueArray(
        insertableFights.flatMap((fight) =>
          fight.composition.map((player) => player.server)
        )
      )
    );

    const characters = await CharacterRepo.createMany(
      insertableFights.flatMap((fight) => fight.composition),
      report.region,
      serverMap
    );

    const insertableFightsWithCharacterId = insertableFights.map((fight) => {
      return {
        ...fight,
        composition: fight.composition
          .map((player) => {
            const serverId = serverMap[player.server];

            const character = getCharacterId(characters, {
              classId: player.classId,
              name: player.name,
              serverId,
            });

            if (!character) {
              return null;
            }

            return {
              ...player,
              serverId,
              characterId: character.id,
            };
          })
          .filter(
            (player): player is ExtendedPlayer =>
              player?.characterId !== null && player?.serverId !== null
          ),
      };
    });

    const allPlayers = insertableFightsWithCharacterId.flatMap(
      (fight) => fight.composition
    );

    await LegendaryRepo.createMany(
      allPlayers
        .map((player) => player.legendary)
        .filter(
          (
            item
          ): item is NonNullable<
            FooFight["composition"][number]["legendary"]
          > => item !== null
        )
    );

    await ConduitRepo.createMany(
      allPlayers.flatMap((player) => player.conduits)
    );

    await TalentRepo.createMany(allPlayers.flatMap((player) => player.talents));

    await CovenantTraitRepo.createMany(
      allPlayers.flatMap((player) => player.covenantTraits)
    );

    const week = WeekRepo.findWeekbyTimestamp(report.startTime, report.endTime);

    const playerIdMap = await PlayerRepo.createMany(allPlayers, report.id);

    await FightRepo.createMany(
      insertableFightsWithCharacterId.map((fight) => {
        const [player1, player2, player3, player4, player5] = fight.composition;

        return {
          reportId: report.id,
          weekId: week.id,
          fightId: fight.id,
          dungeonId: fight.dungeon,
          chests: fight.chests,
          dps: fight.dps,
          hps: fight.hps,
          dtps: fight.dtps,
          averageItemLevel: Math.round(fight.averageItemLevel * 100),
          keystoneLevel: fight.keystoneLevel,
          keystoneTime: fight.keystoneTime,
          totalDeaths: fight.totalDeaths,
          player1Id: playerIdMap[player1.characterId],
          player2Id: playerIdMap[player2.characterId],
          player3Id: playerIdMap[player3.characterId],
          player4Id: playerIdMap[player4.characterId],
          player5Id: playerIdMap[player5.characterId],
        };
      })
    );

    const insertedFights = await FightRepo.loadMany(
      reportId,
      insertableFightsWithCharacterId.map((fight) => fight.id)
    );

    const playersWithFightAndPlayerId = insertableFightsWithCharacterId.flatMap(
      (fight) =>
        fight.composition
          .map((player) => {
            const dbFight = getFightId(insertedFights, fight.id);

            if (!dbFight) {
              return null;
            }

            return {
              ...player,
              playerId: playerIdMap[player.characterId],
              fightId: dbFight.id,
            };
          })
          .filter(
            (player): player is FurtherExtendedPlayer =>
              player?.fightId !== null
          )
    );

    await PlayerConduitRepo.createMany(
      playersWithFightAndPlayerId.map((player) => {
        return {
          playerId: player.playerId,
          conduits: player.conduits,
          fightId: player.fightId,
        };
      })
    );

    await PlayerTalentRepo.createMany(
      playersWithFightAndPlayerId.map((player) => {
        return {
          playerId: player.playerId,
          talents: player.talents,
          fightId: player.fightId,
        };
      })
    );

    await PlayerCovenantTraitRepo.createMany(
      playersWithFightAndPlayerId.map((player) => {
        return {
          playerId: player.playerId,
          covenantTraits: player.covenantTraits,
          covenantId: player.covenantId,
          fightId: player.fightId,
        };
      })
    );

    const fullPersistedFights = await FightRepo.loadFull(
      reportId,
      unseenFightIds
    );

    setCacheControl(
      res,
      ongoing ? CacheControl.ONE_HOUR : CacheControl.ONE_MONTH
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
    classId: number;
    // spec: SpecName;
    specId: number;
    covenantId: number | null;
    soulbindId: number | null;
    actorId: number;
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

const getCharacterId = (
  characters: Character[],
  {
    serverId,
    name,
    classId,
  }: { serverId: Server["id"]; name: string; classId: number }
) => {
  return characters.find(
    (character) =>
      character.name === name &&
      character.serverId === serverId &&
      character.classId === classId
  );
};

const getFightId = (fights: Pick<Fight, "id" | "fightId">[], id: number) => {
  return fights.find((fight) => fight.fightId === id);
};

type ExtendedPlayer = FooFight["composition"][number] & {
  characterId: number;
  serverId: number;
};

type FurtherExtendedPlayer = ExtendedPlayer & {
  playerId: number;
  fightId: number;
};
