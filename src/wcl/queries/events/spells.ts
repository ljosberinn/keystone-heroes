import { remarkableSpellIDs } from "../../../db/data/spellIds";
import type { AllTrackedEventTypes, CastEvent } from "./types";

export const remarkableSpellFilterExpression = `source.type = "player" and type = "cast" and ability.id in (${[
  ...remarkableSpellIDs,
].join(", ")})`;

export const filterRemarkableSpellEvents = (
  allEvents: AllTrackedEventTypes[]
): CastEvent[] => {
  return allEvents.filter(
    (event): event is CastEvent =>
      event.type === "cast" && remarkableSpellIDs.has(event.abilityGameID)
  );
};
