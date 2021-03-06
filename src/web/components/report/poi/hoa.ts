import { spells, HOA_GARGOYLE } from "../../../staticData";
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

const icon = "npcs/174175.png";

export const poi: POIContextDefinition["poi"] = {
  1663: [
    {
      icon,
      label: spells[HOA_GARGOYLE].name,
      x: 0.717_213_114_754_098_3,
      y: 0.384_225_248_209_510_4,
    },
    {
      icon,
      label: spells[HOA_GARGOYLE].name,
      x: 0.614_754_098_360_655_8,
      y: 0.522_546_337_564_934_1,
    },
    {
      icon,
      label: spells[HOA_GARGOYLE].name,
      x: 0.568_647_540_983_606_6,
      y: 0.353_487_228_352_749_54,
    },
    {
      icon,
      label: spells[HOA_GARGOYLE].name,
      x: 0.594_262_295_081_967_3,
      y: 0.668_551_931_884_548,
    },
    {
      icon,
      label: spells[HOA_GARGOYLE].name,
      x: 0.461_065_573_770_491_8,
      y: 0.607_075_892_171_026_4,
    },
    {
      icon,
      label: spells[HOA_GARGOYLE].name,
      x: 0.358_606_557_377_049_16,
      y: 0.391_909_753_173_700_6,
    },
  ],
  1664: [
    {
      icon,
      label: spells[HOA_GARGOYLE].name,
      x: 0.435_450_819_672_131_2,
      y: 0.345_802_723_388_559_33,
    },
    {
      icon,
      label: spells[HOA_GARGOYLE].name,
      x: 0.435_450_819_672_131_2,
      y: 0.630_769_230_769_230_7,
    },
  ],
};
