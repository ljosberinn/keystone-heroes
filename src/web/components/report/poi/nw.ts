import { spells, NW } from "../../../staticData";
import type { POIContextDefinition } from "./context";

export const doors: POIContextDefinition["doors"] = {
  1666: [
    {
      type: "up",
      x: 0.167_680_278_019_113_8,
      y: 0.389_830_508_474_576_3,
      to: 1667,
    },
  ],
  1667: [
    {
      type: "up",
      x: 0.495_221_546_481_320_6,
      y: 0.544_980_443_285_528_1,
      to: 1668,
    },
  ],
  1668: [
    {
      type: "down",
      x: 0.492_615_117_289_313_6,
      y: 0.481_095_176_010_430_2,
      to: 1666,
    },
  ],
};

export const poi: POIContextDefinition["poi"] = {
  1666: [
    {
      x: 0.732_581_967_213_114_7,
      y: 0.315_064_703_531_798_5,
      icon: spells[NW.HAMMER].icon,
      label: spells[NW.HAMMER].name,
    },
    {
      x: 0.409_836_065_573_770_5,
      y: 0.737_327_188_940_092_2,
      icon: spells[NW.HAMMER].icon,
      label: spells[NW.HAMMER].name,
    },
    {
      x: 0.379_098_360_655_737_7,
      y: 0.445_468_509_984_639,
      icon: spells[NW.HAMMER].icon,
      label: spells[NW.HAMMER].name,
    },
    {
      x: 0.671_106_557_377_049_2,
      y: 0.268_957_673_746_657_24,
      icon: spells[NW.SPEAR].icon,
      label: spells[NW.SPEAR].name,
    },
    {
      x: 0.435_450_819_672_131_2,
      y: 0.660_522_273_425_499_2,
      icon: spells[NW.SPEAR].icon,
      label: spells[NW.SPEAR].name,
    },
    {
      x: 0.348_360_655_737_704_9,
      y: 0.299_539_170_506_912_4,
      icon: spells[NW.SPEAR].icon,
      label: spells[NW.SPEAR].name,
    },
    {
      x: 0.589_139_344_262_295_1,
      y: 0.806_451_612_903_225_8,
      icon: spells[NW.ORB].icon,
      label: spells[NW.ORB].name,
    },
    {
      x: 0.133_196_721_311_475_42,
      y: 0.291_858_678_955_453_14,
      icon: spells[NW.ORB].icon,
      label: spells[NW.ORB].name,
    },
    {
      x: 0.599_385_245_901_639_3,
      y: 0.245_775_729_646_697_4,
      icon: spells[NW.KYRIAN_ORB_BUFF].icon,
      label: spells[NW.KYRIAN_ORB_BUFF].name,
    },
    {
      x: 0.609_631_147_540_983_6,
      y: 0.683_563_748_079_877_1,
      icon: spells[NW.KYRIAN_ORB_BUFF].icon,
      label: spells[NW.KYRIAN_ORB_BUFF].name,
    },
    {
      x: 0.220_286_885_245_901_65,
      y: 0.599_078_341_013_824_8,
      icon: spells[NW.KYRIAN_ORB_BUFF].icon,
      label: spells[NW.KYRIAN_ORB_BUFF].name,
    },
    {
      x: 0.681_935_151_827_071_5,
      y: 0.540_540_540_540_540_6,
      icon: spells[NW.SHIELD].icon,
      label: spells[NW.SHIELD].name,
    },
    {
      x: 0.375_707_668_553_782_8,
      y: 0.478_764_478_764_478_75,
      icon: spells[NW.SHIELD].icon,
      label: spells[NW.SHIELD].name,
    },
  ],
};
// weapons & goliath
