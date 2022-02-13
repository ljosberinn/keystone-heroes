import type { POIContextDefinition } from "./context";

export const doors: POIContextDefinition["doors"] = {
  1995: [
    {
      type: "right",
      x: 0.617_601_646_937_725_1,
      y: 0.508_108_108_108_108_1,
      to: 1997,
    },
  ],
  1996: [
    {
      type: "left",
      x: 0.427_174_472_465_259_9,
      y: 0.617_760_617_760_617_7,
      to: 1993,
    },
    {
      type: "up",
      x: 0.777_148_739_063_304_2,
      y: 0.352_895_752_895_752_9,
      to: 1997,
    },
  ],
  1997: [
    {
      type: "left",
      x: 0.174_472_465_259_907_37,
      y: 0.231_660_231_660_231_67,
      to: 1995,
    },
    {
      type: "down",
      x: 0.625_321_667_524_446_7,
      y: 0.554_440_154_440_154_5,
      to: 1996,
    },
  ],
  1993: [
    {
      type: "right",
      x: 0.823_468_862_583_633_6,
      y: 0.524_324_324_324_324_3,
      to: 1996,
    },
  ],
};

export const poi: POIContextDefinition["poi"] = {};
