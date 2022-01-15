const {
  createConfig,
  getDependencies,
} = require("eslint-config-galex/src/createConfig");
const {
  createJestOverride,
} = require("eslint-config-galex/src/overrides/jest");
const {
  createReactOverride,
} = require("eslint-config-galex/src/overrides/react");

const deps = getDependencies();

const jestOverride = createJestOverride({
  ...deps,
  rules: { "jest/require-top-level-describe": "off" },
});

const reactOverride = createReactOverride({
  ...deps,
  rules: {
    "jsx-a11y/control-has-associated-label": "off",
  },
});

module.exports = createConfig({
  overrides: [jestOverride, reactOverride],
  root: true,
});
