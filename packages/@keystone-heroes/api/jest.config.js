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
      statements: 38,
      branches: 26,
      functions: 38,
      lines: 39,
    },
  },
};

module.exports = config;
