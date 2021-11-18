// @ts-check
const baseConfig = require("../../jest.config.base");

const ignored = [
  "<rootDir>/jest",
  "<rootDir>/testUtils",
  "<rootDir>/functions/delete",
  "<rootDir>/functions/deleteAll",
];

/**
 * @type import('@jest/types').Config.InitialOptions
 */
const config = {
  ...baseConfig,
  displayName: "api",
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.ts"],
  coverageThreshold: {
    global: {
      statements: 43,
      branches: 27,
      functions: 41,
      lines: 44,
    },
  },
  testPathIgnorePatterns: ignored,
  coveragePathIgnorePatterns: ignored,
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
};

module.exports = config;
