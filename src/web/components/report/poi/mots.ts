import type { POIContextDefinition } from "./context";

export const doors: POIContextDefinition["doors"] = {};

const icon = "spell_animaardenweald_orb";

const labelDoor = "Door";
const labelGraveyard = "Graveyard (Night Fae)";

export const poi: POIContextDefinition["poi"] = {
  1669: [
    {
      icon,
      x: 0.891_393_442_622_950_8,
      y: 0.230_535_148_925_706_23,
      label: labelDoor,
    },
    {
      icon,
      x: 0.776_639_344_262_295_1,
      y: 0.285_863_584_667_875_7,
      label: labelDoor,
    },
    {
      icon,
      x: 0.66,
      y: 0.292_011_188_639_227_87,
      label: labelGraveyard,
    },
    {
      icon,
      x: 0.404_713_114_754_098_4,
      y: 0.499_492_822_672_363_45,
      label: labelGraveyard,
    },
  ],
};
