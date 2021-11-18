const { createConfig } = require("eslint-config-galex/src/createConfig");
const { resolve } = require("path");

const baseCwd = process.cwd();
const isVSCodeLinterProcess = baseCwd[0].toLowerCase() === baseCwd[0];
const cwd = isVSCodeLinterProcess ? resolve(baseCwd, "../../") : baseCwd;

module.exports = createConfig({
  cwd,
  rules: {
    "unicorn/no-keyword-prefix": "off",
  },
  root: true,
});
