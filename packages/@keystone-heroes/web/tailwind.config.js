const colors = require("tailwindcss/colors");

const classColors = {
  deathknight: "#c41e3a",
  demonhunter: "#a330c9",
  druid: "#ff7c0a",
  hunter: "#aad372",
  mage: "#3fc7eb",
  monk: "#00ff98",
  paladin: "#f48cba",
  priest: colors.white,
  rogue: "#fff648",
  shaman: "#0070dd",
  warlock: "#8788ee",
  warrior: "#c69b7d",
};

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: colors.black,
      blue: colors.blue,
      coolgray: colors.coolGray,
      current: "currentColor",
      gray: colors.warmGray,
      green: colors.emerald,
      red: colors.red,
      transparent: "transparent",
      white: colors.white,
    },
    extend: {
      colors: classColors,
    },
  },
  plugins: [],
  darkMode: "class",
};
