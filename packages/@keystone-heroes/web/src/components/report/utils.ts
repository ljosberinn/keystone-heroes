import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";

import {
  affixes,
  BURSTING,
  DOS_URN,
  ENVELOPMENT_OF_MISTS,
  EXPLOSIVE,
  GRIEVOUS,
  HOA_GARGOYLE,
  NECROTIC,
  NW,
  PF,
  QUAKING,
  SANGUINE_ICHOR_DAMAGE,
  SANGUINE_ICHOR_HEALING,
  SD_LANTERN_BUFF,
  SD_LANTERN_OPENING,
  SOA_SPEAR,
  spells,
  SPITEFUL,
  STORMING,
  TOP_BANNER_AURA,
  TORMENTED_ABILITIES,
  VOLCANIC,
} from "../../staticData";
import type { AbilityReadyRowProps } from "./rows/AbilityReadyRow";
import type { ApplyBuffRowProps } from "./rows/ApplyBuffRow";
import type { CastRowProps } from "./rows/CastRow";
import type { DamageDoneRowProps } from "./rows/DamageDoneRow";
import type { DamageTakenRowProps } from "./rows/DamageTakenRow";
import type { DeathRowProps } from "./rows/DeathRow";
import type { HealingDoneRowProps } from "./rows/HealingDoneRow";
import type { InterruptRowProps } from "./rows/InterruptRow";

const bloodlustTypes = new Set([
  2825, 32_182, 309_658,
  // Timewarp
  80_353,
  // Bloodlust
  2825,
]);
const invisibilityTypes = new Set([307_195, 321_422]);

export const findBloodlust = <
  T extends { events: FightSuccessResponse["pulls"][number]["events"] }
>(
  pull: T
): number | null => {
  const match = pull.events.find(
    (event) =>
      event.type !== "AbilityReady" &&
      event.ability &&
      bloodlustTypes.has(event.ability.id)
  );

  return match?.ability?.id ?? null;
};

export const detectInvisibilityUsage = (
  pull: FightSuccessResponse["pulls"][number]
): null | "invisibility" | "shroud" => {
  const invisEvent = pull.events.find(
    (event) =>
      event.type === "ApplyBuff" &&
      event.ability &&
      invisibilityTypes.has(event.ability.id) &&
      event.category === "AFTER"
  );

  if (invisEvent) {
    return "invisibility";
  }

  const shroudEvent = pull.events.find(
    (event) =>
      event.type === "Cast" &&
      event.ability?.id === 114_018 &&
      event.category === "AFTER"
  );

  return shroudEvent ? "shroud" : null;
};

export const calcChallengersBurden = (keyLevel: number): number => {
  return Math.round((1.08 ** (keyLevel - 2) - 1) * 100);
};

export const determineAbility = (id: number): typeof spells[number] | null => {
  if (spells[id]) {
    return spells[id];
  }

  if (id === SANGUINE_ICHOR_DAMAGE || id === SANGUINE_ICHOR_HEALING) {
    return {
      name: "Sanguine Ichor",
      icon: "spell_shadow_bloodboil",
      cd: 0,
    };
  }

  // Engineer rez
  if (id === 345_130) {
    return {
      name: "Disposable Spectrophasic Reanimator",
      icon: "inv_engineering_90_lightningbox",
      cd: 0,
    };
  }

  // Necrotic
  if (id === NECROTIC) {
    return {
      name: "Necrotic Wound",
      icon: "ability_rogue_venomouswounds",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Bursting
  if (id === BURSTING) {
    return {
      name: affixes["11"].name,
      icon: affixes["11"].icon,
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Explosive
  if (id === EXPLOSIVE) {
    return {
      name: affixes["13"].name,
      icon: affixes["13"].icon,
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Storming
  if (id === STORMING) {
    return {
      name: affixes["124"].name,
      icon: affixes["124"].icon,
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Volcanic
  if (id === VOLCANIC) {
    return {
      name: affixes["3"].name,
      icon: affixes["3"].icon,
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Quaking
  if (id === QUAKING) {
    return {
      name: affixes["14"].name,
      icon: affixes["14"].icon,
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === HOA_GARGOYLE) {
    return {
      name: "Loyal Stoneborn",
      icon: "ability_revendreth_mage",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === NW.ORB) {
    return {
      name: "Discharged Anima",
      icon: "spell_animabastion_orb",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === NW.KYRIAN_ORB_DAMAGE || id === NW.KYRIAN_ORB_HEAL) {
    return {
      name: "Anima Exhaust",
      icon: "spell_animabastion_orb",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === NW.SPEAR) {
    return {
      name: "Bloody Javelin",
      icon: "inv_polearm_2h_bastionquest_b_01",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  // Grievous
  if (id === GRIEVOUS) {
    return {
      name: "Grievous Wound",
      icon: "ability_backstab",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === SPITEFUL) {
    return {
      name: "Spiteful Shade",
      icon: "ability_meleedamage",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === TOP_BANNER_AURA) {
    return {
      name: "TOP_BANNER_AURA",
      icon: "",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === SD_LANTERN_BUFF) {
    return {
      name: "Sinfall Boon",
      icon: "spell_animarevendreth_buff",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === SD_LANTERN_OPENING) {
    return {
      name: "Opening",
      icon: "spell_animarevendreth_orb",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === ENVELOPMENT_OF_MISTS) {
    return {
      name: "Envelopment of Mists",
      icon: "",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === SOA_SPEAR) {
    return {
      name: "SOA_SPEAR",
      icon: "",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === DOS_URN) {
    return {
      name: "DOS_URN",
      icon: "",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === PF.PLAGUE_BOMB) {
    return {
      name: "Plague Bomb",
      icon: "",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === PF.GREEN_BUFF.aura) {
    return {
      name: "Corrosive Gunk",
      icon: "inv_misc_bone_skull_01",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === PF.RED_BUFF.aura) {
    return {
      name: "Rapid Infection",
      icon: "inv_offhand_1h_artifactskulloferedar_d_05",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  if (id === PF.PURPLE_BUFF.aura) {
    return {
      name: "Congealed Contagion",
      icon: "ability_titankeeper_amalgam",
      cd: Number.MAX_SAFE_INTEGER,
    };
  }

  const tormentedPower = TORMENTED_ABILITIES.find(
    (ability) => ability.id === id
  );

  return tormentedPower
    ? { ...tormentedPower, cd: Number.MAX_SAFE_INTEGER }
    : null;
};

export type DefaultEvent =
  FightSuccessResponse["pulls"][number]["events"][number];

export const isCastEventWithAbilityAndSourcePlayer = (
  event: DefaultEvent
): event is CastRowProps["event"] =>
  (event.type === "Cast" || event.type === "BeginCast") &&
  event.ability !== null &&
  event.sourcePlayerID !== null;

export const isAbilityReadyEventWithAbilityAndSourcePlayer = (
  event: DefaultEvent
): event is AbilityReadyRowProps["event"] =>
  event.type === "AbilityReady" &&
  event.ability !== null &&
  event.sourcePlayerID !== null;

export const isDamageTakenEventWithTargetPlayer = (
  event: DefaultEvent
): event is DamageTakenRowProps["event"] =>
  event.type === "DamageTaken" &&
  event.targetPlayerID !== null &&
  event.damage !== null;

export const isInterruptEventWithSourceAndTargetPlayerAndAbility = (
  event: DefaultEvent
): event is InterruptRowProps["event"] =>
  event.type === "Interrupt" &&
  event.sourcePlayerID !== null &&
  event.ability !== null &&
  event.targetPlayerID !== null;

export type PlayerDeathEvent = Omit<DefaultEvent, "type"> & {
  type: "Death";
  sourceNPC: DefaultEvent["sourceNPC"];
  targetPlayerID: NonNullable<DefaultEvent["targetPlayerID"]>;
};

export type NPCDeathEvent = Omit<DefaultEvent, "type"> & {
  type: "Death";
  targetNPC: NonNullable<DefaultEvent["targetNPC"]>;
};

const isNPCDeathEvent = (event: DefaultEvent): event is NPCDeathEvent =>
  event.type === "Death" && event.targetNPC !== null;
const isPlayerDeathEvent = (event: DefaultEvent): event is PlayerDeathEvent =>
  event.type === "Death" && event.targetPlayerID !== null;

export const isPlayerOrNPCDeathEvent = (
  event: DefaultEvent
): event is DeathRowProps["event"] => {
  return isNPCDeathEvent(event) || isPlayerDeathEvent(event);
};

export const isDamageDoneEventWithAbility = (
  event: DefaultEvent
): event is DamageDoneRowProps["event"] =>
  event.type === "DamageDone" &&
  event.ability !== null &&
  event.damage !== null &&
  event.sourcePlayerID !== null;

export const isHealingDoneEventWithAbility = (
  event: DefaultEvent
): event is HealingDoneRowProps["event"] =>
  event.type === "HealingDone" &&
  event.ability !== null &&
  ("sourcePlayerID" in event || "targetNPC" in event);

export const isApplyBuffEventWithAbility = (
  event: DefaultEvent
): event is ApplyBuffRowProps["event"] =>
  (event.type === "ApplyBuff" ||
    event.type === "ApplyBuffStack" ||
    event.type === "RemoveBuff") &&
  event.ability !== null;
