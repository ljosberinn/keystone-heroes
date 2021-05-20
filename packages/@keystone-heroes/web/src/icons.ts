import { FaSun, FaMoon } from "react-icons/fa";
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
  sun: {
    id: "fa-sun",
    component: FaSun,
  },
  moon: {
    id: "fa-moon",
    component: FaMoon,
  },
} as const;
