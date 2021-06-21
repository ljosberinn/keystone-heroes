const colors = require("tailwindcss/colors");

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
      indigo: colors.indigo,
      orange: colors.orange,
      pink: colors.pink,
      purple: colors.violet,
      red: colors.red,
      transparent: "transparent",
      white: colors.white,
      yellow: colors.amber,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  darkMode: "class",
};
