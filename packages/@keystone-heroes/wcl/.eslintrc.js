const {
  createConfig,
  getDependencies,
} = require("eslint-config-galex/src/createConfig");
const {
  createTSOverride,
} = require("eslint-config-galex/src/overrides/typescript");

const cwd = "./packages/@keystone-heroes/wcl";

const tsOverride = createTSOverride({
  ...getDependencies({ cwd }),
  parserOptions: {
    project: `${cwd}/tsconfig.json`,
  },
});

module.exports = {
  ...createConfig({
    cwd,
    overrides: [tsOverride],
  }),
  root: true,
};
