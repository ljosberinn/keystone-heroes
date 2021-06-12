import {
  SD_LANTERN_BUFF,
  SANGUINE_ICHOR_HEALING,
  SANGUINE_ICHOR_DAMAGE,
} from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import type {
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  RemoveBuffEvent,
  HealEvent,
  DamageEvent,
} from "../types";
import type { GetEventBaseParams } from "../utils";
import { createEventFetcher, getEvents, reduceEventsByPlayer } from "../utils";

export const getSanguineDepthsBuffEvents = createEventFetcher<
  ApplyBuffEvent | ApplyBuffStackEvent | RemoveBuffEvent
>({
  dataType: EventDataType.Buffs,
  hostilityType: HostilityType.Friendlies,
  abilityID: SD_LANTERN_BUFF,
});

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
