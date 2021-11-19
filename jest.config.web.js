// @ts-check
const baseConfig = require("./jest.config.base");

const ignored = [
  "<rootDir>/src/api",
  "<rootDir>/src/db",
  "<rootDir>/src/wcl",
  "<rootDir>/src/web/jest",
];

/**
 * @type import('@jest/types').Config.InitialOptions
 */
const config = {
  ...baseConfig,
  setupFilesAfterEnv: ["<rootDir>/src/web/jest/setupTests.js"],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  displayName: "web",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.css$": "<rootDir>/src/web/jest/cssTransform.js",
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  testPathIgnorePatterns: ignored,
  coveragePathIgnorePatterns: ignored,
};

module.exports = config;
