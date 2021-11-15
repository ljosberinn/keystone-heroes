import { Affixes } from "@prisma/client";

import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
} from "../types";

enum TormentedLieutenant {
  SOGGODON_THE_BREAKER = 179_891,
  INCINERATOR_ARKOLATH = 179_446,
  OROS_COLDHEART = 179_892,
  EXECUTIONER_VARRUTH = 179_890,
}

export const tormentedLieutenants = [
  {
    id: TormentedLieutenant.SOGGODON_THE_BREAKER,
    name: "Soggodon the Breaker",
    icon: "inv_icon_wingbroken04a",
  },
  {
    id: TormentedLieutenant.INCINERATOR_ARKOLATH,
    name: "Incinerator Arkolath",
    icon: "ability_warlock_fireandbrimstone",
  },
  {
    id: TormentedLieutenant.OROS_COLDHEART,
    name: "Oros Coldheart",
    icon: "spell_shadow_soulleech_2",
  },
  {
    id: TormentedLieutenant.EXECUTIONER_VARRUTH,
    name: "Executioner Varruth",
    icon: "spell_misc_emotionafraid",
  },
];

export const tormentedLieutenantIDSet = new Set(
  Object.values(TormentedLieutenant).filter(
    (id): id is number => typeof id === "number"
  )
);

export const tormentedSpells = [
  {
    id: 357_524,
    name: "The Stone Ward",
    icon: "ability_mage_shattershield",
    sourceTormentorID: [TormentedLieutenant.SOGGODON_THE_BREAKER],
  },
  {
    id: 356_828,
    name: "Dripping Fang",
    icon: "inv_misc_monsterfang_01",
    sourceTormentorID: [TormentedLieutenant.SOGGODON_THE_BREAKER],
  },
  {
    id: 356_827,
    name: "Tiny Dancing Shoes",
    icon: "inv_boots_pvppriest_e_01",
    sourceTormentorID: [TormentedLieutenant.SOGGODON_THE_BREAKER],
  },
  {
    id: 357_778,
    name: "Broken Mirror",
    icon: "trade_archaeology_highbornesoulmirror",
    sourceTormentorID: [TormentedLieutenant.SOGGODON_THE_BREAKER],
  },
  {
    id: 357_556,
    name: "Self-Embalming Kit",
    icon: "inv_mummypet",
    sourceTormentorID: [TormentedLieutenant.SOGGODON_THE_BREAKER],
  },
  {
    id: 357_864,
    name: "Raging Battle-Axe",
    icon: "ability_hunter_swiftstrike",
    sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
  },
  {
    id: 357_848,
    name: "Signet of Bolstering",
    icon: "ability_socererking_arcanefortification",
    sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
  },
  {
    id: 357_897,
    name: "Crumbling Bulwark",
    icon: "trade_archaeology_stoneshield",
    sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
  },
  {
    id: 357_839,
    name: "The Fifth Skull",
    icon: "inv_misc_bone_skull_02",
    sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
  },
  {
    id: 357_900,
    name: "Bottle of Sanguine Ichor",
    icon: "inv_potion_27",
    sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
  },
  {
    id: 357_889,
    name: "Pedestal of Utter Hubris",
    icon: "ability_paladin_beaconoflight",
    sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
  },
  {
    id: 357_825,
    name: "Vial of Desperation",
    icon: "trade_archaeology_crackedcrystalvial",
    sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
  },
  {
    id: 357_834,
    name: "Handbook of Uncivil Etiquette",
    icon: "inv_misc_profession_book_cooking",
    sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
  },
  {
    id: 357_817,
    name: "Huntman's Horn",
    icon: "inv_misc_horn_01",
    sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
  },
  {
    id: 357_820,
    name: "Pendant of the Martyr",
    icon: "inv_jewelry_necklace_75",
    sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
  },
  {
    id: 357_842,
    name: "Portable Feeding Trough",
    icon: "inv_crate_07",
    sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
  },
  {
    id: 357_814,
    name: "Regenerative Fungus",
    icon: "inv_misc_starspecklemushroom",
    sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
  },
  {
    id: 357_815,
    name: "Satchel of the Hunt",
    icon: "inv_misc_coinbag11",
    sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
  },
  {
    id: 357_829,
    name: "Gavel of Judgement",
    icon: "inv_hammer_17",
    sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
  },
  {
    id: 357_609,
    name: "Dagger of Necrotic Wounding",
    icon: "inv_glaive_1h_maldraxxusquest_b_01",
    sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
  },
  {
    id: 357_706,
    name: "Volcanig Plumage",
    icon: "artifactability_firemage_phoenixbolt",
    sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
  },
  {
    id: 357_863,
    name: "The Stygian King's Barbs",
    icon: "inv_misc_herb_goldthorn_bramble",
    sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
  },
  {
    id: 357_604,
    name: "Siegebreaker's Stand",
    icon: "ability_warrior_unrelentingassault",
    sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
  },
  {
    id: 357_747,
    name: "Overflowing Chalice",
    icon: "inv_drink_22",
    sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
  },
  {
    id: 357_847,
    name: "Stabilizing Diamond Alembic",
    icon: "inv_trinket_80_alchemy01",
    sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
  },
  {
    id: 357_575,
    name: "Champion's Brand",
    icon: "spell_warrior_sharpenblade",
    sourceTormentorID: [
      TormentedLieutenant.INCINERATOR_ARKOLATH,
      TormentedLieutenant.EXECUTIONER_VARRUTH,
    ],
  },
];

export const TORMENTED = tormentedSpells.map((spell) => spell.id);

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
  `type in ("applybuff", "applybuffstack") and ability.id in (${TORMENTED.join(
    ", "
  )})`,
];
export const tormentedAbilityGameIDSet = new Set(TORMENTED);

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
