import type { DungeonIDs } from "@keystone-heroes/db/data";
import type { PlayableClass, Affixes } from "@keystone-heroes/db/types";

import {
  deathFilterExpression,
  filterPlayerDeathEvents,
  filterProfessionEvents,
  filterRemarkableSpellEvents,
  remarkableSpellFilterExpression,
} from "../events/other";
import type {
  AbsorbEvent,
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyDebuffEvent,
  ApplyDebuffStackEvent,
  BeginCastEvent,
  CastEvent,
  DamageEvent,
  DeathEvent,
  HealEvent,
  InterruptEvent,
} from "../events/types";
import { filterAffixEvents, getAffixExpression } from "./affixes";
import { getDungeonExpression, filterDungeonEvents } from "./dungeons";
import { recursiveGetEvents } from "./utils";

export * from "./other";
export * from "./types";

export type EventParams = {
  reportID: string;
  startTime: number;
  endTime: number;
  dungeonID: DungeonIDs;
  fightID: number;
  affixes: Affixes[];
};

const generateFilterExpression = ({
  dungeonID,
  affixes,
}: Pick<EventParams, "dungeonID" | "affixes">) => {
  return [
    deathFilterExpression,
    remarkableSpellFilterExpression,
    ...getDungeonExpression(dungeonID),
    ...getAffixExpression(affixes),
  ]
    .flat()
    .map((part) => `(${part})`)
    .join(" or ");
};

export const getEvents = async (
  params: EventParams,
  playerMetaInformation: { actorID: number; class: PlayableClass }[]
): Promise<{
  allEvents: AllTrackedEventTypes;
  playerDeathEvents: DeathEvent[];
}> => {
  const filterExpression = generateFilterExpression({
    dungeonID: params.dungeonID,
    affixes: params.affixes,
  });

  console.log(filterExpression);

  console.time(`getEvents.recursiveGetEvents-${params.reportID}`);
  const allEvents = await recursiveGetEvents<
    | CastEvent
    | DeathEvent
    | AbsorbEvent
    | DamageEvent
    | InterruptEvent
    | HealEvent
    | BeginCastEvent
    | ApplyBuffEvent
    | ApplyDebuffEvent
    | ApplyDebuffStackEvent
  >({
    startTime: params.startTime,
    endTime: params.endTime,
    reportID: params.reportID,
    filterExpression,
  });
  console.timeEnd(`getEvents.recursiveGetEvents-${params.reportID}`);

  console.time(`filterDungeonEvents-${params.reportID}`);
  const dungeonEvents = filterDungeonEvents(
    allEvents,
    params.dungeonID,
    playerMetaInformation
  );
  console.timeEnd(`filterDungeonEvents-${params.reportID}`);
  console.time(`filterAffixEvents-${params.reportID}`);
  const affixEvents = filterAffixEvents(allEvents, params.affixes);
  console.timeEnd(`filterAffixEvents-${params.reportID}`);
  console.time(`filterProfessionEvents-${params.reportID}`);
  const professionEvents = filterProfessionEvents(allEvents);
  console.timeEnd(`filterProfessionEvents-${params.reportID}`);

  console.time(`remarkableSpellEvents-${params.reportID}`);
  const remarkableSpellEvents = filterRemarkableSpellEvents(allEvents);
  console.timeEnd(`remarkableSpellEvents-${params.reportID}`);

  console.time(`filterPlayerDeathEvents-${params.reportID}`);
  const playerDeathEvents = filterPlayerDeathEvents(
    allEvents,
    playerMetaInformation,
    remarkableSpellEvents
  );
  console.timeEnd(`filterPlayerDeathEvents-${params.reportID}`);

  return {
    allEvents: [
      ...professionEvents,
      ...dungeonEvents,
      ...affixEvents,
      ...remarkableSpellEvents,
      ...playerDeathEvents,
    ].sort((a, b) => a.timestamp - b.timestamp),
    playerDeathEvents,
  };
};
