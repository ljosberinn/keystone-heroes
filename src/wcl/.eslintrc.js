const {
  createConfig,
  getDependencies,
} = require("eslint-config-galex/src/createConfig");
const {
  createTSOverride,
} = require("eslint-config-galex/src/overrides/typescript");
const { resolve } = require("path");

const baseCwd = process.cwd();
const isVSCodeLinterProcess = baseCwd[0].toLowerCase() === baseCwd[0];
const cwd = isVSCodeLinterProcess ? resolve(baseCwd, "../../") : baseCwd;

const deps = getDependencies({
  cwd,
});

const mockOverride = createTSOverride({
  ...deps,
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
  },
  files: ["src/wcl/__mocks__/**/*.ts"],
});

const generatedTypesOverride = createTSOverride({
  ...deps,
  files: ["src/wcl/types.ts"],
  rules: {
    "import/no-namespace": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "unicorn/no-keyword-prefix": "off",
  },
});

module.exports = createConfig({
  cwd,
  rules: {
    "new-cap": "off",
  },
  overrides: [mockOverride, generatedTypesOverride],
  root: true,
});
