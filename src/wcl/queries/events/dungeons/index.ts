import { DungeonIDs } from "../../../../db/data/dungeons";
import type { AllTrackedEventTypes } from "../../events/types";
import { filterExpression as dosFilterExpression, getDOSEvents } from "./dos";
import { filterExpression as hoaFilterExpression, getHOAEvents } from "./hoa";
import {
  filterExpression as motsFilterExpression,
  getMOTSEvents,
} from "./mots";
import { filterExpression as nwFilterExpression, getNWEvents } from "./nw";
import { filterExpression as pfFilterExpression, getPFEvents } from "./pf";
import { filterExpression as sdFilterExpression, getSDEvents } from "./sd";
import { filterExpression as soaFilterExpression, getSOAEvents } from "./soa";
import { filterExpression as topFilterExpression, getTOPEvents } from "./top";

const dungeonExpressionMap: Record<DungeonIDs, string[]> = {
  [DungeonIDs.DE_OTHER_SIDE]: dosFilterExpression,
  [DungeonIDs.HALLS_OF_ATONEMENT]: hoaFilterExpression,
  [DungeonIDs.PLAGUEFALL]: pfFilterExpression,
  [DungeonIDs.SANGUINE_DEPTHS]: sdFilterExpression,
  [DungeonIDs.SPIRES_OF_ASCENSION]: soaFilterExpression,
  [DungeonIDs.THEATER_OF_PAIN]: topFilterExpression,
  [DungeonIDs.THE_NECROTIC_WAKE]: nwFilterExpression,
  [DungeonIDs.MISTS_OF_TIRNA_SCITHE]: motsFilterExpression,
};

export const getDungeonExpression = (id: DungeonIDs): string[] =>
  dungeonExpressionMap[id];

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
    default:
      return [];
  }
};
