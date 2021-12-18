import { spells, TOP_BANNER_AURA } from "../../../staticData";
import type { POIContextDefinition } from "./context";

export const doors: POIContextDefinition["doors"] = {
  1683: [
    {
      type: "down",
      x: 0.490_686_098_654_708_5,
      y: 0.403_768_506_056_527_6,
      to: 1684,
    },
  ],
  1684: [
    {
      type: "up",
      x: 0.305_970_149_253_731_34,
      y: 0.107_692_307_692_307_7,
      to: 1685,
    },
    {
      type: "left",
      x: 0.186_567_164_179_104_5,
      y: 0.268_531_468_531_468_53,
      to: 1686,
    },
    {
      type: "up",
      x: 0.306_902_985_074_626_9,
      y: 0.323_076_923_076_923_1,
      to: 1683,
    },
  ],
  1685: [
    {
      type: "down",
      x: 0.697_980_684_811_237_9,
      y: 0.869_565_217_391_304_3,
      to: 1684,
    },
  ],
  1686: [
    {
      type: "down",
      x: 0.229_148_375_768_217_73,
      y: 0.304_347_826_086_956_54,
      to: 1687,
    },
    {
      type: "down",
      x: 0.160_667_251_975_417_04,
      y: 0.557_312_252_964_426_9,
      to: 1687,
    },
    {
      type: "right",
      x: 0.797_190_517_998_244,
      y: 0.682_476_943_346_508_5,
      to: 1684,
    },
  ],
  1687: [
    {
      type: "up",
      x: 0.232_660_228_270_412_63,
      y: 0.223_978_919_631_093_54,
      to: 1686,
    },
    {
      type: "up",
      x: 0.158_911_325_724_319_57,
      y: 0.565_217_391_304_347_8,
      to: 1686,
    },
    {
      type: "up",
      x: 0.631_255_487_269_534_7,
      y: 0.824_769_433_465_085_7,
      to: 1686,
    },
  ],
};

export const poi: POIContextDefinition["poi"] = {
  // Champer of Conquest
  1684: [
    {
      x: 0.481_557_377_049_180_34,
      y: 0.676_236_436_848_738_2,
      label: spells[TOP_BANNER_AURA].name,
      icon: spells[TOP_BANNER_AURA].icon,
    },
  ],
  // Altars of Agony
  1685: [
    {
      x: 0.696_721_311_475_409_8,
      y: 0.837_611_041_096_732_6,
      label: spells[TOP_BANNER_AURA].name,
      icon: spells[TOP_BANNER_AURA].icon,
    },
  ],
  // Upper Barrows of Carnage
  1686: [
    {
      x: 0.614_754_098_360_655_8,
      y: 0.530_230_842_529_124_3,
      label: spells[TOP_BANNER_AURA].name,
      icon: spells[TOP_BANNER_AURA].icon,
    },
  ],
};
