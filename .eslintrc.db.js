const { createConfig } = require("eslint-config-galex/dist/createConfig");

module.exports = createConfig({
  rules: {
    "unicorn/no-keyword-prefix": "off",
  },
  root: true,
});
