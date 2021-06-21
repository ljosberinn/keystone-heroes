import { Affixes } from "@keystone-heroes/db/types";

import type { EventParams } from "..";
import type {
  AbsorbEvent,
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyDebuffStackEvent,
  DamageEvent,
  HealEvent,
  InterruptEvent,
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
};

export const getAffixExpression = (affixes: Affixes[]): string[] => {
  return affixes
    .filter((affix): affix is AffixWithEvents => affix in affixExpressionMap)
    .flatMap((affix) => affixExpressionMap[affix]);
};

export const filterAffixEvents = (
  allEvents: AllTrackedEventTypes[],
  affixes: EventParams["affixes"]
): (
  | AbsorbEvent
  | InterruptEvent
  | HealEvent
  | DamageEvent
  | ApplyBuffEvent
  | ApplyDebuffStackEvent
)[] => {
  const affixSet = new Set(affixes);

  // seasonal
  const tormentedEvents = getTormentedEvents(allEvents, affixSet);

  // common affixes
  const storming = getStormingEvents(allEvents, affixSet);
  const spiteful = getSpitefulEvents(allEvents, affixSet);
  const sanguine = getSanguineEvents(allEvents, affixSet);
  const volcanic = getVolcanicEvents(allEvents, affixSet);
  const quaking = getQuakingEvents(allEvents, affixSet);
  const bolstering = getBolsteringEvents(allEvents, affixSet);
  const bursting = getBurstingEvents(allEvents, affixSet);
  const explosive = getExplosiveEvents(allEvents, affixSet);
  const grievous = getGrievousEvents(allEvents, affixSet);
  const necrotic = getNecroticEvents(allEvents, affixSet);

  return [
    ...tormentedEvents,
    ...storming,
    ...spiteful,
    ...sanguine,
    ...volcanic,
    ...quaking,
    ...bolstering,
    ...bursting,
    ...explosive,
    ...grievous,
    ...necrotic,
  ];
};
