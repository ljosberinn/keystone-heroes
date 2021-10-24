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

const config = createConfig({
  overrides: [jestOverride, jestConfigOverride],
  root: true,
});

// fix until eslint-plugin-react-hooks supports ESLint v8
config.overrides = config.overrides.map((override) => {
  return {
    ...override,
    rules: Object.fromEntries(
      Object.entries(override.rules).filter(
        ([key]) => !key.startsWith("react-hooks")
      )
    ),
  };
});

module.exports = config;
