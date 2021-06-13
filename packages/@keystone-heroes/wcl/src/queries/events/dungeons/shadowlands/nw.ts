import { EventDataType, HostilityType } from "../../../../types";
import type { DamageEvent, HealEvent } from "../../types";
import type { GetEventBaseParams } from "../../utils";
import {
  getEvents,
  reduceEventsByPlayer,
  createEventFetcher,
  createChunkByThresholdReducer,
} from "../../utils";

export const NW = {
  ORB: 328_406,
  HAMMER: 328_128,
  SPEAR: 328_351,
  KYRIAN_ORB: {
    heal: 344_422,
    damage: 344_421,
  },
};

// NW Spear applies a bleed for 16 seconds
// each usage is hopefully thus at least 16s apart of each other
// may have to adjust later for multi-spearing...
const spearReducer = createChunkByThresholdReducer(16 * 1000);

export const getNecroticWakeSpearUsage = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW.SPEAR,
  });

  return (
    allEvents
      .reduce<DamageEvent[][]>(spearReducer, [])
      // creates one event per spear usage
      .flatMap((chunk) => reduceEventsByPlayer(chunk, "sourceID"))
  );
};

// NW Orb pulses every 1s for 8s
// each usage is hopefully thus at least 8s apart of each other
// may have to adjust later for multi-orbing...
const orbReducer = createChunkByThresholdReducer(8 * 1000);

export const getNecroticWakeOrbUsage = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageDone,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW.ORB,
  });

  return (
    allEvents
      .reduce<DamageEvent[][]>(orbReducer, [])
      // creates one event per orb usage
      .flatMap((chunk) => reduceEventsByPlayer(chunk, "sourceID"))
  );
};

export const getNecroticWakeHammerUsage = createEventFetcher<DamageEvent>({
  dataType: EventDataType.DamageDone,
  hostilityType: HostilityType.Friendlies,
  abilityID: NW.HAMMER,
});

export const getNecroticWakeKyrianOrbHealEvents = async (
  params: GetEventBaseParams
): Promise<HealEvent[]> => {
  const allEvents = await getEvents<HealEvent>({
    ...params,
    dataType: EventDataType.Healing,
    hostilityType: HostilityType.Friendlies,
    abilityID: NW.KYRIAN_ORB.heal,
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
    abilityID: NW.KYRIAN_ORB.damage,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};
