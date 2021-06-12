import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/../../../node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/jest/cssTransform.js",
  },
  transformIgnorePatterns: ["^.+\\.module\\.(css|sass|scss)$"],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  modulePaths: ["<rootDir>"],
  coverageDirectory: "coverage",
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  displayName: "web",
  errorOnDeprecated: true,
  testEnvironment: "jsdom",
};

// eslint-disable-next-line import/no-default-export
export default config;
