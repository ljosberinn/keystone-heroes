import type {
  AllTrackedEventTypes,
  CastEvent,
  ApplyBuffEvent,
  RemoveBuffEvent,
} from "./types";

export const TRINKETS = {
  ANNHYLDES_AEGIS: {
    id: 358_712,
    cd: 90,
    name: "Annhylde's Aegis",
    icon: "inv_shield_1h_bastionquest_b_01",
    type: ["cast", "applybuff", "removebuff"],
  },
  BLOOD_SPLATTERED_SCALE_BUFF: {
    id: 329_849,
    cd: 120,
    name: "Blood Barrier",
    icon: "inv_misc_scales_stonyorange",
    type: ["applybuff", "removebuff"],
  },
  BLOOD_SPLATTERED_SCALE_CAST: {
    id: 329_840,
    cd: 120,
    name: "Blood Barrier",
    icon: "inv_misc_scales_stonyorange",
    type: ["cast"],
  },
};

const trinketAbilities = Object.values(TRINKETS);

export const trinketsFilterExpression = `type in ("cast", "applybuff", "removebuff") and ability.id in (${trinketAbilities
  .map((trinket) => trinket.id)
  .join(", ")})`;

export const isTrinketEvent = (
  event: AllTrackedEventTypes
): event is CastEvent | ApplyBuffEvent | RemoveBuffEvent => {
  return trinketAbilities.some(
    (ability) =>
      ability.type.includes(event.type) && ability.id === event.abilityGameID
  );
};

export const filterTrinkets = (
  allEvents: AllTrackedEventTypes[]
): (CastEvent | ApplyBuffEvent | RemoveBuffEvent)[] => {
  return allEvents.filter(isTrinketEvent);
};
