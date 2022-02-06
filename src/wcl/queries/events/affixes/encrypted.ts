import { Affixes } from "@prisma/client";

import type {
  AllTrackedEventTypes,
  ApplyDebuffEvent,
  DamageEvent,
} from "../types";
import { createIsSpecificEvent } from "../utils";

export const encryptedDebuffIDs = {
  // Vy
  cdr: 368_239,
  // Urh
  ms: 368_241,
  // Wo
  haste: 368_240,
};

export const encryptedDebuffs = [
  {
    name: "Decrypted Vy Cypher",
    id: encryptedDebuffIDs.cdr,
    icon: "inv_progenitor_anima_blue",
    type: "cdr",
  },
  {
    name: "Decrypted Urh Cypher",
    id: encryptedDebuffIDs.ms,
    icon: "inv_progenitor_anima_purple",
    type: "ms & stealth",
  },
  {
    name: "Decrypted Wo Cypher",
    id: encryptedDebuffIDs.haste,
    icon: "inv_progenitor_anima_green",
    type: "haste",
  },
];

export const encryptedMinibosses = [
  {
    name: "Urh Dismantler",
    id: 184_911,
  },
  {
    name: "Wo Drifter",
    id: 184_910,
  },
  {
    name: "Vy Interceptor",
    id: 184_908,
  },
];

export const encryptedDamageAbilityIDs = {
  // urh relic
  energyBarrage: 368_077,
  // vy
  shoot: 366_406,
  fusionBeam: 366_409,
  // Wo
  burst: 366_566,
  // Urh
  deconstruct: 366_297,
};

export const encryptedAbilities = [
  {
    name: "Energy Barrage",
    id: encryptedDamageAbilityIDs.energyBarrage,
    icon: "spell_progenitor_missile",
  },
  {
    name: "Shoot",
    id: encryptedDamageAbilityIDs.shoot,
    icon: "spell_progenitor_missile",
  },
  {
    name: "Fusion Beam",
    id: encryptedDamageAbilityIDs.fusionBeam,
    icon: "spell_progenitor_beam",
  },
  {
    name: "Burst",
    id: encryptedDamageAbilityIDs.burst,
    icon: "spell_progenitor_areadenial",
  },
  {
    name: "Deconstruct",
    id: encryptedDamageAbilityIDs.deconstruct,
    icon: "ability_warrior_shieldbreak",
  },
];

export const encryptedRelics = [
  {
    name: "Wo Relic",
    id: 185_683,
  },
  {
    name: "Vy Relic",
    id: 185_680,
  },
  {
    name: "Urh Relic",
    id: 185_685,
  },
];

export const filterExpression = [
  `type = "applydebuff" and ability.id in (${Object.values(
    encryptedDebuffIDs
  ).join(", ")})`,
  `type = "damage" and ability.id in (${Object.values(
    encryptedDamageAbilityIDs
  ).join(", ")})`,
];

const isEncryptedDebuffEvent = createIsSpecificEvent<ApplyDebuffEvent>({
  type: "applydebuff",
  abilityGameID: Object.values(encryptedDebuffIDs),
});

const isEncryptedDamageTakenEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: Object.values(encryptedDamageAbilityIDs),
});

export const getEncryptedEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): (DamageEvent | ApplyDebuffEvent)[] => {
  if (!affixSet.has(Affixes.Encrypted)) {
    return [];
  }

  return allEvents.reduce<(DamageEvent | ApplyDebuffEvent)[]>((acc, event) => {
    if (isEncryptedDamageTakenEvent(event) || isEncryptedDebuffEvent(event)) {
      acc.push(event);
    }

    return acc;
  }, []);
};
