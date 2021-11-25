// @ts-check
const baseConfig = require("./jest.config.base");

const ignored = [
  "<rootDir>/src/pages",
  "<rootDir>/src/wcl",
  "<rootDir>/src/db",
  "<rootDir>/src/web",
  "<rootDir>/src/api/jest",
  "<rootDir>/src/api/testUtils",
  "<rootDir>/src/api/functions/delete",
  "<rootDir>/src/api/functions/deleteAll",
];

/**
 * @type import('@jest/types').Config.InitialOptions
 */
const config = {
  ...baseConfig,
  displayName: "api",
  setupFilesAfterEnv: ["<rootDir>/src/api/jest/setupTests.ts"],
  coverageThreshold: {
    global: {
      statements: 43,
      branches: 25,
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
