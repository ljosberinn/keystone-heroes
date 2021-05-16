const {
  createConfig,
  getDependencies,
} = require("eslint-config-galex/src/createConfig");
const {
  createReactOverride,
} = require("eslint-config-galex/src/overrides/react");
const {
  createTSOverride,
} = require("eslint-config-galex/src/overrides/typescript");

const cwd = "./packages/@keystone-heroes/web";

const dependencies = getDependencies({ cwd });

const reactOverride = createReactOverride({
  ...dependencies,
  rules: {
    "@next/next/no-html-link-for-pages": ["warn", cwd],
  },
});

const tsOverride = createTSOverride({
  ...dependencies,
  parserOptions: {
    project: `${cwd}/tsconfig.json`,
  },
});

module.exports = {
  ...createConfig({
    cwd,
    overrides: [reactOverride, tsOverride],
  }),
  root: true,
};
