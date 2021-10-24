const {
  createConfig,
  getDependencies,
} = require("eslint-config-galex/src/createConfig");
const {
  createJestOverride,
} = require("eslint-config-galex/src/overrides/jest");

const deps = getDependencies();

const jestOverride = createJestOverride({
  ...deps,
  rules: { "jest/require-top-level-describe": "off" },
});

const jestConfigOverride = {
  files: ["jest.config.ts"],
  rules: {
    "import/no-default-export": "off",
  },
};

module.exports = createConfig({
  overrides: [jestOverride, jestConfigOverride],
  root: true,
});
