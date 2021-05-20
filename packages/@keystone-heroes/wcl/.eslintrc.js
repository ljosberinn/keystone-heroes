const { createConfig } = require("eslint-config-galex/src/createConfig");

module.exports = createConfig({
  rules: {
    "new-cap": "off",
    "inclusive-language/use-inclusive-words": "off",
  },
  overrides: [
    {
      files: ["./src/types.ts"],
      rules: {
        "import/no-namespace": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "unicorn/no-keyword-prefix": "off",
      },
    },
  ],
});
