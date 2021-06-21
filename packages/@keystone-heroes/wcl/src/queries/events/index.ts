import type { DungeonIDs } from "@keystone-heroes/db/data/dungeons";
import type { PlayableClass, Affixes } from "@keystone-heroes/db/types";

import {
  deathFilterExpression,
  filterPlayerDeathEvents,
  filterProfessionEvents,
  filterRemarkableSpellEvents,
  remarkableSpellFilterExpression,
} from "../events/other";
import type { AllTrackedEventTypes, DeathEvent } from "../events/types";
import { filterAffixEvents, getAffixExpression } from "./affixes";
import { getDungeonExpression, filterDungeonEvents } from "./dungeons";
import { recursiveGetEvents } from "./utils";

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
  allEvents: AllTrackedEventTypes[];
  playerDeathEvents: DeathEvent[];
}> => {
  const filterExpression = generateFilterExpression({
    dungeonID: params.dungeonID,
    affixes: params.affixes,
  });

  const allEvents = await recursiveGetEvents<AllTrackedEventTypes>({
    startTime: params.startTime,
    endTime: params.endTime,
    reportID: params.reportID,
    filterExpression,
  });

  const dungeonEvents = filterDungeonEvents(
    allEvents,
    params.dungeonID,
    playerMetaInformation
  );
  const affixEvents = filterAffixEvents(allEvents, params.affixes);
  const professionEvents = filterProfessionEvents(allEvents);
  const remarkableSpellEvents = filterRemarkableSpellEvents(allEvents);
  const playerDeathEvents = filterPlayerDeathEvents(
    allEvents,
    playerMetaInformation,
    remarkableSpellEvents
  );

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
