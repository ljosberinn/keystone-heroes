import { Affixes } from "@prisma/client";

import type { DungeonIDs } from "../../../db/data/dungeons";
import type {
  AllTrackedEventTypes,
  BeginCastEvent,
  DamageEvent,
  DeathEvent,
} from "../events/types";
import { filterAffixEvents, getAffixExpression } from "./affixes";
import { findExplosiveTargetID } from "./affixes/explosive";
import {
  cheatDeathFilterExpression,
  filterCheatDeathEvents,
} from "./cheathDeath";
import {
  generalCovenantExpression,
  filterCovenantCastEvents,
} from "./covenant";
import {
  deathFilterExpression,
  filterEnemyDeathEvents,
  filterPlayerDeathEvents,
} from "./death";
import { getDungeonExpression, filterDungeonEvents } from "./dungeons";
import {
  filterPlayerInterruptEvents,
  interruptFilterExpression,
} from "./interrupts";
import {
  engineeringBattleRezExpression,
  invisibilityFilterExpression,
  filterProfessionEvents,
} from "./professions";
import {
  filterRemarkableSpellEvents,
  remarkableSpellFilterExpression,
} from "./spells";
import { filterTrinkets, trinketsFilterExpression } from "./trinkets";
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
    engineeringBattleRezExpression,
    invisibilityFilterExpression,
    interruptFilterExpression,
    generalCovenantExpression,
    cheatDeathFilterExpression,
    trinketsFilterExpression,
    ...getDungeonExpression(dungeonID),
    ...getAffixExpression(affixes),
  ]
    .flat()
    .map((part) => `(${part})`)
    .join(" or ");
};

export const getEvents = async (
  params: EventParams,
  playerMetaInformation: { actorID: number; class: number }[]
): Promise<{
  allEvents: AllTrackedEventTypes[];
  playerDeathEvents: DeathEvent[];
  enemyDeathEvents: (DeathEvent | BeginCastEvent | DamageEvent)[];
  explosiveTargetID: number | null;
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

  const actorIDSet = new Set(
    playerMetaInformation.map((dataset) => dataset.actorID)
  );

  const dungeonEvents = filterDungeonEvents(
    allEvents,
    params.dungeonID,
    actorIDSet
  );
  const { explosiveTargetID, events: affixEvents } = filterAffixEvents(
    allEvents,
    params.affixes
  );
  const professionEvents = filterProfessionEvents(allEvents);
  const remarkableSpellEvents = filterRemarkableSpellEvents(allEvents);
  const playerDeathEvents = filterPlayerDeathEvents(
    allEvents,
    actorIDSet
    // remarkableSpellEvents
  );
  const interruptEvents = filterPlayerInterruptEvents(allEvents);
  const enemyDeathEvents = filterEnemyDeathEvents(
    allEvents,
    actorIDSet,
    params.affixes.includes(Affixes.Explosive)
      ? findExplosiveTargetID(allEvents)
      : null
  );
  const sharedCovenantAbilitiesEvents = filterCovenantCastEvents(allEvents);
  const cheatDeathEvents = filterCheatDeathEvents(allEvents);
  const trinketEvents = filterTrinkets(allEvents);

  return {
    allEvents: [
      ...professionEvents,
      ...dungeonEvents,
      ...affixEvents,
      ...remarkableSpellEvents,
      ...playerDeathEvents,
      ...interruptEvents,
      ...sharedCovenantAbilitiesEvents,
      ...cheatDeathEvents,
      ...trinketEvents,
    ].sort((a, b) => a.timestamp - b.timestamp),
    playerDeathEvents,
    enemyDeathEvents,
    explosiveTargetID,
  };
};
