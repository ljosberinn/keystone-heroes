import { BURSTING } from "../queries/events/affixes/bursting";
import { EXPLOSIVE } from "../queries/events/affixes/explosive";
import { GRIEVOUS_WOUND } from "../queries/events/affixes/grievous";
import { NECROTIC } from "../queries/events/affixes/necrotic";
import { QUAKING } from "../queries/events/affixes/quaking";
import { SANGUINE_ICHOR_DAMAGE } from "../queries/events/affixes/sanguine";
import { SPITEFUL } from "../queries/events/affixes/spiteful";
import { STORMING } from "../queries/events/affixes/storming";
import { VOLCANIC } from "../queries/events/affixes/volcanic";
import { NW } from "../queries/events/dungeons/nw";
import { PF } from "../queries/events/dungeons/pf";
import type { DamageEvent } from "../queries/events/types";
import { damageProcessor } from "../transform/events/damage";
import allEvents from "./fixtures/allEvents.json";

describe("damage", () => {
  const params = {
    targetPlayerID: 1,
    sourcePlayerID: null,
    sourceNPCID: null,
    targetNPCID: null,
  };

  const damageEvents = allEvents.filter(
    (event): event is DamageEvent => event.type === "damage"
  );

  const environmentalDamageAffixAbilities = new Set([
    BURSTING,
    VOLCANIC,
    STORMING,
    EXPLOSIVE.ability,
    GRIEVOUS_WOUND,
    SANGUINE_ICHOR_DAMAGE,
    QUAKING,
    NECROTIC,
  ]);

  describe("player taking damage", () => {
    test("tracks environmental damage affix events", () => {
      const result = damageEvents
        .filter((event) =>
          environmentalDamageAffixAbilities.has(event.abilityGameID)
        )
        .map((event) => damageProcessor(event, params));

      expect(result).toMatchSnapshot();
    });

    test("tracks damage taken by npc", () => {
      const result = damageEvents
        .filter(
          (event) => !environmentalDamageAffixAbilities.has(event.abilityGameID)
        )
        .map((event) => damageProcessor(event, { ...params, sourceNPCID: 1 }));

      expect(result).toMatchSnapshot();
    });

    test("fixes broken Spiteful autoattacks", () => {
      const result = damageEvents
        .filter((event) => event.abilityGameID === SPITEFUL.ability)
        .map((event) => damageProcessor(event, params));

      expect(result).toMatchSnapshot();
    });
  });

  describe("player damaging npc", () => {
    test("ignores targetNPCID on NW Kyrian Orb Damage", () => {
      const result = damageEvents
        .filter((event) => event.abilityGameID === NW.KYRIAN_ORB_DAMAGE)
        .map((event) =>
          damageProcessor(event, {
            ...params,
            targetPlayerID: null,
            sourcePlayerID: 1,
            targetNPCID: 1,
          })
        );

      expect(result.every((dataset) => dataset?.targetNPCID === null)).toBe(
        true
      );

      expect(result).toMatchSnapshot();
    });
  });

  test("tracks damage done by plagueborers", () => {
    const result = damageEvents
      .filter((event) => event.abilityGameID === PF.PLAGUE_BOMB)
      .map((event) =>
        damageProcessor(event, {
          ...params,
          sourceNPCID: PF.RIGGED_PLAGUEBORER,
          targetPlayerID: null,
        })
      );

    expect(result).toMatchSnapshot();
  });

  test("skips events doing 0 damage", () => {
    const result = damageEvents.map((event) =>
      damageProcessor(
        { ...event, unmitigatedAmount: 0 },
        {
          ...params,
          sourceNPCID: PF.RIGGED_PLAGUEBORER,
          targetPlayerID: null,
        }
      )
    );

    expect(result.every((dataset) => dataset === null)).toBe(true);

    expect(result).toMatchSnapshot();
  });

  test("skips events without any meta information", () => {
    const result = damageEvents.map((event) =>
      damageProcessor(event, {
        targetNPCID: null,
        sourceNPCID: null,
        sourcePlayerID: null,
        targetPlayerID: null,
      })
    );

    expect(result.every((dataset) => dataset === null)).toBe(true);

    expect(result).toMatchSnapshot();
  });
});
