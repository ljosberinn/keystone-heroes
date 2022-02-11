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
  content: [
    "./src/web/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Rubik"],
      mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
    },
    extend: {
      colors: classColors,
      maxWidth: {
        "1/2": "50%",
        "[8ch]": "8ch",
        "1/3": "33.33%",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
