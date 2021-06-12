import {
  DIMENSIONAL_SHIFTER,
  POTION_OF_THE_HIDDEN_SPIRIT,
  CARDBOARD_ASSASSIN,
  remarkableSpellIDs,
  DungeonIDs,
} from "@keystone-heroes/db/data";
import { Affixes } from "@keystone-heroes/db/prisma";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import { getCachedSdk } from "../../client";
import { getBolsteringEvents } from "./affixes/bolstering";
import { getBurstingDamageTakenEvents } from "./affixes/bursting";
import {
  getExplosiveDamageTakenEvents,
  getExplosiveKillEvents,
} from "./affixes/explosive";
import { getGrievousDamageTakenEvents } from "./affixes/grievous";
import {
  getNecroticDamageTakenEvents,
  getHighestNecroticStackAmount,
} from "./affixes/necrotic";
import {
  getManifestationOfPrideSourceID,
  getManifestationOfPrideDeathEvents,
  getDamageDoneToManifestationOfPrideEvents,
  getDamageTakenByManifestatioNOfPrideEvents,
} from "./affixes/prideful";
import {
  getQuakingDamageTakenEvents,
  getQuakingInterruptEvents,
} from "./affixes/quaking";
import {
  getSanguineDepthsBuffEvents,
  getSanguineDamageTakenEvents,
  getSanguineHealingDoneEvents,
} from "./affixes/sanguine";
import { getSpitefulDamageTakenEvents } from "./affixes/spiteful";
import { getStormingDamageTakenEvents } from "./affixes/storming";
import {
  getBottleOfSanguineIchorHealEvents,
  getStoneWardHealEvents,
  getMassiveSmashDamageTakenEvents,
  getRazeDamageTakenEvents,
  getDecapitateDamageTakenEvents,
  getSoulforgeFlamesDamageTakenEvents,
  getFrostLanceDamageTakenEvents,
  getBottleOfSanguineIchorDamageEvents,
  getVolcanicPlumeDamageDoneEvents,
  getStygianKingsBarbsDamageEvents,
  getFifthSkullDamageEvents,
  getBitingColdDamageTakenEvents,
} from "./affixes/tormented";
import { getVolcanicDamageTakenEvents } from "./affixes/volcanic";
import { getDeOtherSideUrnUsage } from "./dungeons/shadowlands/dos";
import { getHallsOfAtonementGargoyleCharms } from "./dungeons/shadowlands/hoa";
import {
  getNecroticWakeKyrianOrbHealEvents,
  getNecroticWakeKyrianOrbDamageEvents,
  getNecroticWakeOrbUsage,
  getNecroticWakeSpearUsage,
  getNecroticWakeHammerUsage,
} from "./dungeons/shadowlands/nw";
import { getPFSlimeKills } from "./dungeons/shadowlands/pf";
import { getSanguineDepthsLanternUsages } from "./dungeons/shadowlands/sd";
import { getSpiresOfAscensionSpearUsage } from "./dungeons/shadowlands/soa";
import { getTheaterOfPainBannerUsage } from "./dungeons/shadowlands/top";
import type {
  CastEvent,
  BeginCastEvent,
  ApplyBuffEvent,
  RemoveBuffEvent,
  AnyEvent,
  DeathEvent,
} from "./types";
import type { GetEventBaseParams } from "./utils";
import { getEvents, createEventFetcher } from "./utils";

export * from "./types";

export const getRemarkableSpellCastEvents = async (
  params: GetEventBaseParams<{ sourceID: number }>
): Promise<CastEvent[]> => {
  const allEvents = await getEvents<CastEvent | BeginCastEvent>({
    ...params,
    dataType: EventDataType.Casts,
    hostilityType: HostilityType.Friendlies,
  });

  return allEvents.filter(
    (event): event is CastEvent =>
      event.type === "cast" && remarkableSpellIDs.has(event.abilityGameID)
  );
};

type CardboardAssassinUsages = { events: CastEvent[]; actorId: number | null };

const getCardboardAssassinUsage = async (
  params: GetEventBaseParams
): Promise<CardboardAssassinUsages[]> => {
  const sdk = await getCachedSdk();

  const data = await sdk.PetActors({
    reportID: params.reportID,
  });

  const cardboardAssassinInstances =
    data?.reportData?.report?.masterData?.actors?.filter(
      (pet) => pet?.gameID === CARDBOARD_ASSASSIN
    ) ?? [];

  if (cardboardAssassinInstances.length === 0) {
    return [];
  }

  const eventGroup = await Promise.all(
    cardboardAssassinInstances.map(async (instance) => {
      if (!instance?.id) {
        return null;
      }

      const events = await getEvents<CastEvent>({
        ...params,
        sourceID: instance.id,
        dataType: EventDataType.Threat,
        hostilityType: HostilityType.Friendlies,
      });

      if (events.length === 0) {
        return null;
      }

      return {
        actorId: instance.petOwner,
        events,
      };
    })
  );

  return eventGroup.filter(
    (dataset): dataset is CardboardAssassinUsages => dataset !== null
  );
};

const getInvisibilityUsage = async (
  params: GetEventBaseParams
): Promise<ApplyBuffEvent[]> => {
  const dimensionalShifterUsage = await getEvents<
    ApplyBuffEvent | RemoveBuffEvent
  >({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: DIMENSIONAL_SHIFTER,
  });

  const potionUsage = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
    ...params,
    dataType: EventDataType.Buffs,
    hostilityType: HostilityType.Friendlies,
    abilityID: POTION_OF_THE_HIDDEN_SPIRIT,
  });

  return [...dimensionalShifterUsage, ...potionUsage].filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );
};

export const getPlayerDeathEvents = createEventFetcher<DeathEvent>({
  dataType: EventDataType.Deaths,
  hostilityType: HostilityType.Friendlies,
});

export type EventParams = {
  reportID: string;
  startTime: number;
  endTime: number;
  dungeonID: DungeonIDs;
  fightID: number;
  affixes: Affixes[];
};

type DungeonWithEvents = Exclude<DungeonIDs, DungeonIDs.MISTS_OF_TIRNA_SCITHE>;

const dungeonEventGetterMap: Record<
  DungeonWithEvents,
  ((params: EventParams) => Promise<AnyEvent[]>)[]
> = {
  [DungeonIDs.DE_OTHER_SIDE]: [getDeOtherSideUrnUsage],
  [DungeonIDs.HALLS_OF_ATONEMENT]: [getHallsOfAtonementGargoyleCharms],
  [DungeonIDs.PLAGUEFALL]: [getPFSlimeKills],
  [DungeonIDs.SANGUINE_DEPTHS]: [
    getSanguineDepthsLanternUsages,
    getSanguineDepthsBuffEvents,
  ],
  [DungeonIDs.SPIRES_OF_ASCENSION]: [getSpiresOfAscensionSpearUsage],
  [DungeonIDs.THEATRE_OF_PAIN]: [getTheaterOfPainBannerUsage],
  [DungeonIDs.THE_NECROTIC_WAKE]: [
    getNecroticWakeKyrianOrbHealEvents,
    getNecroticWakeKyrianOrbDamageEvents,
    getNecroticWakeOrbUsage,
    getNecroticWakeSpearUsage,
    getNecroticWakeHammerUsage,
  ],
};

const isDungeonWithEvent = (id: DungeonIDs): id is DungeonWithEvents =>
  id in dungeonEventGetterMap;

export const getDungeonSpecificEvents = async (
  params: EventParams
): Promise<AnyEvent[]> => {
  if (!isDungeonWithEvent(params.dungeonID)) {
    return [];
  }

  const nestedEvents = await Promise.all(
    dungeonEventGetterMap[params.dungeonID].map((fn) => fn(params))
  );

  return nestedEvents.flat();
};

type AffixWithEvents = Exclude<
  Affixes,
  | "Awakened"
  | "Beguiling"
  | "Tyrannical"
  | "Fortified"
  | "Prideful"
  | "Raging"
  | "Infested"
  | "Inspiring"
  | "Reaping"
  | "Skittish"
  | "Tormented"
>;

const affixEventGetterMap: Record<
  AffixWithEvents,
  ((params: EventParams) => Promise<AnyEvent[]>)[]
> = {
  [Affixes.Sanguine]: [
    getSanguineDamageTakenEvents,
    getSanguineHealingDoneEvents,
  ],
  [Affixes.Explosive]: [getExplosiveDamageTakenEvents, getExplosiveKillEvents],
  [Affixes.Grievous]: [getGrievousDamageTakenEvents],
  [Affixes.Necrotic]: [
    getNecroticDamageTakenEvents,
    getHighestNecroticStackAmount,
  ],
  [Affixes.Volcanic]: [getVolcanicDamageTakenEvents],
  [Affixes.Bursting]: [getBurstingDamageTakenEvents],
  [Affixes.Spiteful]: [getSpitefulDamageTakenEvents],
  [Affixes.Quaking]: [getQuakingDamageTakenEvents, getQuakingInterruptEvents],
  [Affixes.Storming]: [getStormingDamageTakenEvents],
  [Affixes.Bolstering]: [getBolsteringEvents],
};

export const getAffixSpecificEvents = async (
  params: EventParams
): Promise<AnyEvent[]> => {
  const allEvents = await Promise.all(
    params.affixes
      .filter((affix): affix is AffixWithEvents => affix in affixEventGetterMap)
      .flatMap((affix) => affixEventGetterMap[affix])
      .map((fn) => fn(params))
  );

  return allEvents.flat();
};

export const getSeasonSpecificEvents = async (
  params: EventParams
): Promise<AnyEvent[]> => {
  if (params.affixes.includes(Affixes.Prideful)) {
    const prideSourceID = await getManifestationOfPrideSourceID(params);

    if (!prideSourceID) {
      return [];
    }

    const pridefulDeathEvents = await getManifestationOfPrideDeathEvents({
      ...params,
      sourceID: prideSourceID,
    });

    const damageTakenEvents = await Promise.all(
      pridefulDeathEvents.map(async (event, index, arr) => {
        if (!event.targetInstance) {
          return [];
        }

        // on the first pride death event, start searching for damageDone events
        // from the start of the key.
        // on subsequent death events, start searching beginning with the death
        // timestamp of the previous pride
        const startTime =
          index === 0 ? params.startTime : arr[index - 1].timestamp;

        // retrieve the timestamp at which the first damage was done to pride
        const [{ timestamp: firstDamageDoneTimestamp }] =
          await getDamageDoneToManifestationOfPrideEvents(
            {
              reportID: params.reportID,
              endTime: event.timestamp,
              startTime,
              targetID: prideSourceID,
              targetInstance: event.targetInstance,
            },
            true
          );

        return getDamageTakenByManifestatioNOfPrideEvents({
          reportID: params.reportID,
          targetID: prideSourceID,
          startTime: firstDamageDoneTimestamp,
          endTime: event.timestamp,
          targetInstance: event.targetInstance,
        });
      })
    );

    return [...pridefulDeathEvents, ...damageTakenEvents.flat()];
  }

  if (params.affixes.includes(Affixes.Tormented)) {
    const nestedEvents = await Promise.all<AnyEvent[]>([
      getBottleOfSanguineIchorHealEvents(params),
      getStoneWardHealEvents(params),
      getMassiveSmashDamageTakenEvents(params),
      getRazeDamageTakenEvents(params),
      getDecapitateDamageTakenEvents(params),
      getSoulforgeFlamesDamageTakenEvents(params),
      getFrostLanceDamageTakenEvents(params),
      getBottleOfSanguineIchorDamageEvents(params),
      getVolcanicPlumeDamageDoneEvents(params),
      getStygianKingsBarbsDamageEvents(params),
      getFifthSkullDamageEvents(params),
      getBitingColdDamageTakenEvents(params),
    ]);

    return nestedEvents.flat();
  }

  return [];
};
