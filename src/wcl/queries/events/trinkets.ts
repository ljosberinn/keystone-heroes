import type {
  AllTrackedEventTypes,
  CastEvent,
  ApplyBuffEvent,
  RemoveBuffEvent,
  ApplyDebuffEvent,
  RemoveDebuffEvent,
  ApplyBuffStackEvent,
} from "./types";

type Trinkets = Record<
  string,
  {
    ids: number[];
    cd: number;
    name: string;
    icon: string;
    type: (
      | "cast"
      | "applybuff"
      | "removebuff"
      | "applydebuff"
      | "removedebuff"
      | "applybuffstack"
      | "removebuffstack"
    )[];
  }
>;

export const TRINKETS: Trinkets = {
  ANNHYLDES_AEGIS: {
    ids: [358_712],
    cd: 90,
    name: "Annhylde's Aegis",
    icon: "inv_shield_1h_bastionquest_b_01",
    type: ["cast", "applybuff", "removebuff"],
  },
  BLOOD_SPLATTERED_SCALE_BUFF: {
    ids: [329_849],
    cd: 120,
    name: "Blood Barrier",
    icon: "inv_misc_scales_stonyorange",
    type: ["applybuff", "removebuff"],
  },
  BLOOD_SPLATTERED_SCALE_CAST: {
    ids: [329_840],
    cd: 120,
    name: "Blood Barrier",
    icon: "inv_misc_scales_stonyorange",
    type: ["cast"],
  },
  INSCRUTABLE_QUANTUM_DEVICE: {
    ids: [330_323],
    cd: 180,
    name: "Inscrutable Quantum Device",
    icon: "inv_trinket_80_titan02a",
    type: ["cast"],
  },
  INSTRUCTORS_DIVINE_BELL: {
    ids: [348_139],
    cd: 90,
    name: "Instructor's Divine Bell",
    icon: "inv_misc_bell_01",
    type: ["cast", "applybuff", "removebuff"],
  },
  SOULLETTING_RUBY: {
    ids: [345_801, 345_805],
    cd: 120,
    name: "Soulletting Ruby",
    icon: "inv_jewelcrafting_livingruby_01",
    type: ["cast", "applybuff", "removebuff"],
  },
  SALVAGED_FUSION_AMPLIFIER: {
    ids: [355_333],
    cd: 90,
    name: "Salvaged Fusion Amplifier",
    icon: "spell_progenitor_missile",
    type: ["cast", "applybuff", "removebuff"],
  },
  UNCHAINED_GLADIATORS_EMBLEM: {
    ids: [345_231],
    icon: "ability_warrior_endlessrage",
    name: "Unchained Gladiator's Emblem",
    type: ["cast", "applybuff", "removebuff"],
    cd: 120,
  },
  UNCHAINED_GLADIATORS_BADGE_OF_FEROCITY: {
    ids: [345_228],
    icon: "spell_holy_championsbond",
    name: "Unchained Gladiator's Badge of Ferocity",
    type: ["cast", "applybuff", "removebuff"],
    cd: 60,
  },
  SINFUL_GLADIATORS_BADGE_OF_FEROCITY: {
    ids: [345_228],
    icon: "spell_holy_championsbond",
    name: "Sinful Gladiator's Badge of Ferocity",
    type: ["cast", "applybuff", "removebuff"],
    cd: 60,
  },
  SINFUL_GLADIATORS_EMBLEM: {
    ids: [345_231],
    icon: "ability_warrior_endlessrage",
    name: "Sinful Gladiator's Emblem",
    type: ["cast", "applybuff", "removebuff"],
    cd: 120,
  },
  COSMIC_GLADIATORS_BADGE_OF_FEROCITY: {
    ids: [345_228],
    icon: "spell_holy_championsbond",
    name: "Cosmic Gladiator's Badge of Ferocity",
    type: ["cast", "applybuff", "removebuff"],
    cd: 60,
  },
  COSMIC_GLADIATORS_EMBLEM: {
    ids: [345_231],
    icon: "ability_warrior_endlessrage",
    name: "Cosmic Gladiator's Emblem",
    type: ["cast"],
    cd: 120,
  },
  SPLINTERED_HEART_OF_ALAR: {
    ids: [344_900, 344_907],
    icon: "inv_flaming_splinter",
    name: "Splintered Heart of Al'ar",
    type: ["applydebuff", "removedebuff"],
    cd: 8 * 60,
  },
  SOUL_IGNITER: {
    ids: [345_251, 345_211],
    icon: "inv_trinket_maldraxxus_02_yellow",
    name: "Soul Igniter",
    type: ["cast", "applybuff", "removebuff"],
    cd: 60,
  },
  TUFT_OF_SMOLDERING_PLUMAGE: {
    ids: [344_916],
    icon: "inv_icon_feather06a",
    name: "Tuft of Smoldering Plumage",
    type: ["cast", "applybuff", "removebuff"],
    cd: 120,
  },
  OVERWHELMING_POWER_CRYSTAL: {
    ids: [329_831],
    icon: "spell_mage_focusingcrystal",
    name: "Overwhelming Power Crystal",
    type: ["cast", "applybuff", "removebuff"],
    cd: 90,
  },
  SHADOWGRASP_TOTEM: {
    ids: [331_523],
    icon: "inv_alchemy_83_alchemiststone02",
    name: "Shadowgrasp Totem",
    type: ["cast"],
    cd: 120,
  },
  SHADOWED_ORB_OF_TORMENT: {
    ids: [355_321],
    icon: "spell_animamaw_orb",
    name: "Shadowed Orb of Torment",
    type: ["cast", "applybuff", "removebuff"],
    cd: 120,
  },
  RELIC_OF_THE_FROZEN_WASTES: {
    ids: [355_303],
    icon: "trade_archaeology_nerubianspiderscepter",
    name: "Relic of the Frozen Wastes",
    type: ["cast"],
    cd: 60,
  },
  TOME_OF_MONSTROUS_CONSTRUCTIONS: {
    ids: [353_692],
    icon: "inv_artifact_tome02",
    name: "Tome of Monstrous Constructions",
    type: ["cast"],
    cd: 60,
  },
  SOLEAHS_SECRET_TECHNIQUE: {
    ids: [351_926],
    icon: "inv_60pvp_trinket1d",
    name: "So'leah's Secret Technique",
    type: ["cast", "applybuff", "removebuff"],
    cd: 30,
  },
  EMPYREAL_ORDNANCE: {
    ids: [345_539, 345_541],
    icon: "spell_animabastion_orb",
    name: "Empyreal Ordnance",
    type: ["cast", "applybuff", "removebuff"],
    cd: 180,
  },
  SUNBLOOD_AMETHYST: {
    ids: [343_393],
    icon: "inv_jewelcrafting_nightseye_01",
    name: "Sunblood Amethyst",
    type: ["cast"],
    cd: 90,
  },
  MISTCALLER_OCARINA: {
    ids: [
      330_067,
      332_301, // Mastery
      332_299, // Crit
      330_067, // Vers
      332_300, // Haste
    ],
    icon: "inv_misc_primitive_toy03",
    name: "Mistcaller Ocarina",
    type: ["cast", "applybuff", "removebuff"],
    cd: 30,
  },
  OVERCHARGED_ANIMA_BATTERY: {
    ids: [345_530],
    icon: "inv_battery_01",
    name: "Overcharged Anima Battery",
    type: ["cast", "applybuff", "removebuff"],
    cd: 90,
  },
  WAKENERS_FROND: {
    ids: [336_588],
    icon: "inv_trinket_ardenweald_02_purple",
    name: "Wakener's Frond",
    type: ["cast", "applybuff", "removebuff"],
    cd: 120,
  },
  DREADFIRE_VESSEL: {
    ids: [349_857],
    icon: "inv_misc_trinket6oih_orb1",
    name: "Dreadfire Vessel",
    type: ["cast"],
    cd: 90,
  },
  DARKMOON_DECK_VORACITY: {
    ids: [331_624, 311_491],
    icon: "inv_inscription_darkmooncard_voracity",
    name: "Darkmoon Deck: Voracity",
    type: ["cast"],
    cd: 90,
  },
  EBONSOUL_VISE: {
    ids: [355_327, 357_785, 356_281],
    icon: "ability_warlock_improvedsoulleech",
    name: "Ebonsoul Vise",
    type: ["cast", "applybuff", "removebuff"],
    cd: 90,
  },
  IRON_MAIDENS_TOOLKIT: {
    ids: [351_867, 351_872],
    icon: "inv_titanium_shield_spike",
    name: "Iron Maiden's Toolkit",
    type: ["cast", "applybuff", "removebuff"],
    cd: 150,
  },
  SLIMY_CONSUMPTIVE_ORGAN: {
    ids: [345_595],
    icon: "inv_misc_organ_01",
    name: "Slimy Consumptive Organ",
    type: ["cast"],
    cd: 20,
  },
  SIPHONING_PHYLACTERY_SHARD: {
    ids: [345_549],
    icon: "inv_enchanting_70_chaosshard",
    name: "Siphoning Phylactery Shard",
    type: ["cast"],
    cd: 30,
  },
  GRIM_CODEX: {
    ids: [345_739],
    icon: "inv_misc_book_01",
    name: "Grim Codex",
    type: ["cast"],
    cd: 90,
  },
  LINGERING_SUNMOTE: {
    ids: [342_432],
    icon: "inv_elemental_mote_nether",
    name: "Lingering Sunmote",
    type: ["cast"],
    cd: 90,
  },
  BRIMMING_EMBER_SHARD: {
    ids: [336_866],
    icon: "ability_malkorok_blightofyshaarj_yellow",
    name: "Brimming Ember Shard",
    type: ["cast"],
    cd: 90,
  },
  MEMORY_OF_PAST_SINS: {
    ids: [344_662],
    icon: "sha_spell_fire_bluehellfire_nightmare",
    name: "Memory of Past Sins",
    type: ["cast"],
    cd: 120,
  },
  DARKMOON_DECK_PUTRESCENCE: {
    ids: [334_058],
    icon: "inv_inscription_darkmooncard_putrescence",
    name: "Darkmoon Deck: Putrescence",
    type: ["cast"],
    cd: 90,
  },
  DARKMOON_DECK_REPOSE: {
    ids: [333_734],
    icon: "inv_inscription_darkmooncard_repose",
    name: "Darkmoon Deck: Repose",
    type: ["cast"],
    cd: 90,
  },
  VIAL_OF_SPECTRAL_ESSENCE: {
    ids: [345_695],
    icon: "inv_trinket_maldraxxus_02_purple",
    name: "Vial of Spectral Essence",
    type: ["cast"],
    cd: 90,
  },
  DARKMOON_DECK_INDOMITABLE: {
    ids: [311_444],
    icon: "inv_inscription_darkmooncard_indomitable",
    name: "Darkmoon Deck: Indomitable",
    type: ["cast", "applybuff", "removebuff"],
    cd: 90,
  },
  MACABRE_SHEET_MUSIC: {
    ids: [345_432, 345_439],
    icon: "inv_scroll_16",
    name: "Macabre Sheet Music",
    type: [
      "cast",
      "applybuff",
      "removebuff",
      "applybuffstack",
      "removebuffstack",
    ],
    cd: 90,
  },
  OVERFLOWING_ANIMA_CAGE: {
    ids: [343_385, 343_386],
    icon: "inv_trinket_revendreth_02_red",
    name: "Overflowing Anima Cage",
    type: ["cast", "applybuff", "removebuff"],
    cd: 150,
  },
  SPARE_MEAT_HOOK: {
    ids: [345_548],
    icon: "inv_archaeology_70_tauren_moosebonefishhook",
    name: "Spare Meat Hook",
    type: ["cast"],
    cd: 120,
  },
  FLAME_OF_BATTLE: {
    ids: [336_841],
    icon: "inv_trinket_maldraxxus_01_blue",
    name: "Flame of Battle",
    type: ["cast", "applybuff", "removebuff"],
    cd: 90,
  },
  BLADEDANCERS_ARMOR_KIT: {
    ids: [342_423],
    icon: "ability_xavius_nightmareblades",
    name: "Bladedancer's Armor Kit",
    type: ["cast", "applybuff", "removebuff"],
    cd: 300,
  },
  SCRAWLED_WORD_OF_RECALL: {
    ids: [355_318],
    icon: "inv_inscription_80_scroll",
    name: "Scrawled Word of Recall",
    type: ["cast"],
    cd: 60,
  },
  SANGUINE_VINTAGE: {
    ids: [344_231],
    icon: "inv_trinket_revendreth_01_dark",
    name: "Sanguine Vintage",
    type: ["cast", "applybuff", "removebuff"],
    cd: 60,
  },
  OVERFLOWING_EMBER_MIRROR: {
    ids: [336_465],
    icon: "inv_lightforgedmechsuit",
    name: "Overflowing Ember Mirror",
    type: ["cast", "applybuff", "removebuff"],
    cd: 150,
  },
  SKULKERS_WING: {
    ids: [345_019],
    icon: "inv_icon_wingbroken08d",
    name: "Skulker's Wing",
    type: ["cast", "applybuff", "removebuff"],
    cd: 120,
  },
  GLIMMERDUSTS_GRAND_DESIGN: {
    ids: [339_517],
    icon: "inv_trinket_ardenweald_01_light",
    name: "Glimmerdust's Grand Design",
    type: ["cast", "applybuff", "removebuff"],
    cd: 120,
  },
  GLYPH_OF_ASSIMILATION: {
    ids: [345_319],
    icon: "70_inscription_vantus_rune_azure",
    name: "Glyph of Assimilation",
    type: ["cast", "applybuff", "removebuff"],
    cd: 90,
  },
  PULSATING_STONEHEART: {
    ids: [343_399],
    icon: "inv_misc_gem_bloodstone_01",
    name: "Pulsating Stoneheart",
    type: ["cast", "applybuff", "removebuff"],
    cd: 75,
  },
  BARGASTS_LEASH: {
    ids: [344_384],
    icon: "inv_leatherworking_70_petleash",
    name: "Bargast's Leash",
    type: ["cast", "applybuff", "removebuff"],
    cd: 120,
  },
  TABLET_OF_DESPAIR: {
    ids: [336_182],
    icon: "inv_misc_stonetablet_11",
    name: "Tablet of Despair",
    type: ["cast"],
    cd: 120,
  },
  LYRE_OF_SACRED_PURPOSE: {
    ids: [348_136],
    icon: "trade_archaeology_carved-harp-of-exotic-wood",
    name: "Lyre of Sacred Purpose",
    type: ["cast"],
    cd: 90,
  },
};

export const trinketAbilities = Object.values(TRINKETS);

export const trinketAbilityIDCooldownMap = Object.fromEntries(
  trinketAbilities.flatMap((ability) =>
    ability.ids.map((id) => [id, ability.cd])
  )
);

const types = trinketAbilities
  .reduce<string[]>((acc, dataset) => {
    const next = new Set([...acc, ...dataset.type]);

    return [...next];
  }, [])
  .map((str) => `"${str}"`)
  .join(", ");

const abilityIDs = [
  ...new Set(trinketAbilities.flatMap((trinket) => trinket.ids)),
].join(", ");

export const trinketsFilterExpression = `type in (${types}) and ability.id in (${abilityIDs})`;

export const isTrinketEvent = (
  event: AllTrackedEventTypes
): event is
  | CastEvent
  | ApplyBuffEvent
  | RemoveBuffEvent
  | ApplyDebuffEvent
  | RemoveDebuffEvent
  | ApplyBuffStackEvent => {
  if (
    event.type === "applydebuffstack" ||
    event.type === "damage" ||
    event.type === "death" ||
    event.type === "begincast" ||
    event.type === "heal" ||
    event.type === "interrupt"
  ) {
    return false;
  }

  return trinketAbilities.some((ability) => {
    return (
      ability.ids.includes(event.abilityGameID) &&
      ability.type.includes(event.type)
    );
  });
};

export const filterTrinkets = (
  allEvents: AllTrackedEventTypes[]
): (
  | CastEvent
  | ApplyBuffEvent
  | RemoveBuffEvent
  | ApplyDebuffEvent
  | RemoveDebuffEvent
  | ApplyBuffStackEvent
)[] => {
  return allEvents.filter(isTrinketEvent);
};
