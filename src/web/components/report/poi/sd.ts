import {
  spells,
  SD_LANTERN_BUFF,
  SD_LANTERN_OPENING,
} from "../../../staticData";
import type { POIContextDefinition } from "./context";

export const doors: POIContextDefinition["doors"] = {
  1675: [
    {
      type: "down",
      x: 0.440_589_765_828_274_1,
      y: 0.879_063_719_115_734_7,
      to: 1676,
    },
  ],
  1676: [
    {
      type: "up",
      x: 0.491_760_624_457_935_84,
      y: 0.767_230_169_050_715_2,
      to: 1675,
    },
  ],
};

const buff = spells[SD_LANTERN_BUFF];
const icon = spells[SD_LANTERN_OPENING];

export const poi: POIContextDefinition["poi"] = {
  1675: [
    {
      label: buff.name,
      icon: icon.icon,
      x: 0.195_937_561_230_487_9,
      y: 0.457_374_344_566_229_4,
    },
    {
      label: buff.name,
      icon: icon.icon,
      x: 0.680_338_754_272_527_4,
      y: 0.343_030_758_424_672_07,
    },
    {
      label: buff.name,
      icon: icon.icon,
      x: 0.495_286_613_110_399_95,
      y: 0.571_717_930_707_786_8,
    },
    {
      label: buff.name,
      icon: icon.icon,
      x: 0.658_567_914_135_806_5,
      y: 0.759_568_107_940_345_2,
    },
  ],
  1676: [
    {
      label: buff.name,
      icon: icon.icon,
      x: 0.564_953_301_547_906_8,
      y: 0.127_411_424_557_735_33,
    },
  ],
};
// urn
