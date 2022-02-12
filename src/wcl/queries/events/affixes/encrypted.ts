import { Affixes } from "@prisma/client";

import type {
  AllTrackedEventTypes,
  ApplyDebuffEvent,
  DamageEvent,
} from "../types";
import { createIsSpecificEvent } from "../utils";

export const encryptedDebuffIDs = {
  // Urh
  cdrRegen: 368_239,
  // Wo
  msStealth: 368_241,
  // Vy
  hasteDmg: 368_240,
};

export const encryptedDebuffs = [
  {
    name: "Decrypted Urh Cypher",
    id: encryptedDebuffIDs.cdrRegen,
    icon: "inv_progenitor_anima_blue",
    type: "cdr & regen",
  },
  {
    name: "Decrypted Wo Cypher",
    id: encryptedDebuffIDs.msStealth,
    icon: "inv_progenitor_anima_purple",
    type: "ms & stealth",
  },
  {
    name: "Decrypted Vy Cypher",
    id: encryptedDebuffIDs.hasteDmg,
    icon: "inv_progenitor_anima_green",
    type: "haste & dmg",
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

export const encryptedAbilityIDs = {
  // urh relic
  energyBarrage: 368_077,
  // vy
  shoot: 366_406,
  fusionBeam: 366_409,
  vyCypher: 368_495, // on hit proc
  // Wo
  burst: 366_566,
  stealth: 368_162,
  // Urh
  deconstruct: 366_297,
};

export const encryptedAbilities = [
  {
    name: "Energy Barrage",
    id: encryptedAbilityIDs.energyBarrage,
    icon: "spell_progenitor_missile",
  },
  {
    name: "Shoot",
    id: encryptedAbilityIDs.shoot,
    icon: "spell_progenitor_missile",
  },
  {
    name: "Fusion Beam",
    id: encryptedAbilityIDs.fusionBeam,
    icon: "spell_progenitor_beam",
  },
  {
    name: "Burst",
    id: encryptedAbilityIDs.burst,
    icon: "spell_progenitor_areadenial",
  },
  {
    name: "Deconstruct",
    id: encryptedAbilityIDs.deconstruct,
    icon: "ability_warrior_shieldbreak",
  },
  {
    name: "Wo Cloaking Field",
    id: encryptedAbilityIDs.stealth,
    icon: "ability_vanish",
  },
  {
    name: "Decrypted Vy Cypher",
    id: encryptedAbilityIDs.vyCypher,
    icon: "spell_broker_buff",
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
  `type = "damage" and ability.id in (${Object.values(encryptedAbilityIDs).join(
    ", "
  )})`,
];

const isEncryptedDebuffEvent = createIsSpecificEvent<ApplyDebuffEvent>({
  type: "applydebuff",
  abilityGameID: Object.values(encryptedDebuffIDs),
});

const isEncryptedDamageOrDamgeTakenEvent = createIsSpecificEvent<DamageEvent>({
  type: "damage",
  abilityGameID: Object.values(encryptedAbilityIDs),
});

export const getEncryptedEvents = (
  allEvents: AllTrackedEventTypes[],
  affixSet: Set<Affixes>
): (DamageEvent | ApplyDebuffEvent)[] => {
  if (!affixSet.has(Affixes.Encrypted)) {
    return [];
  }

  return allEvents.reduce<(DamageEvent | ApplyDebuffEvent)[]>((acc, event) => {
    if (
      isEncryptedDamageOrDamgeTakenEvent(event) ||
      isEncryptedDebuffEvent(event)
    ) {
      acc.push(event);
    }

    return acc;
  }, []);
};
