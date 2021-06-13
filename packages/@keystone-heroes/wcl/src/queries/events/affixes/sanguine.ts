import { EventDataType, HostilityType } from "../../../types";
import type { HealEvent, DamageEvent } from "../types";
import type { GetEventBaseParams } from "../utils";
import { getEvents, reduceEventsByPlayer } from "../utils";

export const SANGUINE_ICHOR_HEALING = 226_510;
export const SANGUINE_ICHOR_DAMAGE = 226_512;

export const getSanguineHealingDoneEvents = async (
  params: GetEventBaseParams
): Promise<[HealEvent]> => {
  const allEvents = await getEvents<HealEvent>({
    ...params,
    dataType: EventDataType.Healing,
    hostilityType: HostilityType.Enemies,
    abilityID: SANGUINE_ICHOR_HEALING,
  });

  return [
    allEvents.reduce<HealEvent>((acc, event) => {
      return {
        ...acc,
        amount: acc.amount + event.amount,
        overheal: (acc.overheal ?? 0) + (event.overheal ?? 0),
      };
    }, allEvents[0]),
  ];
};

export const getSanguineDamageTakenEvents = async (
  params: GetEventBaseParams
): Promise<DamageEvent[]> => {
  const allEvents = await getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    abilityID: SANGUINE_ICHOR_DAMAGE,
  });

  return reduceEventsByPlayer(allEvents, "targetID");
};
