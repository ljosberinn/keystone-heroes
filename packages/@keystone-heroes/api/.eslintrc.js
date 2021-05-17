const { createConfig } = require("eslint-config-galex/src/createConfig");

module.exports = {
  ...createConfig({
    rules: {
      "unicorn/no-keyword-prefix": "off",
    },
  }),
  root: true,
};
