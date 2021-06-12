import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts}"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/../../../node_modules/babel-jest",
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
  displayName: "db",
  errorOnDeprecated: true,
};

// eslint-disable-next-line import/no-default-export
export default config;
