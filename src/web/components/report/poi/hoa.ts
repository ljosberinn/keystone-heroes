import type { POIContextDefinition } from "./context";

export const doors: POIContextDefinition["doors"] = {
  1663: [
    {
      type: "left",
      x: 0.130_095_403_295_750_23,
      y: 0.524_057_217_165_149_5,
      to: 1664,
    },
  ],
  1664: [
    {
      type: "right",
      x: 0.833_477_883_781_439_7,
      y: 0.486_345_903_771_131_35,
      to: 1663,
    },
    {
      type: "up",
      x: 0.174_327_840_416_305_28,
      y: 0.361_508_452_535_760_75,
      to: 1665,
    },
  ],
  1665: [
    {
      type: "down",
      x: 0.677_363_399_826_539_5,
      y: 0.473_342_002_600_780_24,
      to: 1664,
    },
  ],
};

export const poi: POIContextDefinition["poi"] = [];
// gargoyles?
