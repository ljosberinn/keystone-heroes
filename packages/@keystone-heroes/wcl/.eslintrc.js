const { createConfig } = require("eslint-config-galex/src/createConfig");

const jestConfigOverride = {
  files: ["jest.config.ts"],
  rules: {
    "import/no-default-export": "off",
  },
};

const mockOverride = {
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
  },
  files: ["src/__mocks__/**/*.ts"],
};

const generatedTypesOverride = {
  files: ["./src/types.ts"],
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
    "inclusive-language/use-inclusive-words": "off",
  },
  overrides: [jestConfigOverride, mockOverride, generatedTypesOverride],
  root: true,
});
