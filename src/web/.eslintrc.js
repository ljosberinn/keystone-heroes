const {
  createConfig,
  getDependencies,
} = require("eslint-config-galex/src/createConfig");
const {
  createJestOverride,
} = require("eslint-config-galex/src/overrides/jest");
const { resolve } = require("path");

const baseCwd = process.cwd();
const isVSCodeLinterProcess = baseCwd[0].toLowerCase() === baseCwd[0];
const cwd = isVSCodeLinterProcess ? resolve(baseCwd, "../../") : baseCwd;

const deps = getDependencies({ cwd });

const jestOverride = createJestOverride({
  ...deps,
  rules: { "jest/require-top-level-describe": "off" },
});

module.exports = createConfig({ cwd, overrides: [jestOverride], root: true });
