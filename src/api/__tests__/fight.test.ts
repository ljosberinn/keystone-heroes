import { dungeonMap } from "../../db/data/dungeons";
import { calculateTotalPercent } from "../functions/fight";

describe("calculateTotalPercent", () => {
  const requiredCount = dungeonMap["2289"].count;
  const zones = new Set(dungeonMap[2289].zones.map((zone) => zone.id));

  test("returns 100 if count matches dungeon count", () => {
    const mockPull: Parameters<typeof calculateTotalPercent>[0][number] = {
      count: requiredCount,
      endTime: 0,
      enemyNPCs: [],
      isWipe: false,
      maps: [],
      percent: 0,
      startTime: 0,
      x: 0,
      y: 0,
    };

    const result = calculateTotalPercent([mockPull], 2289, zones);

    expect(result).toBe(100);
  });

  test("returns fraction of required count if cleared count does not match required", () => {
    const mockPull: Parameters<typeof calculateTotalPercent>[0][number] = {
      count: requiredCount - 5,
      endTime: 0,
      enemyNPCs: [],
      isWipe: false,
      maps: [],
      percent: 0,
      startTime: 0,
      x: 0,
      y: 0,
    };

    const result = calculateTotalPercent([mockPull], 2289, zones);

    expect(result).toMatchInlineSnapshot(`99.16666666666667`);
  });
});
