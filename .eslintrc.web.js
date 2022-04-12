const { createConfig } = require("eslint-config-galex/dist/createConfig");
const { getDependencies } = require("eslint-config-galex/dist/getDependencies");
const {
  createJestOverride,
} = require("eslint-config-galex/dist/overrides/jest");
const {
  createReactOverride,
} = require("eslint-config-galex/dist/overrides/react");
const {
  createTypeScriptOverride,
} = require("eslint-config-galex/dist/overrides/typescript");

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

const tsOverride = createTypeScriptOverride({
  ...deps,
  rules: {
    "@typescript-eslint/no-unnecessary-type-arguments": "warn",
  },
});

module.exports = createConfig({
  overrides: [jestOverride, reactOverride, tsOverride],
  root: true,
});
