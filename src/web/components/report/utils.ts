import type { FightSuccessResponse } from "../../../api/functions/fight";
import {
  SANGUINE_ICHOR_HEALING,
  spells,
  PF,
  EXPLOSIVE,
  NW,
  ID,
  WS,
} from "../../staticData";
import type { AbilityReadyRowProps } from "./rows/AbilityReadyRow";
import type { AnimaExhaustDamageRowProps } from "./rows/AnimaExhaustDamageRow";
import type { AnimaExhaustHealingRowProps } from "./rows/AnimaExhaustHealingRow";
import type { AntiPersonnelSquirrelDamageRowProps } from "./rows/AntiPersonnelSquirrelDamageRow";
import type { ApplyBuffRowProps } from "./rows/ApplyBuffRow";
import type { ApplyDebuffRowProps } from "./rows/ApplyDebuffRow";
import type { BloodyJavelinDamageRowProps } from "./rows/BloodyJavelinDamageRow";
import type { CastRowProps } from "./rows/CastRow";
import type { CrushedDamageRowProps } from "./rows/CrushedDamageRow";
import type { DamageDoneRowProps } from "./rows/DamageDoneRow";
import type { DamageTakenRowProps } from "./rows/DamageTakenRow";
import type { DeathRowProps } from "./rows/DeathRow";
import type { DischargedAnimaDamageRowProps } from "./rows/DischargedAnimaDamageRow";
import type { ExplosiveSummaryRowProps } from "./rows/ExplosivesSummaryRow";
import type { ForgottenForgehammerRowProps } from "./rows/ForgottenForgehammerRow";
import type { HealingDoneRowProps } from "./rows/HealingDoneRow";
import type { InterruptRowProps } from "./rows/InterruptRow";
import type { MissedInterruptRowProps } from "./rows/MissedInterruptRow";
import type { PlagueBombDamageRowProps } from "./rows/PlagueBombDamageRow";
import type { RocketBarrageDamageRowProps } from "./rows/RocketBarrageDamageRow";
import type { SanguineTimeLossRowProps } from "./rows/SanguineTimeLossRow";
import type { ThrowCleaverDamageRowProps } from "./rows/ThrowCleaverDamageRow";
import type { ViolentDetonationDamageRowProps } from "./rows/ViolentDetonationDamageRow";

export const bloodlustTypes = new Set([
  // Heroism
  32_182,
  // Drums of Deathly Ferocity
  309_658,
  // Timewarp
  80_353,
  // Bloodlust
  2825,
  // Primal Rage
  272_678,
]);
export const invisibilityTypes = new Set([
  // Invisible; Potion of the Hidden Spirit
  307_195,
  // Dimensional Shifter
  321_422,
]);
export const SHROUD_OF_CONCEALMENT = 114_018;

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
      event.ability?.id === SHROUD_OF_CONCEALMENT &&
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

  // Engineer rez
  if (id === 345_130) {
    return {
      name: "Disposable Spectrophasic Reanimator",
      icon: "inv_engineering_90_lightningbox",
      cd: 0,
    };
  }

  return null;
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

export const isApplyDebuffEventWithAbility = (
  event: DefaultEvent
): event is ApplyDebuffRowProps["event"] =>
  (event.type === "ApplyDebuff" ||
    event.type === "ApplyDebuffStack" ||
    event.type === "RemoveDebuff") &&
  event.ability !== null;

export const isSanguineHealEvent = (
  event: DefaultEvent
): event is SanguineTimeLossRowProps["events"][number] =>
  event.type === "HealingDone" && event.ability?.id === SANGUINE_ICHOR_HEALING;

export const isPlagueBombDamageEvent = (
  event: DefaultEvent
): event is PlagueBombDamageRowProps["events"][number] =>
  (event.type === "DamageDone" || event.type === "DamageTaken") &&
  event.ability?.id === PF.PLAGUE_BOMB;

export const isViolentDetonationDamageEvent = (
  event: DefaultEvent
): event is ViolentDetonationDamageRowProps["events"][number] =>
  (event.type === "DamageDone" || event.type === "DamageTaken") &&
  event.ability?.id === PF.CANISTER_VIOLENT_DETONATION;

export const isExplosivesDamageEvent = (
  event: DefaultEvent
): event is ExplosiveSummaryRowProps["events"][number] =>
  event.type === "DamageDone" && event.targetNPC?.id === EXPLOSIVE.unit;

export const isThrowCleaverDamageEvent = (
  event: DefaultEvent
): event is ThrowCleaverDamageRowProps["events"][number] =>
  (event.type === "DamageDone" || event.type === "DamageTaken") &&
  event.ability?.id === NW.THROW_CLEAVER;

export const isAnimaExhaustDamageEvent = (
  event: DefaultEvent
): event is AnimaExhaustDamageRowProps["events"][number] =>
  event.type === "DamageDone" && event.ability?.id === NW.KYRIAN_ORB_DAMAGE;

export const isAnimaExhaustHealEvent = (
  event: DefaultEvent
): event is AnimaExhaustHealingRowProps["events"][number] =>
  event.type === "HealingDone" && event.ability?.id === NW.KYRIAN_ORB_DAMAGE;

export const isBloodyJavelinDamageEvent = (
  event: DefaultEvent
): event is BloodyJavelinDamageRowProps["events"][number] =>
  event.type === "DamageDone" && event.ability?.id === NW.SPEAR;

export const isDischargedAnimaDamageEvent = (
  event: DefaultEvent
): event is DischargedAnimaDamageRowProps["events"][number] =>
  event.type === "DamageDone" && event.ability?.id === NW.ORB;

export const isMissingInterruptEventWithAbility = (
  event: DefaultEvent
): event is MissedInterruptRowProps["event"] =>
  event.type === "MissedInterrupt" && event.ability !== null;

export const isForgottenForgehammerDamageEvent = (
  event: DefaultEvent
): event is ForgottenForgehammerRowProps["events"][number] =>
  event.type === "DamageDone" && event.ability?.id === NW.HAMMER;

export const formatNumber = (value: number): string => {
  if (value > 1_000_000) {
    return `${Number.parseFloat((value / 1_000_000).toFixed(2)).toLocaleString(
      "en-US"
    )}m`;
  }

  if (value > 1000) {
    return `${Number.parseFloat((value / 1000).toFixed(2)).toLocaleString(
      "en-US"
    )}k`;
  }

  return value.toLocaleString("en-US");
};

export const isCrushedEvent = (
  event: DefaultEvent
): event is CrushedDamageRowProps["events"][number] =>
  event.ability?.id === ID.CRUSHED;

export const isRocketBarrageEvent = (
  event: DefaultEvent
): event is RocketBarrageDamageRowProps["events"][number] =>
  event.ability?.id === WS.ROCKET_BARRAGE;

export const isAntipersonnelSquirrelEvent = (
  event: DefaultEvent
): event is AntiPersonnelSquirrelDamageRowProps["events"][number] =>
  event.ability?.id === WS.ANTI_PERSONNEL_SQUIRREL;
