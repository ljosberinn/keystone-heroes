const { createConfig } = require("eslint-config-galex/dist/createConfig");
const { getDependencies } = require("eslint-config-galex/dist/getDependencies");
const {
  createTypeScriptOverride,
} = require("eslint-config-galex/dist/overrides/typescript");

const deps = getDependencies();

const mockOverride = createTypeScriptOverride({
  ...deps,
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
  },
  files: ["src/wcl/__mocks__/**/*.ts"],
});

const generatedTypesOverride = createTypeScriptOverride({
  ...deps,
  files: ["src/wcl/types.ts"],
  rules: {
    "import/no-namespace": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "unicorn/no-keyword-prefix": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-redundant-type-constituents": "off",
  },
});

module.exports = createConfig({
  rules: {
    "new-cap": "off",
  },
  overrides: [mockOverride, generatedTypesOverride],
  root: true,
});
