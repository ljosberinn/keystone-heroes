// @ts-check
const baseConfig = require("../../../jest.config");

/**
 * @type import('@jest/types').Config.InitialOptions
 */
const config = {
  ...baseConfig,
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  displayName: "web",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.css$": "<rootDir>/jest/cssTransform.js",
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
};

module.exports = config;
