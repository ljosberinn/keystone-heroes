import { DOS_URN } from "../../../../wcl/queries/events/dungeons/dos";
import { spells } from "../../../staticData";
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

export const poi: POIContextDefinition["poi"] = {
  // De Other Side
  1680: [
    {
      icon: spells[DOS_URN].icon,
      x: 0.398_794_552_828_948_9,
      y: 0.768_446_106_766_405_9,
      label: spells[DOS_URN].name,
    },
    {
      icon: spells[DOS_URN].icon,
      x: 0.650_614_754_098_360_7,
      y: 0.514_861_832_600_743_9,
      label: spells[DOS_URN].name,
    },
  ],
  // Ardenweald
  1677: [
    {
      icon: spells[DOS_URN].icon,
      x: 0.495_901_639_344_262_3,
      y: 0.364_245_535_302_615_83,
      label: spells[DOS_URN].name,
    },
  ],
  // Zul'Gurub
  1679: [
    {
      icon: spells[DOS_URN].icon,
      x: 0.578_893_442_622_950_8,
      y: 0.430_332_277_994_651_6,
      label: spells[DOS_URN].name,
    },
  ],
};
