import { PF } from "../queries/events/dungeons/pf";
import type { DeathEvent } from "../queries/events/types";
import { deathProcessor } from "../transform/events/death";
import allEvents from "./fixtures/allEvents.json";

describe("death", () => {
  const params = {
    targetPlayerID: null,
    targetNPCID: null,
    sourcePlayerID: null,
    sourceNPCID: null,
    pull: {
      enemyNPCs: [],
      startTime: 0,
      endTime: 0,
      id: 1,
      x: 0,
      y: 0,
      isWipe: false,
      maps: [],
      percent: 0,
    },
  };

  const deathEvents = allEvents.filter(
    (event): event is DeathEvent => event.type === "death"
  );

  test("tracks player death events", () => {
    const result = deathEvents.map((event) =>
      deathProcessor(event, { ...params, targetPlayerID: 1 })
    );

    expect(result).toMatchSnapshot();
  });

  test("tracks PF Slime Death events", () => {
    const result = [
      PF.GREEN_BUFF.unit,
      PF.PURPLE_BUFF.unit,
      PF.RED_BUFF.unit,
    ].flatMap((targetNPCID) =>
      deathEvents.map((event) =>
        deathProcessor(event, { ...params, targetNPCID })
      )
    );

    expect(result).toMatchSnapshot();
  });

  test("returns null for unknown death events", () => {
    expect(
      deathProcessor(
        {
          type: "death",
          abilityGameID: 1,
          sourceID: 1,
          targetID: 0,
          timestamp: 1,
        },
        params
      )
    ).toBeNull();
  });
});
