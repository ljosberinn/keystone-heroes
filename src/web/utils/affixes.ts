import type { FightSuccessResponse } from "../../api/functions/fight";
import {
  BURSTING,
  ENCRYPTED,
  EXPLOSIVE,
  GRIEVOUS,
  NECROTIC,
  QUAKING,
  SANGUINE_ICHOR_DAMAGE,
  SANGUINE_ICHOR_HEALING,
  SPITEFUL,
  STORMING,
  VOLCANIC,
} from "../staticData";

export type CalculateAffixMetricsParams = {
  events: FightSuccessResponse["pulls"][number]["events"];
  affixes: FightSuccessResponse["affixes"];
  groupDPS: FightSuccessResponse["meta"]["dps"];
};

export type SanguineMetrics = {
  hasSanguine: boolean;
  healing: number;
  estTimeLoss: number;
  damage: Record<number, number>;
  hits: Record<number, number>;
};

export const calculateSanguineMetrics = ({
  affixes,
  events,
  groupDPS,
}: CalculateAffixMetricsParams): SanguineMetrics => {
  if (!affixes.includes(8)) {
    return {
      healing: 0,
      damage: {},
      hasSanguine: false,
      estTimeLoss: 0,
      hits: {},
    };
  }

  const healing = events.reduce((acc, event) => {
    if (
      event.type === "HealingDone" &&
      event.healingDone &&
      event.ability?.id === SANGUINE_ICHOR_HEALING
    ) {
      return acc + event.healingDone;
    }

    return acc;
  }, 0);

  const { hits, damage } = events.reduce<{
    hits: Record<number, number>;
    damage: Record<number, number>;
  }>(
    (acc, event) => {
      if (
        event.type === "DamageTaken" &&
        event.ability?.id === SANGUINE_ICHOR_DAMAGE &&
        event.targetPlayerID
      ) {
        acc.hits[event.targetPlayerID] =
          (acc.hits[event.targetPlayerID] ?? 0) + 1;

        if (event.damage) {
          acc.damage[event.targetPlayerID] =
            (acc.damage[event.targetPlayerID] ?? 0) + event.damage;
        }
      }

      return acc;
    },
    {
      hits: {},
      damage: {},
    }
  );

  return {
    hasSanguine: true,
    healing,
    damage,
    estTimeLoss: Math.floor(healing / groupDPS),
    hits,
  };
};

export type GrievousMetrics = {
  hasGrievous: boolean;
  damage: Record<number, number>;
};

export const calculateGrievousMetrics = ({
  affixes,
  events,
}: CalculateAffixMetricsParams): GrievousMetrics => {
  if (!affixes.includes(12)) {
    return {
      damage: {},
      hasGrievous: false,
    };
  }

  const damage = events.reduce<Record<number, number>>((acc, event) => {
    if (
      event.type === "DamageTaken" &&
      event.ability?.id === GRIEVOUS &&
      event.targetPlayerID &&
      event.damage
    ) {
      acc[event.targetPlayerID] =
        (acc[event.targetPlayerID] ?? 0) + event.damage;
    }
    return acc;
  }, {});

  return {
    hasGrievous: true,
    damage,
  };
};

export type BurstingMetrics = {
  hasBursting: boolean;
  damage: Record<number, number>;
};

export const calculateBurstingMetrics = ({
  affixes,
  events,
}: CalculateAffixMetricsParams): BurstingMetrics => {
  if (!affixes.includes(11)) {
    return {
      damage: {},
      hasBursting: false,
    };
  }

  const damage = events.reduce<Record<number, number>>((acc, event) => {
    if (
      event.type === "DamageTaken" &&
      event.ability?.id === BURSTING.damage &&
      event.targetPlayerID &&
      event.damage
    ) {
      acc[event.targetPlayerID] =
        (acc[event.targetPlayerID] ?? 0) + event.damage;
    }
    return acc;
  }, {});

  return {
    hasBursting: true,
    damage,
  };
};

export type SpitefulMetrics = {
  hasSpiteful: boolean;
  damage: Record<number, number>;
  hits: Record<number, number>;
};

export const calculateSpitefulMetrics = ({
  affixes,
  events,
}: CalculateAffixMetricsParams): SpitefulMetrics => {
  if (!affixes.includes(123)) {
    return {
      damage: {},
      hits: {},
      hasSpiteful: false,
    };
  }

  const { hits, damage } = events.reduce<{
    hits: Record<number, number>;
    damage: Record<number, number>;
  }>(
    (acc, event) => {
      if (
        event.type === "DamageTaken" &&
        event.ability?.id === SPITEFUL &&
        event.targetPlayerID
      ) {
        acc.hits[event.targetPlayerID] =
          (acc.hits[event.targetPlayerID] ?? 0) + 1;

        if (event.damage) {
          acc.damage[event.targetPlayerID] =
            (acc.damage[event.targetPlayerID] ?? 0) + event.damage;
        }
      }

      return acc;
    },
    {
      hits: {},
      damage: {},
    }
  );

  return {
    damage,
    hits,
    hasSpiteful: true,
  };
};

export type ExplosiveMetrics = {
  hasExplosive: boolean;
  kills: Record<number, number>;
  spawned: number;
  missed: number;
};

export const calculateExplosiveMetrics = ({
  affixes,
  events,
}: CalculateAffixMetricsParams): ExplosiveMetrics => {
  if (!affixes.includes(13)) {
    return {
      hasExplosive: false,
      spawned: 0,
      kills: {},
      missed: 0,
    };
  }

  const kills = events.reduce<Record<number, number>>((acc, event) => {
    if (
      event.type === "DamageDone" &&
      event.targetNPC?.id === EXPLOSIVE.unit &&
      event.sourcePlayerID
    ) {
      acc[event.sourcePlayerID] = (acc[event.sourcePlayerID] ?? 0) + 1;
    }

    return acc;
  }, {});

  const missed = Object.values(
    events.reduce<Record<number, number>>((acc, event) => {
      if (
        event.type === "DamageTaken" &&
        event.ability?.id === EXPLOSIVE.ability
      ) {
        acc[event.timestamp] = (acc[event.timestamp] ?? 0) + 1;
      }

      return acc;
    }, {})
  ).length;

  const spawned =
    Object.values(kills).reduce((acc, count) => acc + count, 0) + missed;

  return {
    hasExplosive: true,
    kills,
    spawned,
    missed,
  };
};

export type QuakingMetrics = {
  hasQuaking: boolean;
  damage: Record<number, number>;
  interrupts: Record<number, number>;
};

export const calculateQuakingMetrics = ({
  affixes,
  events,
}: CalculateAffixMetricsParams): QuakingMetrics => {
  if (!affixes.includes(14)) {
    return {
      damage: {},
      interrupts: {},
      hasQuaking: false,
    };
  }

  const damage = events.reduce<Record<number, number>>((acc, event) => {
    if (
      event.type === "DamageTaken" &&
      event.ability?.id === QUAKING &&
      event.targetPlayerID &&
      event.damage
    ) {
      acc[event.targetPlayerID] =
        (acc[event.targetPlayerID] ?? 0) + event.damage;
    }
    return acc;
  }, {});

  const interrupts = events.reduce<Record<number, number>>((acc, event) => {
    if (
      event.type === "Interrupt" &&
      event.ability?.id === QUAKING &&
      event.sourcePlayerID
    ) {
      acc[event.sourcePlayerID] = (acc[event.sourcePlayerID] ?? 0) + 1;
    }
    return acc;
  }, {});

  return {
    damage,
    interrupts,
    hasQuaking: true,
  };
};

export type VolcanicMetrics = {
  hasVolcanic: boolean;
  damage: Record<number, number>;
  hits: Record<number, number>;
};

export const calculateVolcanicMetrics = ({
  affixes,
  events,
}: CalculateAffixMetricsParams): VolcanicMetrics => {
  if (!affixes.includes(3)) {
    return {
      damage: {},
      hasVolcanic: false,
      hits: {},
    };
  }

  const { hits, damage } = events.reduce<{
    hits: Record<number, number>;
    damage: Record<number, number>;
  }>(
    (acc, event) => {
      if (
        event.type === "DamageTaken" &&
        event.ability?.id === VOLCANIC &&
        event.targetPlayerID
      ) {
        acc.hits[event.targetPlayerID] =
          (acc.hits[event.targetPlayerID] ?? 0) + 1;

        if (event.damage) {
          acc.damage[event.targetPlayerID] =
            (acc.damage[event.targetPlayerID] ?? 0) + event.damage;
        }
      }

      return acc;
    },
    {
      hits: {},
      damage: {},
    }
  );

  return {
    damage,
    hasVolcanic: true,
    hits,
  };
};

export type StormingMetrics = {
  hasStorming: boolean;
  damage: Record<number, number>;
  hits: Record<number, number>;
};

export const calculateStormingMetrics = ({
  affixes,
  events,
}: CalculateAffixMetricsParams): StormingMetrics => {
  if (!affixes.includes(124)) {
    return {
      damage: {},
      hits: {},
      hasStorming: false,
    };
  }

  const { hits, damage } = events.reduce<{
    hits: Record<number, number>;
    damage: Record<number, number>;
  }>(
    (acc, event) => {
      if (
        event.type === "DamageTaken" &&
        event.ability?.id === STORMING &&
        event.targetPlayerID
      ) {
        acc.hits[event.targetPlayerID] =
          (acc.hits[event.targetPlayerID] ?? 0) + 1;

        if (event.damage) {
          acc.damage[event.targetPlayerID] =
            (acc.damage[event.targetPlayerID] ?? 0) + event.damage;
        }
      }

      return acc;
    },
    {
      hits: {},
      damage: {},
    }
  );

  return {
    damage,
    hits,
    hasStorming: true,
  };
};

export type NecroticMetrics = {
  hasNecrotic: boolean;
  damage: Record<number, number>;
};

export const calculateNecroticMetrics = ({
  affixes,
  events,
}: CalculateAffixMetricsParams): NecroticMetrics => {
  if (!affixes.includes(4)) {
    return {
      damage: {},
      hasNecrotic: false,
    };
  }

  const damage = events.reduce<Record<number, number>>((acc, event) => {
    if (
      event.type === "DamageTaken" &&
      event.ability?.id === NECROTIC &&
      event.targetPlayerID &&
      event.damage
    ) {
      acc[event.targetPlayerID] =
        (acc[event.targetPlayerID] ?? 0) + event.damage;
    }
    return acc;
  }, {});

  return {
    hasNecrotic: true,
    damage,
  };
};

export type EncryptedMetrics = {
  hasEncrypted: boolean;
  damage: Record<number, number>;
};

export const calculateEncryptedMetrics = ({
  affixes,
  events,
}: CalculateAffixMetricsParams): EncryptedMetrics => {
  if (!affixes.includes(130)) {
    return {
      damage: {},
      hasEncrypted: false,
    };
  }

  const damage = events.reduce<Record<number, number>>((acc, event) => {
    if (
      event.type === "DamageTaken" &&
      event.ability &&
      ENCRYPTED.has(event.ability.id) &&
      event.targetPlayerID &&
      event.damage
    ) {
      acc[event.targetPlayerID] =
        (acc[event.targetPlayerID] ?? 0) + event.damage;
    }
    return acc;
  }, {});

  return {
    hasEncrypted: true,
    damage,
  };
};
