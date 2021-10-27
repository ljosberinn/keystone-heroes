// @ts-check

const baseConfig = require("../../../jest.config.js");

/**
 * @type import('@jest/types').Config.InitialOptions
 */
const config = {
  ...baseConfig,
  displayName: "api",
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.ts"],
  coverageThreshold: {
    global: {
      statements: 42,
      branches: 26,
      functions: 40,
      lines: 42,
    },
  },
};

module.exports = config;
