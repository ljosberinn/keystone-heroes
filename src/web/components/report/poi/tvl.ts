import type { POIContextDefinition } from "./context";

export const doors: POIContextDefinition["doors"] = {
  1989: [
    {
      type: "right",
      x: 0.407_617_086_978_898_6,
      y: 0.270_270_270_270_270_3,
      to: 1992,
    },
    {
      type: "left",
      x: 0.389_089_037_570_766_85,
      y: 0.415_444_015_444_015_44,
      to: 1991,
    },
    {
      type: "left",
      x: 0.431_806_484_817_292_83,
      y: 0.625_482_625_482_625_5,
      to: 1990,
    },
  ],
  1990: [
    {
      type: "right",
      x: 0.391_147_709_727_225_96,
      y: 0.270_270_270_270_270_3,
      to: 1989,
    },
  ],
  1991: [
    {
      type: "right",
      x: 0.772_002_058_672_156_4,
      y: 0.617_760_617_760_617_7,
      to: 1989,
    },
  ],
  1992: [
    {
      type: "left",
      x: 0.608_852_290_272_774_1,
      y: 0.817_760_617_760_617_8,
      to: 1989,
    },
  ],
};

export const poi: POIContextDefinition["poi"] = {};
