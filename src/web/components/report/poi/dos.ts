import type { POIContextDefinition } from "./context";

export const doors: POIContextDefinition["doors"] = {
  1680: [
    {
      type: "left",
      x: 0.252_100_840_336_134_45,
      y: 0.566_204_287_515_762_9,
      to: 1679,
    },
    {
      type: "down",
      x: 0.495_119_787_045_252_9,
      y: 0.897_606_382_978_723_4,
      to: 1678,
    },
    {
      type: "right",
      x: 0.739_436_619_718_309_9,
      y: 0.566_204_287_515_762_9,
      to: 1677,
    },
  ],
  1679: [
    {
      type: "right",
      x: 0.886_490_807_354_116_7,
      y: 0.467_625_899_280_575_5,
      to: 1680,
    },
  ],
  1678: [
    {
      type: "up",
      x: 0.480_069_324_090_121_3,
      y: 0.117_035_110_533_159_94,
      to: 1680,
    },
  ],
  1677: [
    {
      type: "left",
      x: 0.064_444_444_444_444_44,
      y: 0.569_753_810_082_063_3,
      to: 1680,
    },
  ],
};

const HAUNTED_URN_ICON = "inv_misc_urn_01";
const urnLabel = "Haunted Urn";

export const poi: POIContextDefinition["poi"] = {
  // De Other Side
  1680: [
    {
      icon: HAUNTED_URN_ICON,
      x: 0,
      y: 0,
      label: urnLabel,
    },
  ],
  // Ardenweald
  1677: [
    {
      icon: HAUNTED_URN_ICON,
      x: 0,
      y: 0,
      label: urnLabel,
    },
  ],
  // Zul'Gurub
  1679: [
    {
      icon: HAUNTED_URN_ICON,
      x: 0,
      y: 0,
      label: urnLabel,
    },
  ],
};
