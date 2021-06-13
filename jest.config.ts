import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  errorOnDeprecated: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  modulePaths: ["<rootDir>"],
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true,
      },
      isolatedModules: true,
    },
  },
};

export default config;
