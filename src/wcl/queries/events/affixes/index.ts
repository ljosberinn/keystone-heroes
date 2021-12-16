import { Affixes } from "@prisma/client";

import type { EventParams } from "..";
import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  ApplyDebuffEvent,
  ApplyDebuffStackEvent,
  BeginCastEvent,
  CastEvent,
  DamageEvent,
  HealEvent,
  InterruptEvent,
  RemoveBuffEvent,
  RemoveDebuffEvent,
} from "../types";
import {
  filterExpression as bolsteringFilterExpression,
  getBolsteringEvents,
} from "./bolstering";
import {
  filterExpression as burstingFilterExpression,
  getBurstingEvents,
} from "./bursting";
import {
  filterExpression as explosiveFilterExpression,
  getExplosiveEvents,
} from "./explosive";
import {
  filterExpression as grievousFilterExpression,
  getGrievousEvents,
} from "./grievous";
import {
  filterExpression as necroticFilterExpression,
  getNecroticEvents,
} from "./necrotic";
import {
  filterExpression as quakingFilterExpression,
  getQuakingEvents,
} from "./quaking";
import {
  filterExpression as sanguineFilterExpression,
  getSanguineEvents,
} from "./sanguine";
import {
  filterExpression as spitefulFilterExpression,
  getSpitefulEvents,
} from "./spiteful";
import {
  filterExpression as stormingFilterExpression,
  getStormingEvents,
} from "./storming";
import {
  filterExpression as tormentedFilterExpression,
  getTormentedEvents,
} from "./tormented";
import {
  filterExpression as volcanicFilterExpression,
  getVolcanicEvents,
} from "./volcanic";

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
  | "Infernal"
>;

const affixExpressionMap: Record<AffixWithEvents, string[]> = {
  [Affixes.Sanguine]: sanguineFilterExpression,
  [Affixes.Explosive]: explosiveFilterExpression,
  [Affixes.Grievous]: grievousFilterExpression,
  [Affixes.Necrotic]: necroticFilterExpression,
  [Affixes.Volcanic]: volcanicFilterExpression,
  [Affixes.Bursting]: burstingFilterExpression,
  [Affixes.Spiteful]: spitefulFilterExpression,
  [Affixes.Quaking]: quakingFilterExpression,
  [Affixes.Storming]: stormingFilterExpression,
  [Affixes.Bolstering]: bolsteringFilterExpression,
  [Affixes.Tormented]: tormentedFilterExpression,
  [Affixes.Encrypted]: [],
};

export const getAffixExpression = (affixes: Affixes[]): string[] => {
  return affixes
    .filter((affix): affix is AffixWithEvents => affix in affixExpressionMap)
    .flatMap((affix) => affixExpressionMap[affix]);
};

export const filterAffixEvents = (
  allEvents: AllTrackedEventTypes[],
  affixes: EventParams["affixes"]
): {
  explosiveTargetID: number | null;
  events: (
    | ApplyBuffEvent
    | ApplyBuffStackEvent
    | DamageEvent
    | HealEvent
    | InterruptEvent
    | ApplyDebuffStackEvent
    | BeginCastEvent
    | CastEvent
    | ApplyDebuffEvent
    | RemoveBuffEvent
    | RemoveDebuffEvent
  )[];
} => {
  const affixSet = new Set(affixes);

  const { explosiveTargetID, events: explosiveEvents } = getExplosiveEvents(
    allEvents,
    affixSet
  );

  return {
    explosiveTargetID,
    events: [
      // seasonal
      ...getTormentedEvents(allEvents, affixSet),
      // common affixes
      ...getStormingEvents(allEvents, affixSet),
      ...getSpitefulEvents(allEvents, affixSet),
      ...getSanguineEvents(allEvents, affixSet),
      ...getVolcanicEvents(allEvents, affixSet),
      ...getQuakingEvents(allEvents, affixSet),
      ...getBolsteringEvents(allEvents, affixSet),
      ...getBurstingEvents(allEvents, affixSet),
      ...explosiveEvents,
      ...getGrievousEvents(allEvents, affixSet),
      ...getNecroticEvents(allEvents, affixSet),
    ],
  };
};
