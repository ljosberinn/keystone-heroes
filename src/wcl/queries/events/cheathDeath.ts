import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyDebuffEvent,
} from "./types";

export const CHEAT_DEATHS = {
  PODTENDER: {
    name: "Podtender",
    type: ["applybuff", "removebuff"],
    id: 320_224,
    cd: 360,
    icon: "inv_farm_herbseed",
  },
  CHEATING_DEATH: {
    name: "Cheating Death",
    id: 45_182,
    cd: 600,
    icon: "ability_rogue_cheatdeath",
    type: ["applybuff", "removebuff"],
  },
  CHEAT_DEATH: {
    name: "Cheated Death",
    id: 45_181,
    cd: 600,
    icon: "ability_rogue_cheatdeath",
    type: ["applydebuff", "removedebuff"],
  },
  DEPLETED_SHELL: {
    name: "DepletedShell",
    type: ["applydebuff", "removedebuff"],
    cd: 600,
    id: 320_227,
    icon: "inv_farm_herbseed",
  },
  // cauterize
  UNCONTAINED_FEL: {
    name: "Uncontained Fel",
    type: ["applydebuff", "removedebuff"],
    cd: 480,
    id: 209_261,
    icon: "inv_glaive_1h_artifactaldorchi_d_06",
  },
};

export const cheatDeathFilterExpression = `type in ("applydebuff", "applybuff", "removebuff", "removedebuff") and ability.id in (${Object.values(
  CHEAT_DEATHS
)
  .map((ability) => ability.id)
  .join(", ")})`;

const isCheatDeathEvent = (() => {
  const abilities = Object.values(CHEAT_DEATHS);

  return (
    event: AllTrackedEventTypes
  ): event is ApplyDebuffEvent | ApplyBuffEvent => {
    return abilities.some(
      (ability) =>
        ability.type.includes(event.type) && ability.id === event.abilityGameID
    );
  };
})();

export const filterCheatDeathEvents = (
  allEvents: AllTrackedEventTypes[]
): (ApplyDebuffEvent | ApplyBuffEvent)[] => {
  return allEvents.filter(isCheatDeathEvent);
};
