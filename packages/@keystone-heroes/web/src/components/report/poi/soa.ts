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

export const poi: POIContextDefinition["poi"] = [];
