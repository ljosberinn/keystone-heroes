const {
  createConfig,
  getDependencies,
} = require("eslint-config-galex/src/createConfig");
const {
  createTSOverride,
} = require("eslint-config-galex/src/overrides/typescript");

const deps = getDependencies();

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
    "@typescript-eslint/no-unused-vars": "off",
  },
});

module.exports = createConfig({
  rules: {
    "new-cap": "off",
  },
  overrides: [mockOverride, generatedTypesOverride],
  root: true,
});
