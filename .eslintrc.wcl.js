const { createConfig } = require("eslint-config-galex/src/createConfig");

const mockOverride = {
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
  },
  files: ["src/wcl/__mocks__/**/*.ts"],
};

const generatedTypesOverride = {
  files: ["./src/wcl/types.ts"],
  rules: {
    "import/no-namespace": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "unicorn/no-keyword-prefix": "off",
  },
};

module.exports = createConfig({
  rules: {
    "new-cap": "off",
  },
  overrides: [mockOverride, generatedTypesOverride],
  root: true,
});
