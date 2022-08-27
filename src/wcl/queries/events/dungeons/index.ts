import { DungeonIDs } from "../../../../db/data/dungeons";
import type { AllTrackedEventTypes } from "../../events/types";
import { filterExpression as dosFilterExpression, getDOSEvents } from "./dos";
import { filterExpression as hoaFilterExpression, getHOAEvents } from "./hoa";
import { filterExpression as idFilterExpression, getIDEvents } from "./id";
import {
  filterExpression as motsFilterExpression,
  getMOTSEvents,
} from "./mots";
import { filterExpression as nwFilterExpression, getNWEvents } from "./nw";
import { filterExpression as pfFilterExpression, getPFEvents } from "./pf";
import { filterExpression as sdFilterExpression, getSDEvents } from "./sd";
import { filterExpression as soaFilterExpression, getSOAEvents } from "./soa";
import { filterExpression as topFilterExpression, getTOPEvents } from "./top";
import { filterExpression as wsFilterExpression, getWSEvents } from "./ws";

const dungeonExpressionMap: Record<number, string[]> = {
  [DungeonIDs.DE_OTHER_SIDE]: dosFilterExpression,
  [DungeonIDs.HALLS_OF_ATONEMENT]: hoaFilterExpression,
  [DungeonIDs.PLAGUEFALL]: pfFilterExpression,
  [DungeonIDs.SANGUINE_DEPTHS]: sdFilterExpression,
  [DungeonIDs.SPIRES_OF_ASCENSION]: soaFilterExpression,
  [DungeonIDs.THEATER_OF_PAIN]: topFilterExpression,
  [DungeonIDs.THE_NECROTIC_WAKE]: nwFilterExpression,
  [DungeonIDs.MISTS_OF_TIRNA_SCITHE]: motsFilterExpression,
  [DungeonIDs.TAZAVESH]: [],
  [DungeonIDs.GRIMRAIL_DEPOT]: [],
  [Number.parseInt(`2${DungeonIDs.MECHAGON}`)]: wsFilterExpression,
  [DungeonIDs.KARAZHAN]: [],
  [DungeonIDs.IRON_DOCKS]: idFilterExpression,
};

export const getDungeonExpression = (id: DungeonIDs): string[] =>
  dungeonExpressionMap[id] ?? [];

export const filterDungeonEvents = (
  allEvents: AllTrackedEventTypes[],
  dungeonID: DungeonIDs,
  actorIDSet: Set<number>
): ReturnType<
  | typeof getDOSEvents
  | typeof getHOAEvents
  | typeof getPFEvents
  | typeof getSDEvents
  | typeof getSOAEvents
  | typeof getTOPEvents
  | typeof getNWEvents
  | typeof getMOTSEvents
  | typeof getIDEvents
> => {
  switch (dungeonID) {
    case DungeonIDs.DE_OTHER_SIDE:
      return getDOSEvents(allEvents);
    case DungeonIDs.HALLS_OF_ATONEMENT:
      return getHOAEvents(allEvents);
    case DungeonIDs.PLAGUEFALL:
      return getPFEvents(allEvents, actorIDSet);
    case DungeonIDs.SANGUINE_DEPTHS:
      return getSDEvents(allEvents);
    case DungeonIDs.SPIRES_OF_ASCENSION:
      return getSOAEvents(allEvents);
    case DungeonIDs.THEATER_OF_PAIN:
      return getTOPEvents(allEvents);
    case DungeonIDs.THE_NECROTIC_WAKE:
      return getNWEvents(allEvents);
    case DungeonIDs.MISTS_OF_TIRNA_SCITHE:
      return getMOTSEvents(allEvents);
    case DungeonIDs.IRON_DOCKS:
      return getIDEvents(allEvents);
    case Number.parseInt(`2${DungeonIDs.MECHAGON}`):
      return getWSEvents(allEvents);
    default:
      return [];
  }
};
