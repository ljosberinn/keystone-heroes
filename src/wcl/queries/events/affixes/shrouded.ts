import { Affixes } from "@prisma/client";

import type {
  AllTrackedEventTypes,
  ApplyBuffStackEvent,
  ApplyDebuffEvent,
  CastEvent,
  DamageEvent,
} from "../types";
import { createIsSpecificEvent } from "../utils";

export const shroudedNathrezimInfiltratorID = 189_878;
export const shroudedZulgamuxID = 190_128;

export const defaultBrokerRestorationID = 374_295;
export const zulgamuxBrokerRestorationID = 374_300;

export const shroudedAbilities = [
  {
    name: "Shadow Claws",
    id: 373_509,
    icon: "ability_creature_disease_05",
  },
  {
    name: "Shadow Eruption",
    id: 373_513,
    icon: "spell_shadow_painandsuffering",
  },
  {
    name: "Vampiric Claws",
    id: 373_364,
    icon: "ability_druid_disembowel",
  },
  {
    name: "Carrion Swarm",
    id: 373_429,
    icon: "spell_shadow_carrionswarm",
  },
  {
    name: "Blood Siphon", // cast
    id: 373_729,
    icon: "ability_ironmaidens_bloodritual",
  },
  {
    name: "Blood Siphon", // damage source
    id: 373_744,
    icon: "ability_ironmaidens_bloodritual",
  },
  {
    name: "Restoration",
    id: 374_300,
    icon: "spell_broker_buff",
  },
  {
    name: "Restoration",
    id: 374_295,
    icon: "spell_broker_buff",
  },
];

const isShroudedEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: shroudedAbilities.map((ability) => ability.id),
});

const isZulGamuxBrokerRestorationEvent = createIsSpecificEvent<CastEvent>({
  type: "cast",
  abilityGameID: zulgamuxBrokerRestorationID,
});

const isInfiltratorBrokerRestorationEvent = createIsSpecificEvent<CastEvent>({
  type: "cast",
  abilityGameID: defaultBrokerRestorationID,
});

export const shroudedBuffs = [
  {
    id: 373_108,
    name: "Bounty: Critical Strike",
    icon: "ability_criticalstrike",
  },
  {
    id: 373_113,
    name: "Bounty: Haste",
    icon: "ability_mage_netherwindpresence",
  },
  {
    id: 373_121,
    name: "Bounty: Versatility",
    icon: "spell_arcane_arcanetactics",
  },
  {
    id: 373_116,
    name: "Bounty: Mastery",
    icon: "ability_rogue_sinistercalling",
  },
];

const isShroudedApplyBuffStackEvent =
  createIsSpecificEvent<ApplyBuffStackEvent>({
    type: "applybuffstack",
    abilityGameID: shroudedBuffs.map((buff) => buff.id),
  });

const isShroudedApplyDebuffEvent = createIsSpecificEvent<ApplyDebuffEvent>({
  type: "applydebuff",
  abilityGameID: shroudedAbilities.map((buff) => buff.id),
});

export const filterExpression = [
  `type = "cast" and ability.id in (${defaultBrokerRestorationID}, ${zulgamuxBrokerRestorationID})`,
  `type = "damage" and ability.id in (${shroudedAbilities
    .map((ability) => ability.id)
    .join(", ")})`,

  `type = "applybuffstack" and ability.id in (${shroudedBuffs
    .map((buff) => buff.id)
    .join(", ")})`,

  `type = "applydebuff" and ability.id in (${shroudedAbilities
    .map((ability) => ability.id)
    .join(", ")})`,
];

export const getShroudedEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): (DamageEvent | CastEvent | ApplyBuffStackEvent | ApplyDebuffEvent)[] => {
  if (!affixSet.has(Affixes.Shrouded)) {
    return [];
  }

  return [
    ...allEvents.filter(isShroudedEvent),
    ...allEvents.filter(isZulGamuxBrokerRestorationEvent),
    ...allEvents.filter(isInfiltratorBrokerRestorationEvent),
    ...allEvents.filter(isShroudedApplyBuffStackEvent),
    ...allEvents.filter(isShroudedApplyDebuffEvent),
  ];
};
