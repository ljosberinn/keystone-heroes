import { BOLSTERING } from "../queries/events/affixes/bolstering";
import { PF } from "../queries/events/dungeons/pf";
import { SD_LANTERN_BUFF } from "../queries/events/dungeons/sd";
import { TOP_BANNER_AURA } from "../queries/events/dungeons/top";
import { INVISIBILITY } from "../queries/events/other";
import type { ApplyBuffEvent } from "../queries/events/types";
import { applyBuffProcessor } from "../transform/events/applybuff";
import allEvents from "./fixtures/allEvents.json";

describe("applybuff", () => {
  const params = {
    sourcePlayerID: null,
    targetPlayerID: 1,
    sourceNPCID: null,
    targetNPCID: null,
  };

  const applyBuffEvents = allEvents.filter(
    (event): event is ApplyBuffEvent => event.type === "applybuff"
  );

  test("tracks invisibility potion", () => {
    const result = applyBuffEvents
      .filter(
        (event) =>
          event.abilityGameID === INVISIBILITY.POTION_OF_THE_HIDDEN_SPIRIT
      )
      .map((event) =>
        applyBuffProcessor(event, {
          ...params,
          sourcePlayerID: params.targetPlayerID,
        })
      );

    expect(result).toMatchSnapshot();
  });

  test("tracks engineering invisibility", () => {
    const result = applyBuffEvents
      .filter(
        (event) => event.abilityGameID === INVISIBILITY.DIMENSIONAL_SHIFTER
      )
      .map((event) =>
        applyBuffProcessor(event, {
          ...params,
          sourcePlayerID: params.targetPlayerID,
        })
      );

    expect(result).toMatchSnapshot();
  });

  test("tracks ToP banner aura", () => {
    const result = applyBuffEvents
      .filter((event) => event.abilityGameID === TOP_BANNER_AURA)
      .map((event) =>
        applyBuffProcessor(event, {
          ...params,
          sourcePlayerID: params.targetPlayerID,
        })
      );

    expect(result).toMatchSnapshot();
  });

  test("tracks PF Slime buffs", () => {
    const result = applyBuffEvents
      .filter(
        (event) =>
          event.abilityGameID === PF.GREEN_BUFF.aura ||
          event.abilityGameID === PF.RED_BUFF.aura ||
          event.abilityGameID === PF.PURPLE_BUFF.aura
      )
      .map((event) =>
        applyBuffProcessor(event, {
          ...params,
          sourcePlayerID: params.targetPlayerID,
        })
      );

    expect(result).toMatchSnapshot();
  });

  test("tracks bolstering", () => {
    const result = applyBuffEvents
      .filter((event) => event.abilityGameID === BOLSTERING)
      .map((event) =>
        applyBuffProcessor(event, {
          ...params,
          targetPlayerID: null,
          targetNPCID: 1,
        })
      );

    expect(result.every((dataset) => dataset?.stacks === null)).toBe(true);
    expect(result).toMatchSnapshot();
  });

  test("forwards bolstering stack", () => {
    const result = applyBuffEvents
      .filter((event) => event.abilityGameID === BOLSTERING)
      .map((event) =>
        applyBuffProcessor(
          { ...event, stacks: 1 },
          {
            ...params,
            targetPlayerID: null,
            targetNPCID: 1,
          }
        )
      );

    expect(result.every((dataset) => dataset?.stacks === 1)).toBe(true);
    expect(result).toMatchSnapshot();
  });

  test("tracks SD Lantern Buff", () => {
    const result = applyBuffEvents
      .filter((event) => event.abilityGameID === SD_LANTERN_BUFF)
      .map((event) => applyBuffProcessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("returns null for applybuffevents without targetPlayerID", () => {
    expect(
      applyBuffProcessor(
        {
          type: "applybuff",
          abilityGameID: 1,
          sourceID: 1,
          targetID: 0,
          timestamp: 1,
        },
        {
          ...params,
          targetPlayerID: null,
        }
      )
    ).toBeNull();
  });
});
