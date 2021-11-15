import { SANGUINE_ICHOR_HEALING } from "../queries/events/affixes/sanguine";
import { NW } from "../queries/events/dungeons/nw";
import type { HealEvent } from "../queries/events/types";
import { healProcessor } from "../transform/events/heal";
import allEvents from "./fixtures/allEvents.json";

describe("heal", () => {
  const healEvents = allEvents.filter(
    (event): event is HealEvent => event.type === "heal"
  );

  const params = {
    targetPlayerID: 1,
    targetNPCID: null,
    sourcePlayerID: 1,
    sourceNPCID: null,
  };

  test("tracks NW Kyrian Orb heal events", () => {
    const result = healEvents
      .filter((event) => event.abilityGameID === NW.KYRIAN_ORB_HEAL)
      .map((event) => healProcessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("tracks Sanguine heal events", () => {
    const result = healEvents
      .filter((event) => event.abilityGameID === SANGUINE_ICHOR_HEALING)
      .map((event) =>
        healProcessor(event, {
          ...params,
          sourcePlayerID: null,
          targetPlayerID: null,
          targetNPCID: 1,
        })
      );

    expect(result).toMatchSnapshot();
  });

  test("skips event with 0 healing", () => {
    const result = healEvents.map((event) =>
      healProcessor({ ...event, amount: 0 }, params)
    );

    expect(result.every((dataset) => dataset === null)).toBe(true);

    expect(result).toMatchSnapshot();
  });

  test("skips unknown heal events", () => {
    expect(
      healProcessor(
        {
          type: "heal",
          timestamp: 1,
          abilityGameID: 1,
          amount: 1,
          hitType: 1,
          sourceID: 1,
          targetID: 1,
        },
        { ...params, targetPlayerID: null, sourcePlayerID: null }
      )
    ).toBeNull();
  });
});
