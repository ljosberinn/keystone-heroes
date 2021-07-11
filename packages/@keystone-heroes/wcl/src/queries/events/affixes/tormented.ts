import { Affixes } from "@keystone-heroes/db/types";

import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
} from "../types";

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
  VOLCANIC_PLUME: 357_706,
  STYGIAN_KINGS_BARBS: 357_863,
  SIEGEBREAKERS_STAND: 357_604,
  OVERFLOWING_CHALICE: 357_747,
  STABILIZING_DIAMONT_ALEMBIC: 357_847,
};

const TORMENTED = {
  ...SOGGODON_THE_BREAKER,
  ...INCINERATOR_ARKOLATH,
  ...OROS_COLDHEART,
  ...EXECUTIONER_VARRUTH,
};

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
  `type = "applybuff" and ability.id in (${[Object.values(TORMENTED)].join(
    ", "
  )})`,
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
