// @ts-check
const baseConfig = require("../../../jest.config");

/**
 * @type import('@jest/types').Config.InitialOptions
 */
const config = {
  ...baseConfig,
  displayName: "wcl",
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
  coverageThreshold: {
    global: {
      statements: 92,
      branches: 87,
      functions: 87,
      lines: 92,
    },
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/src/queries/introspection.ts",
    "<rootDir>/src/queries/wcl-static-data.ts",
    "<rootDir>/src/queries/index.ts",
    "<rootDir>/src/queries/types.ts",
  ],
};

module.exports = config;
