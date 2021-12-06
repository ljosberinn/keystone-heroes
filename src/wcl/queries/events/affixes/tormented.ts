import { Affixes } from "@prisma/client";

import type {
  AllTrackedEventTypes,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  ApplyDebuffEvent,
  ApplyDebuffStackEvent,
  RemoveBuffEvent,
  RemoveDebuffEvent,
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

type TormentedSpell = {
  id: number;
  name: string;
  icon: string;
  sourceTormentorID: number[];
};

type TormentedDeBuff = {
  id: number;
  name: string;
  icon: string;
  type: (
    | "applydebuff"
    | "applybuff"
    | "applybuffstack"
    | "removebuff"
    | "removedebuff"
  )[];
};

const theStoneWard: TormentedSpell = {
  id: 357_524,
  name: "The Stone Ward",
  icon: "ability_mage_shattershield",
  sourceTormentorID: [TormentedLieutenant.SOGGODON_THE_BREAKER],
};

const theStoneWardBuff: TormentedDeBuff = {
  id: 357_525,
  name: theStoneWard.name,
  icon: theStoneWard.icon,
  type: ["applybuff", "removebuff"],
};

const drippingFang: TormentedSpell = {
  id: 356_828,
  name: "Dripping Fang",
  icon: "inv_misc_monsterfang_01",
  sourceTormentorID: [TormentedLieutenant.SOGGODON_THE_BREAKER],
};

const tinyDancingShoes: TormentedSpell = {
  id: 356_827,
  name: "Tiny Dancing Shoes",
  icon: "inv_boots_pvppriest_e_01",
  sourceTormentorID: [TormentedLieutenant.SOGGODON_THE_BREAKER],
};

const brokenMirror: TormentedSpell = {
  id: 357_778,
  name: "Broken Mirror",
  icon: "trade_archaeology_highbornesoulmirror",
  sourceTormentorID: [TormentedLieutenant.SOGGODON_THE_BREAKER],
};

const selfEmbalmingKit: TormentedSpell = {
  id: 357_556,
  name: "Self-Embalming Kit",
  icon: "inv_mummypet",
  sourceTormentorID: [TormentedLieutenant.SOGGODON_THE_BREAKER],
};

const ragingBattleAxe: TormentedSpell = {
  id: 357_864,
  name: "Raging Battle-Axe",
  icon: "ability_hunter_swiftstrike",
  sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
};

const signetOfBolstering: TormentedSpell = {
  id: 357_848,
  name: "Signet of Bolstering",
  icon: "ability_socererking_arcanefortification",
  sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
};

const bolstering: TormentedDeBuff = {
  id: 357_852,
  name: "Bolstering",
  icon: "ability_socererking_arcanefortification",
  type: ["applybuff", "applybuffstack"],
};

const crumblingBulwark: TormentedSpell = {
  id: 357_897,
  name: "Crumbling Bulwark",
  icon: "trade_archaeology_stoneshield",
  sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
};

const crumblingBulwarkBuff: TormentedDeBuff = {
  id: 357_898,
  name: crumblingBulwark.name,
  icon: crumblingBulwark.icon,
  type: ["applybuff", "removebuff"],
};

const theFifthSkull: TormentedSpell = {
  id: 357_839,
  name: "The Fifth Skull",
  icon: "inv_misc_bone_skull_02",
  sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
};

const bottleOfSanguineIchor: TormentedSpell = {
  id: 357_900,
  name: "Bottle of Sanguine Ichor",
  icon: "inv_potion_27",
  sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
};

const pedestalOfUtterHubris: TormentedSpell = {
  id: 357_889,
  name: "Pedestal of Utter Hubris",
  icon: "ability_paladin_beaconoflight",
  sourceTormentorID: [TormentedLieutenant.INCINERATOR_ARKOLATH],
};

const vialOfDespration: TormentedSpell = {
  id: 357_825,
  name: "Vial of Desperation",
  icon: "trade_archaeology_crackedcrystalvial",
  sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
};

const vialOfDesprationBuff: TormentedDeBuff = {
  id: 357_826,
  name: vialOfDespration.name,
  icon: vialOfDespration.icon,
  type: ["applybuff"],
};

const handbookOfUncivilEtiquette: TormentedSpell = {
  id: 357_834,
  name: "Handbook of Uncivil Etiquette",
  icon: "inv_misc_profession_book_cooking",
  sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
};

const rudeInterruption: TormentedDeBuff = {
  id: 357_835,
  name: "Rude Interruption",
  icon: "spell_misc_emotionhappy",
  type: ["applydebuff", "removedebuff"],
};

const huntsmansHorn: TormentedSpell = {
  id: 357_817,
  name: "Huntman's Horn",
  icon: "inv_misc_horn_01",
  sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
};

const huntmansHornBuff: TormentedDeBuff = {
  id: 357_818,
  name: huntsmansHorn.name,
  icon: huntsmansHorn.icon,
  type: ["applybuff"],
};

const pendantOfTheMartyr: TormentedSpell = {
  id: 357_820,
  name: "Pendant of the Martyr",
  icon: "inv_jewelry_necklace_75",
  sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
};

const portableFeedingTrough: TormentedSpell = {
  id: 357_842,
  name: "Portable Feeding Trough",
  icon: "inv_crate_07",
  sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
};

const regenerativeFungus: TormentedSpell = {
  id: 357_814,
  name: "Regenerative Fungus",
  icon: "inv_misc_starspecklemushroom",
  sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
};

const satchelOfTheHunt: TormentedSpell = {
  id: 357_815,
  name: "Satchel of the Hunt",
  icon: "inv_misc_coinbag11",
  sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
};

const gavelOfJudgement: TormentedSpell = {
  id: 357_829,
  name: "Gavel of Judgement",
  icon: "inv_hammer_17",
  sourceTormentorID: [TormentedLieutenant.OROS_COLDHEART],
};

const gavelOfJudgementDebuff: TormentedDeBuff = {
  id: 357_830,
  name: gavelOfJudgement.name,
  icon: gavelOfJudgement.icon,
  type: ["applydebuff"],
};

const daggerOfNecroticWounding: TormentedSpell = {
  id: 357_609,
  name: "Dagger of Necrotic Wounding",
  icon: "inv_glaive_1h_maldraxxusquest_b_01",
  sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
};

const volcanicPlumage: TormentedSpell = {
  id: 357_706,
  name: "Volcanic Plumage",
  icon: "artifactability_firemage_phoenixbolt",
  sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
};

// volcanic is trackable via id 357708 but noisy

const stygianKingsBarbs: TormentedSpell = {
  id: 357_863,
  name: "The Stygian King's Barbs",
  icon: "inv_misc_herb_goldthorn_bramble",
  sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
};

const siegebreakersStand: TormentedSpell = {
  id: 357_604,
  name: "Siegebreaker's Stand",
  icon: "ability_warrior_unrelentingassault",
  sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
};

const siegebreakersStandBuff: TormentedDeBuff = {
  id: 357_607,
  name: siegebreakersStand.name,
  icon: siegebreakersStand.icon,
  type: ["applybuff"],
};

const overflowingChalice: TormentedSpell = {
  id: 357_747,
  name: "Overflowing Chalice",
  icon: "inv_drink_22",
  sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
};

const stabilizingDiamondAlembic: TormentedSpell = {
  id: 357_847,
  name: "Stabilizing Diamond Alembic",
  icon: "inv_trinket_80_alchemy01",
  sourceTormentorID: [TormentedLieutenant.EXECUTIONER_VARRUTH],
};

const championsBrand: TormentedSpell = {
  id: 357_575,
  name: "Champion's Brand",
  icon: "spell_warrior_sharpenblade",
  sourceTormentorID: [
    TormentedLieutenant.INCINERATOR_ARKOLATH,
    TormentedLieutenant.EXECUTIONER_VARRUTH,
  ],
};

// tracking these is very noisy
// const championsMastery: TormentedDeBuff = {
//   id: 357_582,
//   name: "Champion's Mastery",
//   icon: "spell_holy_weaponmastery",
//   type: ["applybuff"],
// };

// const championsBrutality: TormentedDeBuff = {
//   id: 357_584,
//   name: "Champion's Brutality",
//   icon: "ability_warrior_deepcuts",
//   type: ["applybuff"],
// };

export const tormentedSpells = [
  theStoneWard,
  drippingFang,
  tinyDancingShoes,
  brokenMirror,
  selfEmbalmingKit,
  ragingBattleAxe,
  signetOfBolstering,
  crumblingBulwark,
  theFifthSkull,
  bottleOfSanguineIchor,
  pedestalOfUtterHubris,
  vialOfDespration,
  handbookOfUncivilEtiquette,
  huntsmansHorn,
  pendantOfTheMartyr,
  portableFeedingTrough,
  regenerativeFungus,
  satchelOfTheHunt,
  gavelOfJudgement,
  daggerOfNecroticWounding,
  volcanicPlumage,
  stygianKingsBarbs,
  siegebreakersStand,
  overflowingChalice,
  stabilizingDiamondAlembic,
  championsBrand,
];

export const tormentedBuffsAndDebuffs = [
  theStoneWardBuff,
  bolstering,
  crumblingBulwarkBuff,
  vialOfDesprationBuff,
  rudeInterruption,
  huntmansHornBuff,
  gavelOfJudgementDebuff,
  siegebreakersStandBuff,
  // championsBrutality,
  // championsMastery,
];

export const TORMENTED = tormentedSpells.map((spell) => spell.id);
export const TORMENTED_DE_BUFFS = tormentedBuffsAndDebuffs.map(
  (deBuff) => deBuff.id
);

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
  `type in (${[
    ...new Set(
      tormentedBuffsAndDebuffs.flatMap((deBuff) =>
        deBuff.type.map((type) => `"${type}"`)
      )
    ),
  ].join(", ")}) and ability.id in (${TORMENTED_DE_BUFFS.join(", ")})`,
];
export const tormentedAbilityGameIDSet = new Set(TORMENTED);
export const tormentedDeBuffIDSet = new Set(TORMENTED_DE_BUFFS);

export const getTormentedEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): (
  | ApplyBuffEvent
  | ApplyBuffStackEvent
  | ApplyDebuffEvent
  | ApplyDebuffStackEvent
  | RemoveBuffEvent
  | RemoveDebuffEvent
)[] => {
  if (!affixSet.has(Affixes.Tormented)) {
    return [];
  }

  return allEvents.reduce<
    (
      | ApplyBuffEvent
      | ApplyBuffStackEvent
      | ApplyDebuffEvent
      | ApplyDebuffStackEvent
      | RemoveBuffEvent
      | RemoveDebuffEvent
    )[]
  >((acc, event) => {
    if (
      event.type !== "applybuff" &&
      event.type !== "applybuffstack" &&
      event.type !== "applydebuff" &&
      event.type !== "applydebuffstack" &&
      event.type !== "removebuff" &&
      event.type !== "removedebuff"
    ) {
      return acc;
    }

    if (tormentedAbilityGameIDSet.has(event.abilityGameID)) {
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
    }

    if (tormentedDeBuffIDSet.has(event.abilityGameID)) {
      return [...acc, event];
    }

    return acc;
  }, []);
};
