import { Affixes } from "@keystone-heroes/db/types";

import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
} from "../types";

export const tormentedLieutenants = [
  {
    id: 179_891,
    name: "Soggodon the Breaker",
    icon: "inv_icon_wingbroken04a",
  },
  {
    id: 179_446,
    name: "Incinerator Arkolath",
    icon: "ability_warlock_fireandbrimstone",
  },
  {
    id: 179_892,
    name: "Oros Coldheart",
    icon: "spell_shadow_soulleech_2",
  },
  {
    id: 179_890,
    name: "Executioner Varruth",
    icon: "spell_misc_emotionafraid",
  },
];

export const tormentedLieutenantIDSet = new Set(
  tormentedLieutenants.map((dataset) => dataset.id)
);

const SOGGODON_THE_BREAKER = {
  STONE_WARD: 357_524,
  DRIPPING_FANG: 356_828,
  SELF_EMBALMING_KIT: 357_556,
  TINY_DANCING_SHOES: 356_827,
  BROKEN_MIRROR: 357_778,
};

const INCINERATOR_ARKOLATH = {
  THE_FIFTH_SKULL: 357_839,
  CHAMPIONS_BRAND: 357_575,
  RAGING_BATTLE_AXE: 357_864,
  SIGNET_OF_BOLSTERING: 357_848,
  PEDESTAL_OF_UTTER_HUBRIS: 357_889,
  CRUMBLING_BULWARK: 357_897,
  BOTTLE_OF_SANGUINE_ICHOR: 357_900,
};

const OROS_COLDHEART = {
  REGENERATIVE_FUNGUS: 357_814,
  VIAL_OF_DESPERATION: 357_825,
  HANDBOOK_OF_UNCIVIL_ETIQUETTE: 357_834,
  SATCHEL_OF_THE_HUNT: 357_815,
  HUNTMANS_HORN: 357_817,
  PENDANT_OF_THE_MARTYR: 357_820,
  PORTABLE_FEEDING_TROUGH: 357_842,
  GAVEL_OF_JUDGEMENT: 357_829,
};

const EXECUTIONER_VARRUTH = {
  CHAMPIONS_BRAND: INCINERATOR_ARKOLATH.CHAMPIONS_BRAND,
  DAGGER_OF_NECROTIC_WOUNDING: 357_609,
  VOLCANIC_PLUMAGE: 357_706,
  STYGIAN_KINGS_BARBS: 357_863,
  SIEGEBREAKERS_STAND: 357_604,
  OVERFLOWING_CHALICE: 357_747,
  STABILIZING_DIAMONT_ALEMBIC: 357_847,
};

export const TORMENTED = {
  ...SOGGODON_THE_BREAKER,
  ...INCINERATOR_ARKOLATH,
  ...OROS_COLDHEART,
  ...EXECUTIONER_VARRUTH,
};

/**
 * @TODO remove once WCL provides this itself
 */
export const tormentedSpells = [
  {
    id: TORMENTED.STONE_WARD,
    name: "The Stone Ward",
    icon: "ability_mage_shattershield",
  },
  {
    id: TORMENTED.DRIPPING_FANG,
    name: "Dripping Fang",
    icon: "inv_misc_monsterfang_01",
  },
  {
    id: TORMENTED.TINY_DANCING_SHOES,
    name: "Tiny Dancing Shoes",
    icon: "inv_boots_pvppriest_e_01",
  },
  {
    id: TORMENTED.BROKEN_MIRROR,
    name: "Broken Mirror",
    icon: "trade_archaeology_highbornesoulmirror",
  },
  {
    id: TORMENTED.SELF_EMBALMING_KIT,
    name: "Self-Embalming Kit",
    icon: "inv_mummypet",
  },
  {
    id: TORMENTED.RAGING_BATTLE_AXE,
    name: "Raging Battle-Axe",
    icon: "ability_hunter_swiftstrike",
  },
  {
    id: TORMENTED.SIGNET_OF_BOLSTERING,
    name: "Signet of Bolstering",
    icon: "ability_socererking_arcanefortification",
  },
  {
    id: TORMENTED.CRUMBLING_BULWARK,
    name: "Crumbling Bulwark",
    icon: "trade_archaeology_stoneshield",
  },
  {
    id: TORMENTED.THE_FIFTH_SKULL,
    name: "The Fifth Skull",
    icon: "inv_misc_bone_skull_02",
  },
  {
    id: TORMENTED.BOTTLE_OF_SANGUINE_ICHOR,
    name: "Bottle of Sanguine Ichor",
    icon: "inv_potion_27",
  },
  {
    id: TORMENTED.PEDESTAL_OF_UTTER_HUBRIS,
    name: "Pedestal of Utter Hubris",
    icon: "ability_paladin_beaconoflight",
  },
  {
    id: TORMENTED.VIAL_OF_DESPERATION,
    name: "Vial of Desperation",
    icon: "trade_archaeology_crackedcrystalvial",
  },
  {
    id: TORMENTED.HANDBOOK_OF_UNCIVIL_ETIQUETTE,
    name: "Handbook of Uncivil Etiquette",
    icon: "inv_misc_profession_book_cooking",
  },
  {
    id: TORMENTED.HUNTMANS_HORN,
    name: "Huntman's Horn",
    icon: "inv_misc_horn_01",
  },
  {
    id: TORMENTED.PENDANT_OF_THE_MARTYR,
    name: "Pendant of the Martyr",
    icon: "inv_jewelry_necklace_75",
  },
  {
    id: TORMENTED.PORTABLE_FEEDING_TROUGH,
    name: "Portable Feeding Trough",
    icon: "inv_crate_07",
  },
  {
    id: TORMENTED.REGENERATIVE_FUNGUS,
    name: "Regenerative Fungus",
    icon: "inv_misc_starspecklemushroom",
  },
  {
    id: TORMENTED.SATCHEL_OF_THE_HUNT,
    name: "Satchel of the Hunt",
    icon: "inv_misc_coinbag11",
  },
  {
    id: TORMENTED.GAVEL_OF_JUDGEMENT,
    name: "Gavel of Judgement",
    icon: "inv_hammer_17",
  },
  {
    id: TORMENTED.DAGGER_OF_NECROTIC_WOUNDING,
    name: "Dagger of Necrotic Wounding",
    icon: "inv_glaive_1h_maldraxxusquest_b_01",
  },
  {
    id: TORMENTED.VOLCANIC_PLUMAGE,
    name: "Volcanig Plumage",
    icon: "artifactability_firemage_phoenixbolt",
  },
  {
    id: TORMENTED.STYGIAN_KINGS_BARBS,
    name: "The Stygian King's Barbs",
    icon: "inv_misc_herb_goldthorn_bramble",
  },
  {
    id: TORMENTED.SIEGEBREAKERS_STAND,
    name: "Siegebreaker's Stand",
    icon: "ability_warrior_unrelentingassault",
  },
  {
    id: TORMENTED.OVERFLOWING_CHALICE,
    name: "Overflowing Chalice",
    icon: "inv_drink_22",
  },
  {
    id: TORMENTED.STABILIZING_DIAMONT_ALEMBIC,
    name: "Stabilizing Diamond Alembic",
    icon: "inv_trinket_80_alchemy01",
  },
  {
    id: TORMENTED.CHAMPIONS_BRAND,
    name: "Champion's Brand",
    icon: "spell_warrior_sharpenblade",
  },
];

/**
 * @see https://www.warcraftlogs.com/reports/J3WKacdjpntmLT7C/#fight=3&type=damage-done&view=events&pins=2%24Off%24%23244F4B%24expression%24(type%20%3D%20%22damage%22%20and%20ability.id%20in%20(357865,%20357841,%20357708,%20357901,%20357525,%20356925,%20356923,%20355806,%20358784,%20358970,%20356667,%20356414,%20358894,%20355709,%20355737,%20358967))%20or%20(type%20%3D%20%22heal%22%20and%20ability.id%20%3D%20357901)
 * @example
 * ```gql
 * {
 *   reportData {
 *     report(code: "DrkYtWa2ZPXQ8BjT") {
 *       fights(fightIDs: [2]) {
 *         startTime
 *         endTime
 *       }
 *       events(startTime: 3895428, endTime: 6047081, filterExpression: "type in (\"applybuff\", \"applybuffstack\") and ability.id in (357524, 356828, 357556, 356827, 357778, 357839, 357575, 357864, 357848, 357889, 357897, 357900, 357814, 357825, 357834, 357815, 357817, 357820, 357842, 357829, 357609, 357706, 357863, 357604, 357747, 357847)") {
 *         data
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const filterExpression = [
  `type in ("applybuff", "applybuffstack") and ability.id in (${[
    Object.values(TORMENTED),
  ].join(", ")})`,
];

export const tormentedAbilityGameIDSet = new Set(Object.values(TORMENTED));

export const getTormentedEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): (ApplyBuffEvent | ApplyBuffStackEvent)[] => {
  if (!affixSet.has(Affixes.Tormented)) {
    return [];
  }

  return allEvents.reduce<(ApplyBuffEvent | ApplyBuffStackEvent)[]>(
    (acc, event) => {
      if (event.type !== "applybuff" && event.type !== "applybuffstack") {
        return acc;
      }

      if (!tormentedAbilityGameIDSet.has(event.abilityGameID)) {
        return acc;
      }

      // on death, powers get reapplied and we don't care about those
      if (
        acc.some(
          (prevEvent) =>
            event.targetID === prevEvent.targetID &&
            event.abilityGameID === prevEvent.abilityGameID &&
            event.type === prevEvent.type
        )
      ) {
        return acc;
      }

      return [...acc, event];
    },
    []
  );
};
