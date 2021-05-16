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
  ReportRepo,
  ServerRepo,
  TalentRepo,
  WeekRepo,
} from "@keystone-heroes/db/repos";
import {
  Conduit,
  DamageDone,
  DamageTaken,
  HealingDone,
  InDepthCharacterInformation,
  ItemQuality,
  LegendaryItem,
  RawFight,
  SoulbindTalent,
  Table,
  Talent,
  ValidRawFight,
  wcl,
} from "@keystone-heroes/wcl/queries";

import { toUniqueArray } from "../../utils";

import type { Region, Character } from "@prisma/client";

export const extendPlayersWithServerAndCharacterId = async (
  region: Region,
  fights: InsertableFight[]
): Promise<
  (Omit<InsertableFight, "composition"> & { composition: ExtendedPlayer[] })[]
> => {
  const serverMap = await createServers(region, fights);
  const characters = await createCharacters(region, fights, serverMap);

  return fights.map((fight) => {
    return {
      ...fight,
      composition: fight.composition
        .map((player) => {
          const serverId = serverMap[player.server];

          const character = characters.find(
            (character) =>
              character.name === player.name &&
              character.serverId === serverId &&
              character.classId === player.classId
          );

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
};

type Await<T> = T extends PromiseLike<infer U> ? U : T;

export const createFights = async (
  report: NonNullable<Await<ReturnType<typeof ReportRepo.load>>>,
  allPlayers: ExtendedPlayer[],
  fights: Await<ReturnType<typeof extendPlayersWithServerAndCharacterId>>
): Promise<FurtherExtendedPlayer[]> => {
  const playerIdMap = await PlayerRepo.createMany(allPlayers, report.id);

  const week = WeekRepo.findWeekbyTimestamp(report.startTime, report.endTime);

  await FightRepo.createMany(
    fights.map((fight) => {
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

  const createdFights = await FightRepo.loadMany(
    report.report,
    fights.map((fight) => fight.id)
  );

  return fights.flatMap((fight) =>
    fight.composition
      .map((player) => {
        const dbFight = createdFights.find(
          (createdFight) => createdFight.fightId === fight.id
        );

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
        (player): player is FurtherExtendedPlayer => player?.fightId !== null
      )
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
  region: Region,
  fights: InsertableFight[],
  serverMap: Record<number, number>
): Promise<Character[]> =>
  CharacterRepo.createMany(
    fights.flatMap((fight) => fight.composition),
    region,
    serverMap
  );

type FurtherExtendedPlayer = ExtendedPlayer & {
  playerId: number;
  fightId: number;
};
type ExtendedPlayer = InsertableFight["composition"][number] & {
  characterId: number;
  serverId: number;
};

export type InsertableFight = Omit<
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
        playerId: player.playerId,
        conduits: player.conduits,
        fightId: player.fightId,
      };
    })
  );

export const linkPlayerToTalents = (
  player: FurtherExtendedPlayer[]
): Promise<void> =>
  PlayerTalentRepo.createMany(
    player.map((player) => ({
      playerId: player.playerId,
      talents: player.talents,
      fightId: player.fightId,
    }))
  );

export const linkPlayerToCovenantTraits = (
  player: FurtherExtendedPlayer[]
): Promise<void> =>
  PlayerCovenantTraitRepo.createMany(
    player.map((player) => ({
      playerId: player.playerId,
      covenantTraits: player.covenantTraits,
      covenantId: player.covenantId,
      fightId: player.fightId,
    }))
  );

type EnhancedFight = ValidRawFight & { table: Table };

export const enhanceFightsWithTable = async (
  reportId: string,
  fights: RawFight[]
): Promise<EnhancedFight[]> => {
  const fightsWithGameZone = ensureGameZone(fights);

  const fightsWithTable = await Promise.all(
    fightsWithGameZone.map(async (fight) => {
      const table = await wcl.table(reportId, fight);

      return {
        ...fight,
        table,
      };
    })
  );

  return fightsWithTable.filter((fight): fight is EnhancedFight => {
    return (
      fight.table !== null &&
      Object.values(fight.table.playerDetails).flat().length === 5
    );
  });
};

const ensureGameZone = (fights: RawFight[]) =>
  fights.map((fight) => {
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
  });

export const extractPlayerData = (
  details: InDepthCharacterInformation,
  table: Table,
  keystoneTime: number
): InsertableFight["composition"][number] => {
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
