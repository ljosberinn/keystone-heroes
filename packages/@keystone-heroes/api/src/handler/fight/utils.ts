import {
  classMapByName,
  DungeonIds,
  dungeons,
  getAffixByName,
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
import { Affixes } from "@prisma/client";

import {
  getBolsteringEvents,
  getBurstingDamageTakenEvents,
  getDosUrnUsage,
  getExplosiveDamageTakenEvents,
  getExplosiveKillEvents,
  getGrievousDamageTakenEvents,
  getHoaGargoyleCharms,
  getManifestationOfPrideDeathEvents,
  getManifestationOfPrideSourceID,
  getNecroticDamageTakenEvents,
  getNecroticWakeKyrianOrbDamageEvents,
  getNecroticWakeKyrianOrbHealEvents,
  getNwHammerUsage,
  getNwOrbUsage,
  getNwSpearUsage,
  getPFSlimeKills,
  getPlayerDeathEvents,
  getQuakingDamageTakenEvents,
  getQuakingInterruptEvents,
  getSanguineDamageTakenEvents,
  getSanguineHealingDoneEvents,
  getSdBuffEvents,
  getSdLanternUsages,
  getSpiresSpearUsage,
  getSpitefulDamageTakenEvents,
  getStormingDamageTakenEvents,
  getTopBannerUsage,
  getVolcanicDamageTakenEvents,
  getDamageDoneToManifestationOfPrideEvents,
  getDamageTakenByManifestatioNOfPrideEvents,
} from "../../../../wcl/src/queries/events";
import { toUniqueArray } from "../../utils";

import type {
  CastEvent,
  ApplyBuffEvent,
  DamageEvent,
  ApplyDebuffEvent,
  DeathEvent,
  HealEvent,
  InterruptEvent,
  BeginCastEvent,
  DamageTakenEvent,
  ApplyBuffStackEvent,
  RemoveBuffEvent,
} from "../../../../wcl/src/queries/events";
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
  startTime: number;
  endTime: number;
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
    events: (
      | CastEvent
      | ApplyDebuffEvent
      | DeathEvent
      | (ApplyBuffEvent & { stacks?: number })
      | BeginCastEvent
      | HealEvent
      | DamageEvent
      | InterruptEvent
      | RemoveBuffEvent
      | ApplyBuffStackEvent
    )[];
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

const getDungeonSpecificEvents = async (
  reportID: string,
  fight: FightWithTable
): Promise<
  (
    | ApplyDebuffEvent
    | DeathEvent
    | ApplyBuffEvent
    | CastEvent
    | BeginCastEvent
    | HealEvent
    | DamageEvent
    | ApplyBuffStackEvent
    | RemoveBuffEvent
  )[]
> => {
  const params = {
    startTime: fight.startTime,
    endTime: fight.endTime,
    reportID,
  };

  switch (fight.gameZone.id) {
    case DungeonIds.DE_OTHER_SIDE:
      return getDosUrnUsage(params);
    case DungeonIds.HALLS_OF_ATONEMENT:
      return getHoaGargoyleCharms(params);
    case DungeonIds.PLAGUEFALL:
      return getPFSlimeKills({ ...params, fightID: fight.id });
    case DungeonIds.SANGUINE_DEPTHS: {
      const lanternBeginCastEvents = await getSdLanternUsages(params);
      const sinfallBoonEvents = await getSdBuffEvents(params);

      // const chunks = lanternBeginCastEvents
      //   .map((beginCastEvent, index, arr) => {
      //     const applicationOrRefresh = sinfallBoonEvents.find(
      //       (event) =>
      //         event.timestamp > beginCastEvent.timestamp &&
      //         (event.type === "applybuff" || event.type === "applybuffstack")
      //     );

      //     if (!applicationOrRefresh) {
      //       return null;
      //     }

      //     const nextBeginCastEvent = arr[index + 1];
      //     const nextEvents = sinfallBoonEvents.filter((event) => {
      //       return (
      //         event.timestamp >= applicationOrRefresh.timestamp &&
      //         (nextBeginCastEvent
      //           ? event.timestamp < nextBeginCastEvent.timestamp
      //           : true)
      //       );
      //     });

      //     if (nextEvents.length === 0) {
      //       return null;
      //     }

      //     return [beginCastEvent, ...nextEvents];
      //   })
      //   .filter((arr) => arr !== null);

      return [...lanternBeginCastEvents, ...sinfallBoonEvents];
    }
    case DungeonIds.SPIRES_OF_ASCENSION:
      return getSpiresSpearUsage(params);
    case DungeonIds.THEATRE_OF_PAIN:
      return getTopBannerUsage(params);
    case DungeonIds.THE_NECROTIC_WAKE: {
      const kyrianOrbHealEvents = await getNecroticWakeKyrianOrbHealEvents(
        params
      );
      const kyrianOrbDamageEvents = await getNecroticWakeKyrianOrbDamageEvents(
        params
      );

      const orbDamageEvents = await getNwOrbUsage(params);
      const spearDamageEvents = await getNwSpearUsage(params);
      const hammerDamageEvents = await getNwHammerUsage(params);

      return [
        ...kyrianOrbHealEvents,
        ...kyrianOrbDamageEvents,
        ...orbDamageEvents,
        ...spearDamageEvents,
        ...hammerDamageEvents,
      ];
    }
    default:
      return [];
  }
};

const getAffixSpecificEvents = async (
  reportID: string,
  fight: FightWithTable
): Promise<
  (
    | HealEvent
    | DamageTakenEvent
    | DeathEvent
    | InterruptEvent
    | ApplyBuffEvent
  )[]
> => {
  const affixes = fight.keystoneAffixes;

  const hasSanguineAffix = affixes.includes(getAffixByName(Affixes.Sanguine));
  const hasExplosiveAffix = affixes.includes(getAffixByName(Affixes.Explosive));
  const hasGrievousAffix = affixes.includes(getAffixByName(Affixes.Grievous));
  const hasSpitefulAffix = affixes.includes(getAffixByName(Affixes.Spiteful));
  const hasNecroticAffix = affixes.includes(getAffixByName(Affixes.Necrotic));
  const hasStormingAffix = affixes.includes(getAffixByName(Affixes.Storming));
  const hasVolcanicAffix = affixes.includes(getAffixByName(Affixes.Volcanic));
  const hasBolsteringAffix = affixes.includes(
    getAffixByName(Affixes.Bolstering)
  );
  const hasBurstingAffix = affixes.includes(getAffixByName(Affixes.Bursting));
  const hasQuakingAffix = affixes.includes(getAffixByName(Affixes.Quaking));

  const params = {
    reportID,
    fightID: fight.id,
    startTime: fight.startTime,
    endTime: fight.endTime,
  };

  const sanguineDamageEvents = hasSanguineAffix
    ? await getSanguineDamageTakenEvents(params)
    : [];
  const sanguineHealingEvents = hasSanguineAffix
    ? await getSanguineHealingDoneEvents(params)
    : [];
  const explosiveDamageTakenEvents = hasExplosiveAffix
    ? await getExplosiveDamageTakenEvents(params)
    : [];
  const explosiveKillEvents = hasExplosiveAffix
    ? await getExplosiveKillEvents(params)
    : [];
  const grievousDamageTakenEvents = hasGrievousAffix
    ? await getGrievousDamageTakenEvents(params)
    : [];
  const necroticDamageTakenEvents = hasNecroticAffix
    ? await getNecroticDamageTakenEvents(params)
    : [];
  const volcanicDamageTakenEvents = hasVolcanicAffix
    ? await getVolcanicDamageTakenEvents(params)
    : [];
  const burstingDamageTakenEvents = hasBurstingAffix
    ? await getBurstingDamageTakenEvents(params)
    : [];
  const spitefulDamageTakenEvents = hasSpitefulAffix
    ? await getSpitefulDamageTakenEvents(params)
    : [];
  const quakingDamageTakenEvents = hasQuakingAffix
    ? await getQuakingDamageTakenEvents(params)
    : [];
  const quakingInterruptEvents = hasQuakingAffix
    ? await getQuakingInterruptEvents(params)
    : [];
  const stormingDamageTakenEvents = hasStormingAffix
    ? await getStormingDamageTakenEvents(params)
    : [];

  const bolsteringEvents = hasBolsteringAffix
    ? await getBolsteringEvents(params)
    : [];

  return [
    ...sanguineDamageEvents,
    ...sanguineHealingEvents,
    ...explosiveDamageTakenEvents,
    ...explosiveKillEvents,
    ...grievousDamageTakenEvents,
    ...necroticDamageTakenEvents,
    ...volcanicDamageTakenEvents,
    ...burstingDamageTakenEvents,
    ...spitefulDamageTakenEvents,
    ...quakingDamageTakenEvents,
    ...quakingInterruptEvents,
    ...stormingDamageTakenEvents,
    ...bolsteringEvents,
  ];
};

const getSeasonSpecificEvents = async (
  reportID: string,
  fight: FightWithTable
): Promise<(DeathEvent | DamageTakenEvent)[]> => {
  const hasPrideful = fight.keystoneAffixes.includes(
    getAffixByName(Affixes.Prideful)
  );

  if (hasPrideful) {
    const prideSourceID = await getManifestationOfPrideSourceID({
      reportID,
      fightID: fight.id,
    });

    if (!prideSourceID) {
      return [];
    }

    const pridefulDeathEvents = await getManifestationOfPrideDeathEvents({
      reportID,
      startTime: fight.startTime,
      endTime: fight.endTime,
      fightID: fight.id,
      sourceID: prideSourceID,
    });

    const damageTakenEvents = await Promise.all(
      pridefulDeathEvents.map(async (event, index, arr) => {
        // on the first pride death event, start searching for damageDone events
        // from the start of the key.
        // on subsequent death events, start searching beginning with the death
        // timestamp of the previous pride
        const startTime =
          index === 0 ? fight.startTime : arr[index - 1].timestamp;

        // retrieve the timestamp at which the first damage was done to pride
        const [
          { timestamp: firstDamageDoneTimestamp },
        ] = await getDamageDoneToManifestationOfPrideEvents(
          {
            reportID,
            endTime: event.timestamp,
            startTime,
            targetID: prideSourceID,
            targetInstance: event.targetInstance,
          },
          true
        );

        return getDamageTakenByManifestatioNOfPrideEvents({
          reportID,
          targetID: prideSourceID,
          startTime: firstDamageDoneTimestamp,
          endTime: event.timestamp,
          targetInstance: event.targetInstance,
        });
      })
    );

    return [...pridefulDeathEvents, ...damageTakenEvents.flat()];
  }

  return [];
};

type FightWithEvents = FightWithTable & { events: CastEvent[] };

export const enhanceFightsWithEvents = async (
  reportID: string,
  fights: FightWithTable[]
): Promise<FightWithEvents[]> => {
  const fightsWithEvents = await Promise.all(
    fights.map(async (fight) => {
      const ids = fight.table.composition.map((player) => player.id);

      const abilityEvents = await Promise.all(
        ids.map((id) =>
          wcl.events(reportID, fight.startTime, fight.endTime, id)
        )
      );

      const playerDeathEvents = await getPlayerDeathEvents({
        reportID,
        startTime: fight.startTime,
        endTime: fight.endTime,
      });
      const affixEvents = await getAffixSpecificEvents(reportID, fight);
      const dungeonEvents = await getDungeonSpecificEvents(reportID, fight);
      const seasonEvents = await getSeasonSpecificEvents(reportID, fight);

      const allEvents = [
        ...abilityEvents.flat(),
        ...playerDeathEvents,
        ...dungeonEvents,
        ...seasonEvents,
        ...affixEvents,
      ];

      return {
        ...fight,
        events: allEvents.sort((a, b) => a.timestamp - b.timestamp),
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
