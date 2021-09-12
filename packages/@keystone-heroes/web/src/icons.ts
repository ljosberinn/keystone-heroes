import { FaSun, FaMoon, FaStar } from "react-icons/fa";

export const icons = {
  sun: {
    id: "fa-sun",
    component: FaSun,
  },
  moon: {
    id: "fa-moon",
    component: FaMoon,
  },
  star: {
    id: "fa-star",
    component: FaStar,
  },
} as const;
