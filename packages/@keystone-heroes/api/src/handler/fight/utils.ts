import {
  classMapByName,
  dungeons,
  specMapByName,
} from "@keystone-heroes/db/data";
import {
  CharacterRepo,
  ConduitRepo,
  CovenantTraitRepo,
  FightRepo,
  LegendaryRepo,
  PlayerConduitRepo,
  PlayerCovenantTraitRepo,
  PlayerRepo,
  PlayerTalentRepo,
  ServerRepo,
  TalentRepo,
  WeekRepo,
} from "@keystone-heroes/db/repos";
import { ItemQuality, wcl } from "@keystone-heroes/wcl/src/queries";

import { toUniqueArray } from "../../utils";

import type { CastEvent } from "../../../../wcl/src/queries/events";
import type { ReportRepo } from "@keystone-heroes/db/repos";
import type {
  Conduit,
  DamageDone,
  DamageTaken,
  HealingDone,
  InDepthCharacterInformation,
  LegendaryItem,
  SoulbindTalent,
  Table,
  Talent,
} from "@keystone-heroes/wcl/src/queries";
import type {
  DungeonPull,
  ExtendedReportData,
  ExtendedReportDataWithGameZone,
} from "@keystone-heroes/wcl/src/queries/report";
import type { Region, Character } from "@prisma/client";

export const extendPlayersWithServerAndCharacterID = async (
  region: Region,
  fights: InsertableFight[]
): Promise<
  (Omit<InsertableFight, "composition"> & { composition: ExtendedPlayer[] })[]
> => {
  const serverMap = await createServers(region, fights);
  const characters = await createCharacters(fights, serverMap);

  return fights.map((fight) => {
    return {
      ...fight,
      composition: fight.composition
        .map((player) => {
          const serverID = serverMap[player.server];

          const character = characters.find(
            (character) =>
              character.name === player.name &&
              character.serverID === serverID &&
              character.classID === player.classID
          );

          if (!character) {
            return null;
          }

          return {
            ...player,
            serverID,
            characterID: character.id,
          };
        })
        .filter(
          (player): player is ExtendedPlayer =>
            player?.characterID !== null && player?.serverID !== null
        ),
    };
  });
};

type Await<T> = T extends PromiseLike<infer U> ? U : T;

type CreateFightsReturn_TODO_REFACTOR = Omit<
  Await<ReturnType<typeof extendPlayersWithServerAndCharacterID>>[number],
  "composition"
> & {
  fightID: number;
  composition: FurtherExtendedPlayer[];
};

export const createFights = async (
  report: NonNullable<Await<ReturnType<typeof ReportRepo.load>>>,
  allPlayers: ExtendedPlayer[],
  fights: Await<ReturnType<typeof extendPlayersWithServerAndCharacterID>>
): Promise<CreateFightsReturn_TODO_REFACTOR[]> => {
  const playerIDMap = await PlayerRepo.createMany(allPlayers, report.id);

  const week = WeekRepo.findWeekbyTimestamp(report.startTime, report.endTime);

  await FightRepo.createMany(
    fights.map((fight) => {
      const [player1, player2, player3, player4, player5] = fight.composition;

      return {
        reportID: report.id,
        weekID: week.id,
        fightID: fight.id,
        dungeonID: fight.dungeon,
        chests: fight.chests,
        dps: fight.dps,
        hps: fight.hps,
        dtps: fight.dtps,
        averageItemLevel: Math.round(fight.averageItemLevel * 100),
        keystoneLevel: fight.keystoneLevel,
        keystoneTime: fight.keystoneTime,
        totalDeaths: fight.totalDeaths,
        player1ID: playerIDMap[player1.characterID],
        player2ID: playerIDMap[player2.characterID],
        player3ID: playerIDMap[player3.characterID],
        player4ID: playerIDMap[player4.characterID],
        player5ID: playerIDMap[player5.characterID],
      };
    })
  );

  const createdFights = await FightRepo.loadMany(
    report.report,
    fights.map((fight) => fight.id)
  );

  return fights
    .map<CreateFightsReturn_TODO_REFACTOR | null>((fight) => {
      const dbFight = createdFights.find(
        (createdFight) => createdFight.fightID === fight.id
      );

      if (!dbFight) {
        return null;
      }

      return {
        ...fight,
        fightID: dbFight.id,
        composition: fight.composition.map((player) => {
          return {
            ...player,
            playerID: playerIDMap[player.characterID],
            fightID: dbFight.id,
          };
        }),
      };
    })
    .filter(
      (fight): fight is CreateFightsReturn_TODO_REFACTOR =>
        fight?.fightID !== null
    );
};

export const createLegendaries = async (
  players: ExtendedPlayer[]
): Promise<void> => {
  await LegendaryRepo.createMany(
    players
      .map((player) => player.legendary)
      .filter(
        (
          item
        ): item is NonNullable<
          InsertableFight["composition"][number]["legendary"]
        > => item !== null
      )
  );
};

const createServers = (
  region: Region,
  fights: InsertableFight[]
): Promise<Record<string, number>> =>
  ServerRepo.createMany(
    region,
    toUniqueArray(
      fights.flatMap((fight) =>
        fight.composition.map((player) => player.server)
      )
    )
  );

const createCharacters = (
  fights: InsertableFight[],
  serverMap: Record<number, number>
): Promise<Character[]> =>
  CharacterRepo.createMany(
    fights.flatMap((fight) => fight.composition),
    serverMap
  );

export type FurtherExtendedPlayer = ExtendedPlayer & {
  playerID: number;
  fightID: number;
};
type ExtendedPlayer = InsertableFight["composition"][number] & {
  characterID: number;
  serverID: number;
};

export type InsertableFight = Omit<
  ExtendedReportDataWithGameZone,
  | "keystoneBonus"
  | "keystoneAffixes"
  | "startTime"
  | "endTime"
  | "keystoneTime"
  | "gameZone"
  | "dungeonPulls"
> & {
  chests: ExtendedReportDataWithGameZone["keystoneBonus"];
  dps: number;
  dtps: number;
  totalDeaths: number;
  hps: number;
  dungeon: number;
  keystoneTime: number;
  affixes: ExtendedReportDataWithGameZone["keystoneAffixes"];
  composition: {
    server: string;
    name: string;
    classID: number;
    // spec: SpecName;
    specID: number;
    covenantID: number | null;
    soulbindID: number | null;
    actorID: number;
    itemLevel: number;
    deaths: number;
    hps: number;
    dps: number;
    legendary:
      | null
      | (Pick<LegendaryItem, "id" | "effectIcon" | "effectName"> & {
          effectID: number;
        });
    conduits: (Omit<Conduit, "total" | "guid"> & {
      id: Conduit["guid"];
      itemLevel: Conduit["total"];
    })[];
    talents: (Omit<Talent, "type" | "guid"> & {
      id: Talent["guid"];
      classID: number;
      specID: number;
    })[];
    covenantTraits: (Omit<SoulbindTalent, "guid"> & {
      id: SoulbindTalent["guid"];
      covenantID: number;
    })[];
  }[];
  pulls: {
    startTime: number;
    endTime: number;
    x: number;
    y: number;
    boundingBox: {
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    };
    maps: number[];
    events: CastEvent[];
    npcs: DungeonPull["enemyNPCs"];
  }[];
};

export const createConduits = (players: ExtendedPlayer[]): Promise<void> =>
  ConduitRepo.createMany(players.flatMap((player) => player.conduits));

export const createTalents = (players: ExtendedPlayer[]): Promise<void> =>
  TalentRepo.createMany(players.flatMap((player) => player.talents));

export const createCovenantTraits = (
  players: ExtendedPlayer[]
): Promise<void> =>
  CovenantTraitRepo.createMany(
    players.flatMap((player) => player.covenantTraits)
  );

export const linkPlayerToConduits = (
  player: FurtherExtendedPlayer[]
): Promise<void> =>
  PlayerConduitRepo.createMany(
    player.map((player) => {
      return {
        playerID: player.playerID,
        conduits: player.conduits,
        fightID: player.fightID,
      };
    })
  );

export const linkPlayerToTalents = (
  player: FurtherExtendedPlayer[]
): Promise<void> =>
  PlayerTalentRepo.createMany(
    player.map((player) => ({
      playerID: player.playerID,
      talents: player.talents,
      fightID: player.fightID,
    }))
  );

export const linkPlayerToCovenantTraits = (
  player: FurtherExtendedPlayer[]
): Promise<void> =>
  PlayerCovenantTraitRepo.createMany(
    player.map((player) => ({
      playerID: player.playerID,
      covenantTraits: player.covenantTraits,
      covenantID: player.covenantID,
      fightID: player.fightID,
    }))
  );

type FightWithTable = ExtendedReportDataWithGameZone & { table: Table };

export const enhanceFightsWithTable = async (
  reportID: string,
  fights: ExtendedReportData[]
): Promise<FightWithTable[]> => {
  const fightsWithGameZone = ensureGameZone(fights);

  const fightsWithTable = await Promise.all(
    fightsWithGameZone.map(async (fight) => {
      const table = await wcl.table({
        reportID,
        fightIDs: [fight.id],
        startTime: fight.startTime,
        endTime: fight.endTime,
      });

      return {
        ...fight,
        table,
      };
    })
  );

  return fightsWithTable.filter((fight): fight is FightWithTable => {
    return (
      fight.table !== null &&
      Object.values(fight.table.playerDetails).flat().length === 5
    );
  });
};

type FightWithEvents = FightWithTable & { events: CastEvent[] };

export const enhanceFightsWithEvents = async (
  reportID: string,
  fights: FightWithTable[]
): Promise<FightWithEvents[]> => {
  const fightsWithEvents = await Promise.all(
    fights.map(async (fight) => {
      const ids = fight.table.composition.map((player) => player.id);

      const allEvents = await Promise.all(
        ids.map((id) =>
          wcl.events(reportID, fight.startTime, fight.endTime, id)
        )
      );

      return {
        ...fight,
        events: allEvents.flat().sort((a, b) => a.timestamp - b.timestamp),
      };
    })
  );

  return fightsWithEvents.filter((fight): fight is FightWithEvents => {
    return fight.events.length > 0;
  });
};

const ensureGameZone = (fights: ExtendedReportData[]) =>
  fights.map((fight) => {
    const allNPCIDs = new Set(
      fight.dungeonPulls.flatMap((pull) =>
        pull.enemyNPCs.map((npc) => npc.gameID)
      )
    );

    const matchingDungeon = dungeons.find((dungeon) =>
      dungeon.bossIDs.every((bossID) => allNPCIDs.has(bossID))
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
  });

export const extractPlayerData = (
  details: InDepthCharacterInformation,
  table: Table,
  keystoneTime: number
): InsertableFight["composition"][number] => {
  const legendary = details.combatantInfo.gear.find(
    (item): item is LegendaryItem => item.quality === ItemQuality.LEGENDARY
  );

  const specID = specMapByName[details.specs[0]];
  const covenantID = details.combatantInfo.covenantID ?? null;

  return {
    actorID: details.id,
    server: details.server,
    name: details.name,
    classID: classMapByName[details.type],
    itemLevel: details.minItemLevel,
    covenantID,
    soulbindID: details.combatantInfo.soulbindID ?? null,
    specID,
    legendary: legendary
      ? {
          id: legendary.id,
          effectID: legendary.effectID,
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
    covenantTraits: covenantID
      ? details.combatantInfo.artifact
          .filter((talent) => talent.guid !== 0)
          .map((talent) => {
            return {
              name: talent.name,
              abilityIcon: talent.abilityIcon,
              id: talent.guid,
              covenantID,
            };
          })
      : [],
    talents: details.combatantInfo.talents.map((talent) => {
      return {
        name: talent.name,
        abilityIcon: talent.abilityIcon,
        id: talent.guid,
        specID,
        classID: classMapByName[details.type],
      };
    }),
    deaths: table.deathEvents.filter((event) => event.guid === details.guid)
      .length,
    dps: calcMetricAverage(keystoneTime, table.damageDone, details.guid),
    hps: calcMetricAverage(keystoneTime, table.healingDone, details.guid),
  };
};

export const calcMetricAverage = <
  T extends Pick<DamageDone | HealingDone | DamageTaken, "total" | "guid">[]
>(
  keystoneTime: number,
  data: T,
  guid?: InDepthCharacterInformation["guid"]
): number => {
  const runInSeconds = keystoneTime / 1000;

  const sum = guid
    ? data.find((event) => event.guid === guid)?.total ?? 0
    : data.reduce((acc: number, dataset) => acc + dataset.total, 0);

  return Math.round(sum / runInSeconds);
};
