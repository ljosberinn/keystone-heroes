const { createConfig } = require("eslint-config-galex/src/createConfig");

const jestConfigOverride = {
  files: ["jest.config.ts"],
  rules: {
    "import/no-default-export": "off",
  },
};

module.exports = createConfig({
  overrides: [jestConfigOverride],
});
