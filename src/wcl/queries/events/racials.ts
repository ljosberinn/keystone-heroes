/* eslint-disable sonarjs/no-duplicate-string */
import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  RemoveBuffEvent,
  CastEvent,
  DamageEvent,
  HealEvent,
} from "./types";

type Racial = {
  type: "cast" | "applybuff" | "removebuff" | "damage" | "heal";
  id: number;
  name: string;
  cd: number;
  icon: string;
};

export const RACIALS: Record<string, Racial[]> = {
  BLOOD_ELF: [
    {
      type: "cast",
      id: 28_730,
      name: "Arcane Torrent",
      cd: 120,
      icon: "spell_shadow_teleport",
    },
  ],
  HUMAN: [
    {
      type: "cast",
      id: 59_752,
      name: "Will to Survive",
      cd: 180,
      icon: "spell_shadow_charm",
    },
  ],
  ORC: [
    {
      type: "cast",
      id: 33_697,
      name: "Blood Fury",
      cd: 120,
      icon: "racial_orc_berserkerstrength",
    },
    {
      type: "applybuff",
      id: 33_697,
      name: "Blood Fury",
      cd: 0,
      icon: "racial_orc_berserkerstrength",
    },
    {
      type: "removebuff",
      id: 33_697,
      name: "Blood Fury",
      cd: 0,
      icon: "racial_orc_berserkerstrength",
    },
  ],
  NIGHT_ELF: [
    {
      type: "cast",
      id: 58_984,
      name: "Shadowmeld",
      icon: "ability_ambush",
      cd: 120,
    },
    {
      type: "applybuff",
      id: 58_984,
      name: "Shadowmeld",
      icon: "ability_ambush",
      cd: 0,
    },
    {
      type: "removebuff",
      id: 58_984,
      name: "Shadowmeld",
      icon: "ability_ambush",
      cd: 0,
    },
  ],
  VULPERA: [
    {
      type: "cast",
      id: 312_411,
      name: "Bag of Tricks",
      cd: 90,
      icon: "ability_racial_bagoftricks",
    },
    {
      type: "damage",
      id: 313_108,
      name: "Corrosive Vial",
      cd: 0,
      icon: "spell_nature_acid_01",
    },
    {
      type: "heal",
      id: 317_821,
      name: "Healing Vial",
      cd: 0,
      icon: "inv_alchemy_potion_02",
    },
    {
      type: "damage",
      id: 315_084,
      name: "Flames of Fury",
      cd: 0,
      icon: "ability_vehicle_demolisherflamecatapult",
    },
    {
      type: "damage",
      id: 315_085,
      name: "Sinister Shadows",
      cd: 0,
      icon: "spell_shadow_shadowbolt",
    },
    {
      type: "heal",
      id: 315_879,
      name: "Holy Relic",
      cd: 0,
      icon: "inv_hammer_31",
    },
  ],
  KUL_TIRAN: [
    {
      type: "cast",
      id: 287_712,
      name: "Haymaker",
      cd: 150,
      icon: "ability_racial_haymaker",
    },
    {
      type: "damage",
      id: 287_712,
      name: "Haymaker",
      cd: 0,
      icon: "ability_racial_haymaker",
    },
  ],
  NIGHTBORNE: [
    {
      type: "cast",
      id: 260_364,
      name: "Arcane Pulse",
      cd: 180,
      icon: "ability_racial_forceshield",
    },
    {
      type: "damage",
      id: 260_364,
      cd: 0,
      name: "Arcane Pulse",
      icon: "ability_racial_forceshield",
    },
  ],
  TROLL: [
    {
      type: "cast",
      id: 26_297,
      name: "Berserking",
      cd: 180,
      icon: "racial_troll_berserk",
    },
    {
      type: "applybuff",
      id: 26_297,
      name: "Berserking",
      cd: 0,
      icon: "racial_troll_berserk",
    },
    {
      type: "removebuff",
      id: 26_297,
      name: "Berserking",
      cd: 0,
      icon: "racial_troll_berserk",
    },
  ],
  VOID_ELF: [
    {
      type: "cast",
      id: 256_948,
      cd: 180,
      name: "Spatial Rift",
      icon: "ability_racial_spatialrift",
    },
  ],
  MECHAGNOME: [
    {
      type: "cast",
      cd: 180,
      name: "Hyper Organic Light Originator",
      id: 312_924,
      icon: "ability_racial_hyperorganiclightoriginator",
    },
  ],
  ZANDALARI_TROLL: [
    {
      type: "cast",
      cd: 15 * 60,
      name: "Pterrodax Swoop",
      id: 281_954,
      icon: "ability_racial_pterrordaxswoop",
    },
    {
      type: "applybuff",
      cd: 0,
      name: "Pterrodax Swoop",
      id: 281_954,
      icon: "ability_racial_pterrordaxswoop",
    },
    {
      type: "removebuff",
      cd: 0,
      name: "Pterrodax Swoop",
      id: 281_954,
      icon: "ability_racial_pterrordaxswoop",
    },
    {
      type: "cast",
      cd: 150,
      name: "Regeneratin'",
      id: 291_944,
      icon: "ability_racial_regeneratin",
    },
    {
      type: "applybuff",
      cd: 0,
      name: "Regeneratin'",
      id: 291_944,
      icon: "ability_racial_regeneratin",
    },
    {
      type: "removebuff",
      cd: 0,
      name: "Regeneratin'",
      id: 291_944,
      icon: "ability_racial_regeneratin",
    },
  ],
  WORGEN: [
    {
      type: "cast",
      cd: 120,
      name: "Darkflight",
      id: 68_992,
      icon: "ability_racial_darkflight",
    },
    {
      type: "applybuff",
      cd: 0,
      name: "Darkflight",
      id: 68_992,
      icon: "ability_racial_darkflight",
    },
    {
      type: "removebuff",
      cd: 0,
      name: "Darkflight",
      id: 68_992,
      icon: "ability_racial_darkflight",
    },
  ],
  DWARF: [
    {
      type: "cast",
      cd: 120,
      name: "Stoneform",
      id: 20_594,
      icon: "spell_shadow_unholystrength",
    },
    {
      type: "applybuff",
      cd: 0,
      name: "Stoneform",
      id: 20_594,
      icon: "spell_shadow_unholystrength",
    },
    {
      type: "removebuff",
      cd: 0,
      name: "Stoneform",
      id: 20_594,
      icon: "spell_shadow_unholystrength",
    },
  ],
  GOBLIN: [
    {
      type: "cast",
      cd: 90,
      name: "Rocket Jump",
      id: 69_070,
      icon: "ability_racial_rocketjump",
    },
    {
      type: "damage",
      cd: 90,
      name: "Rocket Barrage",
      id: 69_041,
      icon: "inv_gizmo_rocketlauncher",
    },
  ],
  UNDEAD: [
    {
      type: "cast",
      cd: 120,
      name: "Will of the Forsaken",
      id: 7744,
      icon: "spell_shadow_raisedead",
    },
    {
      type: "cast",
      cd: 120,
      name: "Cannibalize",
      id: 20_577,
      icon: "ability_racial_cannibalize",
    },
    {
      type: "applybuff",
      cd: 0,
      name: "Cannibalize",
      id: 20_577,
      icon: "ability_racial_cannibalize",
    },
    {
      type: "removebuff",
      cd: 0,
      name: "Cannibalize",
      id: 20_577,
      icon: "ability_racial_cannibalize",
    },
  ],
  DARK_IRON_DWARF: [
    {
      type: "cast",
      cd: 120,
      name: "Fireblood",
      id: 265_221,
      icon: "ability_racial_fireblood",
    },
    {
      type: "applybuff",
      cd: 0,
      name: "Fireblood",
      id: 265_221,
      icon: "ability_racial_fireblood",
    },
    {
      type: "removebuff",
      cd: 0,
      name: "Fireblood",
      id: 265_221,
      icon: "ability_racial_fireblood",
    },
  ],
  HIGHMOUNTAIN_TAUREN: [
    {
      type: "cast",
      cd: 120,
      name: "Bull Rush",
      id: 255_654,
      icon: "ability_racial_bullrush",
    },
  ],
  TAUREN: [
    {
      type: "cast",
      cd: 90,
      name: "War Stomp",
      id: 20_549,
      icon: "ability_warstomp",
    },
  ],
  DRAENEI: [
    {
      type: "cast",
      id: 121_093,
      cd: 180,
      name: "Gift of the Naaru",
      icon: "spell_holy_holyprotection",
    }, // Monk
    {
      type: "cast",
      id: 59_545,
      cd: 180,
      name: "Gift of the Naaru",
      icon: "spell_holy_holyprotection",
    }, // DK
    {
      type: "cast",
      id: 59_543,
      cd: 180,
      name: "Gift of the Naaru",
      icon: "spell_holy_holyprotection",
    }, // Hunter
    {
      type: "cast",
      id: 59_548,
      cd: 180,
      name: "Gift of the Naaru",
      icon: "spell_holy_holyprotection",
    }, // Mage
    {
      type: "cast",
      id: 59_542,
      cd: 180,
      name: "Gift of the Naaru",
      icon: "spell_holy_holyprotection",
    }, // Paladin
    {
      type: "cast",
      id: 59_544,
      cd: 180,
      name: "Gift of the Naaru",
      icon: "spell_holy_holyprotection",
    }, // Priest
    {
      type: "cast",
      id: 59_547,
      cd: 180,
      name: "Gift of the Naaru",
      icon: "spell_holy_holyprotection",
    }, // Shaman
    {
      type: "cast",
      id: 28_880,
      cd: 180,
      name: "Gift of the Naaru",
      icon: "spell_holy_holyprotection",
    }, // Warrior
  ],
  GNOME: [
    {
      type: "cast",
      cd: 60,
      name: "Escape Artist",
      id: 20_589,
      icon: "ability_rogue_trip",
    },
  ],
  MAGHAR_ORC: [
    {
      type: "cast",
      cd: 120,
      name: "Ancestral Call",
      id: 274_738,
      icon: "ability_racial_ancestralcall",
    },
    {
      type: "applybuff",
      id: 274_741,
      name: "Ferocity of the Frostwolf",
      cd: 0,
      icon: "ability_racial_ancestralcall",
    },
    {
      type: "removebuff",
      id: 274_741,
      name: "Ferocity of the Frostwolf",
      cd: 0,
      icon: "ability_racial_ancestralcall",
    },
    {
      type: "applybuff",
      id: 274_742,
      cd: 0,
      name: "Might of the Blackrock",
      icon: "ability_racial_ancestralcall",
    },
    {
      type: "removebuff",
      id: 274_742,
      cd: 0,
      name: "Might of the Blackrock",
      icon: "ability_racial_ancestralcall",
    },

    {
      type: "applybuff",
      id: 274_740,
      cd: 0,
      name: "Zeal of the Burning Blade",
      icon: "ability_racial_ancestralcall",
    },
    {
      type: "removebuff",
      id: 274_740,
      cd: 0,
      name: "Zeal of the Burning Blade",
      icon: "ability_racial_ancestralcall",
    },

    {
      type: "applybuff",
      id: 274_739,
      cd: 0,
      name: "Rictus of the Laughing Skull",
      icon: "ability_racial_ancestralcall",
    },
    {
      type: "removebuff",
      id: 274_739,
      cd: 0,
      name: "Rictus of the Laughing Skull",
      icon: "ability_racial_ancestralcall",
    },
  ],
  LIGHTFORGED_DRAENEI: [
    {
      type: "cast",
      id: 255_647,
      name: "Light's Judgement",
      cd: 150,
      icon: "ability_racial_orbitalstrike",
    },
    {
      type: "damage",
      id: 255_647,
      name: "Light's Judgement",
      cd: 0,
      icon: "ability_racial_orbitalstrike",
    },
  ],
  PANDAREN: [
    {
      type: "cast",
      cd: 120,
      name: "Quaking Palm",
      id: 107_079,
      icon: "pandarenracial_quiveringpain",
    },
  ],
};

const values = Object.values(RACIALS).flat();

const types = [...new Set(values.map((value) => `"${value.type}"`))].join(", ");
const abilityIDs = [...new Set(values.map((value) => value.id))].join(", ");
export const racialsFilterExpression = `type in (${types}) and ability.id in (${abilityIDs})`;

export const racialAbilityIDCooldownMap = Object.fromEntries(
  values
    .filter((racial) => racial.cd > 0 && racial.type === "cast")
    .map((racial) => [racial.id, racial.cd])
);

const isRacial = (() => {
  return (
    event: AllTrackedEventTypes
  ): event is
    | CastEvent
    | ApplyBuffEvent
    | RemoveBuffEvent
    | DamageEvent
    | HealEvent => {
    return values.some(
      (racial) =>
        racial.type === event.type && event.abilityGameID === racial.id
    );
  };
})();

export const filterRacials = (
  allEvents: AllTrackedEventTypes[]
): (
  | CastEvent
  | ApplyBuffEvent
  | RemoveBuffEvent
  | DamageEvent
  | HealEvent
)[] => {
  return allEvents.filter(isRacial);
};
