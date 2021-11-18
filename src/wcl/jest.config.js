// @ts-check
const baseConfig = require("../../jest.config.base");

const ignored = [
  "<rootDir>/jest",
  "<rootDir>/queries/introspection.ts",
  "<rootDir>/queries/wcl-static-data.ts",
  "<rootDir>/queries/index.ts",
  "<rootDir>/types.ts",
];

/**
 * @type import('@jest/types').Config.InitialOptions
 */
const config = {
  ...baseConfig,
  displayName: "wcl",
  coverageThreshold: {
    global: {
      statements: 92,
      branches: 87,
      functions: 87,
      lines: 92,
    },
  },
  testPathIgnorePatterns: ignored,
  coveragePathIgnorePatterns: ignored,
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
};

module.exports = config;
