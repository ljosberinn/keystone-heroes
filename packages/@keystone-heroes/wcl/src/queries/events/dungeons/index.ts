import { DungeonIDs } from "@keystone-heroes/db/data";
import type { PlayableClass } from "@keystone-heroes/db/types";

import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  ApplyDebuffEvent,
  BeginCastEvent,
  CastEvent,
  DamageEvent,
  DeathEvent,
  HealEvent,
  RemoveBuffEvent,
} from "../../events/types";
import { filterExpression as dosFilterExpression, getDOSEvents } from "./dos";
import { filterExpression as hoaFilterExpression, getHOAEvents } from "./hoa";
import { filterExpression as nwFilterExpression, getNWEvents } from "./nw";
import { filterExpression as pfFilterExpression, getPFEvents } from "./pf";
import { filterExpression as sdFilterExpression, getSDEvents } from "./sd";
import { filterExpression as soaFilterExpression, getSOAEvents } from "./soa";
import { filterExpression as topFilterExpression, getTOPEvents } from "./top";

type DungeonWithEvents = Exclude<DungeonIDs, DungeonIDs.MISTS_OF_TIRNA_SCITHE>;

const isDungeonWithEvent = (id: DungeonIDs): id is DungeonWithEvents =>
  id in dungeonExpressionMap;

const dungeonExpressionMap: Record<DungeonWithEvents, string[]> = {
  [DungeonIDs.DE_OTHER_SIDE]: dosFilterExpression,
  [DungeonIDs.HALLS_OF_ATONEMENT]: hoaFilterExpression,
  [DungeonIDs.PLAGUEFALL]: pfFilterExpression,
  [DungeonIDs.SANGUINE_DEPTHS]: sdFilterExpression,
  [DungeonIDs.SPIRES_OF_ASCENSION]: soaFilterExpression,
  [DungeonIDs.THEATRE_OF_PAIN]: topFilterExpression,
  [DungeonIDs.THE_NECROTIC_WAKE]: nwFilterExpression,
};

export const getDungeonExpression = (id: DungeonIDs): string[] =>
  isDungeonWithEvent(id) ? dungeonExpressionMap[id] : [];

export const filterDungeonEvents = (
  allEvents: AllTrackedEventTypes,
  dungeonID: DungeonIDs,
  playerMetaInformation: { actorID: number; class: PlayableClass }[]
):
  | ApplyDebuffEvent[]
  | CastEvent[]
  | (DeathEvent | DamageEvent | ApplyBuffEvent)[]
  | (BeginCastEvent | ApplyBuffEvent | RemoveBuffEvent | ApplyBuffStackEvent)[]
  | (DamageEvent | HealEvent)[] => {
  switch (dungeonID) {
    case DungeonIDs.DE_OTHER_SIDE:
      return getDOSEvents(allEvents);
    case DungeonIDs.HALLS_OF_ATONEMENT:
      return getHOAEvents(allEvents);
    case DungeonIDs.PLAGUEFALL:
      return getPFEvents(allEvents, playerMetaInformation);
    case DungeonIDs.SANGUINE_DEPTHS:
      return getSDEvents(allEvents);
    case DungeonIDs.SPIRES_OF_ASCENSION:
      return getSOAEvents(allEvents);
    case DungeonIDs.THEATRE_OF_PAIN:
      return getTOPEvents(allEvents);
    case DungeonIDs.THE_NECROTIC_WAKE:
      return getNWEvents(allEvents);
    default:
      return [];
  }
};
