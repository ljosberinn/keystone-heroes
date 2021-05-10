import { GiLockedChest, GiOpenChest } from "react-icons/gi";

export const icons = {
  openChest: {
    id: "gi-open-chest",
    component: GiOpenChest,
  },
  lockedChest: {
    id: "gi-locked-chest",
    component: GiLockedChest,
  },
} as const;
