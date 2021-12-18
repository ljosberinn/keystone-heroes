import { SOA_SPEAR } from "../../../../wcl/queries/events/dungeons/soa";
import { spells } from "../../../staticData";
import type { POIContextDefinition } from "./context";

export const doors: POIContextDefinition["doors"] = {
  1692: [
    {
      type: "up",
      x: 0.711_188_204_683_434_5,
      y: 0.156_046_814_044_213_28,
      to: 1693,
    },
  ],
  1693: [
    {
      type: "down",
      x: 0.349_522_983_521_248_94,
      y: 0.609_882_964_889_466_8,
      to: 1692,
    },
    {
      type: "up",
      x: 0.693_842_150_910_667_8,
      y: 0.390_117_035_110_533_14,
      to: 1694,
    },
  ],
  1694: [
    {
      type: "down",
      x: 0.364_267_129_228_100_6,
      y: 0.778_933_680_104_031_2,
      to: 1693,
    },
    {
      type: "up",
      x: 0.483_954_900_260_190_8,
      y: 0.457_737_321_196_358_9,
      to: 1695,
    },
  ],
  1695: [
    {
      type: "down",
      x: 0.410_234_171_725_932_35,
      y: 0.685_305_591_677_503_3,
      to: 1694,
    },
  ],
};

export const poi: POIContextDefinition["poi"] = {
  1693: [
    {
      // Garden of Repose, left
      icon: spells[SOA_SPEAR].icon,
      x: 0.360_360_360_360_360_34,
      y: 0.204_633_204_633_204_64,
      label: spells[SOA_SPEAR].name,
    },
    {
      // Garden of Repose, right
      icon: spells[SOA_SPEAR].icon,
      x: 0.561_132_561_132_561_2,
      y: 0.891_891_891_891_891_9,
      label: spells[SOA_SPEAR].name,
    },
  ],
  1694: [
    {
      // Font of Fealty
      icon: spells[SOA_SPEAR].icon,
      x: 0.411_840_411_840_411_8,
      y: 0.772_200_772_200_772_2,
      label: spells[SOA_SPEAR].name,
    },
  ],
};
