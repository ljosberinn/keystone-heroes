import {
  NW_SPEAR,
  NW_ORB,
  NW_HAMMER,
  NW_KYRIAN_ORB_HEAL,
  NW_KYRIAN_ORB_DAMAGE,
} from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import type { DamageEvent, HealEvent } from "../../types";
import type { GetEventBaseParams } from "../../utils";
import {
  getEvents,
  reduceToChunkByThreshold,
  reduceEventsByPlayer,
  createEventFetcher,
} from "../../utils";

export const getNecroticWakeSpearUsage = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_SPEAR,
  });

  // NW Spear applies a bleed for 16 seconds
  // each usage is hopefully thus at least 16s apart of each other
  // may have to adjust later for multi-spearing...
  const threshold = 16 * 1000;

  const chunks = allEvents.reduce<DamageEvent[][]>(
    (acc, event) => reduceToChunkByThreshold(acc, event, threshold),
    []
  );

  // creates one event per orb usage
  return chunks.flatMap((chunk) => reduceEventsByPlayer(chunk, "sourceID"));
};

export const getNecroticWakeOrbUsage = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_ORB,
  });
  // NW Orb pulses every 1s for 8s
  // each usage is hopefully thus at least 8s apart of each other
  // may have to adjust later for multi-orbing...
  const threshold = 8 * 1000;

  const chunks = allEvents.reduce<DamageEvent[][]>(
    (acc, event) => reduceToChunkByThreshold(acc, event, threshold),
    []
  );

  // creates one event per orb usage
  return chunks.flatMap((chunk) => reduceEventsByPlayer(chunk, "sourceID"));
};

export const getNecroticWakeHammerUsage = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageDone,
  hostilityType: HostilityType.Friendlies,
  abilityID: NW_HAMMER,
});

export const getNecroticWakeKyrianOrbHealEvents = async (
  params: GetEventBaseParams
): Promise<HealEvent[]> => {
  const allEvents = await getEvents<HealEvent>({
    ...params,
    dataType: EventDataType.Healing,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_KYRIAN_ORB_HEAL,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};

export const getNecroticWakeKyrianOrbDamageEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW_KYRIAN_ORB_DAMAGE,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};
